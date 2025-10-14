import { Link } from 'react-router-dom';
import '../styles/regionTours.css';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const FEATURED_TOUR_IDS = [
  'tour-ha-noi-van-hien-1n',
  'tour-ha-noi-lang-que-2n1d',
  'tour-ha-noi-ba-vi-2n1d',
];

const COPY = {
  vi: {
    kicker: 'Trải nghiệm Hà Nội',
    title: 'Hà Nội • Hồn Thăng Long trong từng hành trình',
    subtitle:
      'Ba hành trình đặc sắc giúp bạn cảm nhận Hà Nội theo nhiều sắc thái: lịch sử, làng nghề và thiên nhiên ngoại ô.',
    videoTitle: 'Video giới thiệu',
    toursTitle: 'Tour nổi bật',
    toursSubtitle: 'Chọn hành trình bạn yêu thích và đặt tour chỉ với một cú chạm.',
    cta: 'Xem chi tiết & đặt tour',
    priceLabel: 'Giá từ',
  },
  en: {
    kicker: 'Hanoi Experiences',
    title: 'Hanoi • Timeless soul of Thang Long',
    subtitle:
      'Three curated journeys showcasing Vietnam’s capital through history, craft villages and serene suburbs.',
    videoTitle: 'Introduction video',
    toursTitle: 'Featured tours',
    toursSubtitle: 'Choose your journey and reserve instantly.',
    cta: 'View details & book',
    priceLabel: 'From',
  },
};

function HanoiTours() {
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
              src="https://www.youtube.com/embed/CafhAqu8RQA"
              title="Giới thiệu Hà Nội"
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

export default HanoiTours;
