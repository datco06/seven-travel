import { useMemo } from 'react';
import '../styles/experienceDetail.css';
import { useLanguage } from '../context/LanguageContext.jsx';

const CONTENT = {
  vi: {
    hero: {
      kicker: 'Cultural Encounters',
      title: 'Thăm bảo tàng đầu tiên Việt Nam',
      subtitle:
        'Lắng nghe câu chuyện lịch sử và gặp gỡ người gìn giữ ký ức dân tộc trong không gian bảo tàng độc đáo giữa lòng phố cổ.',
    },
    intro: [
      'Bảo tàng được gây dựng bởi một nhà sưu tầm đam mê, lưu giữ hơn hàng nghìn hiện vật quý hiếm về đời sống, chiến tranh và văn hoá dân gian. Chủ nhân bảo tàng dành cả đời để sưu tầm, phục dựng và kể lại những câu chuyện đã từng bị lãng quên.',
      'Khi tham gia trải nghiệm, bạn được đồng hành cùng người thuyết minh là chính chủ nhân bảo tàng – người hiểu từng hiện vật và câu chuyện phía sau. Không gian ấm cúng giúp du khách cảm nhận chiều sâu văn hoá qua góc nhìn cá nhân đầy đam mê.',
    ],
    valuesTitle: 'Điều khiến trải nghiệm khác biệt',
    values: [
      {
        title: 'Chạm vào lịch sử sống',
        description:
          'Mỗi hiện vật được kể bằng ký ức thật, giúp du khách hiểu rõ hơn về những giai đoạn lịch sử quan trọng của Việt Nam.',
      },
      {
        title: 'Không gian nghệ thuật độc đáo',
        description:
          'Bảo tàng kết hợp kiến trúc truyền thống và trưng bày hiện đại, tạo nên hành trình khám phá đa giác quan.',
      },
      {
        title: 'Kết nối với người giữ ký ức',
        description:
          'Người sáng lập chia sẻ hành trình sưu tầm, cách gìn giữ hiện vật và câu chuyện hậu trường ít người biết.',
      },
    ],
    narrativeTitle: 'Hành trình trải nghiệm',
    narrativeBody:
      'Buổi tham quan bắt đầu bằng việc thưởng trà và nghe giới thiệu tổng quan. Sau đó, du khách lần lượt khám phá các phòng trưng bày theo chủ đề: đời sống đô thị xưa, ký ức chiến tranh, thư pháp và mỹ thuật dân gian. Mỗi chặng đều có thời gian đặt câu hỏi và giao lưu trực tiếp.',
    bulletPoints: [
      'Thưởng thức trà sen truyền thống do chính chủ nhân chuẩn bị.',
      'Tìm hiểu câu chuyện đằng sau những bức ảnh tư liệu hiếm.',
      'Trải nghiệm viết chữ Nho hoặc làm dấu triện theo hướng dẫn.',
    ],
    galleryCaptions: [
      'Không gian trưng bày kỷ vật',
      'Phòng tem lưu giữ ký ức chiến tranh',
      'Bảo tàng Đà Nẵng – góc nhìn di sản',
      'Triển lãm mỹ thuật đương đại',
    ],
    closing: [
      'Thăm bảo tàng này là cơ hội để bạn nhìn lại lịch sử qua lăng kính cá nhân đầy cảm xúc. Những hiện vật bé nhỏ được nâng niu, những câu chuyện tầng tầng lớp lớp sẽ khiến bạn trân quý hơn giá trị văn hoá Việt.',
      'Hãy đặt lịch trước để chúng tôi thu xếp buổi gặp gỡ riêng tư, giúp bạn có trải nghiệm sâu sắc và trọn vẹn nhất.',
    ],
  },
  en: {
    hero: {
      kicker: 'Cultural Encounters',
      title: "Visit Vietnam's First Museum",
      subtitle:
        'Step inside a treasury of memories where the curator personally shares stories behind every artefact.',
    },
    intro: [
      'This museum safeguards thousands of rare artefacts that portray daily life, wartime memories, and folk culture. The founder devoted decades to collecting, restoring, and retelling stories that might otherwise fade.',
      'During the experience, you are guided by the owner himself. His personal anecdotes and passion illuminate each object, turning the visit into an intimate conversation with history.',
    ],
    valuesTitle: 'What makes it special',
    values: [
      {
        title: 'Living history',
        description:
          'Every artefact comes with first-hand memories, helping you grasp pivotal chapters of Vietnam’s past.',
      },
      {
        title: 'Artful curation',
        description:
          'Traditional architecture blends with contemporary storytelling techniques, creating a multi-sensory journey.',
      },
      {
        title: 'Personal connection',
        description:
          'Hear the founder recount his collecting adventures, preservation methods, and unseen behind-the-scenes tales.',
      },
    ],
    narrativeTitle: 'Experience flow',
    narrativeBody:
      'The visit begins with a lotus tea welcome and an overview of the museum. You then explore themed rooms devoted to urban life, wartime memories, calligraphy, and folk artistry. Each stop invites questions and conversation.',
    bulletPoints: [
      'Sip traditional lotus tea prepared by the owner.',
      'Discover the context behind rare documentary photographs.',
      'Try your hand at calligraphy or carving a personal seal.',
    ],
    galleryCaptions: [
      'Curated collection of memorabilia',
      'Wartime stamp archives',
      'Da Nang Heritage Museum exterior',
      'Contemporary fine arts showcase',
    ],
    closing: [
      'A visit here lets you reconnect with history through heartfelt storytelling. Small artefacts carry profound meaning when shared with passion.',
      'Reserve in advance so we can coordinate an intimate session tailored to your interests.',
    ],
  },
};

const GALLERY_IMAGES = [
  'https://s-aicmscdn.vietnamhoinhap.vn/vnhn-media/21/5/6/anh-6-bao-tang.jpg',
  'https://media.vietnamplus.vn/images/c13ed6c3a920050ef6858e8d40c88c1782887b816706cd35f8d740c4464e912e2516a70946f73241f257261976faa21a384593e893843c32e7cf2997f93f8ca83292ddff4940b0a876d286ccb96b335ea1c455b753fcc199690f8bcc33a03ef3138fbd725934f8abc143e45c860bf7ed/ttxvn-bao-tang-tinh-thanh-hoa-noi-luu-giu-ky-uc-ham-rong-chien-thang2-resize.jpg',
  'https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2022/1/11/993985/Bao-Tang-Da-Nang-2.jpg',
  'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/c1/d4/4d/da-nang-fine-arts-museum.jpg?w=1200&h=-1&s=1',
];

function MuseumExperience() {
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

export default MuseumExperience;
