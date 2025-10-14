const FAQ_ITEMS = [
  {
    question: 'Tôi có thể đặt tour trước bao lâu?',
    answer:
      'Bạn có thể đặt tour bất cứ lúc nào, tuy nhiên SEVEN TRAVEL khuyến nghị nên đặt trước tối thiểu 14 ngày để đảm bảo còn chỗ và nhận được mức giá tốt nhất.',
  },
  {
    question: 'Chính sách đổi hoặc hủy tour như thế nào?',
    answer:
      'Bạn có thể đổi hoặc hủy tour miễn phí trong vòng 24 giờ sau khi đặt. Sau khoảng thời gian này, phí đổi/hủy sẽ tùy thuộc vào từng tour cụ thể và thời điểm bạn yêu cầu.',
  },
  {
    question: 'Tôi cần chuẩn bị giấy tờ gì khi đi tour?',
    answer:
      'Bạn vui lòng mang theo giấy tờ tùy thân (CMND/CCCD hoặc hộ chiếu). Với tour quốc tế, bạn cần hộ chiếu còn hạn ít nhất 6 tháng, thị thực và các giấy tờ theo yêu cầu của quốc gia đến.',
  },
];

function FAQ() {
  return (
    <div className="info-page">
      <header className="info-page__header">
        <p>Thông tin cần biết</p>
        <h1>Câu hỏi thường gặp</h1>
        <span>
          Giải đáp những thắc mắc phổ biến để bạn có thể an tâm chuẩn bị cho hành trình sắp tới cùng
          SEVEN TRAVEL.
        </span>
      </header>

      <div className="info-page__content">
        {FAQ_ITEMS.map(({ question, answer }) => (
          <section key={question} className="info-page__section">
            <h2>{question}</h2>
            <p>{answer}</p>
          </section>
        ))}

        <div className="info-page__highlight">
          <strong>Chưa tìm thấy câu trả lời bạn cần?</strong>
          <span>
            Đội ngũ chăm sóc khách hàng của chúng tôi luôn sẵn sàng hỗ trợ qua hotline{' '}
            <a href="tel:19006789" className="info-link">
              1900 6789
            </a>{' '}
            hoặc email{' '}
            <a href="mailto:Traveltour@gmail.com.vn" className="info-link">
              Traveltour@gmail.com.vn
            </a>
            .
          </span>
        </div>
      </div>
    </div>
  );
}

export default FAQ;
