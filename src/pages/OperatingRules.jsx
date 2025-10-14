const RULE_SECTIONS = [
  {
    title: 'Nguyên tắc phục vụ',
    description:
      'SEVEN TRAVEL đặt trải nghiệm khách hàng làm trọng tâm, cam kết cung cấp dịch vụ du lịch minh bạch, tiêu chuẩn cao và luôn đồng hành cùng bạn trước, trong và sau hành trình.',
  },
  {
    title: 'Quy tắc an toàn',
    description:
      'Mọi chương trình tour đều tuân thủ các quy chuẩn an toàn tại điểm đến. Khách hàng vui lòng lắng nghe hướng dẫn của hướng dẫn viên và tuân thủ những khuyến cáo về sức khỏe, thời tiết.',
    bullets: [
      'Luôn mang theo giấy tờ tùy thân và các giấy tờ theo yêu cầu.',
      'Không tự ý tách đoàn hoặc thay đổi lịch trình khi chưa thông báo.',
      'Chủ động cập nhật thông tin về thời tiết và điều kiện địa phương.',
    ],
  },
  {
    title: 'Quyền lợi khách hàng',
    description:
      'Khách hàng được bảo vệ quyền lợi khi sử dụng dịch vụ của SEVEN TRAVEL. Mọi phản hồi sẽ được tiếp nhận và xử lý trong vòng 24 giờ làm việc.',
    bullets: [
      'Cam kết hoàn tiền hoặc đổi dịch vụ nếu chương trình thay đổi vì lý do từ phía chúng tôi.',
      'Hỗ trợ khiếu nại trực tuyến và tại quầy giao dịch.',
      'Cung cấp hóa đơn, chứng từ đầy đủ theo yêu cầu.',
    ],
  },
];

function OperatingRules() {
  return (
    <div className="info-page">
      <header className="info-page__header">
        <p>Thông tin cần biết</p>
        <h1>Quy chế hoạt động</h1>
        <span>
          Quy chế được xây dựng nhằm bảo đảm dịch vụ minh bạch, đảm bảo quyền lợi và sự an tâm cho
          mọi du khách trong suốt hành trình.
        </span>
      </header>

      <div className="info-page__content">
        {RULE_SECTIONS.map(({ title, description, bullets }) => (
          <section key={title} className="info-page__section">
            <h2>{title}</h2>
            <p>{description}</p>
            {bullets ? (
              <ul className="info-page__list">
                {bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}

        <div className="info-page__highlight">
          <strong>Kênh tiếp nhận góp ý</strong>
          <span>
            Nếu bạn cần báo cáo vi phạm hoặc đề xuất cải tiến dịch vụ, hãy gửi thông tin tới{' '}
            <a href="mailto:report@seventravel.vn" className="info-link">
              report@seventravel.vn
            </a>{' '}
            hoặc liên hệ đường dây nóng{' '}
            <a href="tel:19006789" className="info-link">
              1900 6789
            </a>
            .
          </span>
        </div>
      </div>
    </div>
  );
}

export default OperatingRules;
