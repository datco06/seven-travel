import { Link } from 'react-router-dom';
import '../styles/regionTours.css';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const FEATURED_TOUR_IDS = [
  'tour-phu-tho-ve-dat-to-1n',
  'tour-phu-tho-2n1d-thanh-thuy',
  'tour-phu-tho-3n2d-mien-nui',
];

const COPY = {
  vi: {
    kicker: 'Hành trình về Đất Tổ',
    title: 'Phú Thọ • Cội nguồn dân tộc & trải nghiệm bản địa',
    subtitle:
      'Ba chương trình đặc sắc giúp bạn khám phá Đền Hùng, nghỉ dưỡng Thanh Thủy và trekking Xuân Sơn.',
    videoTitle: 'Video giới thiệu Phú Thọ',
    toursTitle: 'Chương trình gợi ý',
    toursSubtitle:
      'Chọn lịch trình phù hợp từ hành trình một ngày linh thiêng tới trải nghiệm thiên nhiên 3 ngày 2 đêm.',
    cta: 'Xem chi tiết & đặt tour',
    priceLabel: 'Giá từ',
  },
  en: {
    kicker: 'Journey to the Ancestors',
    title: 'Phu Tho • Spiritual roots and local experiences',
    subtitle:
      'Three curated programs covering Hung Kings Temple, Thanh Thuy hot springs and Xuan Son National Park.',
    videoTitle: 'Phu Tho introduction video',
    toursTitle: 'Suggested programs',
    toursSubtitle:
      'Pick the itinerary that fits you best, from a one-day spiritual escape to a three-day nature getaway.',
    cta: 'View details & book',
    priceLabel: 'From',
  },
};

function PhuThoTours() {
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
              src="https://www.youtube.com/embed/ndNjP3LO6H4"
              title="Giới thiệu Phú Thọ"
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

export default PhuThoTours;
