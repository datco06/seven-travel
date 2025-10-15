import { useMemo, useState } from 'react';
import '../styles/tourExplorer.css';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Link } from 'react-router-dom';
import { BOOKING_MESSAGES, mapBookingErrorMessage } from '../constants/bookingMessages.js';

export const TOUR_EXPLORER_COPY = {
  vi: {
    sectionTitle: 'Bạn muốn đi đâu?',
    sectionSubtitle: 'Nhập điểm đến, chọn thời gian và ngày khởi hành để xem các hành trình phù hợp.',
    destinationLabel: 'Địa điểm',
    destinationPlaceholder: 'Bạn muốn khám phá nơi nào?',
    durationLabel: 'Thời lượng',
    durationPlaceholder: 'Chọn số ngày đêm',
    dateLabel: 'Ngày khởi hành',
    submit: 'Xem gợi ý',
    emptyTitle: 'Chưa tìm thấy tour phù hợp',
    emptyBody: 'Hãy điều chỉnh địa điểm hoặc thời gian để nhận thêm gợi ý phù hợp.',
    includesTitle: 'Bao gồm những gì',
    itineraryTitle: 'Lịch trình chi tiết',
    viewTour: 'Xem tour',
    bookTour: 'Đặt tour',
    selectTourPrompt: 'Hãy chọn “Xem tour” để mở lịch trình chi tiết bạn quan tâm.',
    loginRequired: 'Vui lòng đăng nhập bằng tài khoản khách hàng để đặt tour.',
    adminNotAllowed: 'Chỉ khách hàng mới có thể đặt tour trực tiếp.',
    bookSuccess: 'Bạn đã đặt tour thành công! Thông tin sẽ hiển thị trong trang tài khoản.',
    resultsTitle: (count) => `Tìm thấy ${count} tour phù hợp`,
    dateBadge: (date) => `Khởi hành dự kiến: ${date}`,
    adultPriceLabel: 'Giá người lớn',
    childPriceLabel: 'Giá trẻ em',
    guestPickerTitle: 'Tính giá nhanh',
    guestPickerSubtitle: 'Chọn số khách để xem tổng chi phí dự kiến.',
    adultsLabel: 'Người lớn',
    childrenLabel: 'Trẻ em',
    totalPriceLabel: 'Tổng giá',
    pricingNotesLabel: 'Ghi chú giá',
    heroAlt: 'Hình ảnh tour',
  },
  en: {
    sectionTitle: 'Where would you like to go?',
    sectionSubtitle: 'Enter a destination, pick the duration and your departure date to view curated journeys.',
    destinationLabel: 'Destination',
    destinationPlaceholder: 'Which place inspires you?',
    durationLabel: 'Duration',
    durationPlaceholder: 'Select days & nights',
    dateLabel: 'Departure date',
    submit: 'Show tours',
    emptyTitle: 'No tours match yet',
    emptyBody: 'Adjust your destination or duration to unlock more tailored suggestions.',
    includesTitle: 'What is included',
    itineraryTitle: 'Itinerary highlights',
    viewTour: 'View tour',
    bookTour: 'Book now',
    selectTourPrompt: 'Choose “View tour” to open the day-by-day journey.',
    loginRequired: 'Please sign in with a customer account to book.',
    adminNotAllowed: 'Only customer accounts can place a booking.',
    bookSuccess: 'Tour booked! You can review it in your account page.',
    resultsTitle: (count) => `${count} curated tour${count > 1 ? 's' : ''} for you`,
    dateBadge: (date) => `Preferred departure: ${date}`,
    adultPriceLabel: 'Adult price',
    childPriceLabel: 'Child price',
    guestPickerTitle: 'Quick price estimate',
    guestPickerSubtitle: 'Select guests to view the estimated total.',
    adultsLabel: 'Adults',
    childrenLabel: 'Children',
    totalPriceLabel: 'Total price',
    pricingNotesLabel: 'Pricing notes',
    heroAlt: 'Tour hero image',
  },
};

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

export const FIXED_DESTINATIONS = ['Hà Nội', 'Hải Phòng', 'Ninh Bình', 'Sơn La', 'Lào Cai', 'Phú Thọ'];

const normaliseSearchText = (text) => {
  if (!text) return '';
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
};

const DAY_PATTERNS = [/(\d+)\s*ngày/i, /(\d+)\s*day/i];
const NIGHT_PATTERNS = [/(\d+)\s*đêm/i, /(\d+)\s*night/i];

const slugifyText = (input) =>
  input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const readFirstMatch = (patterns, text) => {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const numeric = Number.parseInt(match[1], 10);
      if (Number.isFinite(numeric)) {
        return numeric;
      }
    }
  }
  return null;
};

const extractDurationMeta = (tour) => {
  const fallbackLabel = (tour.durationLabel || tour.duration || '').trim();
  let days = Number.isFinite(tour.durationDays) ? tour.durationDays : null;
  let nights = Number.isFinite(tour.durationNights) ? tour.durationNights : null;

  if (fallbackLabel) {
    if (!Number.isFinite(days)) {
      const parsedDays = readFirstMatch(DAY_PATTERNS, fallbackLabel);
      if (Number.isFinite(parsedDays)) {
        days = parsedDays;
      }
    }
    if (!Number.isFinite(nights)) {
      const parsedNights = readFirstMatch(NIGHT_PATTERNS, fallbackLabel);
      if (Number.isFinite(parsedNights)) {
        nights = parsedNights;
      }
    }
  }

  return { days, nights, fallbackLabel };
};

const normaliseNights = ({ days, nights }) => {
  if (Number.isFinite(nights)) return nights;
  if (Number.isFinite(days)) {
    if (days <= 1) return 0;
    return days - 1;
  }
  return null;
};

const durationValueFromMeta = (meta) => {
  if (Number.isFinite(meta.days)) {
    const normalisedNights = normaliseNights(meta);
    const safeNights = Number.isFinite(normalisedNights) ? normalisedNights : 0;
    return `standard:${meta.days}-${safeNights}`;
  }
  const base = meta.fallbackLabel ? slugifyText(meta.fallbackLabel) : '';
  return base ? `text:${base}` : null;
};

const durationValueFromTour = (tour) => durationValueFromMeta(extractDurationMeta(tour));

const durationLabelFromMeta = (meta, language) => {
  if (Number.isFinite(meta.days)) {
    const nights = normaliseNights(meta);
    if (language === 'en') {
      const dayLabel = meta.days === 1 ? 'day' : 'days';
      if (Number.isFinite(nights) && nights > 0) {
        const nightLabel = nights === 1 ? 'night' : 'nights';
        return `${meta.days} ${dayLabel} ${nights} ${nightLabel}`;
      }
      return `${meta.days} ${dayLabel}`;
    }

    if (Number.isFinite(nights) && nights > 0) {
      return `${meta.days} ngày ${nights} đêm`;
    }
    return `${meta.days} ngày`;
  }

  return meta.fallbackLabel || '';
};

function TourExplorer({ anchorId = 'tour-explorer', showHeading = true }) {
  const { language } = useLanguage();
  const copy = TOUR_EXPLORER_COPY[language];
  const { tours, currentUser, bookProduct } = useAuth();

  const [filters, setFilters] = useState({ destination: '', duration: '', date: '' });
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState([]);
  const [bookingFeedback, setBookingFeedback] = useState({});
  const [guestSelections, setGuestSelections] = useState({});

  const explorerTours = useMemo(() => {
    const allowed = new Set(
      FIXED_DESTINATIONS.map((item) => normaliseSearchText(item)).filter(Boolean),
    );
    const normalise = (text) => normaliseSearchText(text);
    return tours.filter((tour) => {
      if (tour.hiddenFromExplorer) return false;
      const regions = (tour.regions ?? []).map((region) => normalise(region));
      if (regions.length === 0) {
        return true;
      }
      return regions.some((region) => allowed.has(region));
    });
  }, [tours]);

  const destinationOptions = useMemo(() => FIXED_DESTINATIONS, []);

  const durationOptions = useMemo(() => {
    const options = new Map();

    explorerTours.forEach((tour) => {
      const meta = extractDurationMeta(tour);
      const value = durationValueFromMeta(meta);
      if (!value) return;

      if (!options.has(value)) {
        const normalisedNights = normaliseNights(meta);
        options.set(value, {
          value,
          label: durationLabelFromMeta(meta, language),
          days: Number.isFinite(meta.days) ? meta.days : Number.POSITIVE_INFINITY,
          nights: Number.isFinite(normalisedNights) ? normalisedNights : Number.POSITIVE_INFINITY,
        });
      }
    });

    return Array.from(options.values()).sort((a, b) => {
      if (a.days === b.days) {
        if (a.nights === b.nights) {
          return a.label.localeCompare(b.label);
        }
        return a.nights - b.nights;
      }
      return a.days - b.days;
    });
  }, [explorerTours, language]);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const normalizedDestination = normaliseSearchText(filters.destination.trim());
    const filteredTours = explorerTours.filter((tour) => {
      const tourRegions = (tour.regions ?? []).map((region) => normaliseSearchText(region));
      const matchesDestination = normalizedDestination
        ? tourRegions.some((region) => region.includes(normalizedDestination)) ||
          normaliseSearchText(tour.name).includes(normalizedDestination) ||
          normaliseSearchText(tour.summary ?? '').includes(normalizedDestination)
        : true;
      const tourDurationValue = durationValueFromTour(tour);
      const matchesDuration = filters.duration ? tourDurationValue === filters.duration : true;
      return matchesDestination && matchesDuration;
    });

    setResults(filteredTours);
    setSubmitted(true);

    window.requestAnimationFrame(() => {
      const target = document.getElementById(`${anchorId}-results`);
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const formattedDate = useMemo(() => {
    if (!filters.date) return null;
    try {
      return new Date(filters.date).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US');
    } catch (error) {
      return null;
    }
  }, [filters.date, language]);

  const listToRender = submitted ? results : [];
  const bookingMessages = BOOKING_MESSAGES[language] ?? BOOKING_MESSAGES.vi;
  const pendingLabel = language === 'vi' ? 'Đang xử lý...' : 'Processing...';
  const guestCopy =
    language === 'vi'
      ? {
          title: copy.guestPickerTitle,
          subtitle: copy.guestPickerSubtitle,
          adults: copy.adultsLabel,
          children: copy.childrenLabel,
          total: copy.totalPriceLabel,
        }
      : {
          title: copy.guestPickerTitle,
          subtitle: copy.guestPickerSubtitle,
          adults: copy.adultsLabel,
          children: copy.childrenLabel,
          total: copy.totalPriceLabel,
        };

  const getGuestSelection = (tourId) =>
    guestSelections[tourId] ?? { adults: 2, children: 0 };

  const computeTotal = (tour, selection) => {
    const adultPrice = tour.pricing?.adult ?? tour.price;
    const childPrice =
      tour.pricing?.child ?? tour.pricing?.adult ?? tour.price;
    const adults = Number.isFinite(Number(selection.adults))
      ? Math.max(Number(selection.adults), 0)
      : 0;
    const children = Number.isFinite(Number(selection.children))
      ? Math.max(Number(selection.children), 0)
      : 0;
    return adultPrice * adults + childPrice * children;
  };

  const handleGuestChange = (tourId, field, value) => {
    const numeric = Number(value);
    setGuestSelections((prev) => {
      const next = { ...getGuestSelection(tourId), [field]: Number.isFinite(numeric) ? Math.max(numeric, 0) : 0 };
      return { ...prev, [tourId]: next };
    });
  };

  const handleBookTour = async (tour) => {
    if (!currentUser) {
      setBookingFeedback((prev) => ({
        ...prev,
        [tour.id]: { status: 'error', message: bookingMessages.loginRequired },
      }));
      return;
    }

    if (currentUser.role !== 'customer') {
      setBookingFeedback((prev) => ({
        ...prev,
        [tour.id]: { status: 'error', message: bookingMessages.roleNotAllowed },
      }));
      return;
    }

    const selection = getGuestSelection(tour.id);
    const totalAmount = computeTotal(tour, selection);
    if (totalAmount <= 0) {
      setBookingFeedback((prev) => ({
        ...prev,
        [tour.id]: {
          status: 'error',
          message:
            language === 'vi'
              ? 'Hãy nhập số lượng khách hợp lệ trước khi đặt.'
              : 'Please enter a valid guest count before booking.',
        },
      }));
      return;
    }

    setBookingFeedback((prev) => ({
      ...prev,
      [tour.id]: { status: 'pending', message: bookingMessages.processing },
    }));

    try {
      await bookProduct({
        category: 'tour',
        productId: tour.id,
        amountOverride: totalAmount,
        details: { ...selection, source: 'explorer' },
      });
      setBookingFeedback((prev) => ({
        ...prev,
        [tour.id]: { status: 'success', message: bookingMessages.success },
      }));
    } catch (error) {
      const derivedMessage = mapBookingErrorMessage(language, error.message);
      setBookingFeedback((prev) => ({
        ...prev,
        [tour.id]: { status: 'error', message: derivedMessage || bookingMessages.genericError },
      }));
    }
  };

  return (
    <section className="tour-explorer" id={anchorId}>
      {showHeading ? (
        <div className="tour-explorer__intro">
          <h2>{copy.sectionTitle}</h2>
          <p>{copy.sectionSubtitle}</p>
        </div>
      ) : null}

      <form className="tour-explorer__form" onSubmit={handleSearch}>
        <div className="tour-explorer__field">
          <label htmlFor={`${anchorId}-destination`}>{copy.destinationLabel}</label>
          <input
            id={`${anchorId}-destination`}
            name="destination"
            type="text"
            list={`${anchorId}-destinations`}
            placeholder={copy.destinationPlaceholder}
            value={filters.destination}
            onChange={handleFieldChange}
            autoComplete="off"
          />
          <datalist id={`${anchorId}-destinations`}>
            {destinationOptions.map((option) => (
              <option key={option} value={option} />
            ))}
          </datalist>
        </div>
        <div className="tour-explorer__field">
          <label htmlFor={`${anchorId}-duration`}>{copy.durationLabel}</label>
          <select
            id={`${anchorId}-duration`}
            name="duration"
            value={filters.duration}
            onChange={handleFieldChange}
          >
            <option value="">{copy.durationPlaceholder}</option>
            {durationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="tour-explorer__field">
          <label htmlFor={`${anchorId}-date`}>{copy.dateLabel}</label>
          <input
            id={`${anchorId}-date`}
            name="date"
            type="date"
            value={filters.date}
            onChange={handleFieldChange}
          />
        </div>
        <button type="submit" className="tour-explorer__submit">
          {copy.submit}
        </button>
      </form>

      <div className="tour-explorer__results" id={`${anchorId}-results`}>
        {submitted ? (
          listToRender.length > 0 ? (
            <>
              <div className="tour-explorer__results-heading">
                <h3>{copy.resultsTitle(listToRender.length)}</h3>
                {formattedDate ? <span className="tour-explorer__date-badge">{copy.dateBadge(formattedDate)}</span> : null}
              </div>
              <div className="tour-explorer__cards">
                {listToRender.map((tour) => (
                  <article className="tour-card" key={tour.id}>
                    <div className="tour-card__media">
                      <img src={tour.heroImage} alt={copy.heroAlt} />
                    </div>
                    <div className="tour-card__body">
                      <h4>{tour.name}</h4>
                      <p className="tour-card__summary">{tour.summary}</p>
                      <div className="tour-card__meta">
                        <span><i className="fa-solid fa-clock" aria-hidden="true" /> {tour.durationLabel || tour.duration}</span>
                        {tour.regions?.length ? (
                          <span><i className="fa-solid fa-location-dot" aria-hidden="true" /> {tour.regions.join(' · ')}</span>
                        ) : null}
                        <span><i className="fa-solid fa-tag" aria-hidden="true" /> {copy.adultPriceLabel}: {currencyFormatter.format(tour.pricing?.adult ?? tour.price)}</span>
                        {tour.pricing?.child ? (
                          <span><i className="fa-solid fa-child" aria-hidden="true" /> {copy.childPriceLabel}: {currencyFormatter.format(tour.pricing.child)}</span>
                        ) : null}
                      </div>
                      <div className="tour-card__calculator">
                        <div className="tour-card__calculator-header">
                          <h5>{guestCopy.title}</h5>
                          <p>{guestCopy.subtitle}</p>
                        </div>
                        <div className="tour-card__calculator-fields">
                          <label>
                            <span>{guestCopy.adults}</span>
                            <input
                              type="number"
                              min="0"
                              value={getGuestSelection(tour.id).adults}
                              onChange={(event) => handleGuestChange(tour.id, 'adults', event.target.value)}
                            />
                          </label>
                          <label>
                            <span>{guestCopy.children}</span>
                            <input
                              type="number"
                              min="0"
                              value={getGuestSelection(tour.id).children}
                              onChange={(event) => handleGuestChange(tour.id, 'children', event.target.value)}
                            />
                          </label>
                          <div className="tour-card__calculator-total">
                            <span>{guestCopy.total}</span>
                            <strong>{currencyFormatter.format(computeTotal(tour, getGuestSelection(tour.id)))}</strong>
                          </div>
                        </div>
                      </div>
                      <div className="tour-card__actions">
                        <Link className="tour-card__view" to={`/tours/${tour.slug ?? tour.id}`}>
                          {copy.viewTour}
                        </Link>
                        <button
                          type="button"
                          className="tour-card__book"
                          onClick={() => handleBookTour(tour)}
                          disabled={bookingFeedback[tour.id]?.status === 'pending'}
                        >
                          {bookingFeedback[tour.id]?.status === 'pending' ? pendingLabel : copy.bookTour}
                        </button>
                      </div>
                      {bookingFeedback[tour.id]?.message ? (
                        <p className={`tour-card__status ${bookingFeedback[tour.id].status}`} aria-live="polite">
                          {bookingFeedback[tour.id].message}
                        </p>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <div className="tour-explorer__empty">
              <h3>{copy.emptyTitle}</h3>
              <p>{copy.emptyBody}</p>
            </div>
          )
        ) : null}
      </div>

    </section>
  );
}

export default TourExplorer;
