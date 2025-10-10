import { useMemo, useState } from 'react';
import '../styles/trains.css';

const initialSearchState = {
  departureStation: '',
  arrivalStation: '',
  departureDate: '',
  returnDate: '',
  passengers: '1',
  ticketType: 'ngoi-mem-dieu-hoa',
};

const initialBookingState = {
  visible: false,
  route: '',
  price: 0,
  departureStation: '',
  arrivalStation: '',
};

const initialBookingForm = {
  departureDate: '',
  passengers: '1',
};

function Trains() {
  const [searchData, setSearchData] = useState(initialSearchState);
  const [searchErrors, setSearchErrors] = useState({});
  const [searchResult, setSearchResult] = useState(null);
  const [bookingInfo, setBookingInfo] = useState(initialBookingState);
  const [bookingForm, setBookingForm] = useState(initialBookingForm);
  const [bookingSummary, setBookingSummary] = useState(null);
  const [bookingErrors, setBookingErrors] = useState({});

  const ticketTypeLabel = useMemo(
    () => ({
      'ngoi-mem-dieu-hoa': 'Ngồi mềm điều hòa',
      'nam-khoang-4-dieu-hoa': 'Nằm khoang 4 điều hòa',
      'nam-khoang-6-dieu-hoa': 'Nằm khoang 6 điều hòa',
      'ghe-phu': 'Ghế phụ',
    }),
    []
  );

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setSearchData((prev) => ({ ...prev, [name]: value }));
    setSearchErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const errors = {};

    ['departureStation', 'arrivalStation', 'departureDate', 'passengers'].forEach((field) => {
      if (!searchData[field]?.trim()) {
        errors[field] = 'Vui lòng điền đầy đủ thông tin';
      }
    });

    if (searchData.returnDate && searchData.returnDate < searchData.departureDate) {
      errors.returnDate = 'Ngày về không được nhỏ hơn ngày đi';
    }

    if (Number(searchData.passengers) <= 0) {
      errors.passengers = 'Số hành khách phải lớn hơn 0';
    }

    if (Object.keys(errors).length > 0) {
      setSearchErrors(errors);
      setSearchResult(null);
      return;
    }

    setSearchErrors({});

    setSearchResult({
      departureStation: searchData.departureStation,
      arrivalStation: searchData.arrivalStation,
      departureDate: searchData.departureDate,
      returnDate: searchData.returnDate,
      passengers: searchData.passengers,
      ticketType: ticketTypeLabel[searchData.ticketType] || 'Không xác định',
    });
  };

  const handleBookingOpen = (route, price) => {
    const [departureStation = '', arrivalStation = ''] = route.split(' - ').map((part) => part.trim());
    setBookingInfo({
      visible: true,
      route,
      price,
      departureStation,
      arrivalStation,
    });
    setBookingForm(initialBookingForm);
    setBookingSummary(null);
    setBookingErrors({});
  };

  const handleBookingFieldChange = (event) => {
    const { name, value } = event.target;
    if (name === 'departureStation' || name === 'arrivalStation') {
      setBookingInfo((prev) => ({ ...prev, [name]: value }));
      return;
    }
    setBookingForm((prev) => ({ ...prev, [name]: value }));
    setBookingErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleBookingSubmit = () => {
    const errors = {};
    if (!bookingForm.departureDate) {
      errors.departureDate = 'Vui lòng chọn ngày đi.';
    }
    if (Number(bookingForm.passengers) <= 0) {
      errors.passengers = 'Số hành khách phải lớn hơn 0.';
    }

    if (Object.keys(errors).length > 0) {
      setBookingErrors(errors);
      return;
    }

    const total = bookingInfo.price * Number(bookingForm.passengers);
    setBookingErrors({});
    setBookingSummary({
      route: `${bookingInfo.departureStation} - ${bookingInfo.arrivalStation}`,
      date: bookingForm.departureDate,
      passengers: bookingForm.passengers,
      total,
    });
  };

  return (
    <div className="train-ticket-booking-page">
      <div className="train-page-banner">
        <img src="/anh/Gemini_Generated_Image_ku1zl0ku1zl0ku1z.png" alt="Du lịch bằng tàu hỏa" />
        <div className="train-banner-overlay">
          <h2>Khám Phá Việt Nam Trên Những Chuyến Tàu</h2>
          <p>Trải nghiệm hành trình đáng nhớ với dịch vụ đặt vé tàu tiện lợi, an toàn và nhanh chóng.</p>
        </div>
      </div>

      <div className="container">
        <h1>
          <i className="fas fa-subway" /> Đặt Vé Tàu Trực Tuyến
        </h1>
        <p className="page-intro">
          Tìm kiếm và đặt vé tàu dễ dàng cho mọi hành trình trên khắp Việt Nam cùng SEVEN TRAVEL.
        </p>

        <form className="train-search-form" onSubmit={handleSearchSubmit}>
          <div className="form-row">
            <div className="input-group">
              <label htmlFor="departureStation">
                <i className="fas fa-train" /> Ga đi:
              </label>
              <input
                type="text"
                id="departureStation"
                name="departureStation"
                placeholder="VD: Hà Nội"
                value={searchData.departureStation}
                onChange={handleSearchChange}
              />
              {searchErrors.departureStation && <p className="error-text">{searchErrors.departureStation}</p>}
            </div>
            <div className="input-group">
              <label htmlFor="arrivalStation">
                <i className="fas fa-map-signs" /> Ga đến:
              </label>
              <input
                type="text"
                id="arrivalStation"
                name="arrivalStation"
                placeholder="VD: Đà Nẵng"
                value={searchData.arrivalStation}
                onChange={handleSearchChange}
              />
              {searchErrors.arrivalStation && <p className="error-text">{searchErrors.arrivalStation}</p>}
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label htmlFor="departureDate">
                <i className="fas fa-calendar-alt" /> Ngày đi:
              </label>
              <input
                type="date"
                id="departureDate"
                name="departureDate"
                value={searchData.departureDate}
                onChange={handleSearchChange}
              />
              {searchErrors.departureDate && <p className="error-text">{searchErrors.departureDate}</p>}
            </div>
            <div className="input-group">
              <label htmlFor="returnDate">
                <i className="fas fa-calendar-alt" /> Ngày về (Không bắt buộc):
              </label>
              <input
                type="date"
                id="returnDate"
                name="returnDate"
                value={searchData.returnDate}
                min={searchData.departureDate || undefined}
                onChange={handleSearchChange}
              />
              {searchErrors.returnDate && <p className="error-text">{searchErrors.returnDate}</p>}
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label htmlFor="passengers">
                <i className="fas fa-users" /> Số lượng hành khách:
              </label>
              <input
                type="number"
                id="passengers"
                name="passengers"
                min="1"
                value={searchData.passengers}
                onChange={handleSearchChange}
              />
              {searchErrors.passengers && <p className="error-text">{searchErrors.passengers}</p>}
            </div>
            <div className="input-group">
              <label htmlFor="ticketType">
                <i className="fas fa-ticket-alt" /> Loại vé:
              </label>
              <select
                id="ticketType"
                name="ticketType"
                value={searchData.ticketType}
                onChange={handleSearchChange}
              >
                <option value="ngoi-mem-dieu-hoa">Ngồi mềm điều hòa</option>
                <option value="nam-khoang-4-dieu-hoa">Nằm khoang 4 điều hòa</option>
                <option value="nam-khoang-6-dieu-hoa">Nằm khoang 6 điều hòa</option>
                <option value="ghe-phu">Ghế phụ</option>
              </select>
            </div>
          </div>

          <button type="submit" className="search-button">
            <i className="fas fa-search" /> Tìm Vé Tàu Ngay
          </button>

          {searchResult && (
            <div className="result-message">
              <strong>Tìm kiếm thành công:</strong>
              <ul>
                <li>✅ Ga đi: {searchResult.departureStation}</li>
                <li>✅ Ga đến: {searchResult.arrivalStation}</li>
                <li>🗓 Ngày đi: {searchResult.departureDate}</li>
                {searchResult.returnDate && <li>🗓 Ngày về: {searchResult.returnDate}</li>}
                <li>👥 Số hành khách: {searchResult.passengers}</li>
                <li>🎫 Loại vé: {searchResult.ticketType}</li>
              </ul>
            </div>
          )}
        </form>

        <section className="train-offers-section">
          <h2>
            <i className="fas fa-tags" /> Ưu Đãi Vé Tàu Hấp Dẫn
          </h2>
          <div className="offers-grid">
            <div className="offer-card">
              <img src="/anh/image copy 26.png" alt="Ưu đãi vé tàu Hà Nội - Sapa" />
              <div className="offer-content">
                <h3>
                  Hà Nội <i className="fas fa-long-arrow-alt-right" /> Sapa Chỉ Từ 350.000đ
                </h3>
                <p>Khám phá nóc nhà Đông Dương với ưu đãi đặc biệt.</p>
                <button type="button" className="btn-offer" onClick={() => handleBookingOpen('Hà Nội - Sapa', 350000)}>
                  Đặt vé
                </button>
              </div>
            </div>
            <div className="offer-card">
              <img src="/anh/image copy 27.png" alt="Ưu đãi vé tàu Đà Nẵng - Huế" />
              <div className="offer-content">
                <h3>
                  Đà Nẵng <i className="fas fa-long-arrow-alt-right" /> Huế: Cung Đường Di Sản
                </h3>
                <p>Giảm 15% vé khứ hồi khi đặt qua SEVEN TRAVEL. Ngắm cảnh đèo Hải Vân hùng vĩ.</p>
                <button type="button" className="btn-offer" onClick={() => handleBookingOpen('Đà Nẵng - Huế', 200000)}>
                  Đặt vé
                </button>
              </div>
            </div>
            <div className="offer-card">
              <img src="/anh/image copy 28.png" alt="Ưu đãi vé tàu Sài Gòn - Nha Trang" />
              <div className="offer-content">
                <h3>
                  Sài Gòn <i className="fas fa-long-arrow-alt-right" /> Nha Trang Cuối Tuần
                </h3>
                <p>Combo vé tàu + khách sạn giá cực tốt cho chuyến đi biển ngập nắng.</p>
                <button type="button" className="btn-offer" onClick={() => handleBookingOpen('Sài Gòn - Nha Trang', 400000)}>
                  Đặt vé
                </button>
              </div>
            </div>
          </div>
        </section>

        {bookingInfo.visible && (
          <div id="booking-form-container" className="booking-form-container">
            <h2>Đặt vé</h2>
            <form className="booking-form" onSubmit={(event) => event.preventDefault()}>
              <div className="form-row">
                <div className="input-group">
                  <label htmlFor="booking-departure-station">
                    <i className="fas fa-train" /> Ga đi:
                  </label>
                  <input
                    type="text"
                    id="booking-departure-station"
                    name="departureStation"
                    value={bookingInfo.departureStation}
                    onChange={handleBookingFieldChange}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="booking-arrival-station">
                    <i className="fas fa-train" /> Ga đến:
                  </label>
                  <input
                    type="text"
                    id="booking-arrival-station"
                    name="arrivalStation"
                    value={bookingInfo.arrivalStation}
                    onChange={handleBookingFieldChange}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="booking-departure-date">
                    <i className="fas fa-calendar-alt" /> Ngày đi:
                  </label>
                  <input
                    type="date"
                    id="booking-departure-date"
                    name="departureDate"
                    value={bookingForm.departureDate}
                    onChange={handleBookingFieldChange}
                  />
                  {bookingErrors.departureDate && <p className="error-text">{bookingErrors.departureDate}</p>}
                </div>
                <div className="input-group">
                  <label htmlFor="booking-passengers">
                    <i className="fas fa-users" /> Số lượng hành khách:
                  </label>
                  <input
                    type="number"
                    id="booking-passengers"
                    name="passengers"
                    min="1"
                    value={bookingForm.passengers}
                    onChange={handleBookingFieldChange}
                  />
                  {bookingErrors.passengers && <p className="error-text">{bookingErrors.passengers}</p>}
                </div>
              </div>

              <button type="button" className="search-button" onClick={handleBookingSubmit}>
                <i className="fas fa-check" /> Xác Nhận Đặt Vé
              </button>
            </form>

            {bookingSummary && (
              <div id="booking-summary" className="booking-summary">
                <h2>Thông Tin Đặt Vé</h2>
                <p>
                  <strong>Tuyến đường:</strong> {bookingSummary.route}
                </p>
                <p>
                  <strong>Ngày đi:</strong> {bookingSummary.date}
                </p>
                <p>
                  <strong>Số lượng hành khách:</strong> {bookingSummary.passengers}
                </p>
                <p>
                  <strong>Tổng số tiền:</strong> {bookingSummary.total.toLocaleString('vi-VN')} VNĐ
                </p>
              </div>
            )}
          </div>
        )}

        <section className="why-choose-train">
          <h2>
            <i className="fas fa-question-circle" /> Tại Sao Chọn Du Lịch Bằng Tàu Hỏa?
          </h2>
          <div className="benefits-grid">
            <div className="benefit-item">
              <div className="benefit-icon">
                <i className="fas fa-mountain-sun" />
              </div>
              <h3>Ngắm Cảnh Tuyệt Đẹp</h3>
              <p>Tận hưởng những cung đường sắt đẹp nhất Việt Nam, qua núi non hùng vĩ, bờ biển thơ mộng.</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">
                <i className="fas fa-couch" />
              </div>
              <h3>Thoải Mái &amp; Tiện Nghi</h3>
              <p>Ghế ngồi, giường nằm êm ái, không gian rộng rãi, dịch vụ ăn uống và vệ sinh sạch sẽ trên tàu.</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">
                <i className="fas fa-shield-alt" />
              </div>
              <h3>An Toàn &amp; Đáng Tin Cậy</h3>
              <p>Phương tiện di chuyển an toàn hàng đầu, lịch trình ổn định, ít bị ảnh hưởng bởi thời tiết xấu.</p>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">
                <i className="fas fa-leaf" />
              </div>
              <h3>Thân Thiện Với Môi Trường</h3>
              <p>Lựa chọn di chuyển xanh, góp phần giảm thiểu khí thải carbon so với các phương tiện khác.</p>
            </div>
          </div>
        </section>

        <div className="train-info-sections">
          <section className="popular-routes">
            <h2>
              <i className="fas fa-route" /> Các Tuyến Tàu Phổ Biến
            </h2>
            <ul>
              <li>
                <i className="fas fa-map-pin" /> Hà Nội - Sài Gòn (Tàu Thống Nhất SE1/SE2, SE3/SE4,...)
              </li>
              <li>
                <i className="fas fa-map-pin" /> Hà Nội - Đà Nẵng (Qua Huế, Vinh)
              </li>
              <li>
                <i className="fas fa-map-pin" /> Đà Nẵng - Sài Gòn (Qua Nha Trang, Phan Thiết)
              </li>
              <li>
                <i className="fas fa-map-pin" /> Hà Nội - Lào Cai (Đi Sapa bằng tàu SP, LC)
              </li>
              <li>
                <i className="fas fa-map-pin" /> Sài Gòn - Phan Thiết (Đi Mũi Né)
              </li>
              <li>
                <i className="fas fa-map-pin" /> Sài Gòn - Nha Trang
              </li>
            </ul>
          </section>
          <section className="train-travel-tips">
            <h2>
              <i className="fas fa-lightbulb" /> Mẹo Du Lịch Bằng Tàu Hỏa
            </h2>
            <p>
              <i className="fas fa-check-circle text-green" /> Đặt vé sớm (ít nhất 1-2 tuần, dịp lễ tết nên sớm hơn) để
              có giá tốt và chỗ ngồi ưng ý.
            </p>
            <p>
              <i className="fas fa-check-circle text-green" /> Mang theo đồ dùng cá nhân cần thiết, đồ ăn nhẹ và nước
              uống yêu thích.
            </p>
            <p>
              <i className="fas fa-check-circle text-green" /> Kiểm tra kỹ thông tin trên vé (tên, số CMND/CCCD, ga
              đi/đến, giờ tàu) và chuẩn bị giấy tờ tùy thân.
            </p>
            <p>
              <i className="fas fa-check-circle text-green" /> Đến ga sớm ít nhất 30-45 phút trước giờ tàu chạy để làm
              thủ tục lên tàu.
            </p>
            <p>
              <i className="fas fa-check-circle text-green" /> Tải ứng dụng theo dõi lịch trình tàu hoặc kiểm tra thông
              tin tại ga.
            </p>
          </section>
        </div>

        <section className="train-testimonials">
          <h2>
            <i className="fas fa-comments" /> Khách Hàng Nói Gì Về Dịch Vụ Đặt Vé Tàu Của Chúng Tôi
          </h2>
          <div className="testimonial-grid">
            <div className="testimonial-card">
              <img src="/anh/avatar_customer_1.png" alt="Avatar khách hàng Nguyễn Văn An" className="testimonial-avatar" />
              <p>
                "Đặt vé tàu đi Đà Nẵng qua SEVEN TRAVEL rất nhanh và tiện. Giao diện thân thiện, dễ tìm kiếm. Nhân viên
                hỗ trợ rất nhiệt tình khi tôi cần đổi vé. Chắc chắn sẽ sử dụng lại dịch vụ!"
              </p>
              <h4>Nguyễn Văn An</h4>
              <div className="stars">
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
              </div>
            </div>
            <div className="testimonial-card">
              <img src="/anh/avatar_customer_2.png" alt="Avatar khách hàng Lê Thị Bình" className="testimonial-avatar" />
              <p>
                "Tôi thường xuyên đi công tác bằng tàu hỏa giữa Hà Nội và Vinh. Từ khi biết đến SEVEN TRAVEL, việc đặt vé
                trở nên đơn giản hơn nhiều. Ưu đãi cũng tốt nữa. Rất hài lòng!"
              </p>
              <h4>Lê Thị Bình</h4>
              <div className="stars">
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star-half-alt" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Trains;
