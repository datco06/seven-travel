import { useCallback, useMemo } from 'react';
import '../styles/createTour.css';
import TourExplorer, { FIXED_DESTINATIONS } from '../components/TourExplorer.jsx';
import AdminTourForm from '../components/AdminTourForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';

const WHY_CHOOSE_REASONS = [
  {
    icon: 'fa-sack-dollar',
    title: 'Giá tốt nhất cho bạn',
    description: 'Có nhiều mức giá đa dạng phù hợp với ngân sách và nhu cầu của bạn.',
  },
  {
    icon: 'fa-ticket-simple',
    title: 'Booking dễ dàng',
    description: 'Các bước booking và chăm sóc khách hàng nhanh chóng và thuận tiện.',
  },
  {
    icon: 'fa-suitcase-rolling',
    title: 'Tour du lịch tối ưu',
    description: 'Đa dạng các loại hình tour du lịch với nhiều mức giá khác nhau.',
  },
  {
    icon: 'fa-map-location-dot',
    title: 'Chuyên gia đồng hành',
    description: 'Đội ngũ tư vấn giàu kinh nghiệm luôn theo sát hành trình của bạn.',
  },
];

const WHY_CHOOSE_ICONS = WHY_CHOOSE_REASONS.map((item) => item.icon);

function CreateTour() {
  const { currentUser, tours } = useAuth();
  const { language } = useLanguage();
  const isAdmin = currentUser?.role === 'admin';
  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
      }),
    []
  );

  const scrollToExplorer = useCallback(() => {
    const section = document.getElementById('tour-explorer-page');
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const spotlightTours = useMemo(() => {
    const allowed = new Set(FIXED_DESTINATIONS.map((item) => item.toLowerCase()));
    const isShort = (tour) => {
      if (Number.isFinite(tour.durationDays)) return tour.durationDays <= 3;
      const source = tour.durationLabel || tour.duration || '';
      const match = source.match(/(\d+)\s*ngày/i);
      const days = match ? Number.parseInt(match[1], 10) : Number.NaN;
      return Number.isFinite(days) && days <= 3;
    };
    const isAllowed = (tour) => {
      const regions = (tour.regions ?? []).map((region) => region.toLowerCase());
      return regions.length === 0 ? false : regions.every((region) => allowed.has(region));
    };
    return tours.filter((tour) => isShort(tour) && isAllowed(tour)).slice(0, 3);
  }, [tours]);

  return (
    <div className="create-tour-page">
      <div className="banner" id="home">
        <img src="/anh/home.jpeg" alt="Banner tạo tour SEVEN TRAVEL" />
        <div className="content">
        <h2>DU LỊCH CÙNG SEVEN TRAVEL</h2>
          <p>
            Vinh hạnh cùng chúng tôi là mang đến cho bạn những chuyến đi đáng nhớ. Mang đến cho bạn những chuyến đi
            đầy cảm hứng. Khám phá vùng đất mới. Tự do khám phá cùng chúng tôi.
          </p>
          <button type="button" onClick={scrollToExplorer}>
            Tìm hiểu ngay
          </button>
        </div>
      </div>

      <section className="content2 why-choose-us">
        <h1 className="section-title">Vì Sao Bạn Nên Chọn SEVEN TRAVEL?</h1>
        <div className="why-choose-icons" aria-hidden="true">
          {WHY_CHOOSE_ICONS.map((icon) => (
            <span className="icon-circle" key={icon}>
              <i className={`fa-solid ${icon}`} aria-hidden="true" />
            </span>
          ))}
        </div>
        <div className="duoi">
          {WHY_CHOOSE_REASONS.map((item) => (
            <div className="lydo" key={item.title}>
              <div className="icon">
                <i className={`fa-solid ${item.icon}`} aria-hidden="true" />
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="how-ai-helps-section">
        <h1 className="section-title">AI Đồng Hành Cùng Chuyến Đi Của Bạn Như Thế Nào?</h1>
        <p className="section-subtitle">
          Khám phá cách trí tuệ nhân tạo mang đến trải nghiệm du lịch cá nhân hóa và thông minh hơn.
        </p>
        <div className="ai-benefits-container">
          <div className="ai-benefit-item">
            <div className="ai-benefit-icon">
              <i className="fas fa-user-cog" />
            </div>
            <h3>Cá Nhân Hóa Tối Đa</h3>
            <p>
              AI phân tích sở thích, ngân sách và lịch trình của bạn để tạo ra một chuyến đi độc nhất, dành riêng cho
              bạn.
            </p>
          </div>
          <div className="ai-benefit-item">
            <div className="ai-benefit-icon">
              <i className="fas fa-lightbulb" />
            </div>
            <h3>Gợi Ý Thông Minh</h3>
            <p>
              Khám phá những điểm đến ẩn mình, hoạt động thú vị và món ăn địa phương độc đáo mà có thể bạn chưa từng
              biết tới.
            </p>
          </div>
          <div className="ai-benefit-item">
            <div className="ai-benefit-icon">
              <i className="fas fa-route" />
            </div>
            <h3>Tối Ưu Hóa Lịch Trình</h3>
            <p>
              AI giúp sắp xếp lịch trình một cách logic, tiết kiệm thời gian di chuyển và đảm bảo bạn không bỏ lỡ
              những điều tuyệt vời nhất.
            </p>
          </div>
        </div>
      </section>

      <TourExplorer anchorId="tour-explorer-page" />

      {isAdmin ? (
        <section className="admin-tour-section" id="admin-create-tour">
          <AdminTourForm />
        </section>
      ) : null}

      <section className="phan2 booking-steps">
        <h1 className="section-title">Booking Cùng SEVEN TRAVEL</h1>
        <p className="section-subtitle">Chỉ với vài bước đơn giản và dễ dàng bạn có ngay trải nghiệm tuyệt vời!</p>
        <div className="cacbuoc">
          <div className="buoc">
            <img src="/anh/booking-step1.png" alt="Tìm nơi đến" />
            <h3>Tìm nơi bạn muốn đến</h3>
            <p>Bất cứ nơi đâu bạn muốn đến, chúng tôi có tất cả những gì bạn muốn.</p>
          </div>
          <div className="buoc">
            <img src="/anh/booking-step2.png" alt="Tạo tour" />
            <h3>Tạo tour thông minh</h3>
            <p>SEVEN TRAVEL sẽ hỗ trợ thiết kế tour trực tiếp nhanh chóng và thuận tiện.</p>
          </div>
          <div className="buoc">
            <img src="/anh/booking-step3.png" alt="Thanh toán" />
            <h3>Thanh toán &amp; Lên đường</h3>
            <p>Hoàn thành thanh toán và sẵn sàng cho chuyến đi sắp tới.</p>
          </div>
        </div>
      </section>

      <section className="phan3 about-us-section" id="about-us">
        <div className="trai">
          <h2 className="custom-h2">Hiểu Hơn Về Chúng Tôi</h2>
          <h1 className="custom-h1">Lên Kế Hoạch Cho Chuyến Đi Của Bạn Cùng SEVEN TRAVEL</h1>
          <p className="dai">
            Vinh hạnh của chúng tôi là mang đến cho bạn những chuyến đi đáng nhớ. Mang đến cho bạn những chuyến đi đầy
            cảm hứng. Khám phá những vùng đất mới. Tự do khám phá cùng chúng tôi.
          </p>
          <h2 className="custom-h2">Cơ hội tuyệt vời để gửi gắm niềm tin cùng SEVEN TRAVEL. Tại sao không?</h2>
          <div className="tich">Hơn 10.000 khách hàng trên khắp cả nước đã đồng hành cùng chúng tôi.</div>
          <div className="tich">Bao phủ hơn 1.000 tour trong và ngoài nước.</div>
          <div className="tich">Tour và giá cả rất đa dạng, phù hợp mọi nhu cầu.</div>
        </div>
        <div className="image-layout">
          <div className="image-wrapper img1">
            <img src="/anh/image.png" alt="Camping by the lake" />
          </div>
          <div className="image-wrapper img2">
            <img src="/anh/image copy 34.png" alt="Couple taking selfie" />
          </div>
          <div className="image-wrapper img3">
            <img src="/anh/image copy 2.png" alt="Beach with chairs" />
          </div>
        </div>
      </section>

      <section className="phan4 testimonials-section" id="testimonials">
        <div className="tieude">
          <h1 className="section-title">Khách Hàng Nói Gì Về Chúng Tôi</h1>
          <p className="section-subtitle">
            Chúng tôi vinh hạnh vì đã có cơ hội đồng hành với hơn 10.000 khách hàng trên khắp thế giới.
          </p>
        </div>
        <div className="slide">
          <div className="slide1">
            <p>
              "Dịch vụ rất tuyệt vời. Mình đã có một chuyến đi cực kì đáng nhớ. SEVEN TRAVEL đã hỗ trợ rất nhanh khi gặp
              vấn đề và mình đánh giá rất cao chăm sóc khách hàng."
            </p>
            <div className="stars">⭐⭐⭐⭐⭐</div>
            <img src="/anh/image copy 3.png" className="khach1" alt="Khách hàng Thu Thảo" />
            <h4>Thu Thảo</h4>
          </div>
          <div className="slide1">
            <p>
              "Tour thiết kế rất hợp lý, phù hợp với gia đình có con nhỏ. Các bạn tư vấn nhiệt tình, chu đáo. Chắc chắn
              sẽ quay lại với SEVEN TRAVEL cho những chuyến đi sau!"
            </p>
            <div className="stars">⭐⭐⭐⭐⭐</div>
            <img src="/anh/image copy 3.png" className="khach1" alt="Khách hàng Minh Anh" />
            <h4>Minh Anh</h4>
          </div>
          <div className="slide1">
            <p>
              "Lần đầu trải nghiệm đặt tour qua AI và thực sự ấn tượng. Lịch trình thông minh, tiết kiệm thời gian mà
              vẫn đầy đủ các điểm tham quan hấp dẫn. Rất khuyến khích!"
            </p>
            <div className="stars">⭐⭐⭐⭐⭐</div>
            <img src="/anh/image copy 3.png" className="khach1" alt="Khách hàng Quốc Bảo" />
            <h4>Quốc Bảo</h4>
          </div>
        </div>
      </section>

      <section className="donghanh partners-section">
        <h1 className="section-title">Đồng Hành Cùng SEVEN TRAVEL</h1>
        <img src="/anh/partners-collage.png" className="anhdh" alt="Đối tác đồng hành" />
      </section>
    </div>
  );
}

export default CreateTour;
