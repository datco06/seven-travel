import '../styles/experienceDetail.css';
import { useLanguage } from '../context/LanguageContext.jsx';

const COPY = {
  vi: {
    hero: {
      kicker: 'Tailor-made Journeys',
      title: 'Dịch vụ cá nhân hoá',
      subtitle:
        'Mỗi hành trình được thiết kế dành riêng cho bạn – phù hợp ngân sách, nhịp độ, sở thích và những khoảnh khắc bạn muốn lưu giữ.',
    },
    intro: [
      'Không có hai chuyến đi nào giống nhau. Chúng tôi bắt đầu bằng việc lắng nghe kỹ lưỡng: phong cách lưu trú bạn yêu thích, hoạt động ưu tiên, chế độ ăn uống, nhóm tuổi hay những dịp đặc biệt.',
      'Từ đó, hành trình được cá nhân hoá tới từng chi tiết: khách sạn, phương tiện, lịch trình, thời lượng từng điểm dừng, thậm chí là những bất ngờ nhỏ trên đường đi.',
    ],
    valuesTitle: 'Ba lớp cá nhân hoá',
    values: [
      {
        title: 'Kế hoạch linh hoạt',
        description:
          'Bạn có thể thay đổi lịch trình trước và trong chuyến đi; chúng tôi luôn có phương án dự phòng để đảm bảo trải nghiệm mượt mà.',
      },
      {
        title: 'Trải nghiệm độc quyền',
        description:
          'Những buổi gặp gỡ riêng, workshop giới hạn hoặc hành trình “after hours” được sắp xếp chỉ dành cho nhóm của bạn.',
      },
      {
        title: 'Dịch vụ concierge 24/7',
        description:
          'Đội ngũ hỗ trợ luôn sẵn sàng qua điện thoại, WhatsApp hoặc email để cập nhật thay đổi và giải quyết phát sinh ngay lập tức.',
      },
    ],
    narrativeTitle: 'Cách chúng tôi cá nhân hoá',
    narrativeBody:
      'Sau khi nhận yêu cầu, chuyên viên thiết kế sẽ gửi đề xuất sơ bộ trong vòng 24 giờ. Chúng tôi dùng bảng Moodboard & Travel Canvas để hai bên cùng trao đổi, điều chỉnh đến khi mọi thứ hoàn hảo. Trước ngày khởi hành, bạn nhận bộ tài liệu số hoá bao gồm hành trình chi tiết, liên hệ khẩn, voucher dịch vụ và gợi ý trải nghiệm bổ sung.',
    closing: [
      'Hành trình của bạn xứng đáng được cá nhân hoá tận tâm. Hãy chia sẻ mong muốn để chúng tôi biến chúng thành trải nghiệm trọn vẹn.',
      'Đặt lịch tư vấn miễn phí với SEVEN TRAVEL để bắt đầu thiết kế chuyến đi tiếp theo.',
    ],
  },
  en: {
    hero: {
      kicker: 'Tailor-made Journeys',
      title: 'Personalised service',
      subtitle:
        'Every itinerary is crafted exclusively for you – aligned with your budget, pacing, passions, and the memories you want to create.',
    },
    intro: [
      'No two trips are alike. We begin by deeply understanding your travel style: preferred stays, signature activities, dietary notes, group dynamics, and special occasions.',
      'From there we personalise every detail: hotels, transport, pacing, duration at each stop, and delightful surprises along the way.',
    ],
    valuesTitle: 'Three layers of customisation',
    values: [
      {
        title: 'Flexible planning',
        description:
          'Adjust your itinerary before or during the trip – back-up plans are always ready to keep things smooth.',
      },
      {
        title: 'Signature experiences',
        description:
          'Private meet-ups, limited-capacity workshops, or curated after-hours visits arranged just for your group.',
      },
      {
        title: '24/7 concierge',
        description:
          'Stay supported via phone, WhatsApp, or email with real-time updates and swift resolution of any issues.',
      },
    ],
    narrativeTitle: 'Our personalisation workflow',
    narrativeBody:
      'Within 24 hours of receiving your brief, a travel designer sends a draft proposal. We collaborate through shared moodboards and a Travel Canvas until every detail fits. Before departure you receive a digital travel kit with daily schedule, emergency contacts, service vouchers, and inspired add-ons.',
    closing: [
      'Your journey deserves thoughtful personalisation. Share your vision and we will translate it into a flawless experience.',
      'Schedule a complimentary consultation with SEVEN TRAVEL to start crafting your next escape.',
    ],
  },
};

const PERSONALIZED_IMAGES = [
  'https://sgtt.thesaigontimes.vn/wp-content/uploads/2025/02/han-quoc-jeju-2.jpg',
  'https://vietrektravel.com/Upload/News/Don-Dau-Trao-Luu-Du-Lich-Ca-Nhan-Da-Dang-Hap-Dan.jpg',
  'https://didiholidays.com/wp-content/uploads/2024/06/hinh-anh-khai-niem-khach-du-lich-2.jpg',
];

function PersonalizedService() {
  const { language } = useLanguage();
  const copy = COPY[language];

  return (
    <div className="experience-detail" data-accent="amber">
      <section className="experience-detail__hero">
        <p className="experience-detail__kicker">{copy.hero.kicker}</p>
        <h1>{copy.hero.title}</h1>
        <p className="experience-detail__subtitle">{copy.hero.subtitle}</p>
      </section>

      <section className="experience-detail__intro">
        {copy.intro.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <section className="experience-detail__grid">
        <h2>{copy.valuesTitle}</h2>
        <div className="experience-detail__grid-inner">
          {copy.values.map((item) => (
            <article className="experience-detail-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="experience-detail__split">
        <div className="experience-detail__split-text">
          <h2>{copy.narrativeTitle}</h2>
          <p>{copy.narrativeBody}</p>
        </div>
        <div className="experience-detail__gallery">
          {PERSONALIZED_IMAGES.map((src) => (
            <figure key={src}>
              <img src={src} alt="Personalized travel planning" />
            </figure>
          ))}
        </div>
      </section>

      <section className="experience-detail__closing">
        {copy.closing.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>
    </div>
  );
}

export default PersonalizedService;
