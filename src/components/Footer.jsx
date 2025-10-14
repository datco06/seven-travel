import { Link } from 'react-router-dom';

const GUIDE_LINKS = [
  { to: '/', label: 'Trang chủ' },
  { to: '/tao-tour', label: 'Tour' },
  { to: '/di-chuyen', label: 'Di chuyển' },
  { to: '/luu-tru', label: 'Lưu trú' },
];

const INFO_LINKS = [
  { to: '/cau-hoi-thuong-gap', label: 'Câu hỏi thường gặp' },
  { to: '/dieu-khoan-dieu-kien', label: 'Điều kiện, điều khoản' },
  { to: '/quy-che-hoat-dong', label: 'Quy chế hoạt động' },
];

function Footer() {
  return (
    <footer>
      <div className="chan">
        <div className="chan1">
          <h3>THÔNG TIN LIÊN HỆ</h3>
          <ul>
            <li><h4>Địa chỉ</h4></li>
            <li>
              <a
                href="https://maps.google.com/?q=Tòa nhà Ladeco, Đống Đa, Hà Nội"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                Tòa nhà Ladeco, Đống Đa, Hà Nội
              </a>
            </li>
            <li><h4>Email</h4></li>
            <li>
              <a href="mailto:Traveltour@gmail.com.vn" className="footer-link">
                Traveltour@gmail.com.vn
              </a>
            </li>
            <li><h4>Hotline</h4></li>
            <li>
              <a href="tel:19006789" className="footer-link">
                1900 6789
              </a>
            </li>
          </ul>
        </div>
        <div className="chan2">
          <h3>HƯỚNG DẪN</h3>
          <ul>
            {GUIDE_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="footer-link">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="chan3">
          <h3>THÔNG TIN CẦN BIẾT</h3>
          <ul>
            {INFO_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="footer-link">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="chan4">
          <h3>KẾT NỐI</h3>
          <div className="social-icons">
            <a href="#" aria-label="Facebook">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#" aria-label="YouTube">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="#" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" aria-label="Google">
              <i className="fab fa-google"></i>
            </a>
          </div>
          <h3>PHƯƠNG THỨC THANH TOÁN</h3>
          <img src="/anh/image copy 29.png" className="thanhtoan" alt="Phương thức thanh toán" />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
