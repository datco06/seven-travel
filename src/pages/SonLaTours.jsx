import { Link } from 'react-router-dom';
import '../styles/regionTours.css';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const FEATURED_TOUR_IDS = [
  'tour-son-la-2n1d-ta-xua',
  'tour-son-la-3n2d-son-la-dien-bien',
  'tour-son-la-4n3d-song-da',
];

const COPY = {
  vi: {
    kicker: 'Sắc màu Tây Bắc',
    title: 'Sơn La • Săn mây Tà Xùa, ký ức Điện Biên, hồ Pá Khoang',
    subtitle:
      'Tổng hợp các hành trình từ 2N1Đ đến 4N3Đ khám phá Mộc Châu, Tà Xùa, Tuần Giáo, Điện Biên và hồ Pá Khoang.',
    videoTitle: 'Video giới thiệu Sơn La',
    toursTitle: 'Tour nổi bật',
    toursSubtitle: 'Chọn lịch trình phù hợp để cảm nhận Tây Bắc theo cách riêng của bạn.',
    cta: 'Xem chi tiết & đặt tour',
    priceLabel: 'Giá từ',
  },
  en: {
    kicker: 'Northwest Colors',
    title: 'Son La • Cloud hunting, Dien Bien memories & Pa Khoang lake',
    subtitle:
      'Signature journeys from 2 to 4 days covering Moc Chau, Ta Xua, Tuan Giao, Dien Bien and Pa Khoang.',
    videoTitle: 'Son La introduction video',
    toursTitle: 'Featured tours',
    toursSubtitle: 'Pick your itinerary and embrace the Northwest highlands.',
    cta: 'View details & book',
    priceLabel: 'From',
  },
};

function SonLaTours() {
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
              src="https://www.youtube.com/embed/hP8sMkT4MfQ"
              title="Giới thiệu Sơn La"
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

export default SonLaTours;
