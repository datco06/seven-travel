import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';

const FOOTER_COPY = {
  vi: {
    contact: {
      title: 'THÔNG TIN LIÊN HỆ',
      addressLabel: 'Địa chỉ',
      addressValue: 'Tòa nhà Ladeco, Đống Đa, Hà Nội',
      emailLabel: 'Email',
      emailValue: 'Traveltour@gmail.com.vn',
      hotlineLabel: 'Hotline',
      hotlineValue: '1900 6789',
      mapLabel: 'Mở bản đồ Google',
    },
    guide: {
      title: 'HƯỚNG DẪN',
      links: [
        { to: '/', label: 'Trang chủ' },
        { to: '/tao-tour', label: 'Tour' },
        { to: '/di-chuyen', label: 'Di chuyển' },
        { to: '/luu-tru', label: 'Lưu trú' },
      ],
    },
    info: {
      title: 'THÔNG TIN CẦN BIẾT',
      links: [
        { to: '/cau-hoi-thuong-gap', label: 'Câu hỏi thường gặp' },
        { to: '/dieu-khoan-dieu-kien', label: 'Điều kiện, điều khoản' },
        { to: '/quy-che-hoat-dong', label: 'Quy chế hoạt động' },
      ],
    },
    connect: {
      title: 'KẾT NỐI',
      social: [
        { icon: 'fab fa-facebook', href: '#', label: 'Facebook' },
        { icon: 'fab fa-youtube', href: '#', label: 'YouTube' },
        { icon: 'fab fa-twitter', href: '#', label: 'Twitter' },
        { icon: 'fab fa-instagram', href: '#', label: 'Instagram' },
        { icon: 'fab fa-google', href: '#', label: 'Google' },
      ],
    },
  },
  en: {
    contact: {
      title: 'CONTACT',
      addressLabel: 'Address',
      addressValue: 'Ladeco Building, Dong Da, Hanoi',
      emailLabel: 'Email',
      emailValue: 'Traveltour@gmail.com.vn',
      hotlineLabel: 'Hotline',
      hotlineValue: '1900 6789',
      mapLabel: 'Open in Google Maps',
    },
    guide: {
      title: 'GUIDE',
      links: [
        { to: '/', label: 'Home' },
        { to: '/tao-tour', label: 'Create a tour' },
        { to: '/di-chuyen', label: 'Transport' },
        { to: '/luu-tru', label: 'Stay' },
      ],
    },
    info: {
      title: 'NEED TO KNOW',
      links: [
        { to: '/cau-hoi-thuong-gap', label: 'Frequently asked questions' },
        { to: '/dieu-khoan-dieu-kien', label: 'Terms & conditions' },
        { to: '/quy-che-hoat-dong', label: 'Operating regulations' },
      ],
    },
    connect: {
      title: 'CONNECT',
      social: [
        { icon: 'fab fa-facebook', href: '#', label: 'Facebook' },
        { icon: 'fab fa-youtube', href: '#', label: 'YouTube' },
        { icon: 'fab fa-twitter', href: '#', label: 'Twitter' },
        { icon: 'fab fa-instagram', href: '#', label: 'Instagram' },
        { icon: 'fab fa-google', href: '#', label: 'Google' },
      ],
    },
  },
};

function Footer() {
  const { language } = useLanguage();
  const copy = FOOTER_COPY[language] ?? FOOTER_COPY.vi;

  return (
    <footer>
      <div className="chan">
        <div className="chan1">
          <h3>{copy.contact.title}</h3>
          <ul>
            <li><h4>{copy.contact.addressLabel}</h4></li>
            <li>
              <a
                href="https://maps.google.com/?q=Tòa nhà Ladeco, Đống Đa, Hà Nội"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
                aria-label={copy.contact.mapLabel}
              >
                {copy.contact.addressValue}
              </a>
            </li>
            <li><h4>{copy.contact.emailLabel}</h4></li>
            <li>
              <a href="mailto:Traveltour@gmail.com.vn" className="footer-link">
                {copy.contact.emailValue}
              </a>
            </li>
            <li><h4>{copy.contact.hotlineLabel}</h4></li>
            <li>
              <a href="tel:19006789" className="footer-link">
                {copy.contact.hotlineValue}
              </a>
            </li>
          </ul>
        </div>
        <div className="chan2">
          <h3>{copy.guide.title}</h3>
          <ul>
            {copy.guide.links.map(({ to, label }) => (
              <li key={`${language}-${to}`}>
                <Link to={to} className="footer-link">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="chan3">
          <h3>{copy.info.title}</h3>
          <ul>
            {copy.info.links.map(({ to, label }) => (
              <li key={`${language}-${to}`}>
                <Link to={to} className="footer-link">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="chan4">
          <h3>{copy.connect.title}</h3>
          <div className="social-icons">
            {copy.connect.social.map((item) => (
              <a key={item.icon} href={item.href} aria-label={item.label}>
                <i className={item.icon}></i>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
