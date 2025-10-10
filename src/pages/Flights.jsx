import { useEffect, useMemo, useRef, useState } from 'react';
import '../styles/flights.css';

const initialPassengers = {
  adult: 1,
  child: 0,
  infant: 0,
};

function Flights() {
  const [tripType, setTripType] = useState('roundtrip');
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    depart: '',
    returnDate: '',
    airline: '',
    cheap: false,
  });
  const [passengers, setPassengers] = useState(initialPassengers);
  const [showDropdown, setShowDropdown] = useState(false);
  const [result, setResult] = useState(null);
  const dropdownRef = useRef(null);

  const passengerSummary = useMemo(() => {
    const parts = [];
    if (passengers.adult) parts.push(`${passengers.adult} người lớn`);
    if (passengers.child) parts.push(`${passengers.child} trẻ em`);
    if (passengers.infant) parts.push(`${passengers.infant} em bé`);
    return parts.join(', ') || '1 người lớn';
  }, [passengers]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!dropdownRef.current || dropdownRef.current.contains(event.target)) {
        return;
      }
      setShowDropdown(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePassengerChange = (type, delta) => {
    setPassengers((prev) => {
      const nextValue = type === 'adult' ? Math.max(1, prev[type] + delta) : Math.max(0, prev[type] + delta);
      return { ...prev, [type]: nextValue };
    });
  };

  const handleTripChange = (event) => {
    const value = event.target.value;
    setTripType(value);
    if (value === 'oneway') {
      setFormData((prev) => ({ ...prev, returnDate: '' }));
    }
  };

  const handleFieldChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  useEffect(() => {
    if (!formData.depart || !formData.returnDate) {
      return;
    }
    if (formData.returnDate < formData.depart) {
      setFormData((prev) => ({ ...prev, returnDate: prev.depart }));
    }
  }, [formData.depart, formData.returnDate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.from.trim() || !formData.to.trim() || !formData.depart) {
      setResult({
        heading: 'Chưa đủ thông tin',
        content: 'Vui lòng nhập điểm đi, điểm đến và ngày đi trước khi tìm chuyến bay.',
        error: true,
      });
      return;
    }

    const lines = [
      `<strong>Điểm đi:</strong> ${formData.from}`,
      `<strong>Điểm đến:</strong> ${formData.to}`,
      `<strong>Ngày đi:</strong> ${formData.depart}`,
    ];

    if (tripType === 'roundtrip' && formData.returnDate) {
      lines.push(`<strong>Ngày về:</strong> ${formData.returnDate}`);
    }

    lines.push(`<strong>Hãng bay:</strong> ${formData.airline || 'Không chọn'}`);
    lines.push(`<strong>Hành khách:</strong> ${passengerSummary}`);

    if (formData.cheap) {
      lines.push('<em>Ưu tiên vé giá rẻ.</em>');
    }

    setResult({
      heading: 'Tìm kiếm thành công',
      content: lines.join('<br />'),
      error: false,
    });
  };

  return (
    <div className="flights-page">
      <div className="banner">
        <img src="/anh/TRAVEL TOUR.png" alt="SEVEN TRAVEL" />
      </div>

      <div className="booking-box">
        <div className="top-bar">
          <span>✈ Mua hành lý, suất ăn, chỗ ngồi và hơn thế nữa…</span>
          <span>📦 Gửi hàng nhanh | 📍 Check in</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="trip"
                value="roundtrip"
                checked={tripType === 'roundtrip'}
                onChange={handleTripChange}
              />
              Khứ hồi
            </label>
            <label>
              <input
                type="radio"
                name="trip"
                value="oneway"
                checked={tripType === 'oneway'}
                onChange={handleTripChange}
              />
              Một chiều
            </label>
            <select defaultValue="VND">
              <option>VND</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="from">Điểm khởi hành</label>
            <input
              id="from"
              name="from"
              type="text"
              placeholder="Nhập điểm khởi hành"
              value={formData.from}
              onChange={handleFieldChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="to">Điểm đến</label>
            <input
              id="to"
              name="to"
              type="text"
              placeholder="Nhập điểm đến"
              value={formData.to}
              onChange={handleFieldChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="depart">Ngày đi</label>
            <input
              id="depart"
              name="depart"
              type="date"
              value={formData.depart}
              onChange={handleFieldChange}
            />
          </div>

          {tripType === 'roundtrip' && (
            <div className="form-group">
              <label htmlFor="returnDate">Ngày về</label>
              <input
                id="returnDate"
                name="returnDate"
                type="date"
                value={formData.returnDate}
                min={formData.depart || undefined}
                onChange={handleFieldChange}
              />
            </div>
          )}

          <div className="dropdown" ref={dropdownRef}>
            <button
              type="button"
              className="dropdown-toggle"
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              Hành khách: <span id="passenger-summary">{passengerSummary}</span>
            </button>
            {showDropdown && (
              <div className="dropdown-menu" id="passenger-menu">
                {[
                  { type: 'adult', label: 'Người lớn', description: '12 tuổi trở lên' },
                  { type: 'child', label: 'Trẻ em', description: '2–11 tuổi' },
                  { type: 'infant', label: 'Em bé', description: 'Dưới 2 tuổi' },
                ].map(({ type, label, description }) => (
                  <div className="passenger-row" key={type}>
                    <div className="passenger-info">
                      <span>{label}</span>
                      <small>{description}</small>
                    </div>
                    <div className="counter">
                      <button type="button" onClick={() => handlePassengerChange(type, -1)}>
                        −
                      </button>
                      <span id={`${type}-count`}>{passengers[type]}</span>
                      <button type="button" onClick={() => handlePassengerChange(type, 1)}>
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="airline">Chọn hãng bay</label>
            <select id="airline" name="airline" value={formData.airline} onChange={handleFieldChange}>
              <option value="">-- Tất cả các hãng --</option>
              <optgroup label="Hãng nội địa Việt Nam">
                <option value="Vietnam Airlines">Vietnam Airlines</option>
                <option value="Vietjet Air">Vietjet Air</option>
                <option value="Bamboo Airways">Bamboo Airways</option>
                <option value="Pacific Airlines">Pacific Airlines</option>
                <option value="Vietravel Airlines">Vietravel Airlines</option>
              </optgroup>
              <optgroup label="Hãng quốc tế">
                <option value="Emirates">Emirates</option>
                <option value="Qatar Airways">Qatar Airways</option>
                <option value="Singapore Airlines">Singapore Airlines</option>
                <option value="Thai Airways">Thai Airways</option>
                <option value="Korean Air">Korean Air</option>
                <option value="Asiana Airlines">Asiana Airlines</option>
                <option value="China Airlines">China Airlines</option>
                <option value="EVA Air">EVA Air</option>
                <option value="ANA">ANA (All Nippon Airways)</option>
                <option value="Japan Airlines">Japan Airlines</option>
                <option value="Cathay Pacific">Cathay Pacific</option>
                <option value="AirAsia">AirAsia</option>
                <option value="Scoot">Scoot</option>
                <option value="Malaysia Airlines">Malaysia Airlines</option>
                <option value="Lufthansa">Lufthansa</option>
                <option value="Turkish Airlines">Turkish Airlines</option>
                <option value="Etihad Airways">Etihad Airways</option>
                <option value="British Airways">British Airways</option>
                <option value="Air France">Air France</option>
                <option value="KLM">KLM Royal Dutch Airlines</option>
                <option value="United Airlines">United Airlines</option>
                <option value="Delta Air Lines">Delta Air Lines</option>
                <option value="American Airlines">American Airlines</option>
              </optgroup>
            </select>
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="cheap"
              name="cheap"
              checked={formData.cheap}
              onChange={handleFieldChange}
            />
            <label htmlFor="cheap">Tìm vé rẻ nhất</label>
          </div>

          <button type="submit" className="search-button">
            Tìm chuyến bay
          </button>
          {result && (
            <div
              className="flight-result"
              role="status"
              style={{ background: result.error ? '#ffe0e0' : '#b8e8ed' }}
            >
              <h3>{result.heading}</h3>
              <p dangerouslySetInnerHTML={{ __html: result.content }} />
            </div>
          )}
        </form>
      </div>

      <section className="popular-destinations">
        <h2>Điểm Đến Phổ Biến</h2>
        <div className="destinations-container">
          <div className="destination-card">
            <img src="/anh/image copy 20.png" alt="Thành phố Paris thơ mộng" />
            <h3>Paris, Pháp</h3>
            <p>Kinh đô ánh sáng với tháp Eiffel và những công trình kiến trúc lãng mạn.</p>
          </div>
          <div className="destination-card">
            <img src="/anh/image copy 21.png" alt="Thành phố Tokyo hiện đại" />
            <h3>Tokyo, Nhật Bản</h3>
            <p>Sự kết hợp độc đáo giữa văn hóa truyền thống và công nghệ hiện đại bậc nhất.</p>
          </div>
          <div className="destination-card">
            <img src="/anh/image copy 22.png" alt="Vịnh Hạ Long kỳ vĩ" />
            <h3>Vịnh Hạ Long, Việt Nam</h3>
            <p>Di sản thiên nhiên thế giới với hàng ngàn đảo đá vôi hùng vĩ và làn nước xanh ngọc.</p>
          </div>
          <div className="destination-card">
            <img src="/anh/image copy 23.png" alt="Đảo Bali xinh đẹp" />
            <h3>Bali, Indonesia</h3>
            <p>Thiên đường nghỉ dưỡng với bãi biển tuyệt đẹp, ruộng bậc thang và văn hóa đặc sắc.</p>
          </div>
        </div>
      </section>

      <section className="special-offers">
        <h2>Ưu Đãi Đặc Biệt Cho Bạn</h2>
        <div className="offers-container">
          <div className="offer-card">
            <img src="/anh/3.png" alt="Ưu đãi vé máy bay nội địa" />
            <div className="offer-content">
              <h4>🎉 Bay Nội Địa Thả Ga - Giảm Đến 30%</h4>
              <p>Khám phá vẻ đẹp Việt Nam với ưu đãi hấp dẫn cho các chặng bay nội địa. Áp dụng cho các hãng bay hàng đầu!</p>
            </div>
          </div>
          <div className="offer-card">
            <img src="/anh/image copy 25.png" alt="Ưu đãi vé máy bay đi Thái Lan" />
            <div className="offer-content">
              <h4>🌏 Vi Vu Thái Lan - Giá Chỉ Từ 1.599.000₫</h4>
              <p>Trải nghiệm xứ sở Chùa Vàng với mức giá không thể tốt hơn. Đặt vé ngay, kẻo lỡ!</p>
            </div>
          </div>
          <div className="offer-card">
            <img src="/anh/image copy 24.png" alt="Ưu đãi combo du lịch" />
            <div className="offer-content">
              <h4>✨ Combo Khách Sạn + Vé Bay Siêu Tiết Kiệm</h4>
              <p>Tận hưởng chuyến đi trọn vẹn với gói combo ưu đãi đặc biệt. Lựa chọn đa dạng, dịch vụ chất lượng.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="why-choose-us">
        <h2>Vì Sao Chọn TRAVEL TOUR?</h2>
        <div className="features-container">
          <div className="feature-item">
            <i className="fas fa-plane-departure" />
            <h3>Đa Dạng Chuyến Bay</h3>
            <p>Hàng ngàn chuyến bay từ các hãng hàng không uy tín trong và ngoài nước.</p>
          </div>
          <div className="feature-item">
            <i className="fas fa-dollar-sign" />
            <h3>Giá Tốt Nhất</h3>
            <p>Luôn cập nhật giá vé ưu đãi, giúp bạn tiết kiệm chi phí tối đa.</p>
          </div>
          <div className="feature-item">
            <i className="fas fa-headset" />
            <h3>Hỗ Trợ 24/7</h3>
            <p>Đội ngũ tư vấn viên chuyên nghiệp sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi.</p>
          </div>
          <div className="feature-item">
            <i className="fas fa-shield-alt" />
            <h3>Thanh Toán An Toàn</h3>
            <p>Bảo mật thông tin và giao dịch với nhiều phương thức thanh toán tiện lợi.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Flights;
