import { useMemo } from 'react';
import '../styles/experienceDetail.css';
import { useLanguage } from '../context/LanguageContext.jsx';

const CONTENT = {
  vi: {
    hero: {
      kicker: 'Heritage Performance',
      title: 'Nghệ thuật múa rối nước',
      subtitle:
        'Theo chân nghệ nhân để lắng nghe nhịp trống, nhìn những con rối sống động giữa mặt nước và hiểu vì sao di sản này khiến thế giới say mê.',
    },
    intro: [
      'Múa rối nước ra đời từ đồng bằng Bắc Bộ cách đây hơn 1000 năm. Từ những sân đình mùa lũ, người nông dân đã sáng tạo nên loại hình nghệ thuật kết hợp âm nhạc, ánh sáng, cơ khí và kể chuyện độc đáo.',
      'Trải nghiệm chuyên sâu giúp bạn gặp gỡ nghệ nhân hậu trường, khám phá cơ chế điều khiển rối, thưởng thức trích đoạn kinh điển và tự tay thử điều khiển những con rối nhỏ.',
    ],
    valuesTitle: 'Giá trị trải nghiệm',
    values: [
      {
        title: 'Hiểu cội nguồn di sản',
        description:
          'Tìm hiểu lịch sử hình thành, ý nghĩa tín ngưỡng và sự biến đổi của nghệ thuật múa rối nước qua các triều đại.',
      },
      {
        title: 'Gặp gỡ nghệ nhân',
        description:
          'Lắng nghe những người thổi hồn vào sân khấu nước chia sẻ bí quyết chế tác, luyện tập và gìn giữ nghề.',
      },
      {
        title: 'Tương tác thực tế',
        description:
          'Thử điều khiển rối mini, học cách phối hợp nhạc cụ dân tộc và nhịp trống trong từng phân đoạn.',
      },
    ],
    narrativeTitle: 'Không chỉ là buổi diễn',
    narrativeBody:
      'Chương trình kéo dài khoảng 90 phút gồm tour hậu trường, gặp gỡ nghệ nhân và xem biểu diễn. Bạn được quan sát cơ chế vận hành sân khấu nước, thử chạm tay vào con rối gỗ và nghe nghệ nhân kể về những chuyến lưu diễn quốc tế.',
    bulletPoints: [
      'Giới thiệu nhạc cụ dân tộc và vai trò của từng nghệ sĩ trong dàn nhạc.',
      'Trải nghiệm đứng sau phông, nhìn nghệ nhân điều khiển rối dưới nước.',
      'Thưởng thức các tích cổ: Chú Tễu, múa rồng, múa phượng, đánh cáo bắt vịt.',
    ],
    galleryCaptions: ['Sân khấu múa rối nước truyền thống', 'Nghệ nhân chuẩn bị rối sau hậu trường', 'Khách thử điều khiển rối mini', 'Dàn nhạc dân tộc sống động'],
    closing: [
      'Múa rối nước là sự kết hợp của kỹ thuật, âm nhạc và tâm hồn người Việt. Khi hiểu phía sau ánh đèn là sự nỗ lực truyền đời của nghệ nhân, bạn sẽ trân trọng di sản này hơn.',
      'Liên hệ với chúng tôi để đặt chỗ cho suất diễn riêng hoặc kết hợp cùng hành trình văn hoá Hà Nội.',
    ],
  },
  en: {
    hero: {
      kicker: 'Heritage Performance',
      title: 'The Art of Water Puppetry',
      subtitle:
        'Step behind the curtain with master puppeteers, feel the drumbeats, and witness wooden puppets dance on the water’s surface.',
    },
    intro: [
      'Water puppetry was born over a millennium ago in the Red River Delta. Farmers used flooded rice paddies as stages, crafting stories that blend music, mechanics, and folklore.',
      'This immersive experience lets you meet the artists backstage, explore the engineering of the puppets, enjoy signature performances, and try handling miniature puppets yourself.',
    ],
    valuesTitle: 'Why you will love it',
    values: [
      {
        title: 'Discover living heritage',
        description:
          'Learn about the art form’s origins, spiritual symbolism, and evolution through Vietnam’s dynasties.',
      },
      {
        title: 'Meet the masters',
        description:
          'Hear directly from the artisans who carve, paint, and animate the puppets, keeping the craft alive.',
      },
      {
        title: 'Hands-on experience',
        description:
          'Experiment with mini puppets, coordinate with traditional instruments, and feel the rhythm behind each scene.',
      },
    ],
    narrativeTitle: 'Beyond a show',
    narrativeBody:
      'The 90-minute program covers a backstage tour, artist talk, and curated performance. Observe the underwater mechanisms, touch handcrafted puppets, and hear stories about international tours.',
    bulletPoints: [
      'Introduction to the traditional orchestra and each musician’s role.',
      'Backstage access to see how puppets are controlled beneath the water.',
      'Featured acts include Teu the narrator, dragon dances, phoenix dances, and folk games.',
    ],
    galleryCaptions: ['Traditional water puppet stage', 'Artisan preparing puppets backstage', 'Guests trying miniature puppets', 'Vibrant traditional orchestra'],
    closing: [
      'Water puppetry unites technique, music, and Vietnamese soul. Knowing the devotion behind each performance deepens your appreciation of this heritage art.',
      'Contact us to arrange a private showtime or pair it with a broader Hanoi cultural journey.',
    ],
  },
};

const GALLERY_IMAGES = [
  'https://consosukien.vn/pic/News/Nam_2022/ro-i-nuo-c-loa-i-hi-nh-nghe-thuat-dan-gian-doc-dao-cua-vie-t-nam.jpg',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoXoNSwKRUMlOiO6aZwJswokLV-3xZT88dIg&s',
  'https://images.baodantoc.vn/uploads/2021/Th%C3%A1ng_11/Ng%C3%A0y_29/NG%C3%82N/m%C3%BAa%20r%E1%BB%91i/ti%E1%BA%BFt%20m%E1%BB%A5c%20m%C3%BAa%20r%E1%BB%91i%20n%C6%B0%E1%BB%9Bc%20c%E1%BB%A7a%20NH%20m%C3%BAa%20r%E1%BB%91i%20Th%C4%83ng%20Long%20sua.jpg',
  'https://bcp.cdnchinhphu.vn/Uploaded/buithuhuong/2021_02_10/roi%20nuoc.jpg',
];

function WaterPuppetryExperience() {
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
    <div className="experience-detail" data-accent="ruby">
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

export default WaterPuppetryExperience;
