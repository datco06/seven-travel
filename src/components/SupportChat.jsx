import { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/supportChat.css';

function SupportChat() {
  const { currentUser, submitSupportMessage, supportMessages } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState(null);

  const userMessages = useMemo(() => {
    if (!currentUser) return [];
    return supportMessages.filter((item) => item.userId === currentUser.id).sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
  }, [supportMessages, currentUser]);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) setStatus(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!currentUser) {
      setStatus({
        type: 'error',
        message:
          'Vui lòng đăng nhập bằng tài khoản khách hàng để trò chuyện cùng SEVEN TRAVEL.',
      });
      return;
    }
    try {
      submitSupportMessage({ message: draft });
      setDraft('');
      setStatus({
        type: 'success',
        message: 'Tin nhắn đã được gửi tới đội ngũ SEVEN TRAVEL.',
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Không thể gửi tin nhắn. Vui lòng thử lại.',
      });
    }
  };

  return (
    <div className="support-chat">
      <button type="button" className="support-chat__toggle" onClick={toggleChat} aria-expanded={isOpen}>
        <i className="fa-solid fa-headset" aria-hidden="true" />
      </button>

      {isOpen ? (
        <div className="support-chat__panel">
          <header className="support-chat__header">
            <h3>SEVEN TRAVEL</h3>
            <button type="button" onClick={toggleChat} aria-label="Đóng hỗ trợ">×</button>
          </header>
          <div className="support-chat__body">
            {currentUser ? (
              userMessages.length > 0 ? (
                <ul className="support-chat__messages">
                  {userMessages.map((item) => (
                    <li key={item.id}>
                      <span className="time">
                        {new Date(item.createdAt).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <p>{item.message}</p>
                      {item.adminResponse ? (
                        <div className="support-chat__admin-reply">
                          <span className="time">
                            {item.adminRespondedAt
                              ? new Date(item.adminRespondedAt).toLocaleTimeString('vi-VN', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : ''}
                          </span>
                          <p>{item.adminResponse}</p>
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="support-chat__empty">Hãy gửi câu hỏi đầu tiên của bạn cho SEVEN TRAVEL.</p>
              )
            ) : (
              <p className="support-chat__empty">
                Đăng nhập để trò chuyện trực tiếp với đội ngũ SEVEN TRAVEL.
              </p>
            )}
          </div>
          <form className="support-chat__form" onSubmit={handleSubmit}>
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Nhập tin nhắn của bạn..."
              rows="2"
              disabled={!currentUser}
            />
            <button type="submit" disabled={!currentUser || !draft.trim()}>
              Gửi
            </button>
          </form>
          {status ? <div className={`support-chat__status ${status.type}`}>{status.message}</div> : null}
        </div>
      ) : null}
    </div>
  );
}

export default SupportChat;
