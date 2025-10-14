const POLICY_ITEMS = [
  {
    title: 'Điều kiện đặt tour',
    description:
      'Khách hàng cần cung cấp đầy đủ thông tin cá nhân chính xác khi đặt tour. Mức giá hiển thị đã bao gồm các loại thuế, phí dịch vụ cơ bản và sẽ được xác nhận ngay sau khi thanh toán thành công.',
    bullets: [
      'Tour có thể yêu cầu đặt cọc tối thiểu 30% giá trị gói dịch vụ.',
      'Trẻ em dưới 12 tuổi phải đi cùng người lớn và có giấy tờ kèm theo.',
      'Một số tour đặc biệt có thể yêu cầu chứng nhận sức khỏe hoặc bảo hiểm du lịch.',
    ],
  },
  {
    title: 'Chính sách thanh toán',
    description:
      'SEVEN TRAVEL hỗ trợ nhiều phương thức thanh toán an toàn và bảo mật. Bạn có thể lựa chọn thanh toán online hoặc chuyển khoản ngân hàng theo hướng dẫn.',
    bullets: [
      'Khoản thanh toán được coi là hoàn tất khi hệ thống xác nhận và gửi email.',
      'Chúng tôi sử dụng chuẩn mã hóa SSL để bảo vệ mọi giao dịch.',
      'Hóa đơn điện tử sẽ được gửi trong vòng 24 giờ sau khi thanh toán thành công.',
    ],
  },
  {
    title: 'Trách nhiệm của các bên',
    description:
      'Chúng tôi cam kết cung cấp dịch vụ đúng như mô tả trong chương trình tour. Khách hàng có trách nhiệm tuân thủ các quy định, nội quy và hướng dẫn của hướng dẫn viên trong suốt hành trình.',
    bullets: [
      'Khách hàng cần có mặt đúng giờ tại các điểm đón đã thống nhất.',
      'Mọi thay đổi cá nhân cần thông báo trước tối thiểu 48 giờ.',
      'Trường hợp bất khả kháng sẽ được hỗ trợ đổi tour hoặc hoàn tiền theo chính sách từng nhà cung cấp.',
    ],
  },
];

function Terms() {
  return (
    <div className="info-page">
      <header className="info-page__header">
        <p>Thông tin cần biết</p>
        <h1>Điều kiện &amp; Điều khoản</h1>
        <span>
          Tìm hiểu các điều kiện quan trọng trước khi xác nhận tour để đảm bảo trải nghiệm trọn vẹn
          và an toàn.
        </span>
      </header>

      <div className="info-page__content">
        {POLICY_ITEMS.map(({ title, description, bullets }) => (
          <section key={title} className="info-page__section">
            <h2>{title}</h2>
            <p>{description}</p>
            <ul className="info-page__list">
              {bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </section>
        ))}

        <div className="info-page__highlight">
          <strong>Lưu ý thêm</strong>
          <span>
            Khi cần hỗ trợ chi tiết hơn về các điều khoản, vui lòng liên hệ chuyên viên tư vấn qua
            email{' '}
            <a href="mailto:Traveltour@gmail.com.vn" className="info-link">
              Traveltour@gmail.com.vn
            </a>{' '}
            để được cung cấp văn bản chính thức.
          </span>
        </div>
      </div>
    </div>
  );
}

export default Terms;
