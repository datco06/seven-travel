import { useCallback, useMemo, useState } from 'react';
import '../styles/mountain.css';

const INITIAL_FORM = {
  name: '',
  email: '',
  phone: '',
  selectedTour: '',
  duration: '',
  participants: '',
  experience_level: 'beginner',
  requests: '',
};

function Mountain() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const scrollToForm = useCallback(() => {
    document.getElementById('consultation-form-section')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleSelectTour = useCallback((tourName) => {
    setFormData((prev) => ({ ...prev, selectedTour: tourName }));
    scrollToForm();
  }, [scrollToForm]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validators = useMemo(
    () => ({
      name: (value) => (!value.trim() ? 'Vui lòng nhập họ và tên.' : undefined),
      email: (value) => {
        if (!value.trim()) {
          return 'Vui lòng nhập email.';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? undefined : 'Email không hợp lệ.';
      },
      phone: (value) => {
        if (!value.trim()) {
          return 'Vui lòng nhập số điện thoại.';
        }
        const phoneRegex = /^0\d{9}$/;
        return phoneRegex.test(value) ? undefined : 'Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số.';
      },
      selectedTour: (value) => (!value.trim() ? 'Vui lòng chọn tour bạn muốn.' : undefined),
      duration: (value) => (!value ? 'Vui lòng nhập số ngày dự kiến.' : undefined),
      participants: (value) => (!value ? 'Vui lòng nhập số lượng người.' : undefined),
    }),
    []
  );

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = Object.entries(validators).reduce((acc, [field, validate]) => {
      const message = validate(formData[field]);
      if (message) {
        acc[field] = message;
      }
      return acc;
    }, {});

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
    setFormData(INITIAL_FORM);
  };

  return (
    <div className="mountain-tour-design-page">
      {showSuccess && (
        <div className="success-message">Cảm ơn bạn đã gửi yêu cầu! SEVEN TRAVEL sẽ liên hệ sớm nhất.</div>
      )}

      <section className="hero-mountain-banner">
        <img src="/anh/c4142ae8-76ec-407e-a8a6-8bde6eb4e8c4.jpg" alt="Thiết kế tour leo núi cùng SEVEN TRAVEL" />
        <div className="hero-mountain-overlay">
          <h1>Thiết Kế Tour Leo Núi Của Riêng Bạn</h1>
          <p>
            Chinh phục những đỉnh cao mơ ước với hành trình được "may đo" theo sở thích và thể lực của bạn.
          </p>
          <button type="button" className="btn-primary-mountain" onClick={scrollToForm}>
            Yêu Cầu Tư Vấn Ngay <i className="fas fa-arrow-right" />
          </button>
        </div>
      </section>

      <div className="container">
        <section className="why-custom-mountain">
          <h2>
            <i className="fas fa-question-circle" /> Tại Sao Chọn Thiết Kế Tour Leo Núi Riêng?
          </h2>
          <div className="benefits-grid-mountain">
            <div className="benefit-item-mountain">
              <div className="benefit-icon-mountain">
                <i className="fas fa-sliders-h" />
              </div>
              <h3>Linh Hoạt Tối Đa</h3>
              <p>Tự do chọn điểm đến, thời gian, độ khó và các dịch vụ theo ý muốn.</p>
            </div>
            <div className="benefit-item-mountain">
              <div className="benefit-icon-mountain">
                <i className="fas fa-user-friends" />
              </div>
              <h3>Trải Nghiệm Cá Nhân Hóa</h3>
              <p>Hành trình phù hợp với sở thích, nhịp độ và mục tiêu của riêng bạn hoặc nhóm bạn.</p>
            </div>
            <div className="benefit-item-mountain">
              <div className="benefit-icon-mountain">
                <i className="fas fa-shield-alt" />
              </div>
              <h3>Phù Hợp Mọi Cấp Độ</h3>
              <p>Dù bạn mới bắt đầu hay là nhà leo núi kinh nghiệm, chúng tôi đều có thể thiết kế phù hợp.</p>
            </div>
            <div className="benefit-item-mountain">
              <div className="benefit-icon-mountain">
                <i className="fas fa-lock" />
              </div>
              <h3>Riêng Tư &amp; Thoải Mái</h3>
              <p>Tận hưởng chuyến đi cùng người thân, bạn bè mà không bị ghép đoàn không mong muốn.</p>
            </div>
          </div>
        </section>

        <section className="design-process-mountain">
          <h2>
            <i className="fas fa-drafting-compass" /> Quy Trình Thiết Kế Tour Leo Núi Đơn Giản
          </h2>
          <div className="process-steps-mountain">
            <div className="step-mountain">
              <div className="step-icon-mountain">
                <span>1</span>
                <i className="fas fa-comments" />
              </div>
              <h3>Tiếp Nhận Yêu Cầu</h3>
              <p>Bạn liên hệ và chia sẻ mong muốn, ý tưởng về chuyến leo núi.</p>
            </div>
            <div className="step-mountain">
              <div className="step-icon-mountain">
                <span>2</span>
                <i className="fas fa-map-marked-alt" />
              </div>
              <h3>Tư Vấn &amp; Lựa Chọn</h3>
              <p>Chuyên viên tư vấn giúp bạn chọn địa điểm, cung đường phù hợp.</p>
            </div>
            <div className="step-mountain">
              <div className="step-icon-mountain">
                <span>3</span>
                <i className="fas fa-calendar-alt" />
              </div>
              <h3>Xây Dựng Lịch Trình</h3>
              <p>Thiết kế chi tiết lịch trình, hoạt động, dịch vụ theo yêu cầu.</p>
            </div>
            <div className="step-mountain">
              <div className="step-icon-mountain">
                <span>4</span>
                <i className="fas fa-file-invoice-dollar" />
              </div>
              <h3>Báo Giá &amp; Xác Nhận</h3>
              <p>Gửi báo giá chi tiết và bạn xác nhận để hoàn tất đặt tour.</p>
            </div>
            <div className="step-mountain">
              <div className="step-icon-mountain">
                <span>5</span>
                <i className="fas fa-hiking" />
              </div>
              <h3>Chuẩn Bị &amp; Lên Đường</h3>
              <p>Hướng dẫn chuẩn bị và sẵn sàng cho hành trình chinh phục.</p>
            </div>
          </div>
        </section>

        <section className="customizable-elements-mountain">
          <h2>
            <i className="fas fa-cogs" /> Các Yếu Tố Bạn Có Thể Tùy Chỉnh
          </h2>
          <div className="elements-grid-mountain">
            <div className="element-item-mountain">
              <i className="fas fa-mountain" />
              <h4>Địa Điểm Leo Núi</h4>
              <p>Fansipan, Putaleng, Bạch Mộc Lương Tử, Lảo Thẩn, Tà Xùa, và nhiều đỉnh núi khác.</p>
            </div>
            <div className="element-item-mountain">
              <i className="fas fa-tachometer-alt" />
              <h4>Độ Khó &amp; Thời Gian</h4>
              <p>Từ những cung dễ cho người mới đến những thử thách cho dân chuyên, 1 ngày đến nhiều ngày.</p>
            </div>
            <div className="element-item-mountain">
              <i className="fas fa-users" />
              <h4>Số Lượng Người</h4>
              <p>Tour riêng cho cá nhân, cặp đôi, gia đình hay nhóm bạn, công ty.</p>
            </div>
            <div className="element-item-mountain">
              <i className="fas fa-concierge-bell" />
              <h4>Dịch Vụ Đi Kèm</h4>
              <p>Porter, hướng dẫn viên, thuê đồ, ăn uống, lều trại, homestay/nhà nghỉ...</p>
            </div>
            <div className="element-item-mountain">
              <i className="fas fa-campground" />
              <h4>Hoạt Động Bổ Sung</h4>
              <p>Cắm trại qua đêm, săn mây, tìm hiểu văn hóa bản địa, team building...</p>
            </div>
            <div className="element-item-mountain">
              <i className="fas fa-car" />
              <h4>Phương Tiện Di Chuyển</h4>
              <p>Xe riêng đưa đón, vé tàu/xe khách tới điểm tập kết leo núi.</p>
            </div>
          </div>
        </section>

        <section className="suggested-routes-mountain">
          <h2>
            <i className="fas fa-binoculars" /> Gợi Ý Các Cung Đường Leo Núi Hấp Dẫn
          </h2>
          <div className="routes-grid-mountain">
            <div className="route-card-mountain">
              <img src="/anh/image copy 31.png" alt="Leo núi Fansipan" />
              <div className="route-content-mountain">
                <h3>Fansipan - Nóc Nhà Đông Dương</h3>
                <p>
                  <strong>Độ khó:</strong> Trung bình - Khó
                  <br />
                  <strong>Thời gian:</strong> 2-3 ngày
                  <br />
                  Chinh phục đỉnh núi cao nhất Việt Nam, ngắm biển mây hùng vĩ.
                </p>
                <button
                  type="button"
                  className="btn-secondary-mountain"
                  onClick={() => handleSelectTour('Fansipan - Nóc Nhà Đông Dương')}
                >
                  Thiết kế tour Fansipan
                </button>
              </div>
            </div>
            <div className="route-card-mountain">
              <img src="/anh/image copy 32.png" alt="Leo núi Putaleng" />
              <div className="route-content-mountain">
                <h3>Putaleng - Đại Ngàn Cổ Thụ</h3>
                <p>
                  <strong>Độ khó:</strong> Khó
                  <br />
                  <strong>Thời gian:</strong> 3-4 ngày
                  <br />
                  Khám phá rừng nguyên sinh với thảm thực vật đa dạng, hoa đỗ quyên rực rỡ.
                </p>
                <button
                  type="button"
                  className="btn-secondary-mountain"
                  onClick={() => handleSelectTour('Putaleng - Đại Ngàn Cổ Thụ')}
                >
                  Thiết kế tour Putaleng
                </button>
              </div>
            </div>
            <div className="route-card-mountain">
              <img src="/anh/image copy 33.png" alt="Leo núi Lảo Thẩn" />
              <div className="route-content-mountain">
                <h3>Lảo Thẩn - Thiên Đường Săn Mây</h3>
                <p>
                  <strong>Độ khó:</strong> Dễ - Trung bình
                  <br />
                  <strong>Thời gian:</strong> 1-2 ngày
                  <br />
                  Cung đường lý tưởng cho người mới, cơ hội ngắm biển mây tuyệt đẹp.
                </p>
                <button
                  type="button"
                  className="btn-secondary-mountain"
                  onClick={() => handleSelectTour('Lảo Thẩn - Thiên Đường Săn Mây')}
                >
                  Thiết kế tour Lảo Thẩn
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="consultation-form-section" className="consultation-form-mountain">
          <h2>
            <i className="fas fa-paper-plane" /> Gửi Yêu Cầu Tư Vấn Thiết Kế Tour Leo Núi
          </h2>
          <p>Hãy chia sẻ những mong muốn của bạn, SEVEN TRAVEL sẽ liên hệ tư vấn chi tiết và hoàn toàn miễn phí!</p>
          <form onSubmit={handleSubmit}>
            <div className="form-row-mountain">
              <div className="form-group-mountain">
                <label htmlFor="name">
                  <i className="fas fa-user" /> Họ và Tên:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Nguyễn Văn A"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <p className="error-text">{errors.name}</p>}
              </div>
              <div className="form-group-mountain">
                <label htmlFor="email">
                  <i className="fas fa-envelope" /> Email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="bancuatoi@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="error-text">{errors.email}</p>}
              </div>
            </div>
            <div className="form-row-mountain">
              <div className="form-group-mountain">
                <label htmlFor="phone">
                  <i className="fas fa-phone" /> Số Điện Thoại:
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="09xxxxxxxx"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && <p className="error-text">{errors.phone}</p>}
              </div>
              <div className="form-group-mountain">
                <label htmlFor="selectedTour">
                  <i className="fas fa-route" /> Tour được chọn:
                </label>
                <input
                  type="text"
                  id="selectedTour"
                  name="selectedTour"
                  placeholder="Chưa chọn tour nào"
                  value={formData.selectedTour}
                  onChange={handleChange}
                />
                {errors.selectedTour && <p className="error-text">{errors.selectedTour}</p>}
              </div>
            </div>
            <div className="form-row-mountain">
              <div className="form-group-mountain">
                <label htmlFor="duration">
                  <i className="fas fa-calendar-day" /> Số Ngày Dự Kiến:
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  min="1"
                  placeholder="VD: 2"
                  value={formData.duration}
                  onChange={handleChange}
                />
                {errors.duration && <p className="error-text">{errors.duration}</p>}
              </div>
              <div className="form-group-mountain">
                <label htmlFor="participants">
                  <i className="fas fa-users" /> Số Lượng Người:
                </label>
                <input
                  type="number"
                  id="participants"
                  name="participants"
                  min="1"
                  placeholder="VD: 4"
                  value={formData.participants}
                  onChange={handleChange}
                />
                {errors.participants && <p className="error-text">{errors.participants}</p>}
              </div>
            </div>
            <div className="form-group-mountain">
              <label htmlFor="experience_level">
                <i className="fas fa-chart-line" /> Trình Độ Kinh Nghiệm:
              </label>
              <select
                id="experience_level"
                name="experience_level"
                value={formData.experience_level}
                onChange={handleChange}
              >
                <option value="beginner">Mới bắt đầu (Chưa có kinh nghiệm)</option>
                <option value="intermediate">Trung bình (Đã leo vài lần)</option>
                <option value="advanced">Kinh nghiệm (Leo núi thường xuyên)</option>
              </select>
            </div>
            <div className="form-group-mountain">
              <label htmlFor="requests">
                <i className="fas fa-comment-dots" /> Yêu Cầu Đặc Biệt Khác:
              </label>
              <textarea
                id="requests"
                name="requests"
                rows="4"
                placeholder="Ví dụ: muốn có porter riêng, yêu cầu về đồ ăn chay, muốn kết hợp cắm trại..."
                value={formData.requests}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn-submit-mountain">
              <i className="fas fa-check-circle" /> Gửi Yêu Cầu
            </button>
          </form>
        </section>

        <section className="important-notes-mountain">
          <h2>
            <i className="fas fa-exclamation-triangle" /> Lưu Ý Quan Trọng Khi Leo Núi
          </h2>
          <div className="notes-grid-mountain">
            <div className="note-item-mountain">
              <i className="fas fa-heartbeat" />
              <h4>Sức Khỏe &amp; Thể Lực</h4>
              <p>Đảm bảo sức khỏe tốt, rèn luyện thể lực (chạy bộ, leo cầu thang) trước chuyến đi.</p>
            </div>
            <div className="note-item-mountain">
              <i className="fas fa-hiking" />
              <h4>Trang Bị Phù Hợp</h4>
              <p>Giày leo núi chuyên dụng, balo trợ lực, quần áo nhanh khô, áo ấm, đèn pin, gậy trekking...</p>
            </div>
            <div className="note-item-mountain">
              <i className="fas fa-user-shield" />
              <h4>Tuân Thủ Hướng Dẫn</h4>
              <p>Luôn đi theo sự chỉ dẫn của hướng dẫn viên/porter, không tự ý tách đoàn.</p>
            </div>
            <div className="note-item-mountain">
              <i className="fas fa-seedling" />
              <h4>Bảo Vệ Môi Trường</h4>
              <p>Không xả rác, không bẻ cành, giữ gìn vệ sinh chung và tôn trọng thiên nhiên.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Mountain;
