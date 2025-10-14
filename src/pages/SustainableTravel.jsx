import '../styles/experienceDetail.css';
import { useLanguage } from '../context/LanguageContext.jsx';

const COPY = {
  vi: {
    hero: {
      kicker: 'Responsible Journey',
      title: 'Hướng tới bền vững',
      subtitle:
        'Mỗi chuyến đi là cơ hội tạo tác động tích cực. Chúng tôi làm việc cùng cộng đồng địa phương để hành trình của bạn thân thiện với môi trường và công bằng với con người.',
    },
    intro: [
      'Du lịch bền vững không chỉ dừng lại ở việc hạn chế rác thải. Đó là cách chúng ta lựa chọn dịch vụ, đối tác, hoạt động nhằm bảo tồn thiên nhiên, tôn trọng văn hoá và hỗ trợ sinh kế địa phương.',
      'SEVEN TRAVEL xây dựng bộ tiêu chí đánh giá điểm đến, lưu trú, nhà hàng và trải nghiệm. Chỉ những đơn vị đáp ứng yêu cầu về minh bạch, môi trường và đóng góp xã hội mới được đưa vào hành trình của bạn.',
    ],
    valuesTitle: 'Cam kết bền vững của chúng tôi',
    values: [
      {
        title: 'Ưu tiên nhà cung cấp xanh',
        description:
          'Chúng tôi làm việc với các cơ sở sử dụng năng lượng tái tạo, hạn chế nhựa dùng một lần và hỗ trợ hoạt động bảo tồn.',
      },
      {
        title: 'Gắn kết cộng đồng',
        description:
          '10% lợi nhuận từ mỗi tour được trích cho quỹ phát triển cộng đồng hoặc dự án giáo dục địa phương.',
      },
      {
        title: 'Hướng dẫn trách nhiệm',
        description:
          'Bạn nhận được bộ hướng dẫn “Travel with care” với các gợi ý hành xử văn minh, giảm dấu chân carbon và hỗ trợ người dân bản địa đúng cách.',
      },
    ],
    narrativeTitle: 'Trải nghiệm bền vững điển hình',
    narrativeBody:
      'Chúng tôi kết hợp những hoạt động thân thiện môi trường: trekking có kiểm soát lượng khách, workshop tái chế, trồng cây cùng người dân, hay đêm homestay với gia đình địa phương. Các trải nghiệm luôn có briefing trước và tổng kết sau để cùng rút kinh nghiệm.',
    closing: [
      'Du lịch bền vững là hành trình dài, và mỗi bước chân có trách nhiệm đều đáng trân trọng. Chúng tôi rất vui được đồng hành cùng bạn.',
      'Chia sẻ kế hoạch của bạn để đội ngũ SEVEN TRAVEL gợi ý những chương trình xanh phù hợp nhất.',
    ],
  },
  en: {
    hero: {
      kicker: 'Responsible Journey',
      title: 'Sustainable approach',
      subtitle:
        'Every trip can generate positive impact. We collaborate with local communities so your travels stay gentle on the planet and empowering for people.',
    },
    intro: [
      'Sustainable travel goes beyond reducing waste. It is about choosing services, partners, and activities that preserve nature, respect culture, and support local livelihoods.',
      'SEVEN TRAVEL applies a sustainability scorecard when curating destinations, stays, restaurants, and experiences. Only partners meeting transparency, environmental, and social standards become part of your itinerary.',
    ],
    valuesTitle: 'Our sustainability commitments',
    values: [
      {
        title: 'Green-first partners',
        description:
          'We prioritise suppliers investing in renewable energy, limiting single-use plastics, and funding conservation projects.',
      },
      {
        title: 'Community reinvestment',
        description:
          '10% of profit from each tour supports community development funds or local education initiatives.',
      },
      {
        title: 'Responsible travel toolkit',
        description:
          'You receive our “Travel with care” guidelines to minimise carbon footprint, respect traditions, and give back meaningfully.',
      },
    ],
    narrativeTitle: 'Sample sustainable activities',
    narrativeBody:
      'We incorporate eco-conscious moments such as small-group trekking, recycling workshops, tree-planting with villagers, and overnight stays with local families. Each experience includes pre-briefs and post reflections to keep improving together.',
    closing: [
      'Sustainability is an ongoing journey, and every mindful step counts. We are honoured to walk it with you.',
      'Share your plans so SEVEN TRAVEL can recommend the green programs that best match your passions.',
    ],
  },
};

const SUSTAINABLE_IMAGES = [
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9Q6fd8IySstY6DrD05dUsONlasYB6Rg6q9g&s',
  'https://media.baotintuc.vn/Upload/QKrAM3u3JmfSk084HTqfEg/files/2021/10/du-lich-2021/conver-sua.jpg',
  'https://hnm.1cdn.vn/2023/01/31/hanoimoi.com.vn-uploads-images-phananh-2023-01-31-_dulich.jpg',
];

function SustainableTravel() {
  const { language } = useLanguage();
  const copy = COPY[language];

  return (
    <div className="experience-detail" data-accent="green">
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
          {SUSTAINABLE_IMAGES.map((src) => (
            <figure key={src}>
              <img src={src} alt="Sustainable travel" />
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

export default SustainableTravel;
