import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';
import { useLanguage } from '../context/LanguageContext.jsx';

const CONTENT = {
  vi: {
    hero: {
      title: 'Hành Trình Của Bạn Bắt Đầu',
      subtitle:
        'Hơn cả việc khám phá những kỳ quan thế giới, SEVEN TRAVEL kết nối mọi người, tạo nên ký ức bền lâu và mang đến góc nhìn mới mẻ.',
      kicker: 'đổi thay cuộc sống',
    },
    feature: {
      title: 'Điều Gì Làm Chúng Tôi Khác Biệt',
      body:
        'SEVEN TRAVEL kết hợp kiến thức địa phương sâu rộng, lắng nghe liên tục và cá nhân hoá từng trải nghiệm để mang niềm vui khám phá chân thật đến mọi ngóc ngách Đông Nam Á.',
      mediaAlt: 'Trải nghiệm khác biệt',
    },
    immersive: {
      title: 'Nơi Lý Tưởng Để Lạc Bước',
      description:
        'Những điều tưởng chừng quen thuộc lại đổi thay qua góc nhìn của người bản địa. Hãy để chúng tôi đồng hành, giúp bạn hoà mình vào nhịp sống địa phương cùng những khoảnh khắc không thể tìm thấy ở nơi nào khác.',
    },
    exotic: {
      title: 'Điểm Đến Hấp Dẫn',
      description:
        'Sự tương phản của Đông Nam Á luôn khiến du khách mê đắm. Từ phố cổ Hội An rêu phong đến Angkor Wat huyền bí, mỗi hành trình đều khơi gợi cảm hứng khám phá vô tận.',
    },
    personalize: {
      title: 'Cá Nhân Hoá',
      description:
        'Đội ngũ chuyên gia của chúng tôi kết hợp kiến thức sâu rộng và tình yêu trải nghiệm để tạo nên kỳ nghỉ trọn vẹn, đồng hành 24/7 như một người bạn thực thụ.',
      cta: 'Tìm hiểu đội ngũ',
      features: [
        {
          title: 'Đội ngũ nhiệt huyết',
          description:
            'Chúng tôi tận tâm thiết kế hành trình khó quên với sự quan tâm tỉ mỉ và đồng hành sát sao.',
          image: '/anh/doingu.png',
          to: '/doi-ngu-nhiet-huyet',
        },
        {
          title: 'Chuyên gia bản địa',
          description:
            'Những người bản địa hiểu rõ từng ngóc ngách sẵn sàng chia sẻ nét đẹp chân thật nhất.',
          image: '/anh/bandia.png',
          to: '/chuyen-gia-ban-dia',
        },
        {
          title: 'Dịch vụ cá nhân hoá',
          description:
            'Mọi lịch trình đều “may đo” theo sở thích riêng và được hỗ trợ 24/7.',
          image: '/anh/dichvu.png',
          to: '/dich-vu-ca-nhan-hoa',
        },
        {
          title: 'Hướng tới bền vững',
          description:
            'Chúng tôi kết nối du khách với cộng đồng bằng những trải nghiệm thân thiện môi trường.',
          image: '/anh/moitruong.png',
          to: '/du-lich-ben-vung',
        },
      ],
    },
    review: {
      title: 'Đánh Giá Tin Cậy',
      intro:
        'Chúng tôi không ngừng đổi mới để tốt hơn mỗi ngày. Mỗi phản hồi của khách hàng đều vô giá với SEVEN TRAVEL.',
      ratingNote: 'Điểm Tripadvisor: 5.0 / 5',
      viewAll: 'Xem tất cả đánh giá',
      photoAlt: 'Du khách hạnh phúc',
      testimonials: [
        {
          author: 'andy_and_lisa_2010',
          date: '25 Tháng 8, 2025',
          content:
            'Chúng tôi đã có một kỳ nghỉ tuyệt vời cùng SEVEN TRAVEL. Từ kế hoạch cá nhân hoá đến sự chăm sóc tận tâm, mọi thứ đều vượt mong đợi. Đội ngũ tư vấn luôn theo sát và hỗ trợ kịp thời trong suốt hành trình.',
        },
        {
          author: 'thu_trang_family',
          date: '12 Tháng 6, 2025',
          content:
            'Chuyến đi gia đình 4 người của chúng tôi được chuẩn bị rất chu đáo. Các bạn hỗ trợ từng chi tiết nhỏ, từ khách sạn, bữa ăn đến hoạt động phù hợp cho trẻ nhỏ.',
        },
        {
          author: 'mike_and_julia',
          date: '03 Tháng 5, 2025',
          content:
            'Chúng tôi đặc biệt ấn tượng với những trải nghiệm văn hoá độc đáo. Lịch trình linh hoạt và hướng dẫn viên vô cùng thân thiện.',
        },
        {
          author: 'hanh_travelers',
          date: '21 Tháng 4, 2025',
          content:
            'Tour leo núi được tổ chức chuyên nghiệp với đội ngũ porter tận tâm. Cảm giác chinh phục đỉnh Fansipan thật khó quên!',
        },
      ],
    },
    responsible: {
      title: 'Trách Nhiệm',
      description:
        'Chúng tôi lựa chọn dịch vụ bền vững, hỗ trợ cộng đồng địa phương và bảo tồn thiên nhiên. Mỗi hành trình là cơ hội tạo tác động tích cực.',
      cta: 'Xem thêm',
      imageAlt: 'Trách nhiệm với cộng đồng',
    },
    destinations: {
      cards: [
        { title: 'Hà Nội', image: '/anh/home/hanoi.jpg', to: '/tour-ha-noi' },
        { title: 'Hải Phòng', image: '/anh/home/haiphong.jpg', to: '/tour-hai-phong' },
        { title: 'Ninh Bình', image: '/anh/home/ninhbinh.jpg', to: '/tour-ninh-binh' },
        { title: 'Sơn La', image: '/anh/home/sonla.jpg', to: '/tour-son-la' },
        { title: 'Lào Cai', image: '/anh/home/laocai.webp', to: '/tour-lao-cai' },
        { title: 'Phú Thọ', image: '/anh/home/phutho.jpg', to: '/tour-phu-tho' },
      ],
      title: 'Địa Điểm Bạn Muốn Đến',
      description: 'Khám phá các điểm đến nổi bật ở miền Bắc Việt Nam được SEVEN TRAVEL tuyển chọn.',
    },
    experiences: {
      cards: [
        {
          title: 'Thăm bảo tàng đầu tiên Việt Nam',
          description: 'Lắng nghe câu chuyện văn hoá từ những người canh giữ ký ức.',
          image: '/anh/home/baotangdautien.jpeg',
          to: '/tham-bao-tang-tu-nhan',
        },
        {
          title: 'Trải nghiệm ẩm thực cùng bếp trưởng',
          description: 'Học nấu món địa phương và khám phá chợ bản địa đầy sắc màu.',
          image: '/anh/home/amthuc.jpg',
          to: '/trai-nghiem-am-thuc',
        },
        {
          title: 'Nghệ thuật múa rối nước',
          description: 'Đắm mình trong nghệ thuật truyền thống cùng nghệ nhân lâu năm.',
          image: '/anh/home/muaroi.jpg',
          to: '/nghe-thuat-mua-roi-nuoc',
        },
        {
          title: 'Tour ẩm thực đường phố',
          description: 'Dạo bước qua các con phố nhộn nhịp và thưởng thức hương vị chân thật.',
          image: '/anh/home/amthucduongpho.jpg',
          to: '/tour-am-thuc-duong-pho',
        },
      ],
    },
  },
  en: {
    hero: {
      title: 'Your Journey Begins',
      subtitle:
        'Beyond exploring wonders of the world, SEVEN TRAVEL brings people together, creates lasting memories, and offers a fresh perspective on life.',
      kicker: 'life-changing',
    },
    feature: {
      title: 'What Makes Us Different',
      body:
        'We blend deep local knowledge, continuous listening, and personalised design to deliver authentic travel moments throughout Southeast Asia.',
      mediaAlt: 'Signature travel experience',
    },
    immersive: {
      title: 'A Simply Perfect Place To Get Lost',
      description:
        'Familiar places feel brand new when seen through local eyes. Let us guide you into the rhythm of everyday life and the unforgettable moments that await.',
    },
    exotic: {
      title: 'Exotic Destinations',
      description:
        'From the mossy alleys of Hoi An to the mystique of Angkor Wat, Southeast Asia constantly inspires with vibrant contrasts and endless adventures.',
    },
    personalize: {
      title: 'Personalize',
      description:
        'Our travel specialists pair extensive knowledge with genuine passion to craft flawless trips, staying by your side 24/7 like a trusted friend.',
      cta: 'Get to know our team',
      features: [
        {
          title: 'Passionate team',
          description: 'We design unforgettable journeys with meticulous care and heartfelt dedication.',
          image: '/anh/doingu.png',
          to: '/doi-ngu-nhiet-huyet',
        },
        {
          title: 'Local experts',
          description: 'Insiders who know every corner of the region and love to share its authentic beauty.',
          image: '/anh/bandia.png',
          to: '/chuyen-gia-ban-dia',
        },
        {
          title: 'Personalised service',
          description: 'Every itinerary is tailored to your tastes with 24/7 support.',
          image: '/anh/dichvu.png',
          to: '/dich-vu-ca-nhan-hoa',
        },
        {
          title: 'Sustainable approach',
          description: 'We connect travellers with communities through environmentally friendly experiences.',
          image: '/anh/moitruong.png',
          to: '/du-lich-ben-vung',
        },
      ],
    },
    review: {
      title: 'Trustful Review',
      intro:
        'We constantly evolve to be better every day. Each traveller feedback is invaluable to SEVEN TRAVEL.',
      ratingNote: 'Tripadvisor rating: 5.0 / 5',
      viewAll: 'View all reviews',
      photoAlt: 'Happy travellers',
      testimonials: [
        {
          author: 'andy_and_lisa_2010',
          date: 'August 25, 2025',
          content:
            'We had a wonderful vacation with SEVEN TRAVEL. From tailor-made planning to attentive care, everything exceeded expectations. The team stayed close and supported us throughout the journey.',
        },
        {
          author: 'thu_trang_family',
          date: 'June 12, 2025',
          content:
            'Our family trip was carefully planned. The team supported every detail, ensuring activities suitable for the kids.',
        },
        {
          author: 'mike_and_julia',
          date: 'May 03, 2025',
          content:
            'We were impressed by the unique cultural encounters. Flexible itinerary and super friendly guides.',
        },
        {
          author: 'hanh_travelers',
          date: 'April 21, 2025',
          content:
            'The trekking tour was professionally organised with caring porters. Reaching Fansipan summit was unforgettable!',
        },
      ],
    },
    responsible: {
      title: 'Responsible',
      description:
        'We curate sustainable stays, transport, and experiences that support local communities and preserve nature. Every trip is a chance to create positive impact.',
      cta: 'View more',
      imageAlt: 'Community responsibility',
    },
    destinations: {
      cards: [
        { title: 'Ha Noi', image: '/anh/home/hanoi.jpg', to: '/tour-ha-noi' },
        { title: 'Hai Phong', image: '/anh/home/haiphong.jpg', to: '/tour-hai-phong' },
        { title: 'Ninh Binh', image: '/anh/home/ninhbinh.jpg', to: '/tour-ninh-binh' },
        { title: 'Son La', image: '/anh/home/sonla.jpg', to: '/tour-son-la' },
        { title: 'Lao Cai', image: '/anh/home/laocai.webp', to: '/tour-lao-cai' },
        { title: 'Phu Tho', image: '/anh/home/phutho.jpg', to: '/tour-phu-tho' },
      ],
      title: 'Destinations You Desire',
      description: 'Explore Northern Vietnam highlights curated by Travel Tour specialists.',
    },
    experiences: {
      cards: [
        {
          title: "Visit Vietnam's First Museum",
          description: 'Hear captivating stories and discover cultural heritage with passionate curators.',
          image: '/anh/home/baotangdautien.jpeg',
          to: '/tham-bao-tang-tu-nhan',
        },
        {
          title: 'Culinary Experience With Master Chef',
          description: 'Learn local recipes and explore vibrant markets with a local chef.',
          image: '/anh/home/amthuc.jpg',
          to: '/trai-nghiem-am-thuc',
        },
        {
          title: 'The Art of Water Puppetry',
          description: 'Immerse yourself in a century-old art form with seasoned artisans.',
          image: '/anh/home/muaroi.jpg',
          to: '/nghe-thuat-mua-roi-nuoc',
        },
        {
          title: 'Street Food Tour',
          description: 'Stroll lively streets and savour authentic flavours.',
          image: '/anh/home/amthucduongpho.jpg',
          to: '/tour-am-thuc-duong-pho',
        },
      ],
    },
  },
};

function Home() {
  const { language } = useLanguage();
  const copy = CONTENT[language];
  const sliderRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = useMemo(() => copy.review.testimonials, [copy.review.testimonials]);

  const clampIndex = (index) => {
    if (index < 0) return slides.length - 1;
    if (index >= slides.length) return 0;
    return index;
  };

  const goTo = (index) => {
    setActiveSlide(clampIndex(index));
  };

  const handlePrev = () => goTo(activeSlide - 1);
  const handleNext = () => goTo(activeSlide + 1);

  useEffect(() => {
    const track = sliderRef.current;
    if (!track) return;
    const firstCard = track.children[0];
    if (!firstCard) return;
    const cardWidth = firstCard.offsetWidth;
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap || '0');
    const offset = activeSlide * (cardWidth + gap);
    track.scrollTo({ left: offset, behavior: 'smooth' });
  }, [activeSlide, slides.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => clampIndex(prev + 1));
    }, 7000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="home-modern-page">
      <section className="hero-section">
        <div className="hero-overlay">
          <p className="hero-kicker">{copy.hero.kicker}</p>
          <h1>{copy.hero.title}</h1>
          <p className="hero-subtitle">{copy.hero.subtitle}</p>
        </div>
      </section>

      <section className="feature-highlight">
        <div className="feature-media">
          <img src="/anh/image%20copy%2012.png" alt={copy.feature.mediaAlt} />
          <button type="button" className="feature-play">
            <i className="fa-solid fa-play" aria-hidden="true" />
          </button>
        </div>
        <div className="feature-content">
          <h2>{copy.feature.title}</h2>
          <p>{copy.feature.body}</p>
        </div>
      </section>

      <section className="immersive-banner">
        <div className="immersive-text">
          <h3>{copy.immersive.title}</h3>
          <p>{copy.immersive.description}</p>
        </div>
      </section>

      <section className="exotic-destinations">
        <div className="section-header">
          <h4>{copy.exotic.title}</h4>
          <p>{copy.exotic.description}</p>
        </div>
      </section>

      <section className="personalize-section">
        <div className="section-header">
          <h4>{copy.personalize.title}</h4>
          <p>{copy.personalize.description}</p>
          <a href="#team" className="section-cta">
            {copy.personalize.cta}
          </a>
        </div>
        <div className="personalize-grid">
          {copy.personalize.features.map((item) => {
            const CardTag = item.to ? Link : 'article';
            const cardProps = item.to ? { to: item.to } : {};
            return (
              <CardTag className={`personalize-card${item.to ? ' personalize-card--link' : ''}`} key={item.title} {...cardProps}>
              <img src={item.image} alt={item.title} />
              <h5>{item.title}</h5>
              <p>{item.description}</p>
              </CardTag>
            );
          })}
        </div>
      </section>

      <section className="review-section">
        <div className="review-wrapper">
          <div className="review-content">
            <h4>{copy.review.title}</h4>
            <p>{copy.review.intro}</p>
            <div className="review-slider">
              <div className="review-track" ref={sliderRef}>
                {slides.map((item) => (
                  <div className="review-card" key={item.author}>
                    <div className="review-header">
                      <div className="review-meta">
                        <span className="review-author">{item.author}</span>
                        <span className="review-date">{item.date}</span>
                      </div>
                      <div className="review-stars">★★★★★</div>
                    </div>
                    <p className="review-text">{item.content}</p>
                    <div className="review-footer">
                      <span>{copy.review.ratingNote}</span>
                      <a href="#reviews">{copy.review.viewAll}</a>
                    </div>
                  </div>
                ))}
              </div>
              <div className="review-nav">
                <button type="button" className="prev" onClick={handlePrev} aria-label={language === 'vi' ? 'Đánh giá trước' : 'Previous review'}>
                  <i className="fa-solid fa-chevron-left" aria-hidden="true" />
                </button>
                <button type="button" className="next" onClick={handleNext} aria-label={language === 'vi' ? 'Đánh giá tiếp' : 'Next review'}>
                  <i className="fa-solid fa-chevron-right" aria-hidden="true" />
                </button>
              </div>
              <div className="review-dots">
                {slides.map((_, idx) => (
                  <button
                    type="button"
                    key={idx}
                    className={idx === activeSlide ? 'active' : undefined}
                    aria-label={`Review ${idx + 1}`}
                    onClick={() => goTo(idx)}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="review-photo">
            <img src="/anh/image%20copy%2029.png" alt={copy.review.photoAlt} />
          </div>
        </div>
      </section>

      <section className="responsible-section">
        <div className="responsible-text">
          <h4>{copy.responsible.title}</h4>
          <p>{copy.responsible.description}</p>
          <a href="#responsible">{copy.responsible.cta}</a>
        </div>
        <div className="responsible-media">
          <img src="/anh/image%20copy%2023.png" alt={copy.responsible.imageAlt} />
        </div>
      </section>

      <section className="destination-gallery">
        <div className="destination-grid">
          {copy.destinations.cards.map((item) =>
            item.to ? (
              <Link to={item.to} className="destination-card" key={item.title}>
                <img src={item.image} alt={item.title} />
                <span>{item.title}</span>
              </Link>
            ) : (
              <div className="destination-card" key={item.title}>
                <img src={item.image} alt={item.title} />
                <span>{item.title}</span>
              </div>
            )
          )}
        </div>
        <div className="section-header">
          <h4>{copy.destinations.title}</h4>
          <p>{copy.destinations.description}</p>
        </div>
      </section>

      <section className="exclusive-experiences">
        <div className="experience-grid">
          {copy.experiences.cards.map((item) => {
            const CardTag = item.to ? Link : 'article';
            const cardProps = item.to ? { to: item.to } : {};
            return (
              <CardTag className={`experience-card${item.to ? ' experience-card--link' : ''}`} key={item.title} {...cardProps}>
              <img src={item.image} alt={item.title} />
              <div className="experience-body">
                <h5>{item.title}</h5>
                <p>{item.description}</p>
              </div>
              </CardTag>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default Home;
