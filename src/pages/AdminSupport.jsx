import { useMemo, useState } from 'react';
import '../styles/dashboard.css';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const COPY = {
  vi: {
    title: 'Trung tâm hỗ trợ',
    kicker: 'Tin nhắn khách hàng',
    empty: 'Chưa có tin nhắn nào từ khách hàng.',
    columns: {
      customer: 'Khách hàng',
      phone: 'Số điện thoại',
      message: 'Nội dung',
      time: 'Thời gian',
      status: 'Trạng thái',
    },
    status: {
      pending: 'Chờ phản hồi',
      resolved: 'Đã phản hồi',
    },
    replyCTA: 'Phản hồi',
    viewResponse: 'Xem phản hồi',
    replyPlaceholder: 'Nhập phản hồi cho khách hàng...',
    sendReply: 'Gửi phản hồi',
    replySuccess: 'Đã gửi phản hồi tới khách hàng.',
  },
  en: {
    title: 'Support center',
    kicker: 'Customer messages',
    empty: 'No customer messages yet.',
    columns: {
      customer: 'Customer',
      phone: 'Phone',
      message: 'Message',
      time: 'Timestamp',
      status: 'Status',
    },
    status: {
      pending: 'Pending',
      resolved: 'Resolved',
    },
    replyCTA: 'Reply',
    viewResponse: 'View reply',
    replyPlaceholder: 'Type your reply to the customer...',
    sendReply: 'Send reply',
    replySuccess: 'Reply sent to the customer.',
  },
};

function AdminSupport() {
  const { supportMessages, users, adminRespondSupport } = useAuth();
  const { language } = useLanguage();
  const copy = COPY[language];
  const [activeId, setActiveId] = useState(null);
  const [replyDraft, setReplyDraft] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const entries = useMemo(() => {
    return supportMessages
      .map((message) => {
        const user = users.find((candidate) => candidate.id === message.userId);
        return {
          id: message.id,
          name: message.userName ?? user?.name ?? '—',
          phone: user?.phone ?? '—',
          text: message.message,
          status: message.status ?? 'pending',
          createdAt: message.createdAt,
          adminResponse: message.adminResponse,
          adminRespondedAt: message.adminRespondedAt,
        };
      })
      .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
  }, [supportMessages, users]);

  const handleSelect = (item) => {
    if (activeId === item.id) {
      setActiveId(null);
      setReplyDraft('');
      setFeedback(null);
    } else {
      setActiveId(item.id);
      setReplyDraft(item.adminResponse ?? '');
      setFeedback(null);
    }
  };

  const handleReply = (event, messageId) => {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      const result = adminRespondSupport({ id: messageId, response: replyDraft });
      setFeedback({ id: messageId, type: 'success', message: copy.replySuccess, timestamp: result.respondedAt });
      setActiveId(null);
      setReplyDraft('');
    } catch (error) {
      setFeedback({ id: messageId, type: 'error', message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-hero">
        <div>
          <p className="hero-kicker">{copy.kicker}</p>
          <h1>{copy.title}</h1>
        </div>
      </header>

      <section className="dashboard-section">
        {entries.length === 0 ? (
          <p className="empty-state">{copy.empty}</p>
        ) : (
          <ul className="support-list">
            {entries.map((item) => (
              <li
                key={item.id}
                className={`support-item${activeId === item.id ? ' support-item--active' : ''}`}
              >
                <div className="support-item__header">
                  <span className="support-item__name">{item.name}</span>
                  <span className={`support-item__status status-${item.status}`}>
                    {copy.status[item.status] ?? item.status}
                  </span>
                </div>
                <div className="support-item__meta">
                  <span>
                    <i className="fa-solid fa-phone" aria-hidden="true" /> {item.phone}
                  </span>
                  <time dateTime={item.createdAt}>
                    <i className="fa-solid fa-clock" aria-hidden="true" />{' '}
                    {new Date(item.createdAt).toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US')}
                  </time>
                </div>
                <p className="support-item__message">{item.text}</p>
                {item.adminResponse ? (
                  <div className="support-item__response">
                    <time dateTime={item.adminRespondedAt || undefined}>
                      {item.adminRespondedAt
                        ? new Date(item.adminRespondedAt).toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US')
                        : ''}
                    </time>
                    <p>{item.adminResponse}</p>
                  </div>
                ) : null}
                <button
                  type="button"
                  className="support-item__action"
                  onClick={() => handleSelect(item)}
                >
                  {item.adminResponse ? copy.viewResponse : copy.replyCTA}
                </button>
                {activeId === item.id ? (
                  <form className="support-item__reply" onSubmit={(event) => handleReply(event, item.id)}>
                    <textarea
                      value={replyDraft}
                      onChange={(event) => setReplyDraft(event.target.value)}
                      placeholder={copy.replyPlaceholder}
                    />
                    <div className="support-item__reply-actions">
                      <button type="submit" disabled={isSubmitting || !replyDraft.trim()}>
                        {copy.sendReply}
                      </button>
                      {feedback && feedback.id === item.id ? (
                        <span className={`support-item__feedback ${feedback.type}`}>
                          {feedback.message}
                        </span>
                      ) : null}
                    </div>
                  </form>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default AdminSupport;
