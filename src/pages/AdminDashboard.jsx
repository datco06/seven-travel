import { useMemo, useState } from 'react';
import '../styles/dashboard.css';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const currency = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

const COPY = {
  vi: {
    title: 'Quản trị - Cộng tiền cho khách hàng',
    kicker: 'Trung tâm quản trị',
    topups: 'Yêu cầu nạp tiền',
    pending: 'Đang chờ',
    processed: 'Đã xử lý',
    approve: 'Cộng tiền',
    reject: 'Từ chối',
    emptyTopup: 'Chưa có yêu cầu nào.',
    pendingAmount: 'Tổng số tiền chờ duyệt',
    lastUpdated: 'Cập nhật lần cuối',
  },
  en: {
    title: 'Admin • Credit customers',
    kicker: 'Admin centre',
    topups: 'Top-up requests',
    pending: 'Pending',
    processed: 'Processed',
    approve: 'Credit',
    reject: 'Reject',
    emptyTopup: 'No requests yet.',
    pendingAmount: 'Pending amount',
    lastUpdated: 'Last updated',
  },
};

function AdminDashboard() {
  const { currentUser, customers, users, topUpRequests, adminApproveTopUp, adminRejectTopUp } = useAuth();
  const { language } = useLanguage();
  const copy = COPY[language];
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState('success');

  if (!currentUser || currentUser.role !== 'admin') {
    return null;
  }

  const summary = useMemo(() => {
    const pending = [];
    const processed = [];
    let pendingAmount = 0;
    let lastUpdated = null;

    topUpRequests.forEach((request) => {
      const createdAt = new Date(request.createdAt);
      if (!lastUpdated || createdAt > lastUpdated) {
        lastUpdated = createdAt;
      }

      if (request.status === 'pending') {
        pending.push(request);
        pendingAmount += request.amount ?? 0;
      } else {
        processed.push(request);
      }
    });

    return {
      pendingRequests: pending,
      processedRequests: processed,
      totalPendingAmount: pendingAmount,
      lastUpdated,
    };
  }, [topUpRequests]);

  const customerMap = useMemo(
    () => customers.reduce((acc, customer) => ({ ...acc, [customer.id]: customer }), {}),
    [customers]
  );

  const userName = (userId) =>
    customerMap[userId]?.name ?? users.find((user) => user.id === userId)?.name ?? '—';

  const showFeedback = (type, text) => {
    setFeedbackType(type);
    setFeedback(text);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApprove = (requestId) => {
    try {
      adminApproveTopUp(requestId);
      showFeedback('success', language === 'vi' ? 'Đã cộng tiền cho khách hàng.' : 'Balance credited.');
    } catch (error) {
      showFeedback('error', error.message);
    }
  };

  const handleReject = (requestId) => {
    try {
      adminRejectTopUp(requestId);
      showFeedback('success', language === 'vi' ? 'Đã cập nhật trạng thái yêu cầu.' : 'Request updated.');
    } catch (error) {
      showFeedback('error', error.message);
    }
  };

  const renderRequestRow = (request) => (
    <li key={request.id} className="request-row">
      <div>
        <strong>{userName(request.userId)}</strong>
        <p>{currency.format(request.amount)}</p>
        <time>{new Date(request.createdAt).toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US')}</time>
      </div>
      <div className="request-actions">
        {request.status === 'pending' ? (
          <>
            <button type="button" className="btn-primary" onClick={() => handleApprove(request.id)}>
              {copy.approve}
            </button>
            <button type="button" className="btn-danger" onClick={() => handleReject(request.id)}>
              {copy.reject}
            </button>
          </>
        ) : (
          <span className={`status-pill status-${request.status}`}>
            {request.status === 'completed'
              ? copy.processed
              : language === 'vi'
                ? 'Đã từ chối'
                : 'Rejected'}
          </span>
        )}
      </div>
    </li>
  );

  return (
    <div className="dashboard-page">
      {feedback ? <div className={`dashboard-banner ${feedbackType}`}>{feedback}</div> : null}

      <header className="dashboard-hero">
        <div>
          <p className="hero-kicker">{copy.kicker}</p>
          <h1>{copy.title}</h1>
          {summary.lastUpdated ? (
            <p className="dashboard-hero__meta">
              {copy.lastUpdated}:{' '}
              {summary.lastUpdated.toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US')}
            </p>
          ) : null}
        </div>
        <div className="wallet-card">
          <span>{copy.pending}</span>
          <strong>{summary.pendingRequests.length}</strong>
        </div>
      </header>

      <section className="dashboard-section">
        <div className="section-heading">
          <h2>{copy.topups}</h2>
          <p>
            {copy.pending}: {summary.pendingRequests.length} · {copy.processed}:{' '}
            {summary.processedRequests.length}
          </p>
          <p>
            {copy.pendingAmount}: {currency.format(summary.totalPendingAmount)}
          </p>
        </div>
        {topUpRequests.length === 0 ? (
          <p className="empty-state">{copy.emptyTopup}</p>
        ) : (
          <ul className="request-list">
            {topUpRequests.map((request) => renderRequestRow(request))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;
