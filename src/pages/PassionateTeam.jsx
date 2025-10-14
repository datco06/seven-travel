import '../styles/experienceDetail.css';
import { useLanguage } from '../context/LanguageContext.jsx';

const COPY = {
  vi: {
    hero: {
      kicker: 'Seven Travel Team',
      title: 'Đội ngũ nhiệt huyết',
      subtitle:
        'Gặp gỡ những người đứng sau mỗi hành trình – những chuyên gia tận tâm, luôn sẵn sàng đồng hành và xử lý mọi chi tiết để bạn an tâm trải nghiệm.',
    },
    intro: [
      'Chúng tôi tin rằng hành trình đáng nhớ bắt đầu từ những con người tận tâm. Trong suốt nhiều năm, đội ngũ SEVEN TRAVEL đã xây dựng mạng lưới đối tác đáng tin cậy, am hiểu văn hoá bản địa và luôn ưu tiên trải nghiệm khách hàng.',
      'Từ lúc phác thảo ý tưởng đến khi kết thúc chuyến đi, chúng tôi luôn theo sát bạn, lắng nghe phản hồi và điều chỉnh từng hạng mục để tạo nên hành trình trọn vẹn.',
    ],
    valuesTitle: 'Điều tạo nên đội ngũ SEVEN TRAVEL',
    values: [
      {
        title: 'Chuyên môn sâu rộng',
        description:
          'Mỗi thành viên phụ trách một lĩnh vực khác nhau – từ thiết kế tour, lưu trú, ẩm thực tới trải nghiệm văn hoá – đảm bảo kế hoạch cân bằng và sáng tạo.',
      },
      {
        title: 'Phản hồi nhanh chóng',
        description:
          'Đường dây hỗ trợ 24/7 giúp chúng tôi xử lý mọi tình huống phát sinh và chăm sóc khách hàng ngay cả khi bạn đang trên đường.',
      },
      {
        title: 'Tinh thần đồng hành',
        description:
          'Chúng tôi coi bạn như người bạn đồng hành, thấu hiểu nhu cầu và luôn chủ động gợi ý giải pháp tốt nhất.',
      },
    ],
    narrativeTitle: 'Quy trình làm việc của chúng tôi',
    narrativeBody:
      'Mỗi hành trình được thiết kế qua 4 bước: lắng nghe & tư vấn, thiết kế cá nhân hoá, triển khai và đồng hành trong suốt chuyến đi, cuối cùng là đánh giá – cải thiện. Chu trình liên tục giúp chúng tôi hoàn thiện dịch vụ và xây dựng mối quan hệ bền vững với khách hàng.',
    closing: [
      'Đằng sau sự chỉn chu là những con người yêu nghề và đam mê khám phá. Hãy để chúng tôi đồng hành cùng bạn trong hành trình tiếp theo.',
      'Liên hệ với SEVEN TRAVEL để gặp gỡ chuyên viên tư vấn phù hợp nhất với phong cách du lịch của bạn.',
    ],
  },
  en: {
    hero: {
      kicker: 'Seven Travel Team',
      title: 'Passionate team',
      subtitle:
        'Meet the specialists behind every itinerary – dedicated experts who obsess over details so your journey stays effortless.',
    },
    intro: [
      'We believe memorable journeys start with passionate people. Over the years our team has built trusted partnerships, mastered local cultures, and kept traveller experience at the centre of everything we do.',
      'From the first brainstorming session to your return home, we stay close, listen carefully, and fine tune every component to deliver a seamless trip.',
    ],
    valuesTitle: 'What defines the SEVEN TRAVEL crew',
    values: [
      {
        title: 'Deep expertise',
        description:
          'Each specialist focuses on a dedicated area – itinerary design, stays, cuisine, cultural encounters – ensuring a balanced, imaginative plan.',
      },
      {
        title: 'Always responsive',
        description:
          'Our 24/7 concierge line handles unexpected changes and keeps you supported even while you are on the road.',
      },
      {
        title: 'True partnership',
        description:
          'We travel alongside you like a trusted friend, anticipating needs and suggesting the smartest options.',
      },
    ],
    narrativeTitle: 'How we work',
    narrativeBody:
      'Every journey follows a four-step cycle: listen & consult, craft a personalised design, execute and accompany you throughout, then review & refine. This loop keeps our service evolving and relationships thriving.',
    closing: [
      'Behind the scenes stand people who are in love with travel and driven by purpose. Let us bring that energy to your next adventure.',
      'Reach out to SEVEN TRAVEL and we will pair you with the consultant who fits your travel style.',
    ],
  },
};

const TEAM_IMAGES = [
  'https://www.wtour.vn/content_vnvacations/upload/Image/doingunv.jpg',
  'https://tsgx.vn/wp-content/uploads/2020/01/huong-dan-vien.jpg',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo9e73BDUYh2LD6SYTqGU2XMcanIXg2Imatg&s',
  'https://amis.misa.vn/wp-content/uploads/2024/02/Lu-hanh-SAIGONTOURIST.jpg',
];

function PassionateTeam() {
  const { language } = useLanguage();
  const copy = COPY[language];

  return (
    <div className="experience-detail" data-accent="indigo">
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
          {TEAM_IMAGES.map((src) => (
            <figure key={src}>
              <img src={src} alt="Seven Travel team" />
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

export default PassionateTeam;
