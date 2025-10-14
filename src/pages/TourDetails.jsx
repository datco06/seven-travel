import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../styles/tourExplorer.css';
import '../styles/tourDetails.css';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { TOUR_EXPLORER_COPY } from '../components/TourExplorer.jsx';

const PAGE_COPY = {
  vi: {
    back: 'Quay lại',
    backToCreate: 'Tạo tour khác',
    notFoundTitle: 'Không tìm thấy tour',
    notFoundBody: 'Rất tiếc, tour bạn chọn hiện không còn khả dụng. Vui lòng quay lại và chọn hành trình khác.',
  },
  en: {
    back: 'Go back',
    backToCreate: 'Create another tour',
    notFoundTitle: 'Tour not found',
    notFoundBody: 'Sorry, we could not locate that itinerary. Please return and choose another journey.',
  },
};

function TourDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { tours } = useAuth();
  const { language } = useLanguage();

  const copy = TOUR_EXPLORER_COPY[language];
  const pageCopy = PAGE_COPY[language];
  const [guestCounts, setGuestCounts] = useState({ adults: 2, children: 0 });

  const tour = useMemo(
    () => tours.find((item) => item.slug === slug || item.id === slug) ?? null,
    [slug, tours]
  );

  const adultUnitPrice = tour?.pricing?.adult ?? tour?.price ?? 0;
  const childUnitPrice = tour?.pricing?.child ?? adultUnitPrice;

  const totalPrice = useMemo(
    () => adultUnitPrice * guestCounts.adults + childUnitPrice * guestCounts.children,
    [adultUnitPrice, childUnitPrice, guestCounts.adults, guestCounts.children]
  );

  const handleGuestChange = (event) => {
    const { name, value } = event.target;
    const fallback = name === 'adults' ? 1 : 0;
    const parsed = Number.parseInt(value, 10);
    const safeValue = Number.isNaN(parsed) ? fallback : Math.max(fallback, parsed);
    setGuestCounts((prev) => (prev[name] === safeValue ? prev : { ...prev, [name]: safeValue }));
  };

  useEffect(() => {
    setGuestCounts({ adults: 2, children: 0 });
  }, [tour?.id]);

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
      }),
    []
  );

  if (!tour) {
    return (
      <div className="tour-detail-page tour-detail-page--empty">
        <div className="tour-detail-page__header">
          <button type="button" onClick={() => navigate(-1)} className="tour-detail-page__back">
            <i className="fa-solid fa-arrow-left" aria-hidden="true" /> {pageCopy.back}
          </button>
        </div>
        <div className="tour-detail-page__empty-card">
          <h2>{pageCopy.notFoundTitle}</h2>
          <p>{pageCopy.notFoundBody}</p>
          <div className="tour-detail-page__actions">
            <Link to="/tao-tour" className="tour-detail__book">
              {pageCopy.backToCreate}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const adultsInputId = `${tour.id}-adults`;
  const childrenInputId = `${tour.id}-children`;
  const formattedTotalPrice = currencyFormatter.format(totalPrice);

  return (
    <div className="tour-detail-page">
      <div className="tour-detail-page__header">
        <button type="button" onClick={() => navigate(-1)} className="tour-detail-page__back">
          <i className="fa-solid fa-arrow-left" aria-hidden="true" /> {pageCopy.back}
        </button>
        <Link to="/tao-tour" className="tour-detail-page__link">
          {pageCopy.backToCreate}
        </Link>
      </div>

      <div className="tour-detail">
        <header className="tour-detail__header">
          <div>
            <h3>{tour.name}</h3>
            <p>{tour.description || tour.summary}</p>
            <div className="tour-detail__chips">
              <span>
                <i className="fa-solid fa-clock" aria-hidden="true" /> {tour.durationLabel || tour.duration}
              </span>
              {tour.regions?.length ? (
                <span>
                  <i className="fa-solid fa-map-location-dot" aria-hidden="true" /> {tour.regions.join(' · ')}
                </span>
              ) : null}
              <span>
                <i className="fa-solid fa-tag" aria-hidden="true" /> {copy.adultPriceLabel}:{' '}
                {currencyFormatter.format(tour.pricing?.adult ?? tour.price)}
              </span>
              {tour.pricing?.child ? (
                <span>
                  <i className="fa-solid fa-child" aria-hidden="true" /> {copy.childPriceLabel}:{' '}
                  {currencyFormatter.format(tour.pricing.child)}
                </span>
              ) : null}
            </div>
          </div>
          <img src={tour.heroImage} alt={copy.heroAlt} />
        </header>

        <div className="tour-detail__content">
          <section className="tour-detail__includes">
            <h4>{copy.includesTitle}</h4>
            {tour.pricing ? (
              <div className="tour-detail__pricing-box">
                <div className="tour-detail__pricing-line">
                  <i className="fa-solid fa-user" aria-hidden="true" />
                  <span>
                    {copy.adultPriceLabel}: {currencyFormatter.format(tour.pricing.adult ?? tour.price)}
                  </span>
                </div>
                {tour.pricing.child ? (
                  <div className="tour-detail__pricing-line">
                    <i className="fa-solid fa-child" aria-hidden="true" />
                    <span>
                      {copy.childPriceLabel}: {currencyFormatter.format(tour.pricing.child)}
                    </span>
                  </div>
                ) : null}
                {tour.pricing.notes ? (
                  <p className="tour-detail__pricing-note">
                    <i className="fa-solid fa-circle-info" aria-hidden="true" /> {copy.pricingNotesLabel}:{' '}
                    {tour.pricing.notes}
                  </p>
                ) : null}
              </div>
            ) : null}
            <ul>
              {(tour.includes ?? []).map((item) => (
                <li key={`${tour.id}-${item.label}`} className={item.included ? 'included' : 'excluded'}>
                  <i className={`fa-solid ${item.included ? 'fa-circle-check' : 'fa-circle-xmark'}`} aria-hidden="true" />
                  {item.label}
                </li>
              ))}
            </ul>
          </section>

          <section className="tour-detail__itinerary">
            <h4>{copy.itineraryTitle}</h4>
            <div className="tour-detail__timeline">
              {(tour.itinerary ?? []).map((item, index) => (
                <article key={`${tour.id}-day-${item.day ?? index + 1}`} className="tour-day">
                  <div className="tour-day__badge">Ngày {item.day ?? index + 1}</div>
                  <div className="tour-day__body">
                    <h5>{item.title}</h5>
                    {item.description ? <p>{item.description}</p> : null}
                    {item.schedule?.length ? (
                      <ul className="tour-day__schedule">
                        {item.schedule.map((entry) => (
                          <li key={entry}>
                            <i className="fa-solid fa-circle-dot" aria-hidden="true" />
                            <span>{entry}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {item.image ? <img src={item.image} alt={item.title} /> : null}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <footer className="tour-detail__footer">
          <form
            className="tour-detail__guest-form"
            onSubmit={(event) => event.preventDefault()}
            aria-label={copy.guestPickerTitle}
          >
            <div className="tour-detail__guest-heading">
              <span className="tour-detail__guest-title">{copy.guestPickerTitle}</span>
              <span className="tour-detail__guest-subtitle">{copy.guestPickerSubtitle}</span>
            </div>
            <label className="tour-detail__guest-field" htmlFor={adultsInputId}>
              <span>{copy.adultsLabel}</span>
              <input
                id={adultsInputId}
                name="adults"
                type="number"
                min="1"
                value={guestCounts.adults}
                onChange={handleGuestChange}
                inputMode="numeric"
              />
            </label>
            <label className="tour-detail__guest-field" htmlFor={childrenInputId}>
              <span>{copy.childrenLabel}</span>
              <input
                id={childrenInputId}
                name="children"
                type="number"
                min="0"
                value={guestCounts.children}
                onChange={handleGuestChange}
                inputMode="numeric"
              />
            </label>
            <div className="tour-detail__total">
              <span>{copy.totalPriceLabel}</span>
              <strong>{formattedTotalPrice}</strong>
            </div>
          </form>
          <Link to="/tao-tour#tour-explorer-page" className="tour-detail__book">
            {copy.bookTour}
          </Link>
        </footer>
      </div>
    </div>
  );
}

export default TourDetails;
