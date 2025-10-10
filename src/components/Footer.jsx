function Footer() {
  return (
    <footer>
      <div className="chan">
        <div className="chan1">
          <h3>THÔNG TIN LIÊN HỆ</h3>
          <ul>
            <li><h4>Địa chỉ</h4></li>
            <li>Tòa nhà Ladeco, Đống Đa, Hà Nội</li>
            <li><h4>Email</h4></li>
            <li>Traveltour@gmail.com.vn</li>
            <li><h4>Hotline</h4></li>
            <li>1900 6789</li>
          </ul>
        </div>
        <div className="chan2">
          <h3>HƯỚNG DẪN</h3>
          <ul>
            <li>Trang chủ</li>
            <li>Đặt tour</li>
            <li>Khách sạn</li>
            <li>Khu vui chơi</li>
            <li>Vé xe</li>
            <li>Vé tàu</li>
          </ul>
        </div>
        <div className="chan3">
          <h3>THÔNG TIN CẦN BIẾT</h3>
          <ul>
            <li>Về chúng tôi</li>
            <li>Câu hỏi thường gặp</li>
            <li>Điều kiện, điều khoản</li>
            <li>Quy chế hoạt động</li>
            <li>Liên hệ</li>
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
          <img
            src="/anh/Ảnh màn hình 2025-05-16 lúc 14.55.25.png"
            className="thanhtoan"
            alt="Phương thức thanh toán"
          />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
