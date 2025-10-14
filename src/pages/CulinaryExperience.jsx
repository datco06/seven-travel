import { useMemo } from 'react';
import '../styles/experienceDetail.css';
import { useLanguage } from '../context/LanguageContext.jsx';

const CONTENT = {
  vi: {
    hero: {
      kicker: 'Culinary Journeys',
      title: 'Trải nghiệm ẩm thực cùng bếp trưởng',
      subtitle:
        'Khám phá câu chuyện văn hoá Việt Nam qua khu chợ sớm, gian bếp ấm và những món ăn truyền thống do chính tay bạn thực hiện.',
    },
    intro: [
      'Ẩm thực Việt Nam phản ánh đời sống, phong tục và thói quen sinh hoạt của từng vùng miền. Du lịch ẩm thực đang trở thành xu hướng, trong đó trải nghiệm “Trải nghiệm ẩm thực cùng bếp trưởng” là điểm nhấn nổi bật giúp du khách cảm nhận sâu hơn về văn hoá Việt.',
      'Hành trình bắt đầu từ việc cùng bếp trưởng ghé chợ địa phương để chọn nguyên liệu tươi ngon, tìm hiểu đặc trưng của từng loại rau thơm, gia vị đến hải sản. Tại lớp học nấu ăn, bạn sẽ được hướng dẫn chế biến các món truyền thống như gỏi cuốn, phở, bánh xèo hoặc nem rán – những biểu tượng ẩm thực của người Việt.',
    ],
    valuesTitle: 'Ý nghĩa của trải nghiệm ẩm thực',
    values: [
      {
        title: 'Khám phá văn hoá',
        description:
          'Mỗi món ăn là một câu chuyện về vùng đất, con người và lịch sử. Du khách hiểu sâu hơn về nếp sống và bản sắc từng địa phương.',
      },
      {
        title: 'Tăng tương tác du lịch',
        description:
          'Thay vì chỉ quan sát, du khách được tự tay chế biến, tương tác trực tiếp với bếp trưởng và cộng đồng, từ đó tạo ra kết nối cảm xúc mạnh mẽ.',
      },
      {
        title: 'Góp phần cho kinh tế địa phương',
        description:
          'Chợ phiên, nông sản và lớp học nấu ăn được quảng bá rộng rãi, giúp gia tăng thu nhập cho người dân và gìn giữ nghề truyền thống.',
      },
    ],
    northernTitle: 'Tinh hoa ẩm thực miền Bắc',
    northernBody:
      'Ẩm thực miền Bắc đề cao sự tinh tế, nhẹ nhàng nhưng vô cùng hài hoà. Hà Nội là nơi lưu giữ nhiều tinh hoa nhất với những món ăn nổi tiếng như phở bò, bún chả, chả cá Lã Vọng hay bánh cuốn Thanh Trì. Hương vị được kết hợp từ các loại rau thơm, nước chấm vừa vặn và cách trình bày trang nhã.',
    galleryCaptions: ['Chả cá Lã Vọng', 'Phở bò Hà Nội', 'Bún chả', 'Bánh cuốn nóng'],
    closing: [
      'Trải nghiệm ẩm thực cùng bếp trưởng là hành trình để bạn sống chậm, lắng nghe và cảm nhận bản sắc Việt Nam qua từng nguyên liệu, từng thao tác trong bếp.',
      'Hãy đặt lịch để chúng tôi thiết kế lớp học phù hợp với vùng miền bạn muốn khám phá và kết nối cùng những người gìn giữ hương vị Việt.',
    ],
  },
  en: {
    hero: {
      kicker: 'Culinary Journeys',
      title: 'Culinary Experience With Master Chef',
      subtitle:
        'Discover Vietnam’s culture through bustling markets, warm kitchens, and heritage dishes you prepare with your own hands.',
    },
    intro: [
      'Vietnamese cuisine reflects local lifestyles, customs, and traditions. Culinary travel is on the rise, and joining our “Culinary Experience With Master Chef” lets travellers dive deep into the nation’s culture.',
      'Your journey starts at a local market with the chef, learning about herbs, spices, and regional produce. Back in the kitchen, you will cook iconic dishes such as fresh spring rolls, pho, banh xeo, or fried spring rolls – each representing a story of the Vietnamese people.',
    ],
    valuesTitle: 'Why this experience matters',
    values: [
      {
        title: 'Cultural discovery',
        description:
          'Every dish tells a story of land, people, and history. Guests gain a deeper understanding of local lifestyles and identities.',
      },
      {
        title: 'Interactive learning',
        description:
          'Instead of only observing, you take part in cooking, engaging closely with the chef and community for an emotional, memorable journey.',
      },
      {
        title: 'Support local economy',
        description:
          'Cooking classes and market tours promote regional produce, sustain livelihoods, and safeguard traditional crafts.',
      },
    ],
    northernTitle: 'Northern Vietnamese delicacies',
    northernBody:
      'Northern cuisine values harmony and refinement. Hanoi embodies these qualities with signature dishes such as beef pho, bun cha, cha ca La Vong, and Thanh Tri steamed rolls – all balanced with fresh herbs, delicate dips, and elegant presentation.',
    galleryCaptions: ['Cha Ca La Vong', 'Hanoi beef pho', 'Bun Cha', 'Thanh Tri rice rolls'],
    closing: [
      'Cook With Master Chef invites you to slow down, listen, and feel Vietnam’s essence in every ingredient and technique.',
      'Reserve your session and we will craft a culinary class tailored to the region you wish to explore alongside the keepers of Vietnam’s flavours.',
    ],
  },
};

const GALLERY_IMAGES = [
  'https://exotrails.com/wp-content/uploads/2024/11/hanoi-food-thumb-870x489-02-09-2024.jpeg',
  'https://lh7-rt.googleusercontent.com/docsz/AD_4nXd6KBL6B_MOf1XZsfU9Q8fck6_SSy1NbMxmcLOUjgC6W1etduvQbs1MjyLqYYfBldejguR37Z4H7iTFwh2DSVb3Alc8BapDe8PkG4B0rJi8ZWt7uf4yf6Ilkpoce3p1fwi_73jt7Q?key=5pVcgu2PQ3w2_bZ5-DQm0Q',
  'https://dulichkhampha24.com/wp-content/uploads/2019/10/am-thuc-ha-noi.jpg',
  'https://dntt.mediacdn.vn/197608888129458176/2024/10/9/am-thuc-1692074270963-1728435947196562159762.jpg',
];

function CulinaryExperience() {
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
          <h2>{copy.northernTitle}</h2>
          <p>{copy.northernBody}</p>
        </div>
        <div className="experience-detail__gallery">
          {gallery.map((item) => (
            <figure key={item.src}>
              <img src={item.src} alt={item.caption || copy.northernTitle} />
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

export default CulinaryExperience;
