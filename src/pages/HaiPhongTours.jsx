import { Link } from 'react-router-dom';
import '../styles/regionTours.css';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const FEATURED_TOUR_IDS = [
  'tour-hai-phong-2n1d-cat-ba',
  'tour-hai-phong-3n2d-do-son-cat-ba',
  'tour-hai-phong-4n3d-do-son-cat-ba-ha-long',
];

const COPY = {
  vi: {
    kicker: 'Biển đảo Hải Phòng',
    title: 'Hải Phòng • Cảng biển sôi động, đảo ngọc Cát Bà',
    subtitle:
      'Các chương trình kết hợp thành phố Cảng, Đồ Sơn, Cát Bà và vịnh Lan Hạ với trải nghiệm tàu cao tốc, BBQ hải sản và du thuyền.',
    videoTitle: 'Video giới thiệu Hải Phòng',
    toursTitle: 'Tour nổi bật',
    toursSubtitle: 'Lựa chọn lịch trình phù hợp để khám phá thành phố Cảng và đảo ngọc.',
    cta: 'Xem chi tiết & đặt tour',
    priceLabel: 'Giá từ',
  },
  en: {
    kicker: 'Hai Phong Coasts',
    title: 'Hai Phong • Vibrant port city & Cat Ba island escapes',
    subtitle:
      'Curated journeys linking the bustling port, Do Son beach, Cat Ba island and Lan Ha Bay with speedboats, seafood BBQs and cruise experiences.',
    videoTitle: 'Hai Phong introduction video',
    toursTitle: 'Featured tours',
    toursSubtitle: 'Pick an itinerary to enjoy the best of the city and its islands.',
    cta: 'View details & book',
    priceLabel: 'From',
  },
};

function HaiPhongTours() {
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
              src="https://www.youtube.com/embed/uj90ty4nkeE"
              title="Giới thiệu Hải Phòng"
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

export default HaiPhongTours;
