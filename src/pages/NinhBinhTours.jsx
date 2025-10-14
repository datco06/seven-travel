import { Link } from 'react-router-dom';
import '../styles/regionTours.css';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const FEATURED_TOUR_IDS = [
  'tour-ninh-binh-2n1d-sac-mau-di-san',
  'tour-ninh-binh-3n2d-trang-an',
  'tour-ninh-binh-4n3d-van-long',
];

const COPY = {
  vi: {
    kicker: 'Di sản Tràng An',
    title: 'Ninh Bình • Sắc xanh non nước & linh thiêng cố đô',
    subtitle:
      'Những hành trình kết hợp Tràng An, Hang Múa, Bái Đính, Tam Cốc, Thung Nham và Cúc Phương cho kỳ nghỉ trọn vẹn.',
    videoTitle: 'Video giới thiệu Ninh Bình',
    toursTitle: 'Tour nổi bật',
    toursSubtitle: 'Khám phá các hành trình tiêu biểu từ Hà Nội đến Ninh Bình.',
    cta: 'Xem chi tiết & đặt tour',
    priceLabel: 'Giá từ',
  },
  en: {
    kicker: 'Trang An Heritage',
    title: 'Ninh Binh • Emerald waterways and sacred ancient capital',
    subtitle:
      'Curated routes covering Trang An, Hang Mua, Bai Dinh, Tam Coc, Thung Nham and Cuc Phuong for an immersive escape.',
    videoTitle: 'Ninh Binh introduction video',
    toursTitle: 'Featured tours',
    toursSubtitle: 'Pick your journey from Hanoi into the heart of Ninh Binh.',
    cta: 'View details & book',
    priceLabel: 'From',
  },
};

function NinhBinhTours() {
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
              src="https://www.youtube.com/embed/JtRfHWNukao"
              title="Giới thiệu Ninh Bình"
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

export default NinhBinhTours;
