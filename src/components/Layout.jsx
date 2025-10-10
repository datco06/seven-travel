import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import SupportChat from './SupportChat.jsx';

function Layout() {
  return (
    <div className="app-shell">
      <Header />
      <main className="page-container">
        <Outlet />
      </main>
      <Footer />
      <SupportChat />
    </div>
  );
}

export default Layout;
