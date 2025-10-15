import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/stay.css';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { BOOKING_MESSAGES, mapBookingErrorMessage } from '../constants/bookingMessages.js';
import { FIXED_DESTINATIONS } from '../components/TourExplorer.jsx';
import { STAY_CATALOG } from '../data/stayCatalog.js';

export const STAY_CONTENT = {
  vi: {
    hero: {
      title: 'Lưu trú tinh tế cho mọi phong cách du lịch',
      subtitle:
        'Homestay cảm hứng, khách sạn boutique hay resort cao cấp – SEVEN TRAVEL tuyển chọn tỉ mỉ để mỗi đêm nghỉ đều đáng nhớ.',
      badge: 'Homestay & Hotel',
    },
    search: {
      title: 'Tìm nơi lưu trú phù hợp',
      description: 'Chọn địa điểm, thời gian và loại hình nghỉ dưỡng để xem ngay các gợi ý đã được SEVEN TRAVEL kiểm chứng.',
      destinationLabel: 'Địa điểm',
      destinationPlaceholder: 'Chọn thành phố bạn muốn đến',
      checkInLabel: 'Check-in',
      checkOutLabel: 'Check-out',
      typeLabel: 'Loại hình',
      typeOptions: {
        any: 'Tất cả',
        hotel: 'Khách sạn',
        homestay: 'Homestay',
      },
      submit: 'Tìm kiếm',
      resultsTitle: (count) => `Tìm thấy ${count} lựa chọn lưu trú`,
      dateBadge: (checkIn, checkOut) =>
        checkIn && checkOut ? `Từ ${checkIn} · Đến ${checkOut}` : checkIn ? `Check-in: ${checkIn}` : '',
      emptyTitle: 'Chưa có gợi ý phù hợp',
      emptyBody: 'Hãy điều chỉnh địa điểm, thời gian hoặc loại hình để xem thêm lựa chọn.',
      priceLabel: 'Giá từ',
      bookNow: 'Đặt phòng',
    },
    collections: {
      title: 'Bộ sưu tập được tuyển chọn',
      cards: [
        {
          slug: 'local-homestay-collection',
          title: 'Homestay bản địa ấm áp',
          description:
            'Sống cùng gia đình địa phương, học nấu ăn truyền thống và nghe những câu chuyện bản địa chân thực.',
          image: '/anh/luutru/homestay-ban-ia-am-ap-1.jpg',
          tag: 'Trải nghiệm văn hoá',
          detail:
            'Chúng tôi kết nối bạn với những gia đình hiếu khách ở các bản làng Sapa, Mộc Châu hay Lào Cai. Lịch trình bao gồm lớp nấu ăn truyền thống, tham quan nương chè và hoạt động thủ công đậm bản sắc.',
        },
        {
          slug: 'boutique-hotel-collection',
          title: 'Khách sạn boutique đô thị',
          description:
            'Không gian nghệ thuật giữa trung tâm thành phố, thiết kế sáng tạo cùng tiện nghi hiện đại.',
          image: '/anh/luutru/khach-san-boutique-o-thi-1.jpg',
          tag: 'Chạm vào nghệ thuật',
          detail:
            'Lựa chọn boutique hotel tại Hà Nội, Hải Phòng hay Hội An với phòng thiết kế độc bản, rooftop bar và dịch vụ concierge linh hoạt. Hoàn hảo cho chuyến đi ngắn ngày nhưng giàu trải nghiệm.',
        },
        {
          slug: 'private-resort-collection',
          title: 'Resort nghỉ dưỡng riêng tư',
          description:
            'Biệt thự biển với hồ bơi riêng, liệu trình spa chuyên sâu và dịch vụ quản gia 24/7.',
          image: '/anh/luutru/resort-nghi-duong-rieng-tu-1.jpg',
          tag: 'Thư giãn tuyệt đối',
          detail:
            'Các resort cao cấp tại Phú Quốc, Ninh Bình hay Sơn La với villa hồ bơi riêng, liệu trình wellness và hoạt động dành riêng cho gia đình hoặc cặp đôi. Đội concierge túc trực để cá nhân hoá mọi chi tiết.',
        },
      ],
    },
    moodboard: {
      title: 'Chọn không khí bạn yêu thích',
      filters: [
        'Ẩm thực bản địa',
        'Wellness & Spa',
        'Gần thiên nhiên',
        'Thiết kế đương đại',
        'Gia đình & trẻ nhỏ',
        'Lãng mạn',
      ],
      description:
        'Chúng tôi lắng nghe thói quen nghỉ ngơi và sở thích của bạn để đề xuất nơi lưu trú phù hợp nhất – từ không gian tĩnh lặng giữa rừng đến sky bar đầy năng lượng.',
    },
    services: {
      title: 'Dịch vụ kèm theo để chuyến đi trọn vẹn',
      items: [
        'Tư vấn chọn phòng theo ánh nắng, view và phong thuỷ mong muốn.',
        'Đặt bàn nhà hàng signature, set up kỷ niệm hoặc cầu hôn.',
        'Thiết kế trải nghiệm riêng: lớp yoga bình minh, workshop thủ công, private dining.',
        'Đảm bảo chính sách linh hoạt về giờ nhận – trả phòng và hỗ trợ lên kế hoạch di chuyển.',
      ],
    },
    reviews: {
      title: 'Khách hàng nói gì về nơi lưu trú SEVEN TRAVEL?',
      intro:
        'Mỗi feedback đều giúp chúng tôi hoàn thiện trải nghiệm nghỉ dưỡng cao cấp – từ khâu chọn phòng đến dịch vụ theo sau.',
      ratingNote: 'Điểm hài lòng trung bình: 5 / 5',
      viewAll: 'Xem tất cả đánh giá',
      photoAlt: 'Khách hàng hạnh phúc trong kỳ nghỉ',
      items: [
        {
          author: 'ngocanh_travels',
          date: 'Tháng 5, 2025',
          content:
            'SEVEN TRAVEL chọn được resort đúng gu: phòng hướng biển, dịch vụ quản gia 24/7, mọi setup cầu hôn đều hoàn hảo.',
        },
        {
          author: 'the_smiths',
          date: 'Tháng 3, 2025',
          content:
            'Gia đình 4 người, các bạn gợi ý villa có hồ bơi riêng và hoạt động cho trẻ nhỏ. Các con mê tít lớp làm bánh!',
        },
        {
          author: 'minhchau.lux',
          date: 'Tháng 1, 2025',
          content:
            'Mê nhất dịch vụ concierge. Họ đặt help nhà hàng Michelin, spa và xe đưa đón sân bay cực kỳ chu đáo.',
        },
        {
          author: 'kevin_and_ana',
          date: 'Tháng 12, 2024',
          content:
            'Incredible homestay in Sa Pa curated by the team. Beautiful hosts, authentic cooking class, unforgettable memories.',
        },
      ],
    },
  },
  en: {
    hero: {
      title: 'Curated stays for every travel style',
      subtitle:
        'From soulful homestays to design-led boutique hotels and secluded resorts, every night is crafted to feel special.',
      badge: 'Homestay & Hotel',
    },
    search: {
      title: 'Plan your perfect stay',
      description: 'Pick a destination, travel dates, and property type to explore options vetted by SEVEN TRAVEL.',
      destinationLabel: 'Destination',
      destinationPlaceholder: 'Choose where you want to stay',
      checkInLabel: 'Check-in',
      checkOutLabel: 'Check-out',
      typeLabel: 'Property type',
      typeOptions: {
        any: 'All',
        hotel: 'Hotel',
        homestay: 'Homestay',
      },
      submit: 'Search stays',
      resultsTitle: (count) => `${count} curated stay${count > 1 ? 's' : ''} for you`,
      dateBadge: (checkIn, checkOut) =>
        checkIn && checkOut ? `From ${checkIn} · To ${checkOut}` : checkIn ? `Check-in: ${checkIn}` : '',
      emptyTitle: 'No stays to show yet',
      emptyBody: 'Adjust the destination, dates, or property type to discover more options.',
      priceLabel: 'From',
      bookNow: 'Reserve now',
    },
    collections: {
      title: 'Handpicked collections',
      cards: [
        {
          slug: 'local-homestay-collection',
          title: 'Immersive local homestays',
          description:
            'Stay with welcoming families, join their kitchen, and hear heartfelt stories passed down through generations.',
          image: '/anh/luutru/homestay-ban-ia-am-ap-1.jpg',
          tag: 'Culture-first',
          detail:
            'We pair you with warm-hearted hosts across Sa Pa, Moc Chau, and Lao Cai. Expect hands-on cooking classes, tea field walks, and craft workshops that honour local heritage.',
        },
        {
          slug: 'boutique-hotel-collection',
          title: 'Artful boutique hotels',
          description:
            'Creative spaces in the heart of the city blending contemporary design, gastronomy, and bespoke service.',
          image: '/anh/luutru/khach-san-boutique-o-thi-1.jpg',
          tag: 'City energy',
          detail:
            'Boutique stays in Hanoi, Hai Phong, or Hoi An featuring one-of-a-kind suites, rooftop lounges, and concierge teams ready to secure galleries, dining, and nightlife experiences.',
        },
        {
          slug: 'private-resort-collection',
          title: 'Private luxury resorts',
          description:
            'Oceanfront villas with private pools, holistic spa journeys, and butler service around the clock.',
          image: '/anh/luutru/resort-nghi-duong-rieng-tu-1.jpg',
          tag: 'Slow luxury',
          detail:
            'Exclusive resorts in Phu Quoc, Ninh Binh, and Son La with secluded villas, restorative wellness rituals, and curated activities for couples or families. Butler service personalises every moment.',
        },
      ],
    },
    moodboard: {
      title: 'Choose the mood you crave',
      filters: [
        'Local gastronomy',
        'Wellness & Spa',
        'Close to nature',
        'Modern design',
        'Family-friendly',
        'Romantic hideaway',
      ],
      description:
        'We pay attention to how you unwind and the memories you wish to create – from forest sanctuaries to skyline lounges buzzing with life.',
    },
    services: {
      title: 'Thoughtful services included',
      items: [
        'Room matching based on sunlight, views, and even preferred direction.',
        'Signature dining reservations, milestone surprises, and tailored celebrations.',
        'Exclusive experiences like sunrise yoga, craft workshops, or private chefs-at-home.',
        'Flexible check-in/out coordination and seamless transport planning.',
      ],
    },
    reviews: {
      title: 'Guests love SEVEN TRAVEL stays',
      intro:
        'Your feedback inspires us to keep curating rare, polished lodging experiences with concierge-level care.',
      ratingNote: 'Average satisfaction score: 5 / 5',
      viewAll: 'See all guest stories',
      photoAlt: 'Happy travellers at a resort',
      items: [
        {
          author: 'olivia_and_james',
          date: 'May 2025',
          content:
            'SEVEN TRAVEL nailed our anniversary trip – private pool villa, sunset dinner, even surprise florals ready on arrival.',
        },
        {
          author: 'le_family',
          date: 'March 2025',
          content:
            'They found us a boutique hotel with adjoining rooms, babysitting, and fun workshops for the kids. Stress-free!',
        },
        {
          author: 'marco_digitalnomad',
          date: 'January 2025',
          content:
            'Loved the concierge touch: coworking access, airport transfers, and foodie reservations all handled seamlessly.',
        },
        {
          author: 'kevin_and_ana',
          date: 'December 2024',
          content:
            'Their curated homestay in Sa Pa was authentic and warm. Hosts taught us to cook and shared beautiful stories.',
        },
      ],
    },
  },
};

function Stay() {
  const { language } = useLanguage();
  const { currentUser, bookProduct } = useAuth();
  const copy = STAY_CONTENT[language];
  const stays = useMemo(() => STAY_CATALOG, []);
  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(language === 'vi' ? 'vi-VN' : 'en-US', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
      }),
    [language]
  );
  const [filters, setFilters] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    type: 'any',
  });
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState([]);
  const [stayBookingFeedback, setStayBookingFeedback] = useState({});
  const [roomSelections, setRoomSelections] = useState({});
  const optionsToRender = submitted ? results : stays;
  const reviewSlides = useMemo(() => copy.reviews.items, [copy.reviews.items]);
  const [activeReview, setActiveReview] = useState(0);
  const sliderRef = useRef(null);

  const getRooms = (stayId) => {
    const value = Number(roomSelections[stayId]);
    if (Number.isFinite(value) && value >= 1) {
      return Math.floor(value);
    }
    return 1;
  };

  const handleRoomChange = (stayId, value) => {
    const numeric = Math.floor(Number(value));
    const clamped = Number.isFinite(numeric) && numeric > 0 ? numeric : 1;
    setRoomSelections((prev) => ({ ...prev, [stayId]: clamped }));
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const normalizedDestination = filters.destination.trim().toLowerCase();
    const catalog = stays;
    const filtered = catalog.filter((option) => {
      const matchesDestination = normalizedDestination
        ? option.destination.toLowerCase() === normalizedDestination
        : true;
      const matchesType = filters.type === 'any' ? true : option.type === filters.type;
      return matchesDestination && matchesType;
    });
    setResults(filtered);
    setRoomSelections({});
    setSubmitted(true);

    window.requestAnimationFrame(() => {
      const target = document.getElementById('stay-results');
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const formattedCheckIn = useMemo(() => {
    if (!filters.checkIn) return '';
    try {
      return new Date(filters.checkIn).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US');
    } catch (error) {
      return filters.checkIn;
    }
  }, [filters.checkIn, language]);

  const formattedCheckOut = useMemo(() => {
    if (!filters.checkOut) return '';
    try {
      return new Date(filters.checkOut).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US');
    } catch (error) {
      return filters.checkOut;
    }
  }, [filters.checkOut, language]);

  const destinationOptions = useMemo(() => FIXED_DESTINATIONS, []);
  const bookingMessages = BOOKING_MESSAGES[language] ?? BOOKING_MESSAGES.vi;
  const pendingLabel = language === 'vi' ? 'Đang xử lý...' : 'Processing...';
  const missingDatesMessage =
    language === 'vi'
      ? 'Vui lòng chọn ngày check-in và check-out trước khi đặt phòng.'
      : 'Please select both check-in and check-out dates before booking.';

  const getStayNights = () => {
    if (!filters.checkIn || !filters.checkOut) return null;
    try {
      const start = new Date(filters.checkIn);
      const end = new Date(filters.checkOut);
      const diffMs = end - start;
      if (!Number.isFinite(diffMs) || diffMs <= 0) return 1;
      return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    } catch (error) {
      return 1;
    }
  };

  const handleBookStay = async (stay, rooms = 1) => {
    if (!currentUser) {
      setStayBookingFeedback((prev) => ({
        ...prev,
        [stay.id]: { status: 'error', message: bookingMessages.loginRequired },
      }));
      return;
    }

    if (currentUser.role !== 'customer') {
      setStayBookingFeedback((prev) => ({
        ...prev,
        [stay.id]: { status: 'error', message: bookingMessages.roleNotAllowed },
      }));
      return;
    }

    if (!filters.checkIn || !filters.checkOut) {
      setStayBookingFeedback((prev) => ({
        ...prev,
        [stay.id]: { status: 'error', message: missingDatesMessage },
      }));
      return;
    }

    const nights = Math.max(1, getStayNights() ?? 1);
    const roomCount = Math.max(1, Number.isFinite(Number(rooms)) ? Math.floor(Number(rooms)) : 1);
    const totalAmount = nights * roomCount * Number(stay.price ?? 0);

    setStayBookingFeedback((prev) => ({
      ...prev,
      [stay.id]: { status: 'pending', message: bookingMessages.processing },
    }));

    try {
      await bookProduct({
        category: 'stay',
        productId: stay.id,
        amountOverride: totalAmount,
        details: {
          source: 'stay',
          checkIn: filters.checkIn,
          checkOut: filters.checkOut,
          nights,
          rooms: roomCount,
        },
      });
      setRoomSelections((prev) => ({ ...prev, [stay.id]: 1 }));
      setStayBookingFeedback((prev) => ({
        ...prev,
        [stay.id]: {
          status: 'success',
          message:
            language === 'vi'
              ? `Đã đặt ${roomCount} phòng · ${nights} đêm · ${currencyFormatter.format(totalAmount)}.`
              : `Booked ${roomCount} room(s) · ${nights} night(s) · ${currencyFormatter.format(totalAmount)}.`,
        },
      }));
    } catch (error) {
      const derivedMessage = mapBookingErrorMessage(language, error.message);
      setStayBookingFeedback((prev) => ({
        ...prev,
        [stay.id]: {
          status: 'error',
          message: derivedMessage || bookingMessages.genericError,
        },
      }));
    }
  };
  const clampReviewIndex = (index) => {
    if (reviewSlides.length === 0) return 0;
    if (index < 0) return reviewSlides.length - 1;
    if (index >= reviewSlides.length) return 0;
    return index;
  };

  const goToReview = (index) => {
    setActiveReview(clampReviewIndex(index));
  };

  const handleNextReview = () => goToReview(activeReview + 1);

  useEffect(() => {
    const track = sliderRef.current;
    if (!track || reviewSlides.length === 0) return;
    const firstCard = track.children[0];
    if (!firstCard) return;
    const cardWidth = firstCard.offsetWidth;
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap || '0');
    const offset = activeReview * (cardWidth + gap);
    track.scrollTo({ left: offset, behavior: 'smooth' });
  }, [activeReview, reviewSlides.length]);

  useEffect(() => {
    if (reviewSlides.length === 0) return undefined;
    const interval = setInterval(() => {
      setActiveReview((prev) => clampReviewIndex(prev + 1));
    }, 8000);
    return () => clearInterval(interval);
  }, [reviewSlides.length]);

  useEffect(() => {
    if (reviewSlides.length > 0) {
      setActiveReview(0);
    }
  }, [reviewSlides]);

  return (
    <div className="stay-page">
      <section className="stay-hero">
        <div className="stay-hero__badge">{copy.hero.badge}</div>
        <h1>{copy.hero.title}</h1>
        <p>{copy.hero.subtitle}</p>
      </section>

      <section className="stay-search">
        <div className="stay-search__card">
          <header className="stay-search__header">
            <h2>{copy.search.title}</h2>
            <p>{copy.search.description}</p>
          </header>
          <form className="stay-search__form" onSubmit={handleSearch}>
            <div className="stay-search__grid">
              <label className="stay-search__field">
                <span>{copy.search.destinationLabel}</span>
                <select
                  name="destination"
                  value={filters.destination}
                  onChange={handleFieldChange}
                  required
                >
                  <option value="">{copy.search.destinationPlaceholder}</option>
                  {destinationOptions.map((destination) => (
                    <option key={destination} value={destination}>
                      {destination}
                    </option>
                  ))}
                </select>
              </label>
              <label className="stay-search__field">
                <span>{copy.search.checkInLabel}</span>
                <input
                  type="date"
                  name="checkIn"
                  value={filters.checkIn}
                  onChange={handleFieldChange}
                  required
                />
              </label>
              <label className="stay-search__field">
                <span>{copy.search.checkOutLabel}</span>
                <input
                  type="date"
                  name="checkOut"
                  value={filters.checkOut}
                  onChange={handleFieldChange}
                  required
                />
              </label>
              <label className="stay-search__field">
                <span>{copy.search.typeLabel}</span>
                <select name="type" value={filters.type} onChange={handleFieldChange}>
                  <option value="any">{copy.search.typeOptions.any}</option>
                  <option value="hotel">{copy.search.typeOptions.hotel}</option>
                  <option value="homestay">{copy.search.typeOptions.homestay}</option>
                </select>
              </label>
            </div>
            <div className="stay-search__actions">
              <button type="submit" className="stay-search__submit">
                <i className="fa-solid fa-wand-magic-sparkles" aria-hidden="true" /> {copy.search.submit}
              </button>
              <p className="stay-search__hint">
                {language === 'vi'
                  ? 'Tất cả gợi ý đã được SEVEN TRAVEL kiểm chứng thực tế về dịch vụ, vệ sinh và không gian.'
                  : 'Every stay has been hand-checked by SEVEN TRAVEL for service, hygiene, and ambience.'}
              </p>
            </div>
          </form>
        </div>
      </section>

      {submitted ? (
        <section className="stay-results" id="stay-results">
          <div className="stay-results__heading">
            <div>
              <h2>{copy.search.resultsTitle(optionsToRender.length)}</h2>
              {filters.destination ? <p>{filters.destination}</p> : null}
            </div>
            {copy.search.dateBadge(formattedCheckIn, formattedCheckOut) ? (
              <span className="stay-results__date-badge">
                {copy.search.dateBadge(formattedCheckIn, formattedCheckOut)}
              </span>
            ) : null}
          </div>
          {optionsToRender.length > 0 ? (
            <div className="stay-results__grid">
              {optionsToRender.map((stay) => {
                const [heroImage, ...galleryImages] = stay.images;
                const previewImages = galleryImages.slice(0, 3);
                const propertyLabel =
                  stay.type === 'hotel' ? copy.search.typeOptions.hotel : copy.search.typeOptions.homestay;
                const rooms = getRooms(stay.id);
                const nights = Math.max(1, getStayNights() ?? 1);
                const estimatedTotal = stay.price * rooms * nights;

                return (
                  <article key={stay.id} className="stay-card">
                    <div
                      className={`stay-card__visual${heroImage ? ' has-image' : ''}`}
                      style={heroImage ? { backgroundImage: `url(${heroImage})` } : undefined}
                    >
                      <div className="stay-card__visual-overlay" />
                      <div className="stay-card__visual-content">
                        <span className="stay-card__badge">
                          <i className="fa-solid fa-hotel" aria-hidden="true" /> {propertyLabel}
                        </span>
                        <span className="stay-card__badge">
                          <i className="fa-solid fa-location-dot" aria-hidden="true" /> {stay.destination}
                        </span>
                        <span className="stay-card__price-pill">
                          <i className="fa-solid fa-tag" aria-hidden="true" />{' '}
                          {currencyFormatter.format(stay.price)}{' '}
                          <small>{language === 'vi' ? '/ đêm' : '/ night'}</small>
                        </span>
                      </div>
                      {previewImages.length > 0 ? (
                        <div className="stay-card__thumbnails" role="list">
                          {previewImages.map((image, index) => (
                            <div className="stay-card__thumbnail" role="listitem" key={`${stay.id}-thumb-${index}`}>
                              <img src={image} alt={`${stay.name} preview ${index + 2}`} />
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <div className="stay-card__body">
                      <div className="stay-card__body-header">
                        <h3>{stay.name}</h3>
                        <span className="stay-card__body-pill">
                          <i className="fa-solid fa-calendar-check" aria-hidden="true" />{' '}
                          {copy.search.dateBadge(formattedCheckIn, formattedCheckOut) ||
                            (language === 'vi' ? 'Linh hoạt' : 'Flexible')}
                        </span>
                      </div>
                      <p className="stay-card__summary">{stay.summary}</p>
                      <p className="stay-card__description">{stay.description}</p>
                      <div className="stay-card__controls">
                        <label className="stay-card__rooms">
                          <span>{language === 'vi' ? 'Số phòng' : 'Rooms'}</span>
                          <input
                            type="number"
                            min="1"
                            value={rooms}
                            onChange={(event) => handleRoomChange(stay.id, event.target.value)}
                          />
                        </label>
                        <div className="stay-card__total">
                          <span>{language === 'vi' ? 'Tạm tính' : 'Estimated total'}</span>
                          <strong>{currencyFormatter.format(estimatedTotal)}</strong>
                        </div>
                      </div>
                    </div>
                    <div className="stay-card__footer">
                      <button
                        type="button"
                        className="stay-card__cta"
                        onClick={() => handleBookStay(stay, rooms)}
                        disabled={stayBookingFeedback[stay.id]?.status === 'pending'}
                      >
                        <i className="fa-solid fa-comment-dots" aria-hidden="true" />{' '}
                        {stayBookingFeedback[stay.id]?.status === 'pending' ? pendingLabel : copy.search.bookNow}
                      </button>
                    </div>
                    {stayBookingFeedback[stay.id]?.message ? (
                      <p className={`stay-card__status ${stayBookingFeedback[stay.id].status}`} aria-live="polite">
                        {stayBookingFeedback[stay.id].message}
                      </p>
                    ) : null}
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="stay-results__empty">
              <h3>{copy.search.emptyTitle}</h3>
              <p>{copy.search.emptyBody}</p>
            </div>
          )}
        </section>
      ) : null}

      <section className="stay-collections">
        <div className="section-heading">
          <h2>{copy.collections.title}</h2>
          <p>
            {language === 'vi'
              ? 'Mỗi lựa chọn đều trải qua quy trình kiểm định thực tế bởi SEVEN TRAVEL để đảm bảo vệ sinh, dịch vụ và bầu không khí đúng như kỳ vọng.'
              : 'Every property is personally inspected by SEVEN TRAVEL to guarantee hygiene, service standards, and the ambience you envision.'}
          </p>
        </div>
        <div className="stay-collections__grid">
          {copy.collections.cards.map((card) => (
            <Link key={card.slug} to={`/luu-tru/${card.slug}`} className="stay-collection-card">
              <div className="stay-collection-card__media">
                <img src={card.image} alt={card.title} loading="lazy" />
                {card.tag ? <span className="stay-collection-card__tag">{card.tag}</span> : null}
              </div>
              <div className="stay-collection-card__content">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="stay-moodboard">
        <div className="moodboard-panel">
          <h2>{copy.moodboard.title}</h2>
          <p>{copy.moodboard.description}</p>
          <div className="moodboard-filters">
            {copy.moodboard.filters.map((filter) => (
              <span key={filter} className="filter-chip">
                {filter}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="stay-services">
        <div className="services-card">
          <h2>{copy.services.title}</h2>
          <ul>
            {copy.services.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="review-section" aria-labelledby="stay-reviews-heading">
        <div className="review-wrapper">
          <div className="review-content">
            <h4 id="stay-reviews-heading">{copy.reviews.title}</h4>
            <p>{copy.reviews.intro}</p>
            <div className="review-slider">
              <div className="review-track" ref={sliderRef}>
                {reviewSlides.map((item) => (
                  <div className="review-card" key={`${item.author}-${item.date}`}>
                    <div className="review-header">
                      <div className="review-meta">
                        <span className="review-author">{item.author}</span>
                        <span className="review-date">{item.date}</span>
                      </div>
                      <div className="review-stars">★★★★★</div>
                    </div>
                    <p className="review-text">{item.content}</p>
                    <div className="review-footer">
                      <span>{copy.reviews.ratingNote}</span>
                      <a href="#reviews">{copy.reviews.viewAll}</a>
                    </div>
                  </div>
                ))}
              </div>
              <div className="review-nav">
                <button
                  type="button"
                  className="prev"
                  onClick={() => goToReview(activeReview - 1)}
                  aria-label={language === 'vi' ? 'Đánh giá trước' : 'Previous review'}
                >
                  <i className="fa-solid fa-chevron-left" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="next"
                  onClick={handleNextReview}
                  aria-label={language === 'vi' ? 'Đánh giá tiếp' : 'Next review'}
                >
                  <i className="fa-solid fa-chevron-right" aria-hidden="true" />
                </button>
              </div>
              <div className="review-dots">
                {reviewSlides.map((_, index) => (
                  <button
                    type="button"
                    key={`stay-review-dot-${index}`}
                    className={index === activeReview ? 'active' : undefined}
                    aria-label={`${language === 'vi' ? 'Đánh giá' : 'Review'} ${index + 1}`}
                    onClick={() => goToReview(index)}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="review-photo">
            <img src="/anh/luutru/banner-1.jpg" alt={copy.reviews.photoAlt} />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Stay;
