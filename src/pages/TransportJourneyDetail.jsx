import { useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import '../styles/transport.css';
import { useLanguage } from '../context/LanguageContext.jsx';
import { TRANSPORT_CONTENT } from './Transport.jsx';

function TransportJourneyDetail() {
  const { language } = useLanguage();
  const { journeySlug } = useParams();
  const copy = TRANSPORT_CONTENT[language];

  const journey = useMemo(
    () => copy.journeys.cards.find((card) => card.slug === journeySlug),
    [copy.journeys.cards, journeySlug]
  );

  if (!journey) {
    return <Navigate to="/di-chuyen" replace />;
  }

  const detailText = journey.detail || journey.description;
  const backLabel = language === 'vi' ? 'Quay về dịch vụ di chuyển' : 'Back to transport';
  const ctaLabel = language === 'vi' ? 'Nhận tư vấn hành trình' : 'Plan this journey';

  return (
    <div className="transport-journey-detail">
      <div className="transport-journey-detail__hero">
        <img src={journey.image} alt={journey.title} />
        <div className="transport-journey-detail__overlay">
          <nav className="transport-journey-detail__breadcrumbs" aria-label="Breadcrumb">
            <Link to="/di-chuyen">{backLabel}</Link>
          </nav>
          <h1>{journey.title}</h1>
          <p>{journey.description}</p>
          <div className="transport-journey-detail__actions">
            <Link to="/di-chuyen#transport-rental" className="btn-primary">
              {ctaLabel}
            </Link>
          </div>
        </div>
      </div>

      <section className="transport-journey-detail__content">
        <article>
          <h2>{language === 'vi' ? 'Vì sao hành trình này đặc biệt' : 'What makes this journey special'}</h2>
          <p>{detailText}</p>
        </article>
      </section>
    </div>
  );
}

export default TransportJourneyDetail;
