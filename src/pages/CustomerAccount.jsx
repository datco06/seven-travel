import { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import '../styles/dashboard.css';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const currency = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

const COPY = {
  vi: {
    greeting: 'Xin chào',
    balance: 'Số dư ví SEVEN TRAVEL',
    qrTitle: 'Quét mã để nạp tiền',
    qrDescription: 'Sử dụng ứng dụng ngân hàng để quét mã QR và hoàn tất thanh toán.',
    qrNote: 'Yêu cầu nạp sẽ được xử lý tự động ngay khi giao dịch thành công.',
    qrImage: '/anh/chuyenkhoan/qr.png',
    topupAmountLabel: 'Số tiền đã chuyển',
    topupAmountPlaceholder: 'Nhập số tiền bạn đã nạp',
    topupSubmitLabel: 'Yêu cầu nạp',
    topupSuccess: 'Yêu cầu nạp đã được gửi. Quản trị viên sẽ sớm cộng tiền cho bạn.',
    transactions: 'Lịch sử giao dịch',
    noTransactions: 'Chưa có giao dịch nào.',
    serviceName: 'Tên dịch vụ',
    bookings: 'Dịch vụ đã đặt',
    noBookings: 'Bạn chưa đặt dịch vụ nào. Bắt đầu khám phá cùng SEVEN TRAVEL!',
    pending: 'Đang chờ duyệt',
    completed: 'Hoàn tất',
    rejected: 'Từ chối',
    date: 'Thời gian',
    amount: 'Thành tiền',
  },
  en: {
    greeting: 'Welcome back',
    balance: 'SEVEN TRAVEL wallet balance',
    qrTitle: 'Scan to top up',
    qrDescription: 'Use your banking app to scan the QR code and complete the transfer.',
    qrNote: 'Funds will be added automatically once the payment is received.',
    qrImage: '/anh/chuyenkhoan/qr.png',
    topupAmountLabel: 'Amount transferred',
    topupAmountPlaceholder: 'Enter the amount you just sent',
    topupSubmitLabel: 'Request top up',
    topupSuccess: 'Your top-up request has been sent. Our team will credit your wallet shortly.',
    transactions: 'Transaction history',
    noTransactions: 'No transactions yet.',
    serviceName: 'Service name',
    bookings: 'Your bookings',
    noBookings: 'No bookings yet. Start exploring with SEVEN TRAVEL!',
    pending: 'Pending',
    completed: 'Completed',
    rejected: 'Rejected',
    date: 'Date',
    amount: 'Amount',
  },
};

const TYPE_LABELS = {
  vi: {
    tour: 'Tour',
    transport: 'Di chuyển',
    stay: 'Lưu trú',
    topup: 'Nạp tiền',
  },
  en: {
    tour: 'Tour',
    transport: 'Transport',
    stay: 'Stay',
    topup: 'Top up',
  },
};

function CustomerAccount() {
  const { currentUser, bookings, requestTopUp } = useAuth();
  const { language } = useLanguage();
  const copy = COPY[language];
  const typeLabels = TYPE_LABELS[language];
  const qrImageSrc = useMemo(() => copy.qrImage ?? '/anh/topup-qr.svg', [copy.qrImage]);
  const [topupAmount, setTopupAmount] = useState('');
  const [topupStatus, setTopupStatus] = useState({ type: null, message: '' });
  const [isSubmittingTopup, setIsSubmittingTopup] = useState(false);

  if (!currentUser) {
    return <Navigate to="/dang-nhap" replace />;
  }

  if (currentUser.role !== 'customer') {
    return <Navigate to="/admin" replace />;
  }

  const userBookings = useMemo(
    () => bookings.filter((booking) => booking.userId === currentUser.id),
    [bookings, currentUser.id]
  );

  const handleTopUpSubmit = (event) => {
    event.preventDefault();
    if (isSubmittingTopup) return;

    setTopupStatus({ type: null, message: '' });

    try {
      setIsSubmittingTopup(true);
      requestTopUp(topupAmount.trim());
      setTopupStatus({ type: 'success', message: copy.topupSuccess });
      setTopupAmount('');
    } catch (error) {
      setTopupStatus({ type: 'error', message: error.message });
    } finally {
      setIsSubmittingTopup(false);
    }
  };

  return (
    <div className="dashboard-page">
      {topupStatus.message ? (
        <div className={`dashboard-banner ${topupStatus.type}`}>
          {topupStatus.message}
        </div>
      ) : null}
      <header className="dashboard-hero">
        <div>
          <p className="hero-kicker">{copy.greeting}</p>
          <h1>{currentUser.name}</h1>
        </div>
        <div className="wallet-card">
          <span>{copy.balance}</span>
          <strong>{currency.format(currentUser.balance)}</strong>
        </div>
      </header>

      <section className="dashboard-section">
        <div className="section-heading">
          <h2>{copy.qrTitle}</h2>
          <p>{copy.qrDescription}</p>
        </div>
        <div className="topup-qr-block">
          <img src={qrImageSrc} alt={language === 'vi' ? 'Mã QR nạp tiền' : 'Top-up QR code'} />
          <form className="topup-form" onSubmit={handleTopUpSubmit}>
            <label htmlFor="topup-amount">{copy.topupAmountLabel}</label>
            <input
              id="topup-amount"
              className="topup-input"
              type="number"
              min="1000"
              step="1000"
              inputMode="numeric"
              placeholder={copy.topupAmountPlaceholder}
              value={topupAmount}
              onChange={(event) => setTopupAmount(event.target.value)}
              required
            />
            <button type="submit" className="btn-primary" disabled={isSubmittingTopup}>
              {copy.topupSubmitLabel}
            </button>
          </form>
          <p className="topup-note">{copy.qrNote}</p>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <h2>{copy.transactions}</h2>
        </div>
        {currentUser.transactions.length === 0 ? (
          <p className="empty-state">{copy.noTransactions}</p>
        ) : (
          <ul className="transaction-list">
            {currentUser.transactions.map((transaction) => (
              <li key={transaction.id}>
                <div>
                  <span className="transaction-type">
                    {transaction.type === 'payment' && transaction.category
                      ? typeLabels[transaction.category]
                      : typeLabels[transaction.type]}
                  </span>
                  <time>{new Date(transaction.createdAt).toLocaleString()}</time>
                </div>
                <div className="transaction-meta">
                  <span>{currency.format(transaction.amount)}</span>
                  <span className={`status-pill status-${transaction.status}`}>
                    {copy[transaction.status] ?? transaction.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <h2>{copy.bookings}</h2>
        </div>
        {userBookings.length === 0 ? (
          <p className="empty-state">{copy.noBookings}</p>
        ) : (
          <table className="booking-table">
            <thead>
              <tr>
                <th>#</th>
                <th>{copy.serviceName}</th>
                <th>{copy.date}</th>
                <th>{copy.amount}</th>
              </tr>
            </thead>
            <tbody>
              {userBookings.map((booking, index) => (
                <tr key={booking.id}>
                  <td>{index + 1}</td>
                  <td>
                    <span className="booking-name">{booking.productName}</span>
                    <span className="booking-category">{typeLabels[booking.category]}</span>
                  </td>
                  <td>{new Date(booking.createdAt).toLocaleString()}</td>
                  <td>{currency.format(booking.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default CustomerAccount;
