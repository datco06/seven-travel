import { Link } from 'react-router-dom';
import '../styles/regionTours.css';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const FEATURED_TOUR_IDS = [
  'tour-hai-phong-2n1d-cat-ba',
  'tour-hai-phong-3n2d-do-son-cat-ba',
  'tour-hai-phong-4n3d-do-son-cat-ba-ha-long',
];

const FALLBACK_TOURS = {
  vi: [
    {
      id: 'tour-hai-phong-2n1d-cat-ba',
      name: 'Hải Phòng – Cát Bà 2N1Đ',
      slug: 'hai-phong-cat-ba-2n1d',
      durationLabel: '2 ngày 1 đêm',
      duration: '2 ngày 1 đêm',
      price: 3950000,
      pricing: { adult: 3950000, child: 2650000 },
      summary:
        'Trải nghiệm trọn vẹn Cát Bà trong 2 ngày 1 đêm: vườn quốc gia, pháo đài Thần Công và BBQ hải sản ven biển.',
      description:
        'Lịch trình kết hợp thành phố Cảng và đảo Cát Bà, phù hợp gia đình muốn nghỉ dưỡng nhanh mà vẫn đầy đủ điểm nhấn.',
      heroImage:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4aQuMqJSbyWro_9OxooVJLHvpkY5QLu50hA&s',
    },
    {
      id: 'tour-hai-phong-3n2d-do-son-cat-ba',
      name: 'Hải Phòng – Đồ Sơn – Cát Bà 3N2Đ',
      slug: 'hai-phong-do-son-cat-ba-3n2d',
      durationLabel: '3 ngày 2 đêm',
      duration: '3 ngày 2 đêm',
      price: 7850000,
      pricing: { adult: 7850000, child: 5200000 },
      summary:
        'Ba ngày kết hợp Đồ Sơn – Cát Bà – vịnh Lan Hạ với trải nghiệm biển đảo, văn hóa và ẩm thực đặc sắc.',
      description:
        'Tour dành cho gia đình và nhóm bạn muốn nghỉ dưỡng dài ngày, thưởng thức hải sản và trải nghiệm du thuyền Lan Hạ.',
      heroImage:
        'https://media-cdn-v2.laodong.vn/storage/newsportal/2024/8/20/1386337/8G0A3793.jpg?w=800&h=480&crop=auto&scale=both',
    },
    {
      id: 'tour-hai-phong-4n3d-do-son-cat-ba-ha-long',
      name: 'Hải Phòng – Đồ Sơn – Cát Bà – Hạ Long 4N3Đ',
      slug: 'hai-phong-do-son-cat-ba-ha-long-4n3d',
      durationLabel: '4 ngày 3 đêm',
      duration: '4 ngày 3 đêm',
      price: 10950000,
      pricing: { adult: 10950000, child: 7250000 },
      summary:
        'Hành trình 4 ngày 3 đêm khám phá Đồ Sơn, Cát Bà, vịnh Lan Hạ và Hạ Long với nhiều trải nghiệm biển đảo độc đáo.',
      description:
        'Lịch trình mở rộng phù hợp đoàn gia đình hoặc công ty, kết hợp nghỉ dưỡng resort và du thuyền hạng sang trên vịnh.',
      heroImage:
        'https://statics.vinpearl.com/cat-ba-2024-1_1721649747.png',
    },
  ],
  en: [
    {
      id: 'tour-hai-phong-2n1d-cat-ba',
      name: 'Hai Phong – Cat Ba 2D1N',
      slug: 'hai-phong-cat-ba-2n1d',
      durationLabel: '2 days 1 night',
      duration: '2 days 1 night',
      price: 3950000,
      pricing: { adult: 3950000, child: 2650000 },
      summary:
        'Two days embracing Cat Ba: National Park trekking, Cannon Fort sunset and a seafood BBQ by the beach.',
      description:
        'A balanced getaway linking the port city and Cat Ba Island, ideal for families seeking a quick yet complete escape.',
      heroImage:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4aQuMqJSbyWro_9OxooVJLHvpkY5QLu50hA&s',
    },
    {
      id: 'tour-hai-phong-3n2d-do-son-cat-ba',
      name: 'Hai Phong – Do Son – Cat Ba 3D2N',
      slug: 'hai-phong-do-son-cat-ba-3n2d',
      durationLabel: '3 days 2 nights',
      duration: '3 days 2 nights',
      price: 7850000,
      pricing: { adult: 7850000, child: 5200000 },
      summary:
        'Three days across Do Son, Cat Ba and Lan Ha Bay with island experiences, local culture and signature seafood.',
      description:
        'Designed for families and friends wanting a longer coastal holiday with a Lan Ha cruise and nightly seafood feasts.',
      heroImage:
        'https://media-cdn-v2.laodong.vn/storage/newsportal/2024/8/20/1386337/8G0A3793.jpg?w=800&h=480&crop=auto&scale=both',
    },
    {
      id: 'tour-hai-phong-4n3d-do-son-cat-ba-ha-long',
      name: 'Hai Phong – Do Son – Cat Ba – Ha Long 4D3N',
      slug: 'hai-phong-do-son-cat-ba-ha-long-4n3d',
      durationLabel: '4 days 3 nights',
      duration: '4 days 3 nights',
      price: 10950000,
      pricing: { adult: 10950000, child: 7250000 },
      summary:
        'A four-day journey embracing Do Son, Cat Ba, Lan Ha Bay and Ha Long with standout island adventures.',
      description:
        'An extended itinerary for families and corporate retreats blending premium resorts with an upscale cruise experience.',
      heroImage:
        'https://statics.vinpearl.com/cat-ba-2024-1_1721649747.png',
    },
  ],
};

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
  const fallbackTours = FALLBACK_TOURS[language] ?? FALLBACK_TOURS.vi;
  const displayTours = featuredTours.length > 0 ? featuredTours : fallbackTours;

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
          {displayTours.map((tour) => (
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
