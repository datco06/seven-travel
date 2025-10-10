import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AVAILABLE_LANGUAGES, useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const NAV_ITEMS = [
  { to: '/', labels: { vi: 'Trang chủ', en: 'Home' }, end: true },
  { to: '/tao-tour', labels: { vi: 'Tạo Tour', en: 'Create Tour' } },
  { to: '/di-chuyen', labels: { vi: 'Di chuyển', en: 'Transport' } },
  { to: '/luu-tru', labels: { vi: 'Lưu trú', en: 'Stay' } },
];

function Header() {
  const { language, setLanguage } = useLanguage();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [...NAV_ITEMS];

  if (currentUser) {
    if (currentUser.role === 'admin') {
      navItems.push({ to: '/admin', labels: { vi: 'Quản trị', en: 'Admin' } });
    } else {
      navItems.push({ to: '/tai-khoan', labels: { vi: 'Tài khoản', en: 'Account' } });
    }
  }

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="brand-group">
          <div className="language-switch language-switch--compact">
            {AVAILABLE_LANGUAGES.map(({ code, label }) => (
              <button
                type="button"
                key={code}
                className={code === language ? 'active' : undefined}
                onClick={() => setLanguage(code)}
              >
                {label}
              </button>
            ))}
          </div>
          <Link className="logo" to="/">
            <img src="/anh/27Sep24 Simon  Free Upload  -3.png" alt="Logo SEVEN TRAVEL" />
            <h3>SEVEN TRAVEL</h3>
          </Link>
        </div>

        <nav>
          <ul>
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => (isActive ? 'active' : undefined)}
                  end={item.end}
                >
                  {item.labels[language]}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          {currentUser ? (
            <div className="auth-links">
              <span className="auth-name">{currentUser.name}</span>
              <button type="button" className="auth-button" onClick={handleLogout}>
                {language === 'vi' ? 'Đăng xuất' : 'Log out'}
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <NavLink to="/dang-nhap" className="auth-button">
                {language === 'vi' ? 'Đăng nhập' : 'Sign in'}
              </NavLink>
              <NavLink to="/dang-ky" className="auth-button primary">
                {language === 'vi' ? 'Đăng ký' : 'Sign up'}
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
