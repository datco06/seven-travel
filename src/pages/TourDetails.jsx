import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../styles/tourExplorer.css';
import '../styles/tourDetails.css';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { TOUR_EXPLORER_COPY } from '../components/TourExplorer.jsx';
import { BOOKING_MESSAGES, mapBookingErrorMessage } from '../constants/bookingMessages.js';
import { fetchReviewsForProduct, createReviewRecord } from '../services/reviewService.js';

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

const REVIEW_COPY = {
  vi: {
    sectionTitle: 'Đánh giá khách hàng',
    averageLabel: 'Điểm trung bình',
    reviewsCount: (count) => `${count} đánh giá`,
    shareCta: 'Viết đánh giá',
    nameLabel: 'Tên của bạn',
    ratingLabel: 'Chọn số sao',
    messageLabel: 'Cảm nhận của bạn',
    submit: 'Gửi đánh giá',
    success: 'Cảm ơn bạn! Đánh giá của bạn đã được ghi nhận.',
    placeholderName: 'Nguyễn Văn A',
    placeholderMessage: 'Chia sẻ trải nghiệm của bạn cùng SEVEN TRAVEL...',
    showMore: 'Xem thêm đánh giá',
    empty: 'Hãy là người đầu tiên chia sẻ cảm nhận về hành trình này.',
  },
  en: {
    sectionTitle: 'Guest reviews',
    averageLabel: 'Average rating',
    reviewsCount: (count) => `${count} reviews`,
    shareCta: 'Share a review',
    nameLabel: 'Your name',
    ratingLabel: 'Star rating',
    messageLabel: 'Your thoughts',
    submit: 'Submit review',
    success: 'Thank you! Your review has been recorded.',
    placeholderName: 'Alex Nguyen',
    placeholderMessage: 'Tell us about your journey with SEVEN TRAVEL...',
    showMore: 'Show more reviews',
    empty: 'Be the first to share your experience for this itinerary.',
  },
};

const ANONYMOUS_REVIEWER = {
  vi: 'Khách hàng ẩn danh',
  en: 'Anonymous traveler',
};

const normaliseReviewKey = (value) =>
  value
    ? value
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
    : '';

const TOUR_REVIEWS = {
  vi: {
    'ha-noi-dau-an-ngan-nam-van-hien': {
      average: 4.8,
      total: 4,
      reviews: [
        {
          id: 'rv-1',
          author: 'Hồng Ánh',
          rating: 5,
          content: 'Lịch trình gọn gàng, hướng dẫn viên nhiệt tình và kể nhiều câu chuyện thú vị.',
          timestamp: '15 Tháng 10, 2025 • 19:45',
        },
        {
          id: 'rv-2',
          author: 'Trọng Nghĩa',
          rating: 4,
          content: 'Gia đình mình rất hài lòng, xe đưa đón đúng giờ, món ăn ngon.',
          timestamp: '10 Tháng 10, 2025 • 08:10',
        },
        {
          id: 'rv-3',
          author: 'Minh Anh',
          rating: 5,
          content: 'Được trải nghiệm văn hóa Hà Nội đúng chất, cảm giác như có người bạn địa phương đồng hành.',
          timestamp: '03 Tháng 10, 2025 • 21:05',
        },
        {
          id: 'rv-4',
          author: 'Lan Phương',
          rating: 5,
          content: 'Các điểm tham quan sắp xếp hợp lý, mỗi nơi đều có thời gian trải nghiệm đủ lâu.',
          timestamp: '25 Tháng 9, 2025 • 14:30',
        },
      ],
    },
    'region:ha-noi': {
      average: 4.7,
      total: 4,
      reviews: [
        {
          id: 'rv-hn-1',
          author: 'Hải Nam',
          rating: 5,
          content: 'Rất nhiều câu chuyện thú vị, gia đình tôi đều hào hứng.',
          timestamp: '18 Tháng 9, 2025 • 17:20',
        },
        {
          id: 'rv-hn-2',
          author: 'Thuỳ Dương',
          rating: 4,
          content: 'Nhịp tour hợp lý, có thời gian khám phá phố cổ và ẩm thực.',
          timestamp: '05 Tháng 9, 2025 • 09:40',
        },
        {
          id: 'rv-hn-3',
          author: 'Quốc Toàn',
          rating: 5,
          content: 'HDV tâm lý, hỗ trợ chu đáo cho đoàn người lớn tuổi.',
          timestamp: '29 Tháng 8, 2025 • 15:05',
        },
        {
          id: 'rv-hn-4',
          author: 'Thùy Trâm',
          rating: 5,
          content: 'Ăn uống phong phú, trải nghiệm văn hoá rất đáng nhớ.',
          timestamp: '16 Tháng 8, 2025 • 20:50',
        },
      ],
    },
    'region:hai-phong': {
      average: 4.6,
      total: 4,
      reviews: [
        {
          id: 'rv-hp-1',
          author: 'Minh Hòa',
          rating: 5,
          content: 'BBQ hải sản cực ngon, lịch trình Cát Bà rất hợp lý.',
          timestamp: '12 Tháng 10, 2025 • 19:05',
        },
        {
          id: 'rv-hp-2',
          author: 'Lan Chi',
          rating: 4,
          content: 'Đồ Sơn và Cát Bà đều chăm chút, khách sạn đẹp.',
          timestamp: '04 Tháng 10, 2025 • 13:30',
        },
        {
          id: 'rv-hp-3',
          author: 'Tùng Phong',
          rating: 4,
          content: 'Có thêm thời gian tự do thì sẽ hoàn hảo hơn.',
          timestamp: '22 Tháng 9, 2025 • 08:55',
        },
        {
          id: 'rv-hp-4',
          author: 'Bích Hạnh',
          rating: 5,
          content: 'Lan Hạ tuyệt đẹp, ekip hỗ trợ tận tình.',
          timestamp: '14 Tháng 9, 2025 • 21:10',
        },
      ],
    },
    'region:ninh-binh': {
      average: 4.9,
      total: 4,
      reviews: [
        {
          id: 'rv-nb-1',
          author: 'Anh Kiệt',
          rating: 5,
          content: 'Tràng An, Tam Cốc đều rất ấn tượng, ảnh đẹp mê ly.',
          timestamp: '20 Tháng 10, 2025 • 10:25',
        },
        {
          id: 'rv-nb-2',
          author: 'Thảo Vy',
          rating: 5,
          content: 'Chuyến đi nhiều hoạt động, HDV kể chuyện dân gian cực hay.',
          timestamp: '08 Tháng 10, 2025 • 18:45',
        },
        {
          id: 'rv-nb-3',
          author: 'Gia Bảo',
          rating: 5,
          content: 'Đi thuyền ngắm hang động thật tuyệt, tổ chức chuyên nghiệp.',
          timestamp: '01 Tháng 10, 2025 • 16:05',
        },
        {
          id: 'rv-nb-4',
          author: 'Thiên An',
          rating: 4,
          content: 'Khách sạn sạch, món dê núi ngon, sẽ giới thiệu bạn bè.',
          timestamp: '18 Tháng 9, 2025 • 11:50',
        },
      ],
    },
    default: {
      average: 4.7,
      total: 4,
      reviews: [
        {
          id: 'rv-def-1',
          author: 'Việt Hùng',
          rating: 5,
          content: 'Dịch vụ chu đáo, lịch trình nhiều trải nghiệm địa phương.',
          timestamp: '10 Tháng 8, 2025 • 09:15',
        },
        {
          id: 'rv-def-2',
          author: 'Nhật Lệ',
          rating: 4,
          content: 'Team hỗ trợ 24/7, chuyến đi rất đáng giá.',
          timestamp: '02 Tháng 8, 2025 • 14:40',
        },
        {
          id: 'rv-def-3',
          author: 'Hoàng Dương',
          rating: 5,
          content: 'Trải nghiệm văn hóa và ẩm thực đặc sắc, rất hài lòng.',
          timestamp: '25 Tháng 7, 2025 • 20:05',
        },
        {
          id: 'rv-def-4',
          author: 'Bảo Ngọc',
          rating: 5,
          content: 'Rất đáng tin cậy, sẽ tiếp tục đồng hành trong chuyến tới.',
          timestamp: '15 Tháng 7, 2025 • 18:30',
        },
      ],
    },
  },
  en: {
    'ha-noi-dau-an-ngan-nam-van-hien': {
      average: 4.8,
      total: 4,
      reviews: [
        {
          id: 'rv-1',
          author: 'Hong Anh',
          rating: 5,
          content: 'Thoughtfully curated itinerary with passionate storytelling from the local guide.',
          timestamp: 'Oct 15, 2025 • 7:45 PM',
        },
        {
          id: 'rv-2',
          author: 'Trong Nghia',
          rating: 4,
          content: 'Our family loved the journey—punctual transfers and delicious meals throughout.',
          timestamp: 'Oct 10, 2025 • 8:10 AM',
        },
        {
          id: 'rv-3',
          author: 'Minh Anh',
          rating: 5,
          content: 'The tour captured the true spirit of Hanoi. Felt like travelling with a local friend.',
          timestamp: 'Oct 3, 2025 • 9:05 PM',
        },
        {
          id: 'rv-4',
          author: 'Lan Phuong',
          rating: 5,
          content: 'Every stop was well-paced, giving us time to soak in each historic landmark.',
          timestamp: 'Sep 25, 2025 • 2:30 PM',
        },
      ],
    },
    'region:ha-noi': {
      average: 4.7,
      total: 4,
      reviews: [
        {
          id: 'rv-hn-1',
          author: 'Hai Nam',
          rating: 5,
          content: 'Plenty of fascinating stories; our whole family was engaged.',
          timestamp: 'Sep 18, 2025 • 5:20 PM',
        },
        {
          id: 'rv-hn-2',
          author: 'Thuy Duong',
          rating: 4,
          content: 'Balanced pace with time to explore the Old Quarter and food stops.',
          timestamp: 'Sep 5, 2025 • 9:40 AM',
        },
        {
          id: 'rv-hn-3',
          author: 'Quoc Toan',
          rating: 5,
          content: 'Guide was thoughtful and patient with our senior travellers.',
          timestamp: 'Aug 29, 2025 • 3:05 PM',
        },
        {
          id: 'rv-hn-4',
          author: 'Thuy Tram',
          rating: 5,
          content: 'Great food choices and memorable cultural moments.',
          timestamp: 'Aug 16, 2025 • 8:50 PM',
        },
      ],
    },
    'region:hai-phong': {
      average: 4.6,
      total: 4,
      reviews: [
        {
          id: 'rv-hp-1',
          author: 'Minh Hoa',
          rating: 5,
          content: 'Seafood BBQ was amazing and Cat Ba itinerary flowed nicely.',
          timestamp: 'Oct 12, 2025 • 7:05 PM',
        },
        {
          id: 'rv-hp-2',
          author: 'Lan Chi',
          rating: 4,
          content: 'Do Son and Cat Ba were well arranged, hotels were comfortable.',
          timestamp: 'Oct 4, 2025 • 1:30 PM',
        },
        {
          id: 'rv-hp-3',
          author: 'Tung Phong',
          rating: 4,
          content: 'Would love a bit more free time, otherwise fantastic.',
          timestamp: 'Sep 22, 2025 • 8:55 AM',
        },
        {
          id: 'rv-hp-4',
          author: 'Bich Hanh',
          rating: 5,
          content: 'Lan Ha Bay scenery was stunning and the crew very attentive.',
          timestamp: 'Sep 14, 2025 • 9:10 PM',
        },
      ],
    },
    'region:ninh-binh': {
      average: 4.9,
      total: 4,
      reviews: [
        {
          id: 'rv-nb-1',
          author: 'Anh Kiet',
          rating: 5,
          content: 'Trang An and Tam Coc were breathtaking; photos turned out great.',
          timestamp: 'Oct 20, 2025 • 10:25 AM',
        },
        {
          id: 'rv-nb-2',
          author: 'Thao Vy',
          rating: 5,
          content: 'Plenty of activities plus storytelling about local legends.',
          timestamp: 'Oct 8, 2025 • 6:45 PM',
        },
        {
          id: 'rv-nb-3',
          author: 'Gia Bao',
          rating: 5,
          content: 'Boat trip through the caves was magical, very well organised.',
          timestamp: 'Oct 1, 2025 • 4:05 PM',
        },
        {
          id: 'rv-nb-4',
          author: 'Thien An',
          rating: 4,
          content: 'Clean hotel, delicious goat dishes; will recommend to friends.',
          timestamp: 'Sep 18, 2025 • 11:50 AM',
        },
      ],
    },
    default: {
      average: 4.7,
      total: 4,
      reviews: [
        {
          id: 'rv-def-1',
          author: 'Viet Hung',
          rating: 5,
          content: 'Thoughtful service with lots of authentic local experiences.',
          timestamp: 'Aug 10, 2025 • 9:15 AM',
        },
        {
          id: 'rv-def-2',
          author: 'Nhat Le',
          rating: 4,
          content: 'Support team was responsive day and night; great value.',
          timestamp: 'Aug 2, 2025 • 2:40 PM',
        },
        {
          id: 'rv-def-3',
          author: 'Hoang Duong',
          rating: 5,
          content: 'Loved the cultural and culinary highlights throughout.',
          timestamp: 'Jul 25, 2025 • 8:05 PM',
        },
        {
          id: 'rv-def-4',
          author: 'Bao Ngoc',
          rating: 5,
          content: 'Highly trustworthy — we will travel with them again soon.',
          timestamp: 'Jul 15, 2025 • 6:30 PM',
        },
      ],
    },
  },
};

function sanitizeReviewText(value) {
  if (typeof value !== 'string') {
    return '';
  }
  const trimmed = value.trim();
  return trimmed.length ? trimmed : '';
}

function normaliseStaticReview(review, anonymousLabel) {
  const ratingValue = Number(review?.rating);
  const safeRating = Number.isFinite(ratingValue) ? Math.min(Math.max(ratingValue, 0), 5) : 0;
  return {
    id: review?.id ?? `static-${Math.random().toString(36).slice(2, 10)}`,
    author: sanitizeReviewText(review?.author) || anonymousLabel,
    rating: safeRating,
    content: sanitizeReviewText(review?.content),
    timestamp: sanitizeReviewText(review?.timestamp),
    createdAt: review?.createdAt ?? null,
    source: 'static',
  };
}

function normaliseSupabaseReview(record, formatTimestamp, anonymousLabel) {
  if (!record) {
    return null;
  }
  const ratingValue = Number(record?.rating);
  const safeRating = Number.isFinite(ratingValue) ? Math.min(Math.max(ratingValue, 1), 5) : 0;
  const createdAt = record?.created_at ?? record?.createdAt ?? null;
  let formattedTimestamp = '';
  if (createdAt) {
    formattedTimestamp = formatTimestamp(createdAt);
  }
  if (!formattedTimestamp) {
    formattedTimestamp = formatTimestamp(new Date().toISOString());
  }
  const author =
    sanitizeReviewText(record?.author_name) ||
    sanitizeReviewText(record?.author) ||
    sanitizeReviewText(record?.display_name) ||
    anonymousLabel;
  return {
    id: record?.id ?? `remote-${Math.random().toString(36).slice(2, 10)}`,
    author,
    rating: safeRating,
    content: sanitizeReviewText(record?.comment),
    timestamp: formattedTimestamp,
    createdAt,
    source: 'remote',
  };
}

function buildReviewData({ staticReviews, remoteReviews, formatTimestamp, anonymousLabel }) {
  const mergedRemote =
    remoteReviews?.map((review) => normaliseSupabaseReview(review, formatTimestamp, anonymousLabel)).filter(Boolean) ??
    [];
  const mergedStatic =
    staticReviews?.map((review) => normaliseStaticReview(review, anonymousLabel)).filter(Boolean) ?? [];
  const combined = [...mergedRemote, ...mergedStatic];
  const total = combined.length;
  const average =
    total > 0
      ? combined.reduce((sum, review) => sum + (Number.isFinite(review.rating) ? review.rating : 0), 0) / total
      : 0;
  return {
    average,
    total,
    reviews: combined,
  };
}

function TourDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { tours, currentUser, supabaseUser, bookProduct, recordTourView } = useAuth();
  const { language } = useLanguage();

  const copy = TOUR_EXPLORER_COPY[language];
  const pageCopy = PAGE_COPY[language];
  const bookingMessages = BOOKING_MESSAGES[language] ?? BOOKING_MESSAGES.vi;
  const [guestCounts, setGuestCounts] = useState({ adults: 2, children: 0 });
  const [bookingStatus, setBookingStatus] = useState({ state: null, message: '' });
  const [reviewForm, setReviewForm] = useState({ name: '', rating: '5', message: '' });
  const [reviewFeedback, setReviewFeedback] = useState({ type: null, message: '' });
  const [remoteReviews, setRemoteReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const redirectTimerRef = useRef(null);

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
  const totalGuests = guestCounts.adults + guestCounts.children;

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

  useEffect(() => {
    if (!tour?.id) {
      return;
    }
    recordTourView(tour.id);
  }, [tour?.id, recordTourView]);

  useEffect(() => () => {
    if (redirectTimerRef.current) {
      clearTimeout(redirectTimerRef.current);
      redirectTimerRef.current = null;
    }
  }, []);

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
      }),
    []
  );

  const handleBookTour = async () => {
    if (!currentUser) {
      setBookingStatus({ state: 'error', message: bookingMessages.loginRequired });
      return;
    }

    if (currentUser.role !== 'customer') {
      setBookingStatus({ state: 'error', message: bookingMessages.roleNotAllowed });
      return;
    }

    if (totalGuests <= 0 || totalPrice <= 0) {
      setBookingStatus({
        state: 'error',
        message:
          language === 'vi'
            ? 'Hãy nhập số lượng khách hợp lệ trước khi đặt.'
            : 'Please enter a valid guest count before booking.',
      });
      return;
    }

    if (redirectTimerRef.current) {
      clearTimeout(redirectTimerRef.current);
      redirectTimerRef.current = null;
    }

    setBookingStatus({ state: 'pending', message: bookingMessages.processing });

    try {
      await bookProduct({
        category: 'tour',
        productId: tour.id,
        amountOverride: totalPrice,
        details: {
          source: 'tour-detail',
          guestCount: totalGuests,
          adults: guestCounts.adults,
          children: guestCounts.children,
          tourName: tour.name,
        },
      });
      setBookingStatus({ state: 'success', message: bookingMessages.success });
      redirectTimerRef.current = setTimeout(() => {
        redirectTimerRef.current = null;
        navigate('/tai-khoan');
      }, 1500);
    } catch (error) {
      const derived = mapBookingErrorMessage(language, error.message);
      setBookingStatus({ state: 'error', message: derived });
    }
  };

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
  const reviewCopy = REVIEW_COPY[language] ?? REVIEW_COPY.vi;
  const baseReviewData = useMemo(() => {
    const library = TOUR_REVIEWS[language] ?? null;
    if (!library) {
      return { average: 0, total: 0, reviews: [] };
    }
    if (!tour) {
      return library.default ?? { average: 0, total: 0, reviews: [] };
    }
    const slugMatch = tour.slug ? library[tour.slug] : null;
    if (slugMatch) {
      return slugMatch;
    }
    const idMatch = tour.id ? library[tour.id] : null;
    if (idMatch) {
      return idMatch;
    }
    const regionMatch =
      (tour.regions ?? [])
        .map((region) => library[`region:${normaliseReviewKey(region)}`])
        .find(Boolean) ?? null;
    if (regionMatch) {
      return regionMatch;
    }
    return library.default ?? { average: 0, total: 0, reviews: [] };
  }, [language, tour]);
  const anonymousLabel = ANONYMOUS_REVIEWER[language] ?? ANONYMOUS_REVIEWER.vi;
  const formatTimestamp = useCallback(
    (value) => {
      if (!value) {
        return '';
      }
      try {
        return new Intl.DateTimeFormat(language === 'vi' ? 'vi-VN' : 'en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }).format(new Date(value));
      } catch {
        return value;
      }
    },
    [language]
  );
  const reviewData = useMemo(
    () =>
      buildReviewData({
        staticReviews: baseReviewData?.reviews ?? [],
        remoteReviews,
        formatTimestamp,
        anonymousLabel,
      }),
    [anonymousLabel, baseReviewData?.reviews, formatTimestamp, remoteReviews]
  );
  const reviewErrorMessage = useMemo(() => {
    if (!reviewsError) {
      return '';
    }
    if (typeof reviewsError?.message === 'string' && reviewsError.message.trim()) {
      return reviewsError.message;
    }
    return language === 'vi'
      ? 'Không thể tải danh sách đánh giá. Vui lòng thử lại sau.'
      : 'Unable to load reviews right now. Please try again later.';
  }, [language, reviewsError]);
  const INITIAL_VISIBLE_REVIEWS = 4;
  const [visibleReviewCount, setVisibleReviewCount] = useState(INITIAL_VISIBLE_REVIEWS);

  useEffect(() => {
    if (!tour?.id) {
      setRemoteReviews([]);
      return;
    }
    let isActive = true;
    setReviewsLoading(true);
    setReviewsError(null);

    fetchReviewsForProduct({ productType: 'tour', productId: tour.id })
      .then((data) => {
        if (!isActive) return;
        setRemoteReviews(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        if (!isActive) return;
        setReviewsError(error instanceof Error ? error : new Error(String(error)));
      })
      .finally(() => {
        if (!isActive) return;
        setReviewsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [tour?.id]);

  useEffect(() => {
    setVisibleReviewCount((prev) => {
      const total = reviewData.reviews.length;
      if (total === 0) return INITIAL_VISIBLE_REVIEWS;
      if (total <= INITIAL_VISIBLE_REVIEWS) return total;
      const safePrev = Math.max(prev, INITIAL_VISIBLE_REVIEWS);
      return Math.min(safePrev, total);
    });
  }, [reviewData]);

  const renderStars = (value) => {
    const rounded = Math.round(value);
    return (
      <span className="tour-review__stars" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, index) => (
          <i
            key={`${tour.id}-avg-star-${index}`}
            className={`fa-solid fa-star ${index < rounded ? 'filled' : ''}`}
          />
        ))}
      </span>
    );
  };

  const handleReviewFieldChange = (event) => {
    const { name, value } = event.target;
    setReviewForm((prev) => ({ ...prev, [name]: value }));
    if (reviewFeedback.type) {
      setReviewFeedback({ type: null, message: '' });
    }
  };

  const handleSubmitReview = async (event) => {
    event.preventDefault();
    if (isSubmittingReview) {
      return;
    }
    if (!reviewForm.name.trim() || !reviewForm.message.trim()) {
      setReviewFeedback({
        type: 'error',
        message:
          language === 'vi'
            ? 'Vui lòng điền đầy đủ tên và cảm nhận trước khi gửi.'
            : 'Please provide your name and thoughts before submitting.',
      });
      return;
    }
    if (!tour?.id) {
      setReviewFeedback({
        type: 'error',
        message:
          language === 'vi'
            ? 'Không xác định được tour để lưu đánh giá.'
            : 'We could not determine which tour to attach this review to.',
      });
      return;
    }
    const currentRating = reviewForm.rating;
    const numericRating = Number.parseInt(currentRating, 10) || 5;
    setIsSubmittingReview(true);
    setReviewFeedback({ type: null, message: '' });
    try {
      const record = await createReviewRecord({
        productType: 'tour',
        productId: tour.id,
        rating: numericRating,
        comment: reviewForm.message.trim(),
        authorName: reviewForm.name.trim(),
        userId: supabaseUser?.id ?? null,
      });
      setRemoteReviews((prev) => [record, ...prev]);
      setReviewFeedback({ type: 'success', message: reviewCopy.success });
      setReviewForm({ name: '', rating: currentRating, message: '' });
    } catch (error) {
      const fallback =
        language === 'vi'
          ? 'Không thể gửi đánh giá. Vui lòng thử lại sau.'
          : 'Unable to submit the review. Please try again later.';
      const message = error instanceof Error ? error.message || fallback : fallback;
      setReviewFeedback({ type: 'error', message });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleShowMoreReviews = () => {
    setVisibleReviewCount((prev) =>
      Math.min(prev + INITIAL_VISIBLE_REVIEWS, reviewData.reviews.length)
    );
  };

  const ratingBreakdown = useMemo(() => {
    const reviews = reviewData?.reviews ?? [];
    const base = [5, 4, 3, 2, 1].map((rating) => ({ rating, count: 0, percentage: 0 }));
    if (!reviews.length) {
      return base;
    }
    const counted = base.map((item) => {
      const count = reviews.filter((review) => Number(review.rating) === item.rating).length;
      return { ...item, count };
    });
    const total = counted.reduce((sum, item) => sum + item.count, 0);
    return counted.map((item) => ({
      ...item,
      percentage: total > 0 ? Math.round((item.count / total) * 100) : 0,
    }));
  }, [reviewData]);

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
          <div className="tour-detail__cta">
            {bookingStatus.message ? (
              <p className={`tour-detail__status ${bookingStatus.state ?? ''}`}>{bookingStatus.message}</p>
            ) : null}
            <button
              type="button"
              className="tour-detail__book"
              onClick={handleBookTour}
              disabled={bookingStatus.state === 'pending'}
            >
              {bookingStatus.state === 'pending' ? '...' : copy.bookTour}
            </button>
          </div>
        </footer>
      </div>
      {reviewData ? (
        <section className="tour-detail__reviews-block">
          <div className="tour-detail__reviews" aria-labelledby="tour-review-heading">
            <aside className="tour-review__summary-card">
              <h4 id="tour-review-heading">{reviewCopy.sectionTitle}</h4>
              <div className="tour-review__score">
                <span className="tour-review__value">{reviewData.average.toFixed(1)}</span>
                {renderStars(reviewData.average)}
              </div>
              <p className="tour-review__meta">
                <span>{reviewCopy.averageLabel}</span>
                <strong>{reviewCopy.reviewsCount(reviewData.total)}</strong>
              </p>
              <div className="tour-review__breakdown" role="list">
                {ratingBreakdown.map((item) => (
                  <div key={`rating-${item.rating}`} className="tour-review__breakdown-row" role="listitem">
                    <span className="tour-review__breakdown-label">{item.rating}★</span>
                    <div className="tour-review__breakdown-bar" aria-hidden="true">
                      <span style={{ width: `${item.percentage}%` }} />
                    </div>
                    <span className="tour-review__breakdown-value">
                      {item.count} · {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>
              <button type="button" className="tour-review__share">
                <i className="fa-solid fa-pen-to-square" aria-hidden="true" /> {reviewCopy.shareCta}
              </button>
            </aside>

              <div className="tour-review__content">
              <div className="tour-review__feed">
                {reviewsLoading ? (
                  <p className="tour-review__feedback">
                    {language === 'vi' ? 'Đang tải đánh giá...' : 'Loading reviews...'}
                  </p>
                ) : null}
                {reviewErrorMessage ? (
                  <p className="tour-review__feedback error">{reviewErrorMessage}</p>
                ) : null}
                {reviewData.reviews.length ? (
                  reviewData.reviews.slice(0, visibleReviewCount).map((review) => {
                    const initialsSource =
                      typeof review.author === 'string' ? review.author.trim() : '';
                    const avatarInitial = initialsSource ? initialsSource.charAt(0).toUpperCase() : '★';
                    return (
                      <article key={review.id} className="tour-review__card">
                        <div className="tour-review__card-header">
                          <div className="tour-review__avatar" aria-hidden="true">
                            {avatarInitial}
                          </div>
                          <div className="tour-review__identity">
                            <strong>{review.author}</strong>
                            <span className="tour-review__card-stars">
                              {Array.from({ length: 5 }).map((_, index) => (
                                <i
                                  key={`${review.id}-star-${index}`}
                                  className={`fa-solid fa-star ${index < review.rating ? 'filled' : ''}`}
                                />
                              ))}
                            </span>
                          </div>
                          <time>{review.timestamp}</time>
                        </div>
                        <p className="tour-review__text">{review.content}</p>
                      </article>
                    );
                  })
                ) : !reviewsLoading ? (
                  <p className="tour-review__empty">{reviewCopy.empty}</p>
                ) : null}
                {reviewData.reviews.length > visibleReviewCount ? (
                  <button type="button" className="tour-review__more" onClick={handleShowMoreReviews}>
                    {reviewCopy.showMore}
                  </button>
                ) : null}
              </div>

              <form className="tour-review__form" onSubmit={handleSubmitReview}>
                <div className="tour-review__form-header">
                  <h5>{reviewCopy.shareCta}</h5>
                </div>
                <label>
                  <span>{reviewCopy.nameLabel}</span>
                  <input
                    type="text"
                    name="name"
                    value={reviewForm.name}
                    onChange={handleReviewFieldChange}
                    placeholder={reviewCopy.placeholderName}
                  />
                </label>
                <label>
                  <span>{reviewCopy.ratingLabel}</span>
                  <select name="rating" value={reviewForm.rating} onChange={handleReviewFieldChange}>
                    <option value="5">5 ⭐</option>
                    <option value="4">4 ⭐</option>
                    <option value="3">3 ⭐</option>
                    <option value="2">2 ⭐</option>
                    <option value="1">1 ⭐</option>
                  </select>
                </label>
                <label>
                  <span>{reviewCopy.messageLabel}</span>
                  <textarea
                    name="message"
                    rows="4"
                    value={reviewForm.message}
                    onChange={handleReviewFieldChange}
                    placeholder={reviewCopy.placeholderMessage}
                  />
                </label>
                {reviewFeedback.message ? (
                  <p className={`tour-review__feedback ${reviewFeedback.type ?? ''}`}>{reviewFeedback.message}</p>
                ) : null}
                <button type="submit" className="tour-review__submit" disabled={isSubmittingReview}>
                  <i className="fa-solid fa-paper-plane" aria-hidden="true" />{' '}
                  {isSubmittingReview ? (language === 'vi' ? 'Đang gửi...' : 'Submitting...') : reviewCopy.submit}
                </button>
              </form>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default TourDetails;
