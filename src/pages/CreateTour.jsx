import { useCallback, useMemo } from 'react';
import '../styles/createTour.css';
import TourExplorer, { FIXED_DESTINATIONS } from '../components/TourExplorer.jsx';
import AdminTourForm from '../components/AdminTourForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';

const COPY = {
  vi: {
    banner: {
      heading: 'DU LỊCH CÙNG SEVEN TRAVEL',
      body:
        'Vinh hạnh cùng chúng tôi là mang đến cho bạn những chuyến đi đáng nhớ. Mang đến cho bạn những chuyến đi đầy cảm hứng. Khám phá vùng đất mới. Tự do khám phá cùng chúng tôi.',
      cta: 'Tìm hiểu ngay',
      imageAlt: 'Banner tạo tour SEVEN TRAVEL',
    },
    whyChoose: {
      title: 'Vì Sao Bạn Nên Chọn SEVEN TRAVEL?',
      reasons: [
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
      ],
    },
    aiSection: {
      title: 'AI Đồng Hành Cùng Chuyến Đi Của Bạn Như Thế Nào?',
      subtitle: 'Khám phá cách trí tuệ nhân tạo mang đến trải nghiệm du lịch cá nhân hóa và thông minh hơn.',
      items: [
        {
          icon: 'fa-user-cog',
          title: 'Cá Nhân Hóa Tối Đa',
          description:
            'AI phân tích sở thích, ngân sách và lịch trình của bạn để tạo ra một chuyến đi độc nhất, dành riêng cho bạn.',
        },
        {
          icon: 'fa-lightbulb',
          title: 'Gợi Ý Thông Minh',
          description:
            'Khám phá những điểm đến ẩn mình, hoạt động thú vị và món ăn địa phương độc đáo mà có thể bạn chưa từng biết tới.',
        },
        {
          icon: 'fa-route',
          title: 'Tối Ưu Hóa Lịch Trình',
          description:
            'AI giúp sắp xếp lịch trình một cách logic, tiết kiệm thời gian di chuyển và đảm bảo bạn không bỏ lỡ những điều tuyệt vời nhất.',
        },
      ],
    },
    booking: {
      title: 'Booking Cùng SEVEN TRAVEL',
      subtitle: 'Chỉ với vài bước đơn giản và dễ dàng bạn có ngay trải nghiệm tuyệt vời!',
      steps: [
        {
          image: '/anh/booking-step1.png',
          alt: 'Tìm nơi đến',
          title: 'Tìm nơi bạn muốn đến',
          description: 'Bất cứ nơi đâu bạn muốn đến, chúng tôi có tất cả những gì bạn muốn.',
        },
        {
          image: '/anh/booking-step2.png',
          alt: 'Tạo tour',
          title: 'Tạo tour thông minh',
          description: 'SEVEN TRAVEL sẽ hỗ trợ thiết kế tour trực tiếp nhanh chóng và thuận tiện.',
        },
        {
          image: '/anh/booking-step3.png',
          alt: 'Thanh toán',
          title: 'Thanh toán & lên đường',
          description: 'Hoàn thành thanh toán và sẵn sàng cho chuyến đi sắp tới.',
        },
      ],
    },
    about: {
      eyebrow: 'Hiểu Hơn Về Chúng Tôi',
      heading: 'Lên Kế Hoạch Cho Chuyến Đi Của Bạn Cùng SEVEN TRAVEL',
      description:
        'Vinh hạnh của chúng tôi là mang đến cho bạn những chuyến đi đáng nhớ. Mang đến cho bạn những chuyến đi đầy cảm hứng. Khám phá những vùng đất mới. Tự do khám phá cùng chúng tôi.',
      subheading: 'Cơ hội tuyệt vời để gửi gắm niềm tin cùng SEVEN TRAVEL. Tại sao không?',
      bullets: [
        'Hơn 10.000 khách hàng trên khắp cả nước đã đồng hành cùng chúng tôi.',
        'Bao phủ hơn 1.000 tour trong và ngoài nước.',
        'Tour và giá cả rất đa dạng, phù hợp mọi nhu cầu.',
      ],
      images: [
        { src: '/anh/image.png', alt: 'Cắm trại bên hồ' },
        { src: '/anh/image copy 34.png', alt: 'Cặp đôi chụp ảnh selfie' },
        { src: '/anh/image copy 2.png', alt: 'Bãi biển với ghế tắm nắng' },
      ],
    },
    partners: {
      title: 'Đồng Hành Cùng SEVEN TRAVEL',
      imageAlt: 'Đối tác đồng hành',
    },
    testimonials: {
      title: 'Khách Hàng Nói Gì Về Chúng Tôi',
      subtitle: 'Chúng tôi vinh hạnh vì đã có cơ hội đồng hành với hơn 10.000 khách hàng trên khắp thế giới.',
      items: [
        {
          quote:
            '“Dịch vụ rất tuyệt vời. Mình đã có một chuyến đi cực kì đáng nhớ. SEVEN TRAVEL đã hỗ trợ rất nhanh khi gặp vấn đề và mình đánh giá rất cao chăm sóc khách hàng.”',
          name: 'Thu Thảo',
          avatar: '/anh/dichuyen/khach1.jpg',
        },
        {
          quote:
            '“Tour thiết kế rất hợp lý, phù hợp với gia đình có con nhỏ. Các bạn tư vấn nhiệt tình, chu đáo. Chắc chắn sẽ quay lại với SEVEN TRAVEL cho những chuyến đi sau!”',
          name: 'Minh Anh',
          avatar: '/anh/dichuyen/khach2.jpg',
        },
        {
          quote:
            '“Lần đầu trải nghiệm đặt tour qua AI và thực sự ấn tượng. Lịch trình thông minh, tiết kiệm thời gian mà vẫn đầy đủ các điểm tham quan hấp dẫn. Rất khuyến khích!”',
          name: 'Quốc Bảo',
          avatar: '/anh/dichuyen/khach3.jpg',
        },
      ],
    },
  },
  en: {
    banner: {
      heading: 'TRAVEL WITH SEVEN TRAVEL',
      body:
        'It is our honour to craft unforgettable journeys for you. Be inspired, uncover new destinations, and enjoy the freedom to explore with us.',
      cta: 'Explore now',
      imageAlt: 'Create tour banner for SEVEN TRAVEL',
    },
    whyChoose: {
      title: 'Why Choose SEVEN TRAVEL?',
      reasons: [
        {
          icon: 'fa-sack-dollar',
          title: 'Best price for you',
          description: 'Flexible price points tailored to your budget and expectations.',
        },
        {
          icon: 'fa-ticket-simple',
          title: 'Easy booking',
          description: 'Streamlined booking steps and attentive concierge support.',
        },
        {
          icon: 'fa-suitcase-rolling',
          title: 'Optimised journeys',
          description: 'A curated variety of tours designed to match every travel style.',
        },
        {
          icon: 'fa-map-location-dot',
          title: 'Dedicated experts',
          description: 'Seasoned consultants stay close to your itinerary from start to finish.',
        },
      ],
    },
    aiSection: {
      title: 'How AI Enhances Your Journey',
      subtitle:
        'Discover how artificial intelligence delivers smarter, more personalised travel experiences.',
      items: [
        {
          icon: 'fa-user-cog',
          title: 'Hyper-personalised plans',
          description:
            'AI analyses your interests, budget, and schedule to craft a unique trip designed solely for you.',
        },
        {
          icon: 'fa-lightbulb',
          title: 'Smart suggestions',
          description:
            'Unlock hidden gems, inspiring activities, and authentic flavours you might never discover alone.',
        },
        {
          icon: 'fa-route',
          title: 'Optimised itineraries',
          description:
            'AI arranges your schedule logically, saving travel time while ensuring you never miss the highlights.',
        },
      ],
    },
    booking: {
      title: 'Book With SEVEN TRAVEL',
      subtitle: 'Just a few simple steps stand between you and an unforgettable experience.',
      steps: [
        {
          image: '/anh/booking-step1.png',
          alt: 'Pick a destination',
          title: 'Choose where to go',
          description: 'Wherever inspires you, we have the journey to match.',
        },
        {
          image: '/anh/booking-step2.png',
          alt: 'Create a tour',
          title: 'Build a smart itinerary',
          description: 'SEVEN TRAVEL quickly tailors a tour with seamless concierge support.',
        },
        {
          image: '/anh/booking-step3.png',
          alt: 'Make payment',
          title: 'Confirm & take off',
          description: 'Complete payment and get ready for your next adventure.',
        },
      ],
    },
    about: {
      eyebrow: 'Get to Know Us',
      heading: 'Plan Your Journey With SEVEN TRAVEL',
      description:
        'We are proud to deliver memorable getaways filled with inspiration. Explore new horizons and embrace the freedom to roam with us.',
      subheading: 'A great moment to trust SEVEN TRAVEL—why not right now?',
      bullets: [
        'Over 10,000 travellers nationwide have journeyed with us.',
        'More than 1,000 itineraries across Vietnam and beyond.',
        'Diverse tours and pricing tailored to every need.',
      ],
      images: [
        { src: '/anh/image.png', alt: 'Camping by the lake' },
        { src: '/anh/image copy 34.png', alt: 'Couple taking a selfie' },
        { src: '/anh/image copy 2.png', alt: 'Beach with sun loungers' },
      ],
    },
    partners: {
      title: 'Trusted By Our Partners',
      imageAlt: 'SEVEN TRAVEL partners',
    },
    testimonials: {
      title: 'What Travellers Say About Us',
      subtitle: 'We are honoured to have travelled with over 10,000 guests around the world.',
      items: [
        {
          quote:
            '“Amazing service! My trip was memorable in every way. SEVEN TRAVEL responded swiftly whenever I needed help – outstanding customer care.”',
          name: 'Thu Thao',
          avatar: '/anh/dichuyen/khach1.jpg',
        },
        {
          quote:
            '“The itinerary suited our family perfectly. The consultants were warm and attentive. We will definitely return to SEVEN TRAVEL for future journeys!”',
          name: 'Minh Anh',
          avatar: '/anh/dichuyen/khach2.jpg',
        },
        {
          quote:
            '“My first time booking via AI and I was impressed: smart planning that saved time yet covered all the highlights. Highly recommended!”',
          name: 'Quoc Bao',
          avatar: '/anh/dichuyen/khach3.jpg',
        },
      ],
    },
  },
};

function CreateTour() {
  const { currentUser, tours } = useAuth();
  const { language } = useLanguage();
  const copy = COPY[language];
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
        <img src="/anh/home.jpeg" alt={copy.banner.imageAlt} />
        <div className="content">
          <h2>{copy.banner.heading}</h2>
          <p>{copy.banner.body}</p>
          <button type="button" onClick={scrollToExplorer}>
            {copy.banner.cta}
          </button>
        </div>
      </div>

      <section className="content2 why-choose-us">
        <h1 className="section-title">{copy.whyChoose.title}</h1>
        <div className="why-choose-icons" aria-hidden="true">
          {copy.whyChoose.reasons.map((item) => (
            <span className="icon-circle" key={`icon-${item.icon}`}>
              <i className={`fa-solid ${item.icon}`} aria-hidden="true" />
            </span>
          ))}
        </div>
        <div className="duoi">
          {copy.whyChoose.reasons.map((item) => (
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
        <h1 className="section-title">{copy.aiSection.title}</h1>
        <p className="section-subtitle">{copy.aiSection.subtitle}</p>
        <div className="ai-benefits-container">
          {copy.aiSection.items.map((item) => (
            <div className="ai-benefit-item" key={item.title}>
              <div className="ai-benefit-icon">
                <i className={`fas ${item.icon}`} aria-hidden="true" />
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <TourExplorer anchorId="tour-explorer-page" />

      {isAdmin ? (
        <section className="admin-tour-section" id="admin-create-tour">
          <AdminTourForm />
        </section>
      ) : null}

      <section className="phan2 booking-steps">
        <h1 className="section-title">{copy.booking.title}</h1>
        <p className="section-subtitle">{copy.booking.subtitle}</p>
        <div className="cacbuoc">
          {copy.booking.steps.map((step) => (
            <div className="buoc" key={step.title}>
              <img src={step.image} alt={step.alt} />
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="phan3 about-us-section" id="about-us">
        <div className="trai">
          <h2 className="custom-h2">{copy.about.eyebrow}</h2>
          <h1 className="custom-h1">{copy.about.heading}</h1>
          <p className="dai">{copy.about.description}</p>
          <h2 className="custom-h2">{copy.about.subheading}</h2>
          {copy.about.bullets.map((bullet) => (
            <div className="tich" key={bullet}>
              {bullet}
            </div>
          ))}
        </div>
        <div className="image-layout">
          {copy.about.images.map((item, index) => (
            <div className={`image-wrapper img${index + 1}`} key={item.src}>
              <img src={item.src} alt={item.alt} />
            </div>
          ))}
        </div>
      </section>

      <section className="phan4 testimonials-section" id="testimonials">
        <div className="tieude">
          <h1 className="section-title">{copy.testimonials.title}</h1>
          <p className="section-subtitle">{copy.testimonials.subtitle}</p>
        </div>
        <div className="slide">
          {copy.testimonials.items.map((item) => (
            <div className="slide1" key={item.name}>
              <p>{item.quote}</p>
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <img src={item.avatar} className="khach1" alt={item.name} />
              <h4>{item.name}</h4>
            </div>
          ))}
        </div>
      </section>

      <section className="donghanh partners-section">
        <h1 className="section-title">{copy.partners.title}</h1>
        <img src="/anh/partners-collage.png" className="anhdh" alt={copy.partners.imageAlt} />
      </section>
    </div>
  );
}

export default CreateTour;
