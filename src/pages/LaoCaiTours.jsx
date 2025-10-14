import { Link } from 'react-router-dom';
import '../styles/regionTours.css';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const FEATURED_TOUR_IDS = ['tour-lao-cai-5n4d-fansipan-legacy', 'tour-lao-cai-3n2d-ha-noi-lc'];

const COPY = {
  vi: {
    kicker: 'Sapa & Fansipan',
    title: 'Lào Cai • Sapa mờ sương, Fansipan huyền thoại, Hạ Long nối dài',
    subtitle:
      'Các hành trình 3-5 ngày kết hợp Sapa, Fansipan, bản làng vùng cao và du thuyền Hạ Long dành cho gia đình & nhóm bạn.',
    videoTitle: 'Video giới thiệu Lào Cai',
    toursTitle: 'Tour nổi bật',
    toursSubtitle: 'Khám phá những cung đường đẹp nhất vùng Tây Bắc mở rộng.',
    cta: 'Xem chi tiết & đặt tour',
    priceLabel: 'Giá từ',
  },
  en: {
    kicker: 'Sapa & Fansipan',
    title: 'Lao Cai • Misty Sapa, legendary Fansipan & Halong extensions',
    subtitle:
      'Signature programs from 3 to 5 days linking Sapa, Fansipan, ethnic villages and Halong Bay for families and friends.',
    videoTitle: 'Lao Cai introduction video',
    toursTitle: 'Featured tours',
    toursSubtitle: 'Choose the itinerary that matches your pace across the northern mountains.',
    cta: 'View details & book',
    priceLabel: 'From',
  },
};

function LaoCaiTours() {
  const { tours } = useAuth();
  const { language } = useLanguage();
  const copy = COPY[language];

  const currencyFormatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  });

  const featuredTours = FEATURED_TOUR_IDS.map((id) => tours.find((tour) => tour.id === id)).filter(
    Boolean
  );

  return (
    <div className="region-page">
      <section className="region-hero">
        <p className="region-hero__kicker">{copy.kicker}</p>
        <h1>{copy.title}</h1>
        <p className="region-hero__subtitle">{copy.subtitle}</p>
      </section>

      <section className="region-video">
        <div className="region-video__inner">
          <h2>{copy.videoTitle}</h2>
          <div className="region-video__frame">
            <iframe
              src="https://www.youtube.com/embed/0LW37u8fSEk"
              title="Giới thiệu Lào Cai"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      <section className="region-tour-section">
        <div className="region-tour-section__head">
          <h2>{copy.toursTitle}</h2>
          <p>{copy.toursSubtitle}</p>
        </div>

        <div className="region-tour-grid">
          {featuredTours.map((tour) => (
            <article className="region-tour-card" key={tour.id}>
              <div className="region-tour-card__media">
                <img src={tour.heroImage} alt={tour.name} />
              </div>
              <div className="region-tour-card__body">
                <h3>{tour.name}</h3>
                <p>{tour.summary || tour.description}</p>
                <div className="region-tour-card__meta">
                  <span>
                    <i className="fa-solid fa-clock" aria-hidden="true" /> {tour.durationLabel || tour.duration}
                  </span>
                  <span>
                    <i className="fa-solid fa-tag" aria-hidden="true" /> {copy.priceLabel}:{' '}
                    {currencyFormatter.format(tour.pricing?.adult ?? tour.price)}
                  </span>
                </div>
                <Link to={`/tours/${tour.slug}`} className="region-tour-card__cta">
                  {copy.cta}
                  <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default LaoCaiTours;
