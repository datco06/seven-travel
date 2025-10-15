import { useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import '../styles/stay.css';
import { useLanguage } from '../context/LanguageContext.jsx';
import { STAY_CONTENT } from './Stay.jsx';

function StayCollectionDetail() {
  const { language } = useLanguage();
  const { collectionSlug } = useParams();
  const copy = STAY_CONTENT[language];

  const collection = useMemo(
    () => copy.collections.cards.find((card) => card.slug === collectionSlug),
    [collectionSlug, copy.collections.cards]
  );

  if (!collection) {
    return <Navigate to="/luu-tru" replace />;
  }

  const backLabel = language === 'vi' ? 'Quay về lưu trú' : 'Back to stays';
  const ctaLabel = language === 'vi' ? 'Khám phá nơi lưu trú' : 'Explore stays';
  const detailHeading =
    language === 'vi'
      ? 'Điều làm nên bộ sưu tập này'
      : 'What makes this collection special';
  const detailText = collection.detail || collection.description;

  return (
    <div className="stay-collection-detail">
      <div className="stay-collection-detail__hero">
        <img src={collection.image} alt={collection.title} />
        <div className="stay-collection-detail__overlay">
          <nav className="stay-collection-detail__breadcrumbs" aria-label="Breadcrumb">
            <Link to="/luu-tru">{backLabel}</Link>
          </nav>
          <div className="stay-collection-detail__header">
            {collection.tag ? <span className="stay-collection-detail__tag">{collection.tag}</span> : null}
            <h1>{collection.title}</h1>
          </div>
          <p>{collection.description}</p>
          <div className="stay-collection-detail__actions">
            <Link to="/luu-tru" className="btn-primary">
              {ctaLabel}
            </Link>
          </div>
        </div>
      </div>

      <section className="stay-collection-detail__content">
        <article>
          <h2>{detailHeading}</h2>
          <p>{detailText}</p>
        </article>
      </section>
    </div>
  );
}

export default StayCollectionDetail;
