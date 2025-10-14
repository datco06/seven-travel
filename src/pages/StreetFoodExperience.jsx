import { useMemo } from 'react';
import '../styles/experienceDetail.css';
import { useLanguage } from '../context/LanguageContext.jsx';

const CONTENT = {
  vi: {
    hero: {
      kicker: 'Urban Flavours',
      title: 'Tour ẩm thực đường phố',
      subtitle:
        'Cùng food host địa phương len lỏi qua những con phố nhộn nhịp, thưởng thức món ngon và nghe những câu chuyện phía sau mỗi hàng quán.',
    },
    intro: [
      'Ẩm thực đường phố Việt Nam là sự hòa quyện của hương vị, nhịp sống và văn hoá cộng đồng. Mỗi góc phố, xe đẩy hay quán nhỏ đều phản ánh câu chuyện riêng của người bán và thực khách.',
      'Tour ẩm thực đường phố đưa bạn trải nghiệm theo tuyến curated: bắt đầu từ những món khai vị nhẹ nhàng, tiếp nối bằng món chính đậm đà và kết thúc bằng đồ tráng miệng ngọt ngào. Bạn sẽ hiểu vì sao ẩm thực đường phố Việt Nam luôn nằm trong danh sách phải thử của du khách quốc tế.',
    ],
    valuesTitle: 'Điểm nhấn trong hành trình',
    values: [
      {
        title: 'Không chỉ ăn mà còn hiểu',
        description:
          'Người dẫn chuyện chia sẻ nguồn gốc, cách chế biến và câu chuyện đời thường của chủ quán, giúp mỗi món ăn trở nên đầy ý nghĩa.',
      },
      {
        title: 'Tuyến đường được tuyển chọn',
        description:
          'Từ phố cổ Hà Nội tới những khu chợ đêm sầm uất, hành trình được sắp xếp để bạn cảm nhận trọn vẹn nhịp sống bản địa.',
      },
      {
        title: 'An tâm về an toàn & vệ sinh',
        description:
          'Các điểm dừng đều được kiểm tra kỹ về chất lượng nguyên liệu, quy trình chế biến và tiêu chuẩn vệ sinh để bạn trải nghiệm trọn vẹn.',
      },
    ],
    narrativeTitle: 'Menu gợi ý',
    narrativeBody:
      'Tuỳ mùa và thời tiết, food host sẽ điều chỉnh thực đơn để đảm bảo hương vị tốt nhất. Một số món tiêu biểu bạn có thể thưởng thức trong hành trình:',
    bulletPoints: [
      'Phở bò hoặc phở gà với nước dùng ninh xương đặc trưng.',
      'Bún chả nướng trên than hoa ăn kèm nem cua bể.',
      'Nem rán hoặc bánh gối giòn tan, nóng hổi.',
      'Chè thập cẩm, kem dừa hoặc cà phê trứng kết thúc hành trình.',
    ],
    galleryCaptions: ['Ngõ nhỏ với hàng quán lâu năm', 'Food host hướng dẫn du khách thưởng thức', 'Bàn ăn bún chả nóng hổi', 'Món tráng miệng ngọt ngào cuối tour'],
    closing: [
      'Tour ẩm thực đường phố giúp bạn kết nối với thành phố bằng vị giác. Mỗi món ăn là lời chào thân thiện từ người dân địa phương.',
      'Liên hệ với chúng tôi để tuỳ chỉnh tuyến đường theo sở thích (đồ chay, món vùng miền, tour đêm, v.v.).',
    ],
  },
  en: {
    hero: {
      kicker: 'Urban Flavours',
      title: 'Street Food Tour',
      subtitle:
        'Follow a local food host through buzzing alleys, savour iconic dishes, and uncover the stories behind each vendor.',
    },
    intro: [
      'Vietnamese street food blends flavour, community, and daily rhythm. Every corner stall and pushcart holds the tale of its maker and loyal guests.',
      'Our curated tour moves at a relaxed pace: start with light bites, continue with hearty mains, and end with sweet treats. You will understand why Vietnamese street food captivates travellers worldwide.',
    ],
    valuesTitle: 'Highlights along the way',
    values: [
      {
        title: 'Taste with context',
        description:
          'Your host explains origins, techniques, and personal stories from each vendor, enriching every bite.',
      },
      {
        title: 'Curated route',
        description:
          'From Hanoi’s Old Quarter to bustling night markets, the journey is crafted to showcase authentic local life.',
      },
      {
        title: 'Safety first',
        description:
          'All stops are vetted for ingredient quality, preparation, and hygiene so you can enjoy with peace of mind.',
      },
    ],
    narrativeTitle: 'Sample tasting menu',
    narrativeBody:
      'Menus change with the season to keep flavours at their peak. A typical evening might include:',
    bulletPoints: [
      'Beef or chicken pho with slow-simmered broth.',
      'Charcoal-grilled bun cha paired with crispy crab nem.',
      'Golden fried spring rolls or pillow cakes fresh from the wok.',
      'Sweet endings such as che desserts, coconut ice cream, or egg coffee.',
    ],
    galleryCaptions: ['Hidden alley eatery', 'Food host guiding guests', 'Steaming plate of bun cha', 'Sweet treats to finish the walk'],
    closing: [
      'A street food tour lets you taste the city’s heartbeat. Each dish is a friendly introduction to local life.',
      'Tell us your cravings—vegetarian, regional specialties, or late-night bites—and we will tailor the route accordingly.',
    ],
  },
};

const GALLERY_IMAGES = [
  'https://vj-prod-website-cms.s3.ap-southeast-1.amazonaws.com/shutterstock540535987huge-1697426116789.jpg',
  'https://mocgianguyen.com/wp-content/uploads/2024/11/82.webp',
  'https://images.vietnamtourism.gov.vn/vn/images/stories/Monngonviahe.jpg',
  'https://static.vinwonders.com/production/mon-an-duong-pho-viet-nam-8.jpg',
];

function StreetFoodExperience() {
  const { language } = useLanguage();
  const copy = CONTENT[language];

  const gallery = useMemo(
    () =>
      GALLERY_IMAGES.map((src, index) => ({
        src,
        caption: copy.galleryCaptions[index] ?? '',
      })),
    [copy.galleryCaptions]
  );

  return (
    <div className="experience-detail" data-accent="cerulean">
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
          <ul className="experience-detail__list">
            {copy.bulletPoints.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="experience-detail__gallery">
          {gallery.map((item) => (
            <figure key={item.src}>
              <img src={item.src} alt={item.caption || copy.hero.title} />
              {item.caption ? <figcaption>{item.caption}</figcaption> : null}
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

export default StreetFoodExperience;
