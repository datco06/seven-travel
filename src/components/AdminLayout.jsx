import { NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import '../styles/adminLayout.css';

const NAV_ITEMS = [
  {
    to: '/admin',
    labels: {
      vi: 'Quản trị',
      en: 'Admin Hub',
    },
  },
  {
    to: '/admin/thong-ke',
    labels: {
      vi: 'Thống kê',
      en: 'Analytics',
    },
  },
  {
    to: '/admin/ho-tro',
    labels: {
      vi: 'Hỗ trợ',
      en: 'Support',
    },
  },
];

function AdminLayout() {
  const { currentUser, logout } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  if (!currentUser) {
    return <Navigate to="/dang-nhap" replace />;
  }

  if (currentUser.role !== 'admin') {
    return <Navigate to="/tai-khoan" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="admin-brand">
          <span className="admin-brand__title">SEVEN TRAVEL</span>
          <span className="admin-brand__role">{language === 'vi' ? 'Quản trị viên' : 'Administrator'}</span>
        </div>
        <nav className="admin-nav" aria-label="Admin navigation">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              className={({ isActive }) => `admin-nav__link${isActive ? ' is-active' : ''}`}
            >
              {item.labels[language] ?? item.labels.vi}
            </NavLink>
          ))}
        </nav>
        <button type="button" className="admin-logout" onClick={handleLogout}>
          <i className="fa-solid fa-arrow-right-from-bracket" aria-hidden="true" />
          <span>{language === 'vi' ? 'Đăng xuất' : 'Sign out'}</span>
        </button>
      </header>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
