import { useMemo } from 'react';
import '../styles/dashboard.css';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const currency = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

const COPY = {
  vi: {
    title: 'Thống kê dịch vụ đã đặt',
    kicker: 'Bảng theo dõi',
    totalLabel: 'Tổng số lượt đặt',
    revenueLabel: 'Tổng doanh thu dự kiến',
    table: {
      customer: 'Khách hàng',
      phone: 'Số điện thoại',
      category: 'Danh mục',
      product: 'Dịch vụ',
      amount: 'Số tiền',
      date: 'Thời gian',
      status: 'Trạng thái',
    },
    empty: 'Chưa có lượt đặt nào được ghi nhận.',
    confirm: 'Xác nhận',
    confirmed: 'Đã xác nhận',
    rooms: 'phòng',
    nights: 'đêm',
  },
  en: {
    title: 'Booked service overview',
    kicker: 'Tracking summary',
    totalLabel: 'Total bookings',
    revenueLabel: 'Projected revenue',
    table: {
      customer: 'Customer',
      phone: 'Phone',
      category: 'Category',
      product: 'Service',
      amount: 'Amount',
      date: 'Date',
      status: 'Status',
    },
    empty: 'No bookings have been recorded yet.',
    confirm: 'Confirm',
    confirmed: 'Confirmed',
    rooms: 'room(s)',
    nights: 'night(s)',
  },
};

const CATEGORY_LABELS = {
  vi: {
    tour: 'Tour',
    transport: 'Di chuyển',
    stay: 'Lưu trú',
  },
  en: {
    tour: 'Tour',
    transport: 'Transport',
    stay: 'Stay',
  },
};

function AdminStats() {
  const { bookings, users, adminConfirmBooking } = useAuth();
  const { language } = useLanguage();
  const copy = COPY[language];
  const categoryLabels = CATEGORY_LABELS[language];

  const { rows, totalRevenue } = useMemo(() => {
    const mapped = bookings.map((booking) => {
      const user = users.find((candidate) => candidate.id === booking.userId);
      const detailParts = [];
      if (booking.details?.rooms) {
        detailParts.push(`${booking.details.rooms} ${copy.rooms}`);
      }
      if (booking.details?.nights) {
        detailParts.push(`${booking.details.nights} ${copy.nights}`);
      }
      const detailSummary = detailParts.join(' · ');
      return {
        id: booking.id,
        name: user?.name ?? '—',
        phone: user?.phone ?? '—',
        category: categoryLabels[booking.category] ?? booking.category,
        product: booking.productName,
        amount: booking.amount,
        createdAt: booking.createdAt,
        confirmed: booking.confirmed ?? false,
        details: detailSummary,
      };
    });

    mapped.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));

    const revenue = mapped.reduce((sum, item) => sum + (item.amount ?? 0), 0);

    return {
      rows: mapped,
      totalRevenue: revenue,
    };
  }, [bookings, users, categoryLabels, copy]);

  return (
    <div className="dashboard-page">
      <header className="dashboard-hero">
        <div>
          <p className="hero-kicker">{copy.kicker}</p>
          <h1>{copy.title}</h1>
        </div>
        <div className="wallet-card">
          <span>{copy.totalLabel}</span>
          <strong>{rows.length}</strong>
        </div>
      </header>

      <section className="dashboard-section">
        <div className="section-heading">
          <h2>{copy.revenueLabel}</h2>
          <p>{currency.format(totalRevenue)}</p>
        </div>

        {rows.length === 0 ? (
          <p className="empty-state">{copy.empty}</p>
        ) : (
          <div className="table-wrapper">
            <table className="booking-table">
              <thead>
                <tr>
                  <th>{copy.table.customer}</th>
                  <th>{copy.table.phone}</th>
                  <th>{copy.table.category}</th>
                  <th>{copy.table.product}</th>
                  <th>{copy.table.amount}</th>
                  <th>{copy.table.date}</th>
                  <th>{copy.table.status}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.name}</td>
                    <td>{row.phone}</td>
                    <td>{row.category}</td>
                    <td>
                      <div>{row.product}</div>
                      {row.details ? <div className="booking-detail">{row.details}</div> : null}
                    </td>
                    <td>{currency.format(row.amount)}</td>
                    <td>{new Date(row.createdAt).toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US')}</td>
                    <td>
                      {row.confirmed ? (
                        <span className="booking-status confirmed">{copy.confirmed}</span>
                      ) : (
                        <button
                          type="button"
                          className="table-action"
                          onClick={() => adminConfirmBooking(row.id)}
                        >
                          {copy.confirm}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminStats;
