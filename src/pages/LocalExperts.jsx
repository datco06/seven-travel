import { Link } from 'react-router-dom';
import '../styles/localExperts.css';
import { useLanguage } from '../context/LanguageContext.jsx';

const COPY = {
  vi: {
    hero: {
      kicker: 'Local Experts',
      title: 'Chuyên Gia Bản Địa – Linh Hồn Của Mỗi Hành Trình',
      subtitle:
        'Mỗi chuyến đi trở nên đặc biệt khi đồng hành cùng những người hiểu từng lối nhỏ, từng câu chuyện và hơi thở văn hoá của vùng đất bạn đến.',
    },
    intro: [
      'Chuyên gia bản địa không chỉ dẫn đường. Họ sinh ra, lớn lên và sống trọn vẹn với quê hương mình, hiểu rõ từng mùa vụ, từng câu chuyện sau mỗi nụ cười. Họ dẫn bạn đi qua cả những góc bình dị – nơi nhịp sống vẫn giữ nét chân thật và hiếu khách.',
      'Với họ, bạn không chỉ “đi thăm” mà còn được “sống cùng”: cùng nấu ăn, cùng làm nghề, cùng nghe những câu chuyện đời thường. Đó là lúc hành trình trở thành sự kết nối, là câu chuyện đáng nhớ được viết nên từ sự đồng cảm giữa du khách và người dân địa phương.',
    ],
    pillarsTitle: 'Những linh hồn gìn giữ bản sắc',
    pillars: [
      {
        title: 'Người kể chuyện sống',
        description:
          'Từ bác nông dân hiểu từng thửa ruộng đến nghệ nhân giữ bí quyết làng nghề, mỗi chuyên gia bản địa là một kho tàng tri thức sống mà không cuốn sách nào ghi lại được.',
        image: '/anh/taotour/ngay-3-lang-nghe-gia-thanh.jpg',
      },
      {
        title: 'Trải nghiệm nguyên bản',
        description:
          'Họ mở ra những trải nghiệm đời thường: ăn bữa cơm quê, lắng nghe tiếng chày giã cốm, thử làm đồ thủ công hay chèo thuyền cùng ngư dân – những khoảnh khắc chỉ người địa phương mới có thể chia sẻ.',
        image: '/anh/taotour/ngay-2-lang-co-dac-san.jpg',
      },
      {
        title: 'Kết nối chân thành',
        description:
          'Chuyên gia bản địa là cầu nối để du khách hiểu vì sao một vùng đất lại đẹp: bởi con người, bởi truyền thống và bởi niềm tự hào được truyền qua bao thế hệ.',
        image: '/anh/taotour/ngay-1-ban-pa-phach-trang-trai-dau.jpg',
      },
      {
        title: 'Du lịch bền vững',
        description:
          'Họ kể lại chuyện cũ để người trẻ không quên, gìn giữ nghề truyền thống và lan toả tình yêu quê hương – để mỗi chuyến đi là bước chân góp phần bảo tồn giá trị văn hoá.',
        image: '/anh/taotour/ngay-3-cho-phien-tro-ve.jpg',
      },
    ],
    connection: {
      title: 'Khi trải nghiệm trở thành kết nối',
      body: [
        'Trong thời đại du lịch thương mại hoá, trải nghiệm nguyên bản ngày càng quý giá. Chuyên gia bản địa giúp bạn đi chậm lại, lắng nghe nhịp sống và hoà mình vào văn hoá bản địa.',
        'Không ít du khách chia sẻ rằng sau khi đồng hành cùng họ, họ thấy yêu hơn con người Việt Nam. Bởi đằng sau mỗi phong cảnh là một cuộc sống và một câu chuyện được kể bằng sự chân thành.',
      ],
    },
    mission: {
      title: 'Giữ nhịp bản sắc quê hương',
      body: [
        'Vai trò của chuyên gia bản địa ngày càng quan trọng khi du lịch hướng đến cá nhân hoá và bền vững. Họ không chỉ giới thiệu cảnh đẹp mà còn giúp bạn hiểu vì sao nơi ấy đáng để yêu.',
        'Mỗi câu chuyện họ kể, mỗi con đường họ dẫn, mỗi nụ cười họ trao – đều góp phần xây dựng hình ảnh một Việt Nam thân thiện, đa dạng và sâu sắc.',
      ],
    },
    cta: {
      title: 'Sẵn sàng đồng hành cùng chuyên gia bản địa?',
      body:
        'Chúng tôi sẽ ghép bạn với chuyên gia phù hợp nhất để kiến tạo hành trình giàu cảm hứng và có trách nhiệm với cộng đồng địa phương.',
      button: 'Đặt lịch tư vấn',
      to: '/tao-tour',
    },
  },
  en: {
    hero: {
      kicker: 'Local Experts',
      title: 'Local Experts • Heart and Soul of Every Journey',
      subtitle:
        'Great trips feel effortless when you travel with people who know every lane, every story, and every heartbeat of the place you visit.',
    },
    intro: [
      'Our local experts are more than guides. They were born and raised in their homeland, carrying memories of rice seasons, craft secrets, and the legends behind every smile. They lead you beyond landmarks into everyday corners where genuine hospitality lives.',
      'With them, you do not just “visit” – you live alongside the community: cooking together, learning their craft, and listening to their stories. Travel becomes connection, and each moment turns into a meaningful chapter shared between guests and locals.',
    ],
    pillarsTitle: 'Guardians of Living Heritage',
    pillars: [
      {
        title: 'Living storytellers',
        description:
          'From farmers who know each terrace by heart to artisans safeguarding centuries-old techniques, every expert holds a treasury of lived knowledge no guidebook can capture.',
        image: '/anh/taotour/ngay-3-lang-nghe-gia-thanh.jpg',
      },
      {
        title: 'Authentic experiences',
        description:
          'They open doors to everyday life: rural family meals, the rhythm of pounding young rice, learning crafts by hand, or paddling alongside fishermen – precious scenes shared only by locals.',
        image: '/anh/taotour/ngay-2-lang-co-dac-san.jpg',
      },
      {
        title: 'Heartfelt connections',
        description:
          'Local experts reveal why a destination feels special: because of its people, traditions, and pride passed through generations. They help you feel the emotion behind every landscape.',
        image: '/anh/taotour/ngay-1-ban-pa-phach-trang-trai-dau.jpg',
      },
      {
        title: 'Sustainable journeys',
        description:
          'They keep stories alive so the young remember, protect traditional crafts, and inspire travellers to love the homeland – ensuring tourism uplifts communities and preserves culture.',
        image: '/anh/taotour/ngay-3-cho-phien-tro-ve.jpg',
      },
    ],
    connection: {
      title: 'When travel becomes connection',
      body: [
        'In an era of commercialised travel, true authenticity is precious. Our experts slow the pace, let you breathe with the village, and invite you into everyday cultural rhythms.',
        'Many travellers leave saying they fell deeper in love with Vietnam because behind every landscape is a life, and every smile carries a story shared with honesty and warmth.',
      ],
    },
    mission: {
      title: 'Keeping cultural heritage alive',
      body: [
        'As travel shifts toward personalisation and sustainability, the role of local experts grows. They do more than show beautiful places – they help you understand why those places matter.',
        'Each story they tell, each path they lead, each smile they share builds the image of a welcoming, diverse, and deeply soulful Vietnam.',
      ],
    },
    cta: {
      title: 'Ready to journey with a local expert?',
      body:
        'We will match you with the specialist who best fits your interests, crafting an inspiring, responsible itinerary rooted in community connections.',
      button: 'Plan with us',
      to: '/tao-tour',
    },
  },
};

function LocalExperts() {
  const { language } = useLanguage();
  const copy = COPY[language];

  return (
    <div className="local-experts-page">
      <section className="local-experts-hero">
        <p className="local-experts-hero__kicker">{copy.hero.kicker}</p>
        <h1>{copy.hero.title}</h1>
        <p className="local-experts-hero__subtitle">{copy.hero.subtitle}</p>
      </section>

      <section className="local-experts-intro">
        {copy.intro.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <section className="local-experts-pillars">
        <div className="local-experts-pillars__head">
          <h2>{copy.pillarsTitle}</h2>
        </div>
        <div className="local-experts-pillars__grid">
          {copy.pillars.map((item) => (
            <article className="local-expert-card" key={item.title}>
              <div className="local-expert-card__media">
                <img src={item.image} alt={item.title} />
              </div>
              <div className="local-expert-card__body">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="local-experts-connection">
        <div className="local-experts-connection__inner">
          <h2>{copy.connection.title}</h2>
          {copy.connection.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="local-experts-mission">
        <div className="local-experts-mission__inner">
          <h2>{copy.mission.title}</h2>
          {copy.mission.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="local-experts-cta">
        <h2>{copy.cta.title}</h2>
        <p>{copy.cta.body}</p>
        <Link to={copy.cta.to} className="local-experts-cta__button">
          {copy.cta.button}
          <i className="fa-solid fa-arrow-right" aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}

export default LocalExperts;
