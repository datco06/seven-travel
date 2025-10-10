import { useCallback, useMemo, useState } from 'react';
import '../styles/transport.css';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { FIXED_DESTINATIONS } from '../components/TourExplorer.jsx';

const CONTENT = {
  vi: {
    hero: {
      tag: 'Di chuyển linh hoạt',
      title: 'Hành trình trọn vẹn bắt đầu từ cách bạn di chuyển',
      subtitle:
        'Từ xe riêng sang trọng đến chuyến tàu tuyệt đẹp, SEVEN TRAVEL sắp xếp mọi chặng đường để bạn chỉ tập trung tận hưởng.',
      ctaPrimary: 'Nhận tư vấn miễn phí',
    },
    highlights: {
      title: 'Giải pháp di chuyển hoàn hảo cho từng phong cách',
      items: [
        {
          title: 'Đưa đón sân bay cao cấp',
          description:
            'Xe riêng hạng thương gia, tài xế song ngữ đón tại gate, hỗ trợ hành lý và cập nhật chuyến bay theo thời gian thực.',
          icon: 'fa-plane-arrival',
        },
        {
          title: 'Hành trình đường dài riêng tư',
          description:
            'Xe limousine hoặc SUV đời mới với wifi, đồ uống và lịch trình linh hoạt vừa di chuyển vừa khám phá.',
          icon: 'fa-route',
        },
        {
          title: 'Trải nghiệm đường sông & đường sắt',
          description:
            'Ngắm cảnh thiên nhiên từ cabin tàu đêm, du thuyền boutique hoặc thuỷ phi cơ xuyên vịnh biển.',
          icon: 'fa-water',
        },
        {
          title: 'Di chuyển xanh bền vững',
          description:
            'Xe điện, xe đạp và tuyến trekking nhẹ nhàng, dành cho tín đồ sống chậm và yêu môi trường.',
          icon: 'fa-seedling',
        },
      ],
    },
    rental: {
      title: 'Thuê xe riêng theo yêu cầu',
      subtitle: 'Chọn điểm đến, loại xe và thời gian, đội ngũ SEVEN TRAVEL sẽ sắp xếp và báo giá trong thời gian sớm nhất.',
      gallery: [
        { src: '/anh/dichuyen/khoangxelimouse16cho.jpg', alt: 'Khoang xe limousine 16 chỗ' },
        { src: '/anh/dichuyen/khoangxe32cho.jpg', alt: 'Khoang xe 32 chỗ cho đoàn' },
        { src: '/anh/dichuyen/khoangxe45cho.jpg', alt: 'Khoang xe 45 chỗ tiện nghi' },
      ],
      destinationLabel: 'Điểm đến',
      destinationPlaceholder: 'Ví dụ: Hà Nội',
      vehicleLabel: 'Loại xe',
      vehicleOptions: {
        '16': 'Xe 16 chỗ (Limousine)',
        '32': 'Xe 32 chỗ',
        '45': 'Xe 45 chỗ',
      },
      dateLabel: 'Ngày di chuyển',
      submit: 'Tìm chuyến',
      summaryTitle: 'Yêu cầu của bạn',
      summaryDestination: 'Điểm đến',
      summaryVehicle: 'Loại xe',
      summaryDate: 'Ngày khởi hành',
      pendingTitle: 'Thông tin đang được xử lý',
      pendingBody: 'Chúng tôi sẽ kiểm tra lịch xe khả dụng và gửi báo giá chi tiết trong thời gian sớm nhất.',
      contactButton: 'Gửi thông tin liên hệ',
      contactSuccess: 'Chúng tôi sẽ liên hệ với bạn.',
    },
    journeys: {
      title: 'Ba hành trình được yêu thích',
      cards: [
        {
          title: 'Vòng cung di sản miền Trung',
          description:
            'Xe riêng đưa đón từ Đà Nẵng - Huế - Hội An, kết hợp tàu hỏa ngắm biển Lăng Cô và du thuyền sông Hương buổi tối.',
          image: '/anh/dichuyen/codohue.jpg',
        },
        {
          title: 'Săn mây Tây Bắc',
          description:
            'Limousine giường nằm Hà Nội - Sa Pa, trekking bản Tả Van cùng porter địa phương, kết thúc bằng xe jeep săn mây Y Tý.',
          image: '/anh/image%20copy%2033.png',
        },
        {
          title: 'Đảo ngọc Phú Quốc',
          description:
            'Thuỷ phi cơ từ TP.HCM, xe buggy riêng tại resort và cano riêng khám phá quần đảo An Thới trong ngày.',
          image: '/anh/dichuyen/daongocphuquoc.jpg',
        },
      ],
    },
    assurances: {
      title: 'Chúng tôi chăm lo từng chi tiết',
      points: [
        'Theo dõi chuyến bay, cập nhật thay đổi và điều phối tài xế 24/7.',
        'Đội ngũ tài xế được đào tạo phục vụ du lịch cao cấp, thông thạo ngoại ngữ cơ bản.',
        'Bảo hiểm du lịch toàn diện cho cả chặng đường.',
        'Hỗ trợ đặc biệt cho gia đình có trẻ nhỏ và khách cao tuổi.',
      ],
    },
    testimonials: {
      title: 'Khách hàng nói gì về dịch vụ di chuyển?',
      subtitle: 'Những phản hồi chân thành từ khách hàng đã tin tưởng SEVEN TRAVEL trên mọi hành trình.',
      items: [
        {
          quote:
            '“Xe limousine sạch sẽ, tài xế biết tiếng Anh và chủ động điều chỉnh giờ đón khi chuyến bay bị trễ. Rất chuyên nghiệp!”',
          name: 'Lan Phương',
          role: 'Hà Nội ⇄ Hạ Long',
          image: '/anh/dichuyen/khach1.jpg',
        },
        {
          quote:
            '“Đoàn công ty 30 người của chúng tôi được chăm sóc chu đáo, xe 32 chỗ đời mới và lịch trình linh hoạt.”',
          name: 'Quang Huy',
          role: 'Team building Đà Nẵng',
          image: '/anh/dichuyen/khach2.jpg',
        },
        {
          quote:
            '“Gia đình có trẻ nhỏ nên tôi rất an tâm khi được hỗ trợ ghế trẻ em, tài xế thân thiện và lái xe an toàn.”',
          name: 'Mai Chi',
          role: 'Nghỉ dưỡng Phú Quốc',
          image: '/anh/dichuyen/khach3.jpg',
        },
      ],
    },
  },
  en: {
    hero: {
      tag: 'Seamless mobility',
      title: 'Remarkable journeys start with effortless transport',
      subtitle:
        'From chauffeur-driven sedans to scenic rail adventures, we choreograph every transfer so you can focus on the memories.',
      ctaPrimary: 'Plan with an expert',
    },
    highlights: {
      title: 'Transport solutions tailored to your travel style',
      items: [
        {
          title: 'Premium airport transfers',
          description:
            'Business-class vehicles, bilingual drivers waiting at the gate, luggage assistance, and real-time flight monitoring.',
          icon: 'fa-plane-arrival',
        },
        {
          title: 'Private long-haul journeys',
          description:
            'Late-model limousines and SUVs with onboard wifi, refreshments, and flexible stops that turn travel into discovery.',
          icon: 'fa-route',
        },
        {
          title: 'Water & rail escapes',
          description:
            'Watch nature unfold from sleeper trains, boutique cruises, or seaplanes skimming across emerald bays.',
          icon: 'fa-water',
        },
        {
          title: 'Sustainable motion',
          description:
            'Electric vehicles, cycling routes, and gentle treks curated for slow travellers with a green heart.',
          icon: 'fa-seedling',
        },
      ],
    },
    rental: {
      title: 'Request a private vehicle',
      subtitle: 'Tell us where, when, and which coach size you need — we will secure the ride and send the quote shortly.',
      gallery: [
        { src: '/anh/dichuyen/khoangxelimouse16cho.jpg', alt: '16-seat limousine interior' },
        { src: '/anh/dichuyen/khoangxe32cho.jpg', alt: '32-seat coach for groups' },
        { src: '/anh/dichuyen/khoangxe45cho.jpg', alt: '45-seat premium coach' },
      ],
      destinationLabel: 'Destination',
      destinationPlaceholder: 'e.g. Hanoi',
      vehicleLabel: 'Vehicle size',
      vehicleOptions: {
        '16': '16-seat (limousine)',
        '32': '32-seat coach',
        '45': '45-seat coach',
      },
      dateLabel: 'Travel date',
      submit: 'Find transfer',
      summaryTitle: 'Your request',
      summaryDestination: 'Destination',
      summaryVehicle: 'Vehicle',
      summaryDate: 'Departure date',
      pendingTitle: 'We are reserving your ride',
      pendingBody: 'Our concierge is checking availability and will return with a detailed proposal.',
      contactButton: 'Send contact info',
      contactSuccess: 'We will reach out to you shortly.',
    },
    journeys: {
      title: 'Three journeys travellers love',
      cards: [
        {
          title: 'Central heritage arc',
          description:
            'Private transfers across Da Nang, Hue, and Hoi An paired with a coastal train ride and an evening Perfume River cruise.',
          image: '/anh/dichuyen/codohue.jpg',
        },
        {
          title: 'Cloud-chasing Northwest',
          description:
            'Luxury sleeper from Hanoi to Sa Pa, guided treks in Ta Van, and iconic jeep rides through the Y Ty cloud oceans.',
          image: '/anh/image%20copy%2033.png',
        },
        {
          title: 'Phu Quoc island hop',
          description:
            'Seaplane from Ho Chi Minh City, private buggy at the resort, and charter speedboat through the An Thoi archipelago.',
          image: '/anh/dichuyen/daongocphuquoc.jpg',
        },
      ],
    },
    assurances: {
      title: 'Every detail is handled with care',
      points: [
        '24/7 monitoring of flights, schedule changes, and driver dispatch.',
        'Well-trained chauffeurs experienced in premium hospitality and conversational English.',
        'Comprehensive travel insurance for every segment.',
        'Special assistance for families with children and senior travellers.',
      ],
    },
    testimonials: {
      title: 'Travelers share their transfer stories',
      subtitle: 'Honest words from passengers who trusted SEVEN TRAVEL to manage every ride.',
      items: [
        {
          quote:
            '“The limousine was spotless, the chauffeur spoke English, and they adjusted pickup when my flight was delayed. Outstanding service!”',
          name: 'Lynn Phan',
          role: 'Hanoi ⇄ Ha Long',
          image: '/anh/dichuyen/khach1.jpg',
        },
        {
          quote:
            '“Our 30-person corporate retreat ran smoothly. The 32-seat coach was brand-new and the schedule stayed flexible.”',
          name: 'Henry Quang',
          role: 'Company offsite in Da Nang',
          image: '/anh/dichuyen/khach2.jpg',
        },
        {
          quote:
            '“Traveling with kids felt stress-free. Child seats were ready, the driver was caring, and the ride felt super safe.”',
          name: 'Chloe Mai',
          role: 'Family escape to Phu Quoc',
          image: '/anh/dichuyen/khach3.jpg',
        },
      ],
    },
  },
};

function Transport() {
  const { language } = useLanguage();
  const { currentUser, submitTransportContact } = useAuth();
  const copy = CONTENT[language];
  const [rentalForm, setRentalForm] = useState({
    destination: '',
    vehicle: '16',
    date: '',
  });
  const [isRentalSubmitted, setIsRentalSubmitted] = useState(false);
  const [isContactSent, setIsContactSent] = useState(false);
  const [contactError, setContactError] = useState('');
  const scrollToForm = useCallback(() => {
    const target = document.getElementById('transport-rental-form');
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleRentalChange = (event) => {
    const { name, value } = event.target;
    setRentalForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRentalSubmit = (event) => {
    event.preventDefault();
    if (!rentalForm.destination || !rentalForm.date) {
      return;
    }
    setIsRentalSubmitted(true);
    setIsContactSent(false);
  };

  const handleContactSubmit = (event) => {
    event.preventDefault();
    setContactError('');
    if (!currentUser) {
      setContactError(
        language === 'vi'
          ? 'Vui lòng đăng nhập bằng tài khoản khách hàng để gửi thông tin.'
          : 'Please sign in with a customer account to send your contact details.'
      );
      return;
    }
    if (currentUser.role !== 'customer') {
      setContactError(
        language === 'vi'
          ? 'Chỉ khách hàng mới có thể gửi thông tin liên hệ.'
          : 'Only customer accounts can submit contact details.'
      );
      return;
    }
    try {
      submitTransportContact({
        destination: rentalForm.destination,
        vehicle: rentalForm.vehicle,
        date: rentalForm.date,
      });
      setIsContactSent(true);
    } catch (error) {
      setContactError(error.message || (language === 'vi' ? 'Không thể gửi yêu cầu. Vui lòng thử lại.' : 'Unable to send request. Please try again.'));
    }
  };

  const formattedRentalDate = useMemo(() => {
    if (!rentalForm.date) return '';
    try {
      return new Date(rentalForm.date).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US');
    } catch (error) {
      return rentalForm.date;
    }
  }, [rentalForm.date, language]);

  return (
    <div className="transport-page">
      <section className="transport-hero">
        <div className="transport-hero__content">
          <span className="hero-tag">{copy.hero.tag}</span>
          <h1>{copy.hero.title}</h1>
          <p>{copy.hero.subtitle}</p>
          <div className="hero-actions">
            <button type="button" className="btn-primary" onClick={scrollToForm}>
              {copy.hero.ctaPrimary}
            </button>
          </div>
        </div>
      </section>

      <section className="transport-highlights">
        <div className="section-heading">
          <h2>{copy.highlights.title}</h2>
          <p>
            {language === 'vi'
              ? 'Chúng tôi kết hợp xe riêng, đường sắt, đường sông và hàng không để tạo nên hành trình thông minh, thuận tiện và giàu cảm xúc.'
              : 'We combine private vehicles, rail, waterways, and air to craft smart, convenient, and inspiring movement across destinations.'}
          </p>
        </div>
        <div className="highlight-grid">
          {copy.highlights.items.map((item) => (
            <article key={item.title} className="highlight-card">
              <div className="icon-circle">
                <i className={`fas ${item.icon}`} aria-hidden="true" />
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="transport-rental" id="transport-rental">
        <div className="transport-rental__panel">
          <div className="transport-rental__intro">
            <h2>{copy.rental.title}</h2>
            <p>{copy.rental.subtitle}</p>
          </div>
          <div className="transport-rental__gallery" aria-hidden="true">
            {copy.rental.gallery.map((item) => (
              <div className="transport-rental__gallery-item" key={item.src}>
                <img src={item.src} alt={item.alt} />
              </div>
            ))}
          </div>
          <form className="transport-rental__form" onSubmit={handleRentalSubmit} id="transport-rental-form">
            <label className="transport-rental__field">
              <span>{copy.rental.destinationLabel}</span>
              <select
                name="destination"
                value={rentalForm.destination}
                onChange={handleRentalChange}
                required
              >
                <option value="">{copy.rental.destinationPlaceholder}</option>
                {FIXED_DESTINATIONS.map((destination) => (
                  <option key={destination} value={destination}>
                    {destination}
                  </option>
                ))}
              </select>
            </label>
            <label className="transport-rental__field">
              <span>{copy.rental.vehicleLabel}</span>
              <select name="vehicle" value={rentalForm.vehicle} onChange={handleRentalChange}>
                {Object.entries(copy.rental.vehicleOptions).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="transport-rental__field">
              <span>{copy.rental.dateLabel}</span>
              <input
                type="date"
                name="date"
                value={rentalForm.date}
                onChange={handleRentalChange}
                required
              />
            </label>
            <button
              type="submit"
              className="transport-rental__submit"
              disabled={!rentalForm.destination || !rentalForm.date}
            >
              {copy.rental.submit}
            </button>
          </form>

          {isRentalSubmitted ? (
            <div className="transport-rental__summary" role="status" aria-live="polite">
              <div className="transport-rental__summary-gallery" aria-hidden="true">
                {copy.rental.gallery.map((item) => (
                  <div className="transport-rental__summary-media" key={`summary-${item.src}`}>
                    <img src={item.src} alt={item.alt} />
                  </div>
                ))}
              </div>
              <div className="transport-rental__summary-header">
                <span className="transport-rental__badge">{copy.rental.pendingTitle}</span>
                <h3>{copy.rental.summaryTitle}</h3>
                <p>{copy.rental.pendingBody}</p>
              </div>
              <ul className="transport-rental__summary-list">
                <li>
                  <span>{copy.rental.summaryDestination}</span>
                  <strong>{rentalForm.destination}</strong>
                </li>
                <li>
                  <span>{copy.rental.summaryVehicle}</span>
                  <strong>{copy.rental.vehicleOptions[rentalForm.vehicle]}</strong>
                </li>
                <li>
                  <span>{copy.rental.summaryDate}</span>
                  <strong>{formattedRentalDate || '-'}</strong>
                </li>
              </ul>
              <form className="transport-rental__contact" onSubmit={handleContactSubmit}>
                <button type="submit" disabled={isContactSent}>
                  {copy.rental.contactButton}
                </button>
                {contactError ? <span className="transport-rental__status error">{contactError}</span> : null}
                {isContactSent ? (
                  <span className="transport-rental__status">{copy.rental.contactSuccess}</span>
                ) : null}
              </form>
            </div>
          ) : null}
        </div>
      </section>

      <section className="transport-journeys">
        <div className="section-heading">
          <h2>{copy.journeys.title}</h2>
        </div>
        <div className="journey-grid">
          {copy.journeys.cards.map((card) => (
            <article key={card.title} className="journey-card">
              <div className="journey-image">
                <img src={card.image} alt={card.title} />
              </div>
              <div className="journey-body">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="transport-assurances">
        <div className="assurance-panel">
          <h2>{copy.assurances.title}</h2>
          <ul>
            {copy.assurances.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="transport-testimonials" aria-labelledby="transport-testimonials-heading">
        <div className="transport-testimonials__header">
          <h2 id="transport-testimonials-heading">{copy.testimonials.title}</h2>
          <p>{copy.testimonials.subtitle}</p>
        </div>
        <div className="transport-testimonials__grid">
          {copy.testimonials.items.map((item) => (
            <article key={item.name} className="transport-testimonial-card">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="transport-testimonial-card__avatar"
                  loading="lazy"
                />
              ) : null}
              <p className="transport-testimonial-card__quote">{item.quote}</p>
              <div className="transport-testimonial-card__meta">
                <span className="transport-testimonial-card__name">{item.name}</span>
                <span className="transport-testimonial-card__role">{item.role}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Transport;
