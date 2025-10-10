import { useMemo, useState } from 'react';
import '../styles/adminTourForm.css';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const COPY = {
  vi: {
    title: 'Thêm tour mới',
    subtitle: 'Nhập thông tin chi tiết để tour xuất hiện ngay trên hệ thống khách hàng.',
    nameLabel: 'Tên tour',
    provinceLabel: 'Tỉnh/Thành phố (ví dụ: Hà Nội)',
    heroLabel: 'Ảnh đại diện (URL)',
    priceLabel: 'Giá tour (VND)',
    daysLabel: 'Số ngày',
    nightsLabel: 'Số đêm',
    summaryLabel: 'Giới thiệu ngắn',
    includesLabel: 'Dịch vụ bao gồm (mỗi dòng một mục)',
    excludesLabel: 'Không bao gồm (mỗi dòng một mục)',
    itineraryLabel: 'Lịch trình từng ngày',
    itineraryAdd: 'Thêm ngày',
    itineraryRemove: 'Xoá',
    itineraryTitle: 'Tiêu đề ngày',
    itineraryDescription: 'Nội dung chi tiết',
    itineraryImage: 'Ảnh cho ngày này (URL)',
    lodgingTitle: 'Trải nghiệm lưu trú',
    lodgingSubtitle: 'Thiết kế nơi nghỉ dưỡng đẳng cấp cho từng đêm trong hành trình.',
    lodgingAdd: 'Thêm lưu trú',
    lodgingRemove: 'Xoá lưu trú',
    lodgingName: 'Tên nơi lưu trú',
    lodgingType: 'Loại hình',
    lodgingNights: 'Số đêm',
    lodgingRating: 'Hạng sao',
    lodgingAmenities: 'Tiện nghi nổi bật',
    lodgingAmenitiesHint: 'Chọn tối đa 4 tiện nghi nổi bật.',
    lodgingNotes: 'Điểm nhấn trải nghiệm / ghi chú',
    lodgingImage: 'Ảnh moodboard (URL)',
    submit: 'Tạo tour',
    success: 'Tour mới đã sẵn sàng! Khách hàng có thể tìm thấy ngay trong mục gợi ý.',
    errorFallback: 'Không thể tạo tour. Vui lòng kiểm tra lại thông tin.',
    missingPermission: 'Vui lòng đăng nhập bằng tài khoản admin để tạo tour mới.',
  },
  en: {
    title: 'Create a new tour',
    subtitle: 'Fill in the details and the tour becomes instantly visible to customers.',
    nameLabel: 'Tour name',
    provinceLabel: 'Province / City (e.g. Hanoi)',
    heroLabel: 'Hero image (URL)',
    priceLabel: 'Price (VND)',
    daysLabel: 'Days',
    nightsLabel: 'Nights',
    summaryLabel: 'Short introduction',
    includesLabel: 'Included services (one per line)',
    excludesLabel: 'Not included (one per line)',
    itineraryLabel: 'Daily itinerary',
    itineraryAdd: 'Add day',
    itineraryRemove: 'Remove',
    itineraryTitle: 'Day title',
    itineraryDescription: 'Detailed description',
    itineraryImage: 'Image (URL)',
    lodgingTitle: 'Stay highlights',
    lodgingSubtitle: 'Curate a signature lodging experience for every overnight stop.',
    lodgingAdd: 'Add stay',
    lodgingRemove: 'Remove stay',
    lodgingName: 'Property name',
    lodgingType: 'Stay type',
    lodgingNights: 'Nights',
    lodgingRating: 'Star rating',
    lodgingAmenities: 'Key amenities',
    lodgingAmenitiesHint: 'Pick up to 4 highlight amenities.',
    lodgingNotes: 'Experience notes',
    lodgingImage: 'Mood image (URL)',
    submit: 'Create tour',
    success: 'Tour created successfully. Customers can now explore it.',
    errorFallback: 'Unable to create the tour. Please review the fields.',
    missingPermission: 'Please sign in as an admin to create tours.',
  },
};

const DEFAULT_INCLUDES = [
  'Chỗ ở',
  'Chuyến bay nội địa',
  'Hướng dẫn viên địa phương',
  'Bữa ăn theo chương trình',
  'Phương tiện di chuyển',
];

const DEFAULT_EXCLUDES = ['Bảo hiểm du lịch', 'Chi phí cá nhân'];

const LODGING_TYPES = {
  vi: [
    { value: 'resort', label: 'Resort biển' },
    { value: 'boutique', label: 'Khách sạn boutique' },
    { value: 'villa', label: 'Villa riêng tư' },
    { value: 'mountain', label: 'Lodge núi' },
    { value: 'city', label: 'Khách sạn trung tâm' },
  ],
  en: [
    { value: 'resort', label: 'Beach resort' },
    { value: 'boutique', label: 'Boutique hotel' },
    { value: 'villa', label: 'Private villa' },
    { value: 'mountain', label: 'Mountain lodge' },
    { value: 'city', label: 'City hotel' },
  ],
};

const LODGING_AMENITIES = {
  vi: [
    { value: 'breakfast', label: 'Buffet sáng' },
    { value: 'pool', label: 'Hồ bơi vô cực' },
    { value: 'spa', label: 'Spa & wellness' },
    { value: 'airport', label: 'Đưa đón sân bay' },
    { value: 'kids', label: 'Khu vui chơi trẻ em' },
    { value: 'view', label: 'View panorama' },
    { value: 'dining', label: 'Fine dining' },
  ],
  en: [
    { value: 'breakfast', label: 'Breakfast buffet' },
    { value: 'pool', label: 'Infinity pool' },
    { value: 'spa', label: 'Spa & wellness' },
    { value: 'airport', label: 'Airport transfer' },
    { value: 'kids', label: 'Kids club' },
    { value: 'view', label: 'Panoramic view' },
    { value: 'dining', label: 'Fine dining' },
  ],
};

const createLodgingTemplate = () => ({
  name: '',
  type: 'resort',
  nights: '2',
  rating: '5',
  amenities: ['breakfast', 'pool'],
  notes: '',
  image: '',
});

function AdminTourForm() {
  const { currentUser, adminCreateTour } = useAuth();
  const { language } = useLanguage();
  const copy = COPY[language];
  const lodgingTypes = LODGING_TYPES[language];
  const lodgingAmenities = LODGING_AMENITIES[language];

  const [formState, setFormState] = useState({
    name: '',
    province: '',
    heroImage: '',
    price: '',
    days: 10,
    nights: 9,
    summary: '',
    includes: DEFAULT_INCLUDES.join('\n'),
    excludes: DEFAULT_EXCLUDES.join('\n'),
    itinerary: [
      { title: 'Ngày 1 – Chào đón & khám phá', description: '', image: '' },
      { title: 'Ngày 2 – Trải nghiệm địa phương', description: '', image: '' },
    ],
    lodgings: [createLodgingTemplate()],
  });
  const [status, setStatus] = useState({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = currentUser?.role === 'admin';

  const itineraryCount = useMemo(() => formState.itinerary.length, [formState.itinerary]);
  const lodgingCount = useMemo(() => formState.lodgings.length, [formState.lodgings]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleItineraryChange = (index, field, value) => {
    setFormState((prev) => {
      const next = [...prev.itinerary];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, itinerary: next };
    });
  };

  const handleAddDay = () => {
    setFormState((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        { title: `Ngày ${prev.itinerary.length + 1} – Hoạt động mới`, description: '', image: '' },
      ],
    }));
  };

  const handleRemoveDay = (index) => {
    setFormState((prev) => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, idx) => idx !== index),
    }));
  };

  const handleLodgingChange = (index, field, value) => {
    setFormState((prev) => {
      const next = [...prev.lodgings];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, lodgings: next };
    });
  };

  const handleAmenityToggle = (index, amenity) => {
    setFormState((prev) => {
      const next = [...prev.lodgings];
      const currentAmenities = next[index]?.amenities ?? [];
      const hasAmenity = currentAmenities.includes(amenity);
      const updatedAmenities = hasAmenity
        ? currentAmenities.filter((item) => item !== amenity)
        : currentAmenities.length >= 4
          ? currentAmenities
          : [...currentAmenities, amenity];
      next[index] = { ...next[index], amenities: updatedAmenities };
      return { ...prev, lodgings: next };
    });
  };

  const handleAddLodging = () => {
    setFormState((prev) => ({
      ...prev,
      lodgings: [...prev.lodgings, createLodgingTemplate()],
    }));
  };

  const handleRemoveLodging = (index) => {
    setFormState((prev) => ({
      ...prev,
      lodgings: prev.lodgings.filter((_, idx) => idx !== index),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isAdmin) {
      setStatus({ type: 'error', message: copy.missingPermission });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: null, message: '' });

    try {
      const includes = formState.includes
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean)
        .map((label) => ({ label, included: true }));
      const excludes = formState.excludes
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean)
        .map((label) => ({ label, included: false }));

      const itinerary = formState.itinerary
        .map((item, index) => ({
          day: index + 1,
          title: item.title.trim() || `Ngày ${index + 1}`,
          description: item.description.trim(),
          image: item.image.trim(),
        }))
        .filter((item) => item.description || item.image || item.title);

      const lodgings = formState.lodgings
        .map((item, index) => ({
          order: index + 1,
          name: item.name.trim(),
          type: item.type,
          nights: Number.parseInt(item.nights, 10) || 1,
          rating: Number.parseInt(item.rating, 10) || null,
          amenities: Array.isArray(item.amenities)
            ? item.amenities.map((amenity) => amenity.trim()).filter(Boolean)
            : [],
          notes: item.notes.trim(),
          image: item.image.trim(),
        }))
        .filter((item) => item.name || item.notes || item.image);

      const trimmedProvince = formState.province.trim();
      const regions = trimmedProvince ? [trimmedProvince] : [];

      adminCreateTour({
        name: formState.name,
        price: formState.price,
        summary: formState.summary,
        description: formState.summary,
        durationDays: formState.days,
        durationNights: formState.nights,
        heroImage: formState.heroImage,
        regions,
        includes: [...includes, ...excludes],
        itinerary,
        lodgings,
        gallery: formState.heroImage ? [formState.heroImage] : [],
      });

      setStatus({ type: 'success', message: copy.success });
      setFormState((prev) => ({
        ...prev,
        name: '',
        province: '',
        heroImage: '',
        price: '',
        summary: '',
        itinerary: prev.itinerary.map(() => ({ title: '', description: '', image: '' })),
        lodgings: [createLodgingTemplate()],
      }));
    } catch (error) {
      setStatus({ type: 'error', message: error.message || copy.errorFallback });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="admin-tour-form" aria-live="polite">
      <header>
        <h2>{copy.title}</h2>
        <p>{copy.subtitle}</p>
      </header>
      <form onSubmit={handleSubmit}>
        <div className="admin-tour-form__grid">
          <label>
            {copy.nameLabel}
            <input
              type="text"
              name="name"
              value={formState.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            {copy.provinceLabel}
            <input
              type="text"
              name="province"
              value={formState.province}
              onChange={handleChange}
              placeholder={language === 'vi' ? 'Ví dụ: Hà Nội' : 'e.g. Ho Chi Minh City'}
            />
          </label>
          <label>
            {copy.heroLabel}
            <input
              type="url"
              name="heroImage"
              value={formState.heroImage}
              onChange={handleChange}
              placeholder="https://..."
            />
          </label>
          <label>
            {copy.priceLabel}
            <input
              type="number"
              name="price"
              value={formState.price}
              onChange={handleChange}
              min="1000000"
              step="1000000"
              required
            />
          </label>
          <label>
            {copy.daysLabel}
            <input
              type="number"
              name="days"
              value={formState.days}
              onChange={handleChange}
              min="1"
              required
            />
          </label>
          <label>
            {copy.nightsLabel}
            <input
              type="number"
              name="nights"
              value={formState.nights}
              onChange={handleChange}
              min="0"
            />
          </label>
        </div>

        <label className="admin-tour-form__full">
          {copy.summaryLabel}
          <textarea
            name="summary"
            value={formState.summary}
            onChange={handleChange}
            rows="3"
          />
        </label>

        <div className="admin-tour-form__split">
          <label>
            {copy.includesLabel}
            <textarea
              name="includes"
              value={formState.includes}
              onChange={handleChange}
              rows="6"
            />
          </label>
          <label>
            {copy.excludesLabel}
            <textarea
              name="excludes"
              value={formState.excludes}
              onChange={handleChange}
              rows="6"
            />
          </label>
        </div>

        <section className="admin-tour-form__lodging">
          <div className="admin-tour-form__lodging-header">
            <div>
              <h3>{copy.lodgingTitle}</h3>
              <p>{copy.lodgingSubtitle}</p>
            </div>
            <button type="button" onClick={handleAddLodging}>
              <i className="fa-solid fa-plus" aria-hidden="true" /> {copy.lodgingAdd}
            </button>
          </div>
          <div className="admin-tour-form__lodging-list">
            {formState.lodgings.map((lodging, index) => {
              const typeOption =
                lodgingTypes.find((option) => option.value === lodging.type) ?? lodgingTypes[0];
              const typeLabel = typeOption?.label ?? lodging.type;
              const ratingValue = Number.parseInt(lodging.rating, 10);
              const ratingLabel =
                language === 'vi' ? `${ratingValue} sao` : `${ratingValue} star${ratingValue > 1 ? 's' : ''}`;

              return (
                <article key={`lodging-${index}`} className="lodging-card">
                  <div
                    className={`lodging-card__visual${lodging.image ? ' has-image' : ''}`}
                    style={lodging.image ? { backgroundImage: `url(${lodging.image})` } : undefined}
                  >
                    <div className="lodging-card__visual-overlay" />
                    <div className="lodging-card__visual-content">
                      <span className="lodging-card__type">
                        <i className="fa-solid fa-hotel" aria-hidden="true" /> {typeLabel}
                      </span>
                      <span className="lodging-card__nights">
                        <i className="fa-solid fa-moon" aria-hidden="true" /> {copy.lodgingNights}:{' '}
                        {lodging.nights || '1'}
                      </span>
                      {ratingValue ? (
                        <span className="lodging-card__rating" aria-label={ratingLabel}>
                          {Array.from({ length: ratingValue }).map((_, starIndex) => (
                            <i key={`star-${starIndex}`} className="fa-solid fa-star" aria-hidden="true" />
                          ))}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="lodging-card__body">
                    <div className="lodging-card__body-header">
                      <h4>{lodging.name || copy.lodgingName}</h4>
                      {lodgingCount > 1 ? (
                        <button type="button" onClick={() => handleRemoveLodging(index)}>
                          <i className="fa-solid fa-trash" aria-hidden="true" /> {copy.lodgingRemove}
                        </button>
                      ) : null}
                    </div>
                    <label>
                      {copy.lodgingName}
                      <input
                        type="text"
                        value={lodging.name}
                        onChange={(event) => handleLodgingChange(index, 'name', event.target.value)}
                        placeholder={
                          language === 'vi'
                            ? 'Ví dụ: Santorini Seaside Resort'
                            : 'e.g. Santorini Seaside Resort'
                        }
                      />
                    </label>
                    <div className="lodging-card__meta">
                      <label>
                        {copy.lodgingType}
                        <select
                          value={lodging.type}
                          onChange={(event) => handleLodgingChange(index, 'type', event.target.value)}
                        >
                          {lodgingTypes.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        {copy.lodgingNights}
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={lodging.nights}
                          onChange={(event) => handleLodgingChange(index, 'nights', event.target.value)}
                        />
                      </label>
                      <label>
                        {copy.lodgingRating}
                        <select
                          value={lodging.rating}
                          onChange={(event) => handleLodgingChange(index, 'rating', event.target.value)}
                        >
                          <option value="">{language === 'vi' ? 'Chọn hạng sao' : 'Select rating'}</option>
                          {[3, 4, 5].map((star) => (
                            <option key={star} value={String(star)}>
                              {star}★
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <div className="lodging-card__amenities">
                      <span>{copy.lodgingAmenities}</span>
                      <div className="lodging-card__chips" role="list">
                        {lodgingAmenities.map((amenity) => {
                          const isActive = lodging.amenities.includes(amenity.value);
                          return (
                            <button
                              type="button"
                              key={amenity.value}
                              role="listitem"
                              className={`lodging-chip${isActive ? ' active' : ''}`}
                              onClick={() => handleAmenityToggle(index, amenity.value)}
                              aria-pressed={isActive}
                            >
                              {amenity.label}
                            </button>
                          );
                        })}
                      </div>
                      <p className="lodging-card__hint">{copy.lodgingAmenitiesHint}</p>
                    </div>
                    <label>
                      {copy.lodgingNotes}
                      <textarea
                        rows="3"
                        value={lodging.notes}
                        onChange={(event) => handleLodgingChange(index, 'notes', event.target.value)}
                        placeholder={
                          language === 'vi'
                            ? 'Ví dụ: Hạng phòng suite hướng biển, set-up hoa và champagne buổi tối.'
                            : 'e.g. Ocean-view suite with nightly turndown and champagne welcome.'
                        }
                      />
                    </label>
                    <label>
                      {copy.lodgingImage}
                      <input
                        type="url"
                        value={lodging.image}
                        placeholder="https://..."
                        onChange={(event) => handleLodgingChange(index, 'image', event.target.value)}
                      />
                    </label>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="admin-tour-form__itinerary">
          <div className="admin-tour-form__itinerary-header">
            <h3>{copy.itineraryLabel}</h3>
            <button type="button" onClick={handleAddDay}>
              <i className="fa-solid fa-plus" aria-hidden="true" /> {copy.itineraryAdd}
            </button>
          </div>
          <div className="admin-tour-form__itinerary-list">
            {formState.itinerary.map((day, index) => (
              <article key={`itinerary-${index}`} className="admin-tour-form__day">
                <header>
                  <h4>{`Ngày ${index + 1}`}</h4>
                  {itineraryCount > 1 ? (
                    <button type="button" onClick={() => handleRemoveDay(index)}>
                      <i className="fa-solid fa-trash" aria-hidden="true" /> {copy.itineraryRemove}
                    </button>
                  ) : null}
                </header>
                <label>
                  {copy.itineraryTitle}
                  <input
                    type="text"
                    value={day.title}
                    onChange={(event) => handleItineraryChange(index, 'title', event.target.value)}
                  />
                </label>
                <label>
                  {copy.itineraryDescription}
                  <textarea
                    value={day.description}
                    rows="3"
                    onChange={(event) => handleItineraryChange(index, 'description', event.target.value)}
                  />
                </label>
                <label>
                  {copy.itineraryImage}
                  <input
                    type="url"
                    value={day.image}
                    onChange={(event) => handleItineraryChange(index, 'image', event.target.value)}
                    placeholder="https://..."
                  />
                </label>
              </article>
            ))}
          </div>
        </section>

        <div className="admin-tour-form__actions">
          <button type="submit" disabled={isSubmitting}>
            {copy.submit}
          </button>
          {status.message ? (
            <span className={`admin-tour-form__status ${status.type}`}>{status.message}</span>
          ) : null}
        </div>
      </form>
    </section>
  );
}

export default AdminTourForm;
