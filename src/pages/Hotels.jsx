import '../styles/hotels.css';

function Hotels() {
  return (
    <div className="hotels-page">
      <div className="banner">
        <img src="/anh/Ảnh màn hình 2025-05-20 lúc 21.59.47.png" alt="Hệ thống khách sạn" />
        <div className="content">
          <h2>THƯ GIÃN TRỌN VẸN TẠI HỆ THỐNG KHÁCH SẠN</h2>
          <p>
            Hệ thống khách sạn của SEVEN TRAVEL được thiết kế nhằm mang đến cho khách hàng trải nghiệm du lịch trọn vẹn,
            tiện lợi nhất.
          </p>
          <button type="button">Đặt Ngay</button>
        </div>

        <div className="form-container">
          <h2 className="form-title">Đặt Phòng Ngay</h2>

          <div className="form-group destination-group">
            <label className="form-label">
              <i className="fas fa-map-marker-alt" /> Nơi bạn đến
            </label>
            <input type="text" placeholder="Nhập thành phố, khách sạn, địa điểm..." className="form-input" />
          </div>

          <div className="form-group">
            <label className="form-label">
              <i className="fas fa-star" /> Hạng khách sạn
            </label>
            <select className="form-input" defaultValue="">
              <option value="" disabled>
                Chọn số sao
              </option>
              <option>1 sao</option>
              <option>2 sao</option>
              <option>3 sao</option>
              <option>4 sao</option>
              <option>5 sao</option>
            </select>
          </div>

          <div className="form-group date-group">
            <label className="form-label">
              <i className="fas fa-calendar-alt" /> Ngày nhận - trả phòng
            </label>
            <div className="form-row">
              <input type="date" className="form-input" placeholder="Ngày nhận phòng" />
              <input type="date" className="form-input" placeholder="Ngày trả phòng" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <i className="fas fa-users" /> Số người
            </label>
            <div className="form-row">
              <select className="form-input" defaultValue="">
                <option value="" disabled>
                  Người lớn
                </option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4+</option>
              </select>
              <select className="form-input" defaultValue="">
                <option value="" disabled>
                  Trẻ em
                </option>
                <option>0</option>
                <option>1</option>
                <option>2</option>
                <option>3+</option>
              </select>
            </div>
          </div>

          <div className="form-button-wrapper">
            <button type="button" className="form-button">
              <i className="fas fa-search" /> Tìm kiếm
            </button>
          </div>
        </div>
        <div className="hienthongtin" />
      </div>

      <div className="khachsan">
        <div className="tieude1">
          <h2>Điểm đến yêu thích trong nước</h2>
        </div>

        <div className="grid">
          <div className="card">
            <img src="/anh/image copy 4.png" alt="Phú Quốc" />
            <div className="card-text">
              Phú Quốc
              <br />
              <span className="card-subtext">733 khách sạn</span>
            </div>
          </div>
          <div className="card">
            <img src="/anh/image copy 5.png" alt="Đà Lạt" />
            <div className="card-text">
              Đà Lạt
              <br />
              <span className="card-subtext">924 khách sạn</span>
            </div>
          </div>
          <div className="card">
            <img src="/anh/image copy 6.png" alt="Quy Nhơn" />
            <div className="card-text">
              Quy Nhơn
              <br />
              <span className="card-subtext">293 khách sạn</span>
            </div>
          </div>
          <div className="card">
            <img src="/anh/image copy 7.png" alt="Vũng Tàu" />
            <div className="card-text">
              Vũng Tàu
              <br />
              <span className="card-subtext">619 khách sạn</span>
            </div>
          </div>
          <div className="card">
            <img src="/anh/image copy 8.png" alt="Nha Trang" />
            <div className="card-text">
              Nha Trang
              <br />
              <span className="card-subtext">875 khách sạn</span>
            </div>
          </div>
          <div className="card">
            <img src="/anh/image copy 11.png" alt="Đà Nẵng" />
            <div className="card-text">
              Đà Nẵng
              <br />
              <span className="card-subtext">1145 khách sạn</span>
            </div>
          </div>
          <div className="card">
            <img src="/anh/image copy 9.png" alt="Phan Thiết" />
            <div className="card-text">
              Phan Thiết
              <br />
              <span className="card-subtext">311 khách sạn</span>
            </div>
          </div>
          <div className="card">
            <img src="/anh/image copy 10.png" alt="Phú Yên" />
            <div className="card-text">
              Phú Yên
              <br />
              <span className="card-subtext">15 khách sạn</span>
            </div>
          </div>
        </div>
      </div>

      <div className="word">
        <h2>Điểm đến yêu thích nước ngoài</h2>
        <div className="grid">
          <div className="card">
            <img src="/anh/image copy 12.png" alt="Thái Lan" />
            <div className="card-text">
              Thái Lan
              <br />
              <span className="card-subtext">1.233 khách sạn</span>
            </div>
          </div>
          <div className="card">
            <img src="/anh/image copy 13.png" alt="Singapore" />
            <div className="card-text">
              Singapore
              <br />
              <span className="card-subtext">924 khách sạn</span>
            </div>
          </div>
          <div className="card">
            <img src="/anh/image copy 14.png" alt="Tokyo" />
            <div className="card-text">
              Tokyo
              <br />
              <span className="card-subtext">937 khách sạn</span>
            </div>
          </div>
          <div className="card">
            <img src="/anh/image copy 15.png" alt="Thượng Hải" />
            <div className="card-text">
              Thượng Hải
              <br />
              <span className="card-subtext">619 khách sạn</span>
            </div>
          </div>
          <div className="card">
            <img src="/anh/image copy 16.png" alt="Pháp" />
            <div className="card-text">
              Pháp
              <br />
              <span className="card-subtext">875 khách sạn</span>
            </div>
          </div>
          <div className="card">
            <img src="/anh/image copy 17.png" alt="Thuỵ Sĩ" />
            <div className="card-text">
              Thuỵ Sĩ
              <br />
              <span className="card-subtext">1145 khách sạn</span>
            </div>
          </div>
          <div className="card">
            <img src="/anh/image copy 18.png" alt="Đức" />
            <div className="card-text">
              Đức
              <br />
              <span className="card-subtext">311 khách sạn</span>
            </div>
          </div>
          <div className="card">
            <img src="/anh/image copy 19.png" alt="Áo" />
            <div className="card-text">
              Áo
              <br />
              <span className="card-subtext">155 khách sạn</span>
            </div>
          </div>
        </div>
      </div>

      <div className="uudiem">
        <h1>Tại sao nên chọn đặt phòng tại SEVEN TRAVEL?</h1>
        <img src="/anh/Ảnh màn hình 2025-05-27 lúc 23.15.31.png" className="anhdiem" alt="Ưu điểm" />
        <hr className="divider" />
      </div>

      <div className="doitac">
        <div className="trai">
          <h1>Đối tác khách sạn</h1>
          <p>
            Chúng tôi hợp tác với các chuỗi khách sạn trên toàn thế giới đảm bảo mang lại kỳ nghỉ tuyệt vời nhất tại
            mọi điểm đến trong mơ của bạn!
          </p>
        </div>
        <div className="phai">
          <img src="/anh/Ảnh màn hình 2025-05-29 lúc 08.58.15.png" alt="Đối tác" />
        </div>
      </div>
    </div>
  );
}

export default Hotels;
