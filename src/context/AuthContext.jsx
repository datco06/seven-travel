import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { STAY_CATALOG } from '../data/stayCatalog.js';
import { supabase } from '../lib/supabaseClient.js';

const AuthContext = createContext(null);

function createId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
}

function slugify(input) {
  return input
    .replace(/Đ/g, 'D')
    .replace(/đ/g, 'd')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s-]+/g, '-')
    .replace(/-+/g, '-');
}

function sanitizePhoneNumber(raw) {
  if (!raw) return '';
  return raw.replace(/\D/g, '');
}

function buildAuthEmail(identifier) {
  if (!identifier) return '';
  const trimmed = identifier.trim().toLowerCase();
  if (trimmed.includes('@')) {
    return trimmed;
  }
  const digits = sanitizePhoneNumber(trimmed);
  const base = digits || trimmed.replace(/\s+/g, '');
  const handle = base ? `traveler${base}` : `traveler${Date.now()}`;
  return `${handle}@seven-travel.app`;
}

const RAW_INITIAL_TOURS = [
  {
    id: 'tour-ha-noi-2n1d-heritage',
    name: '2N1Đ Hà Nội – Cà phê phố cổ & văn hiến',
    slug: '2n1d-ha-noi-ca-phe-pho-co-van-hien',
    duration: '2 ngày 1 đêm',
    durationLabel: '2 ngày 1 đêm',
    durationDays: 2,
    durationNights: 1,
    price: 4800000,
    pricing: {
      adult: 4800000,
      child: 3300000,
      notes: 'Trẻ em dưới 5 tuổi miễn phí ngủ chung giường bố mẹ.',
    },
    summary:
      'Hai ngày khám phá Hà Nội với cà phê phố cổ, phố đi bộ Hồ Gươm và đêm nghệ thuật Tinh hoa Bắc Bộ.',
    description:
      'Lịch trình tinh gọn kết hợp trải nghiệm ẩm thực đường phố, thưởng trà đạo và đêm diễn thực cảnh Tinh hoa Bắc Bộ.',
    regions: ['Hà Nội'],
    heroImage: '/anh/ha-noi-2n1d-heritage.jpg',
    gallery: [
      '/anh/ha-noi-2n1d-heritage.jpg',
      '/anh/ha-noi-2n1d-heritage-2.jpg',
      '/anh/ha-noi-2n1d-heritage-3.jpg',
    ],
    includes: [
      { label: 'Khách sạn boutique phố cổ 4*', included: true },
      { label: 'Tour cà phê & ẩm thực đêm', included: true },
      { label: 'Vé show Tinh hoa Bắc Bộ', included: true },
      { label: 'Hướng dẫn viên song ngữ', included: true },
      { label: 'Chi phí mua sắm cá nhân', included: false },
      { label: 'Bảo hiểm du lịch', included: false },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Ngày 1 – Phố cổ & nghệ thuật đêm',
        description:
          'Đón khách, check-in khách sạn, tham quan phố cổ, thưởng thức chả cá và café trứng. Tối xem show Tinh hoa Bắc Bộ ở Quốc Oai, dạo phố đi bộ Hoàn Kiếm.',
        image: '/anh/ha-noi-2n1d-heritage-1.jpg',
      },
      {
        day: 2,
        title: 'Ngày 2 – Văn hiến Hồ Tây',
        description:
          'Buổi sáng đạp xe quanh Hồ Tây, ghé chùa Trấn Quốc. Trưa thưởng thức bún thang, chiều tham quan di tích Hoàng thành Thăng Long và kết thúc lúc 17:00.',
        image: '/anh/ha-noi-2n1d-heritage-2.jpg',
      },
    ],
    departureCity: 'Hà Nội',
    createdAt: new Date('2025-04-10T08:00:00').toISOString(),
  },
  {
    id: 'tour-ha-noi-3n2d-craft-night',
    name: '3N2Đ Hà Nội – Làng nghề & nghệ thuật đêm',
    slug: '3n2d-ha-noi-lang-nghe-nghe-thuat',
    duration: '3 ngày 2 đêm',
    durationLabel: '3 ngày 2 đêm',
    durationDays: 3,
    durationNights: 2,
    price: 6600000,
    pricing: {
      adult: 6600000,
      child: 4500000,
      notes: 'Giảm 10% cho nhóm từ 4 khách trở lên.',
    },
    summary:
      'Ba ngày khám phá Hà Nội qua làng gốm Bát Tràng, không gian đương đại Long Biên và tour ẩm thực đêm.',
    description:
      'Tận hưởng kỳ nghỉ cân bằng giữa văn hoá, nghệ thuật và thư giãn với spa hồ sen, lớp làm gốm và show thực cảnh Thăng Long.',
    regions: ['Hà Nội'],
    heroImage: '/anh/ha-noi-3n2d-craft.jpg',
    gallery: [
      '/anh/ha-noi-3n2d-craft.jpg',
      '/anh/ha-noi-3n2d-craft-2.jpg',
      '/anh/ha-noi-3n2d-craft-3.jpg',
    ],
    includes: [
      { label: 'Khách sạn 5* trung tâm', included: true },
      { label: 'Lớp làm gốm Bát Tràng', included: true },
      { label: 'Vé show thực cảnh Thăng Long', included: true },
      { label: 'Liệu trình spa hồ sen', included: true },
      { label: 'Đồ uống trong minibar', included: false },
      { label: 'Chi phí cá nhân khác', included: false },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Ngày 1 – Trái tim phố cổ',
        description:
          'Đón khách tại Hà Nội, tham quan Văn Miếu và khu Pháp cổ. Chiều trải nghiệm xe jeep dạo hồ Tây, tối food tour phố cổ.',
        image: '/anh/ha-noi-3n2d-craft-1.jpg',
      },
      {
        day: 2,
        title: 'Ngày 2 – Làng nghề & nghệ thuật',
        description:
          'Buổi sáng ra làng gốm Bát Tràng làm sản phẩm riêng, trưa ăn đặc sản. Chiều tham quan trung tâm nghệ thuật Long Biên, tối xem show thực cảnh.',
        image: '/anh/ha-noi-3n2d-craft-2.jpg',
      },
      {
        day: 3,
        title: 'Ngày 3 – Nghỉ ngơi & mua sắm',
        description:
          'Sáng thư giãn với spa hồ sen, trưa thưởng thức phở bò truyền thống. Chiều tự do shopping tại Lotte Center, tiễn sân bay/ga cuối ngày.',
        image: '/anh/ha-noi-3n2d-craft-3.jpg',
      },
    ],
    departureCity: 'Hà Nội',
    createdAt: new Date('2025-04-14T08:30:00').toISOString(),
  },
  {
    id: 'tour-ha-noi-4n3d-ba-vi',
    name: '4N3Đ Hà Nội – Ba Vì xanh & thành phố sáng đèn',
    slug: '4n3d-ha-noi-ba-vi-van-hoa',
    duration: '4 ngày 3 đêm',
    durationLabel: '4 ngày 3 đêm',
    durationDays: 4,
    durationNights: 3,
    price: 8700000,
    pricing: {
      adult: 8700000,
      child: 5900000,
      notes: 'Bao gồm xe riêng di chuyển nội thành & Ba Vì.',
    },
    summary:
      'Bốn ngày tận hưởng Hà Nội, nghỉ dưỡng núi Ba Vì, workshop trà sen và dinner cruise sông Hồng.',
    description:
      'Lịch trình kết hợp thiên nhiên và văn hoá: trekking vườn quốc gia Ba Vì, chụp ảnh áo dài phố cổ, cruise dinner trên sông Hồng.',
    regions: ['Hà Nội'],
    heroImage: '/anh/ha-noi-4n3d-ba-vi.jpg',
    gallery: [
      '/anh/ha-noi-4n3d-ba-vi.jpg',
      '/anh/ha-noi-4n3d-ba-vi-2.jpg',
      '/anh/ha-noi-4n3d-ba-vi-3.jpg',
    ],
    includes: [
      { label: 'Resort 4* tại Ba Vì 1 đêm', included: true },
      { label: 'Dinner cruise sông Hồng', included: true },
      { label: 'Workshop trà sen Hồ Tây', included: true },
      { label: 'Xe riêng theo lịch trình', included: true },
      { label: 'Ảnh áo dài cá nhân', included: false },
      { label: 'Chi phí bar & club', included: false },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Ngày 1 – Hà Nội di sản',
        description:
          'Check-in khách sạn, tham quan Lăng Chủ tịch, Nhà sàn Bác Hồ và bảo tàng. Tối thưởng thức bánh tôm Hồ Tây và đi thuyền ngắm đêm Hồ Gươm.',
        image: '/anh/ha-noi-4n3d-ba-vi-1.jpg',
      },
      {
        day: 2,
        title: 'Ngày 2 – Ba Vì xanh mát',
        description:
          'Rời Hà Nội lên Ba Vì, trekking rừng tùng, picnic ở đồi cỏ lau và tắm lá người Mường. Tối đốt lửa trại, giao lưu văn hóa.',
        image: '/anh/ha-noi-4n3d-ba-vi-2.jpg',
      },
      {
        day: 3,
        title: 'Ngày 3 – Trà sen & sáng tạo',
        description:
          'Trở lại Hà Nội, tham gia workshop ướp trà sen, chiều gallery tour phố Tràng Tiền. Tối dinner cruise sông Hồng với set menu 5 món.',
        image: '/anh/ha-noi-4n3d-ba-vi-3.jpg',
      },
      {
        day: 4,
        title: 'Ngày 4 – Chill & mua sắm',
        description:
          'Sáng tự do chụp ảnh áo dài, trưa thưởng thức bún chả Obama. Chiều shopping tại Vincom Metropolis, tiễn đoàn ra sân bay/ga.',
        image: '/anh/ha-noi-4n3d-ba-vi-4.jpg',
      },
    ],
    departureCity: 'Hà Nội',
    createdAt: new Date('2025-04-20T09:00:00').toISOString(),
  },
  {
    id: 'tour-hai-phong-2n1d-do-son-chill',
    name: '2N1Đ Hải Phòng – Đồ Sơn chill & hải sản phố',
    slug: '2n1d-hai-phong-do-son-chill',
    duration: '2 ngày 1 đêm',
    durationLabel: '2 ngày 1 đêm',
    durationDays: 2,
    durationNights: 1,
    price: 3950000,
    pricing: {
      adult: 3950000,
      child: 2650000,
      notes: 'Miễn phí cho trẻ em dưới 4 tuổi ngủ chung.',
    },
    summary:
      'Đưa bạn đến Đồ Sơn thư giãn, check-in Casino cũ, thưởng thức bánh mì cay, chè dừa dầm và chợ đêm Tam Bạc.',
    description:
      'Tour nghỉ dưỡng nhẹ nhàng tại Đồ Sơn với villa hướng biển, trải nghiệm paddle board bình minh và ẩm thực đường phố Hải Phòng.',
    regions: ['Hải Phòng'],
    heroImage: '/anh/hai-phong-2n1d.jpg',
    gallery: [
      '/anh/hai-phong-2n1d.jpg',
      '/anh/hai-phong-2n1d-2.jpg',
      '/anh/hai-phong-2n1d-3.jpg',
    ],
    includes: [
      { label: 'Villa biển Đồ Sơn 4*', included: true },
      { label: 'Bữa tối hải sản tươi', included: true },
      { label: 'Trải nghiệm chèo SUP bình minh', included: true },
      { label: 'Xe riêng đón tại trung tâm', included: true },
      { label: 'Chi phí trò chơi casino', included: false },
      { label: 'Đồ uống có cồn', included: false },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Ngày 1 – Đồ Sơn thư giãn',
        description:
          'Đón khách tại Hải Phòng, ghé nhà hát lớn và bảo tàng. Chiều về Đồ Sơn nhận villa, tắm biển, tối BBQ hải sản và dạo chợ đêm Tam Bạc.',
        image: '/anh/hai-phong-2n1d-1.jpg',
      },
      {
        day: 2,
        title: 'Ngày 2 – Bình minh & đặc sản',
        description:
          'Sáng chèo SUP đón bình minh, thưởng thức bún cá cay. Trưa trở lại trung tâm ăn bánh đa cua, mua sắm quà bánh mì cay rồi tiễn khách.',
        image: '/anh/hai-phong-2n1d-2.jpg',
      },
    ],
    departureCity: 'Hải Phòng',
    createdAt: new Date('2025-04-08T07:00:00').toISOString(),
  },
  {
    id: 'tour-hai-phong-3n2d-cat-ba-retreat',
    name: '3N2Đ Hải Phòng – Cát Bà retreat & vịnh Lan Hạ',
    slug: '3n2d-hai-phong-cat-ba-retreat',
    duration: '3 ngày 2 đêm',
    durationLabel: '3 ngày 2 đêm',
    durationDays: 3,
    durationNights: 2,
    price: 7850000,
    pricing: {
      adult: 7850000,
      child: 5200000,
      notes: 'Giảm 5% cho đoàn từ 6 khách.',
    },
    summary:
      'Trải nghiệm du thuyền Lan Hạ, kayak hang Sáng Tối, trekking rừng quốc gia và chill beach club Cát Cò.',
    description:
      'Lịch trình cân bằng thời gian trên du thuyền và nghỉ dưỡng resort, phù hợp gia đình yêu biển đảo.',
    regions: ['Hải Phòng'],
    heroImage: '/anh/hai-phong-3n2d.jpg',
    gallery: [
      '/anh/hai-phong-3n2d.jpg',
      '/anh/hai-phong-3n2d-2.jpg',
      '/anh/hai-phong-3n2d-3.jpg',
    ],
    includes: [
      { label: 'Resort 4* tại Cát Bà', included: true },
      { label: 'Du thuyền Lan Hạ 1 ngày', included: true },
      { label: 'Kayak & bơi biển', included: true },
      { label: 'Ăn sáng buffet & 2 bữa hải sản', included: true },
      { label: 'Đồ uống trên du thuyền', included: false },
      { label: 'Chi phí spa riêng', included: false },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Ngày 1 – Đến với đảo ngọc',
        description:
          'Đón khách tại sân bay Cát Bi, tham quan phố Tam Bạc, thưởng thức bánh đa cua. Chiều tàu cao tốc sang Cát Bà, nhận phòng resort.',
        image: '/anh/hai-phong-3n2d-1.jpg',
      },
      {
        day: 2,
        title: 'Ngày 2 – Du thuyền Lan Hạ',
        description:
          'Du thuyền khám phá vịnh Lan Hạ, kayak hang Sáng Tối, tắm biển Bãi Ba Trái Đào. Tối chill beach club với DJ.',
        image: '/anh/hai-phong-3n2d-2.jpg',
      },
      {
        day: 3,
        title: 'Ngày 3 – Rừng quốc gia & mua sắm',
        description:
          'Trekking nhẹ vườn quốc gia Cát Bà, ghé chợ hải sản mua quà. Trưa trả phòng, tàu về đất liền và tiễn khách.',
        image: '/anh/hai-phong-3n2d-3.jpg',
      },
    ],
    departureCity: 'Hải Phòng',
    createdAt: new Date('2025-04-16T09:00:00').toISOString(),
  },
  {
    id: 'tour-hai-phong-4n3d-lan-ha-lux',
    name: '4N3Đ Hải Phòng – Lan Hạ luxury & đảo Cát Ông',
    slug: '4n3d-hai-phong-lan-ha-luxury',
    duration: '4 ngày 3 đêm',
    durationLabel: '4 ngày 3 đêm',
    durationDays: 4,
    durationNights: 3,
    price: 10400000,
    pricing: {
      adult: 10400000,
      child: 7200000,
      notes: 'Bao gồm cano riêng thăm đảo Cát Ông.',
    },
    summary:
      'Combo nghỉ dưỡng 2 đêm du thuyền sang trọng, 1 đêm resort Cát Ông, khám phá làng chài Việt Hải và câu mực đêm.',
    description:
      'Thưởng thức hành trình cao cấp với bữa tối fine-dining trên boong, lớp nấu ăn hải sản và lặn biển ngắm san hô đảo Cát Ông.',
    regions: ['Hải Phòng'],
    heroImage: '/anh/hai-phong-4n3d.jpg',
    gallery: [
      '/anh/hai-phong-4n3d.jpg',
      '/anh/hai-phong-4n3d-2.jpg',
      '/anh/hai-phong-4n3d-3.jpg',
    ],
    includes: [
      { label: 'Du thuyền 5* 2 đêm', included: true },
      { label: 'Resort đảo Cát Ông', included: true },
      { label: 'Cano riêng thăm đảo hoang', included: true },
      { label: 'Lớp nấu ăn hải sản', included: true },
      { label: 'Đồ uống cao cấp trên boong', included: false },
      { label: 'Phí tip hướng dẫn viên', included: false },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Ngày 1 – Nhịp sống đất Cảng',
        description:
          'Chào đón tại Hải Phòng, tham quan bảo tàng, ăn trưa bánh đa cua. Chiều lên du thuyền, thưởng trà chiều và ngắm hoàng hôn.',
        image: '/anh/hai-phong-4n3d-1.jpg',
      },
      {
        day: 2,
        title: 'Ngày 2 – Vịnh Lan Hạ & Việt Hải',
        description:
          'Dậy sớm tập thái cực quyền, ăn sáng trên boong. Cả ngày khám phá làng Việt Hải bằng xe đạp và chèo kayak vịnh.',
        image: '/anh/hai-phong-4n3d-2.jpg',
      },
      {
        day: 3,
        title: 'Ngày 3 – Cát Ông hoang sơ',
        description:
          'Cano riêng đưa tới đảo Cát Ông, snorkeling san hô và picnic. Chiều về resort, tối BBQ bãi biển và câu mực đêm.',
        image: '/anh/hai-phong-4n3d-3.jpg',
      },
      {
        day: 4,
        title: 'Ngày 4 – Tạm biệt biển đảo',
        description:
          'Ăn sáng nhẹ, thư giãn spa. Trưa tàu về đất liền, ghé chợ con mua đặc sản rồi tiễn khách.',
        image: '/anh/hai-phong-4n3d-4.jpg',
      },
    ],
    departureCity: 'Hải Phòng',
    createdAt: new Date('2025-04-25T10:00:00').toISOString(),
  },
  {
    id: 'tour-ninh-binh-2n1d-sac-mau-di-san',
    name: '2N1Đ Hà Nội – Ninh Bình: Sắc màu di sản',
    slug: '2n1d-ninh-binh-sac-mau-di-san',
    duration: '2 ngày 1 đêm',
    durationLabel: '2 ngày 1 đêm',
    durationDays: 2,
    durationNights: 1,
    price: 6800000,
    pricing: {
      adult: 6800000,
      child: 4600000,
      notes: 'Bao gồm xe riêng Hà Nội – Ninh Bình.',
    },
    summary:
      'Kỳ nghỉ cuối tuần kết hợp nhịp sống thủ đô và thiên nhiên Tràng An, picnic đồng lúa Tam Cốc.',
    description:
      'Ngày đầu khám phá Hà Nội và Tràng An, tối nghỉ resort thiên nhiên. Ngày tiếp theo đạp xe Tam Cốc, thưởng thức đặc sản dê núi trước khi trở lại Hà Nội.',
    regions: ['Ninh Bình'],
    heroImage: '/anh/image copy 31.png',
    gallery: ['/anh/image copy 31.png', '/anh/image copy 35.png', '/anh/image copy 29.png'],
    includes: [
      { label: 'Resort sinh thái Ninh Bình', included: true },
      { label: 'Xe đưa đón riêng Hà Nội - Ninh Bình', included: true },
      { label: 'Vé thuyền Tràng An & Bích Động', included: true },
      { label: 'Hướng dẫn viên địa phương', included: true },
      { label: 'Chi phí cá nhân', included: false },
      { label: 'Đồ uống ngoài chương trình', included: false },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Hà Nội – Tràng An huyền thoại',
        description:
          'Đón khách tại Hà Nội, dạo phố cổ, ăn trưa bún chả. Chiều di chuyển Ninh Bình, chèo thuyền Tràng An, check-in cố đô Hoa Lư và nghỉ dưỡng resort.',
        image: '/anh/image copy 30.png',
      },
      {
        day: 2,
        title: 'Tam Cốc – Picnic đồng lúa',
        description:
          'Sáng đạp xe xuyên đồng lúa Tam Cốc, thăm chùa Bích Động. Trưa thưởng thức đặc sản dê núi, chiều trở lại Hà Nội, kết thúc hành trình lúc 17:30.',
        image: '/anh/image copy 33.png',
      },
    ],
    departureCity: 'Hà Nội',
    createdAt: new Date('2025-04-01T08:00:00').toISOString(),
  },
  {
    id: 'tour-ninh-binh-3n2d-hang-mua',
    name: '3N2Đ Ninh Bình – Hang Múa & xứ sơn thuỷ hữu tình',
    slug: '3n2d-ninh-binh-hang-mua',
    duration: '3 ngày 2 đêm',
    durationLabel: '3 ngày 2 đêm',
    durationDays: 3,
    durationNights: 2,
    price: 8200000,
    pricing: {
      adult: 8200000,
      child: 5600000,
      notes: 'Tặng vé đạp xe sunset Tam Cốc.',
    },
    summary:
      'Chinh phục Hang Múa, ngắm hoàng hôn Tam Cốc, thuyền dọc sông Ngô Đồng và trải nghiệm làm cơm cháy gia truyền.',
    description:
      'Tour 3 ngày đưa bạn khám phá Ninh Bình sâu hơn với homestay boutique, trải nghiệm nấu ăn, chèo SUP trên hồ Đồng Thái.',
    regions: ['Ninh Bình'],
    heroImage: '/anh/ninh-binh-3n2d.jpg',
    gallery: [
      '/anh/ninh-binh-3n2d.jpg',
      '/anh/ninh-binh-3n2d-2.jpg',
      '/anh/ninh-binh-3n2d-3.jpg',
    ],
    includes: [
      { label: 'Homestay boutique view núi', included: true },
      { label: 'Vé Hang Múa & Tam Cốc', included: true },
      { label: 'Workshop làm cơm cháy', included: true },
      { label: 'SUP hồ Đồng Thái', included: true },
      { label: 'Đồ uống đặc biệt', included: false },
      { label: 'Chi phí ảnh kỷ niệm', included: false },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Ngày 1 – Hang Múa & sunset',
        description:
          'Check-in homestay, leo 500 bậc Hang Múa ngắm toàn cảnh Tam Cốc. Chiều chèo SUP hồ Đồng Thái, tối BBQ sân vườn.',
        image: '/anh/ninh-binh-3n2d-1.jpg',
      },
      {
        day: 2,
        title: 'Ngày 2 – Tam Cốc & làng nghề',
        description:
          'Sáng chèo thuyền Tam Cốc, trưa thăm làng thêu Văn Lâm. Chiều trải nghiệm làm cơm cháy gia truyền, tối xem múa rối nước.',
        image: '/anh/ninh-binh-3n2d-2.jpg',
      },
      {
        day: 3,
        title: 'Ngày 3 – Tuyệt tình cốc & trở về',
        description:
          'Thăm động Am Tiên, thưởng thức trà sen. Trưa ăn dê hấp tương gừng, chiều trả phòng và trở về.',
        image: '/anh/ninh-binh-3n2d-3.jpg',
      },
    ],
    departureCity: 'Ninh Bình',
    createdAt: new Date('2025-04-12T09:30:00').toISOString(),
  },
  {
    id: 'tour-ninh-binh-4n3d-van-long',
    name: '4N3Đ Ninh Bình – Vân Long, Cúc Phương & nghỉ dưỡng',
    slug: '4n3d-ninh-binh-van-long-cuc-phuong',
    duration: '4 ngày 3 đêm',
    durationLabel: '4 ngày 3 đêm',
    durationDays: 4,
    durationNights: 3,
    price: 9900000,
    pricing: {
      adult: 9900000,
      child: 6900000,
      notes: 'Bao gồm hướng dẫn viên chuyên về sinh thái.',
    },
    summary:
      'Hành trình chuyên sâu khám phá khu bảo tồn đất ngập nước Vân Long, rừng Cúc Phương và nghỉ dưỡng suối khoáng Kênh Gà.',
    description:
      'Phù hợp gia đình yêu thiên nhiên: đạp xe xuyên làng Nho Quan, tham quan bảo tồn linh trưởng, câu cá buổi tối tại resort.',
    regions: ['Ninh Bình'],
    heroImage: '/anh/ninh-binh-4n3d.jpg',
    gallery: [
      '/anh/ninh-binh-4n3d.jpg',
      '/anh/ninh-binh-4n3d-2.jpg',
      '/anh/ninh-binh-4n3d-3.jpg',
    ],
    includes: [
      { label: 'Resort suối khoáng 5*', included: true },
      { label: 'Vé tham quan Vân Long & Cúc Phương', included: true },
      { label: 'Xe đạp trekking & hướng dẫn viên', included: true },
      { label: 'Lớp làm nón lá Nho Quan', included: true },
      { label: 'Dịch vụ minibar', included: false },
      { label: 'Tip tự nguyện', included: false },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Ngày 1 – Vân Long hoang sơ',
        description:
          'Nhận phòng resort, chèo thuyền Vân Long quan sát voọc mông trắng, tối dùng bữa đặc sản dê núi.',
        image: '/anh/ninh-binh-4n3d-1.jpg',
      },
      {
        day: 2,
        title: 'Ngày 2 – Rừng Cúc Phương',
        description:
          'Khám phá vườn quốc gia Cúc Phương, thăm trung tâm cứu hộ linh trưởng và cây chò ngàn năm.',
        image: '/anh/ninh-binh-4n3d-2.jpg',
      },
      {
        day: 3,
        title: 'Ngày 3 – Làng cổ & suối khoáng',
        description:
          'Đạp xe làng cổ Đường Lâm, workshop làm nón lá. Chiều tắm suối khoáng Kênh Gà, tối câu cá và karaoke gia đình.',
        image: '/anh/ninh-binh-4n3d-3.jpg',
      },
      {
        day: 4,
        title: 'Ngày 4 – Thư giãn & tạm biệt',
        description:
          'Sáng yoga suối khoáng, brunch đặc sản, trả phòng và trở về Hà Nội.',
        image: '/anh/ninh-binh-4n3d-4.jpg',
      },
    ],
    departureCity: 'Ninh Bình',
    createdAt: new Date('2025-04-22T10:45:00').toISOString(),
  },
  {
    id: 'tour-son-la-2n1d-moc-chau-blossom',
    name: '2N1Đ Sơn La – Mộc Châu mùa hoa',
    slug: '2n1d-son-la-moc-chau-mua-hoa',
    duration: '2 ngày 1 đêm',
    durationLabel: '2 ngày 1 đêm',
    durationDays: 2,
    durationNights: 1,
    price: 3650000,
    pricing: {
      adult: 3650000,
      child: 2450000,
      notes: 'Bao gồm xe limousine Hà Nội – Mộc Châu.',
    },
    summary:
      'Trốn phố lên cao nguyên Mộc Châu săn hoa mận, thưởng trà shan tuyết và picnic đồi chè trái tim.',
    description:
      'Hành trình nhẹ nhàng phù hợp gia đình và cặp đôi với homestay gỗ, nướng BBQ lửa trại và trải nghiệm làm bánh dày người Mông.',
    regions: ['Sơn La'],
    heroImage: '/anh/son-la-2n1d.jpg',
    gallery: [
      '/anh/son-la-2n1d.jpg',
      '/anh/son-la-2n1d-2.jpg',
      '/anh/son-la-2n1d-3.jpg',
    ],
    includes: [
      { label: 'Homestay gỗ Mộc Châu', included: true },
      { label: 'Xe limousine khứ hồi', included: true },
      { label: 'BBQ lửa trại', included: true },
      { label: 'Workshop làm bánh dày', included: true },
      { label: 'Chi phí tắm sữa bò', included: false },
      { label: 'Đồ uống có cồn', included: false },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Ngày 1 – Đồi chè & trang trại bò',
        description:
          'Khởi hành tới Mộc Châu, check-in đồi chè trái tim, thăm trang trại bò sữa, tối BBQ lửa trại giao lưu văn nghệ.',
        image: '/anh/son-la-2n1d-1.jpg',
      },
      {
        day: 2,
        title: 'Ngày 2 – Săn mây & làng Mông',
        description:
          'Dậy sớm săn mây đồi Chè Ô, thưởng trà shan tuyết. Thăm làng văn hoá người Mông Pa Phách, trưa về Hà Nội.',
        image: '/anh/son-la-2n1d-2.jpg',
      },
    ],
    departureCity: 'Hà Nội',
    createdAt: new Date('2025-03-30T06:30:00').toISOString(),
  },
  {
    id: 'tour-son-la-3n2d-pa-phach',
    name: '3N2Đ Sơn La – Pa Phách & nông trại hữu cơ',
    slug: '3n2d-son-la-pa-phach',
    duration: '3 ngày 2 đêm',
    durationLabel: '3 ngày 2 đêm',
    durationDays: 3,
    durationNights: 2,
    price: 6550000,
    pricing: {
      adult: 6550000,
      child: 4300000,
      notes: 'Tặng voucher đặc sản Mộc Châu 300.000đ.',
    },
    summary:
      'Khám phá bản Pa Phách, trekking thác Dải Yếm, trải nghiệm farmstay hữu cơ và xông hơi lá thuốc người Thái.',
    description:
      'Tour phù hợp nhóm bạn yêu thiên nhiên với hoạt động trekking, hái dâu tây công nghệ cao và lớp làm phô mai tươi.',
    regions: ['Sơn La'],
    heroImage: '/anh/son-la-3n2d.jpg',
    gallery: [
      '/anh/son-la-3n2d.jpg',
      '/anh/son-la-3n2d-2.jpg',
      '/anh/son-la-3n2d-3.jpg',
    ],
    includes: [
      { label: 'Farmstay hữu cơ 4*', included: true },
      { label: 'Trekking thác Dải Yếm', included: true },
      { label: 'Lớp làm phô mai tươi', included: true },
      { label: 'Xông hơi lá thuốc người Thái', included: true },
      { label: 'Chi phí cưỡi ngựa', included: false },
      { label: 'Đồ uống đặc biệt', included: false },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Ngày 1 – Bản Pa Phách & trang trại dâu',
        description:
          'Đến Mộc Châu, tham quan bản Pa Phách, chụp ảnh hoa cải. Chiều hái dâu tây trong nhà kính, tối xông lá thuốc.',
        image: '/anh/son-la-3n2d-1.jpg',
      },
      {
        day: 2,
        title: 'Ngày 2 – Thác Dải Yếm & farmstay',
        description:
          'Trekking thác Dải Yếm, tham quan cầu kính tình yêu. Chiều học làm phô mai, tối giao lưu văn nghệ người Thái.',
        image: '/anh/son-la-3n2d-2.jpg',
      },
      {
        day: 3,
        title: 'Ngày 3 – Chợ phiên & trở về',
        description:
          'Sáng chợ phiên 70, thưởng thức thắng cố, sữa chua nếp cẩm. Trưa trả phòng, xe đưa về Hà Nội.',
        image: '/anh/son-la-3n2d-3.jpg',
      },
    ],
    departureCity: 'Hà Nội',
    createdAt: new Date('2025-04-05T07:45:00').toISOString(),
  },
  {
    id: 'tour-son-la-4n3d-song-da',
    name: '4N3Đ Sơn La – Sông Đà & đồi chè mùa mây',
    slug: '4n3d-son-la-song-da-doi-che',
    duration: '4 ngày 3 đêm',
    durationLabel: '4 ngày 3 đêm',
    durationDays: 4,
    durationNights: 3,
    price: 9400000,
    pricing: {
      adult: 9400000,
      child: 6400000,
      notes: 'Bao gồm nhà sàn cao cấp và du thuyền sông Đà.',
    },
    summary:
      'Hành trình độc đáo với du thuyền sông Đà, bản Phiêng Cằm, trekking Tà Xùa và săn mây trên sống lưng khủng long.',
    description:
      'Dành cho tín đồ khám phá miền núi: săn mây Tà Xùa, tham quan nhà máy chè, thưởng thức ẩm thực cá sông Đà.',
    regions: ['Sơn La'],
    heroImage: '/anh/son-la-4n3d.jpg',
    gallery: [
      '/anh/son-la-4n3d.jpg',
      '/anh/son-la-4n3d-2.jpg',
      '/anh/son-la-4n3d-3.jpg',
    ],
    includes: [
      { label: 'Nhà sàn cao cấp 2 đêm', included: true },
      { label: 'Du thuyền sông Đà', included: true },
      { label: 'Trekking Tà Xùa', included: true },
      { label: 'Workshop trà shan tuyết', included: true },
      { label: 'Chi phí đồ uống cao cấp', included: false },
      { label: 'Tip hướng dẫn viên', included: false },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Ngày 1 – Sông Đà huyền thoại',
        description:
          'Di chuyển tới Sơn La, lên du thuyền sông Đà, thưởng thức cá nướng pa pỉnh tộp, tối ngủ nhà sàn.',
        image: '/anh/son-la-4n3d-1.jpg',
      },
      {
        day: 2,
        title: 'Ngày 2 – Bản Phiêng Cằm & trà',
        description:
          'Thăm bản Phiêng Cằm, học nhuộm vải chàm, chiều workshop trà shan tuyết.',
        image: '/anh/son-la-4n3d-2.jpg',
      },
      {
        day: 3,
        title: 'Ngày 3 – Săn mây Tà Xùa',
        description:
          'Khởi hành sớm săn mây Tà Xùa, trekking sống lưng khủng long, trưa picnic trên đỉnh, chiều về nghỉ.',
        image: '/anh/son-la-4n3d-3.jpg',
      },
      {
        day: 4,
        title: 'Ngày 4 – Đồi chè & tạm biệt',
        description:
          'Thăm nhà máy chè, mua quà đặc sản. Trưa thưởng thức bê chao, chiều trở lại Hà Nội.',
        image: '/anh/son-la-4n3d-4.jpg',
      },
    ],
    departureCity: 'Hà Nội',
    createdAt: new Date('2025-04-28T06:50:00').toISOString(),
  },
  {
    id: 'tour-lao-cai-2n1d-sapa-highlight',
    name: '2N1Đ Lào Cai – Sa Pa highlights',
    slug: '2n1d-lao-cai-sapa-highlight',
    duration: '2 ngày 1 đêm',
    durationLabel: '2 ngày 1 đêm',
    durationDays: 2,
    durationNights: 1,
    price: 5500000,
    pricing: {
      adult: 5500000,
      child: 3600000,
      notes: 'Gồm vé tàu hạng thương gia Hà Nội – Lào Cai.',
    },
    summary:
      'Hai ngày săn mây Fansipan, check-in Cầu kính Rồng Mây và thưởng thức lẩu cá hồi đặc sản Sa Pa.',
    description:
      'Tour nhanh gọn cho người bận rộn: tàu đêm lên Sa Pa, tham quan bản Cát Cát và thư giãn tại café ngắm mây.',
    regions: ['Lào Cai'],
    heroImage: '/anh/lao-cai-2n1d.jpg',
    gallery: [
      '/anh/lao-cai-2n1d.jpg',
      '/anh/lao-cai-2n1d-2.jpg',
      '/anh/lao-cai-2n1d-3.jpg',
    ],
    includes: [
      { label: 'Vé tàu hạng thương gia', included: true },
      { label: 'Khách sạn 4* trung tâm Sa Pa', included: true },
      { label: 'Vé cáp treo Fansipan', included: true },
      { label: 'Tour bản Cát Cát', included: true },
      { label: 'Chi phí ảnh truyền thống', included: false },
      { label: 'Đồ uống café', included: false },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Ngày 1 – Đón mây & bản làng',
        description:
          'Tàu đêm đến Sa Pa, ăn sáng, lên Fansipan chụp ảnh biển mây. Chiều tham quan bản Cát Cát, tối ăn lẩu cá hồi.',
        image: '/anh/lao-cai-2n1d-1.jpg',
      },
      {
        day: 2,
        title: 'Ngày 2 – Cầu kính & café',
        description:
          'Sáng đi Cầu kính Rồng Mây, chiều café view Mường Hoa, mua sắm đặc sản rồi trở về Hà Nội.',
        image: '/anh/lao-cai-2n1d-2.jpg',
      },
    ],
    departureCity: 'Hà Nội',
    createdAt: new Date('2025-04-06T21:00:00').toISOString(),
  },
  {
    id: 'tour-lao-cai-3n2d-sapa-chill',
    name: '3N2Đ Lào Cai – Sa Pa chill & văn hoá bản địa',
    slug: '3n2d-lao-cai-sapa-chill',
    duration: '3 ngày 2 đêm',
    durationLabel: '3 ngày 2 đêm',
    durationDays: 3,
    durationNights: 2,
    price: 9250000,
    pricing: {
      adult: 9250000,
      child: 6200000,
      notes: 'Bao gồm vé cáp treo Fansipan và xe jeep bản địa.',
    },
    summary:
      'Ba ngày săn mây Fansipan, trekking bản Tả Van và nghỉ homestay view thung lũng Mường Hoa.',
    description:
      'Đi tàu đêm lên Sa Pa, tận hưởng khí trời 18 độ, thưởng thức lẩu cá hồi và giao lưu văn nghệ với người H’Mông.',
    regions: ['Lào Cai'],
    heroImage: '/anh/lao-cai-3n2d.jpg',
    gallery: [
      '/anh/lao-cai-3n2d.jpg',
      '/anh/lao-cai-3n2d-2.jpg',
      '/anh/lao-cai-3n2d-3.jpg',
    ],
    includes: [
      { label: 'Vé tàu cabin Hà Nội - Lào Cai', included: true },
      { label: 'Homestay view ruộng bậc thang', included: true },
      { label: 'Vé cáp treo Fansipan', included: true },
      { label: 'Hướng dẫn viên bản địa', included: true },
      { label: 'Chi phí café & đồ uống riêng', included: false },
      { label: 'Tiền tip tự nguyện', included: false },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Ngày 1 – Check-in thị trấn Sa Pa',
        description:
          'Đón đoàn tại Lào Cai, lên Sa Pa thăm nhà thờ đá và hồ trung tâm. Chiều khám phá bản Cát Cát, tối nghỉ homestay.',
        image: '/anh/lao-cai-3n2d-1.jpg',
      },
      {
        day: 2,
        title: 'Ngày 2 – Fansipan & bản Tả Van',
        description:
          'Đi cáp treo Fansipan, chụp ảnh biển mây, thưởng thức café view núi. Chiều thăm bản Tả Van, tối ăn lẩu cá hồi.',
        image: '/anh/lao-cai-3n2d-2.jpg',
      },
      {
        day: 3,
        title: 'Ngày 3 – Trekking Mường Hoa',
        description:
          'Sáng trekking thung lũng Mường Hoa, ghé chợ phiên mua quà. Trưa trả phòng, khởi hành về Hà Nội.',
        image: '/anh/lao-cai-3n2d-3.jpg',
      },
    ],
    departureCity: 'Hà Nội',
    createdAt: new Date('2025-04-18T10:15:00').toISOString(),
  },
  {
    id: 'tour-lao-cai-4n3d-bac-ha',
    name: '4N3Đ Lào Cai – Bắc Hà, Y Tý & bản làng cổ',
    slug: '4n3d-lao-cai-bac-ha-y-ty',
    duration: '4 ngày 3 đêm',
    durationLabel: '4 ngày 3 đêm',
    durationDays: 4,
    durationNights: 3,
    price: 11200000,
    pricing: {
      adult: 11200000,
      child: 7600000,
      notes: 'Tour giới hạn 12 khách, xe off-road chuyên dụng.',
    },
    summary:
      'Khám phá chợ phiên Bắc Hà, ruộng bậc thang Y Tý và làng cổ Trung Đô với homestay người Hà Nhì.',
    description:
      'Lịch trình dành cho người mê khám phá vùng biên với trekking dã ngoại, camping và trải nghiệm nấu rượu ngô.',
    regions: ['Lào Cai'],
    heroImage: '/anh/lao-cai-4n3d.jpg',
    gallery: [
      '/anh/lao-cai-4n3d.jpg',
      '/anh/lao-cai-4n3d-2.jpg',
      '/anh/lao-cai-4n3d-3.jpg',
    ],
    includes: [
      { label: 'Xe off-road chuyên dụng', included: true },
      { label: 'Homestay người Hà Nhì', included: true },
      { label: 'Camping Y Tý', included: true },
      { label: 'Workshop nấu rượu ngô', included: true },
      { label: 'Chi phí thuê flycam', included: false },
      { label: 'Đồ uống đóng chai đặc biệt', included: false },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Ngày 1 – Sa Pa & bản Cát Cát',
        description:
          'Check-in Sa Pa, tham quan bản Cát Cát, tối giao lưu văn nghệ.',
        image: '/anh/lao-cai-4n3d-1.jpg',
      },
      {
        day: 2,
        title: 'Ngày 2 – Chợ phiên Bắc Hà',
        description:
          'Di chuyển tới Bắc Hà, khám phá chợ phiên, thưởng thức thắng cố, chiều thăm dinh Hoàng A Tường.',
        image: '/anh/lao-cai-4n3d-2.jpg',
      },
      {
        day: 3,
        title: 'Ngày 3 – Y Tý săn mây',
        description:
          'Hành trình off-road lên Y Tý, trekking ruộng bậc thang, camping đêm, thưởng thức ẩm thực người Hà Nhì.',
        image: '/anh/lao-cai-4n3d-3.jpg',
      },
      {
        day: 4,
        title: 'Ngày 4 – Làng cổ Trung Đô',
        description:
          'Thăm làng Trung Đô bên sông Chảy, trải nghiệm nấu rượu ngô, ăn trưa và về Hà Nội.',
        image: '/anh/lao-cai-4n3d-4.jpg',
      },
    ],
    departureCity: 'Hà Nội',
    createdAt: new Date('2025-04-26T22:15:00').toISOString(),
  },
  {
    id: 'tour-phu-tho-2n1d-den-hung',
    name: '2N1Đ Phú Thọ – Đền Hùng & suối khoáng Thanh Thủy',
    slug: '2n1d-phu-tho-den-hung-thanh-thuy',
    duration: '2 ngày 1 đêm',
    durationLabel: '2 ngày 1 đêm',
    durationDays: 2,
    durationNights: 1,
    price: 3200000,
    pricing: {
      adult: 3200000,
      child: 2100000,
      notes: 'Bao gồm xe limousine Hà Nội – Phú Thọ.',
    },
    summary:
      'Hành trình về Đất Tổ dâng hương Đền Hùng, tắm khoáng nóng Thanh Thủy và thưởng thức xôi nếp nương.',
    description:
      'Tour nhẹ nhàng cho gia đình với resort khoáng nóng, trải nghiệm làm bánh tai và xem hát xoan làng cổ.',
    regions: ['Phú Thọ'],
    heroImage: '/anh/phu-tho-2n1d.jpg',
    gallery: [
      '/anh/phu-tho-2n1d.jpg',
      '/anh/phu-tho-2n1d-2.jpg',
      '/anh/phu-tho-2n1d-3.jpg',
    ],
    includes: [
      { label: 'Resort khoáng nóng 4*', included: true },
      { label: 'Vé vào Đền Hùng & xe điện', included: true },
      { label: 'Buffet khoáng nóng', included: true },
      { label: 'Hướng dẫn viên địa phương', included: true },
      { label: 'Chi phí dịch vụ spa cao cấp', included: false },
      { label: 'Đồ uống có cồn', included: false },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Ngày 1 – Về Đất Tổ',
        description:
          'Khởi hành từ Hà Nội, dâng hương Đền Hùng, tham quan bảo tàng Hùng Vương. Chiều tắm khoáng nóng Thanh Thủy.',
        image: '/anh/phu-tho-2n1d-1.jpg',
      },
      {
        day: 2,
        title: 'Ngày 2 – Làng cổ & đặc sản',
        description:
          'Sáng xem hát xoan tại đình Hùng Lô, trải nghiệm làm bánh tai. Trưa thưởng thức thịt chua Thanh Sơn, chiều về Hà Nội.',
        image: '/anh/phu-tho-2n1d-2.jpg',
      },
    ],
    departureCity: 'Hà Nội',
    createdAt: new Date('2025-03-22T07:30:00').toISOString(),
  },
  {
    id: 'tour-phu-tho-3n2d-thanh-thuy',
    name: '3N2Đ Phú Thọ – Nghỉ dưỡng khoáng nóng & đồi chè Long Cốc',
    slug: '3n2d-phu-tho-thanh-thuy-long-coc',
    duration: '3 ngày 2 đêm',
    durationLabel: '3 ngày 2 đêm',
    durationDays: 3,
    durationNights: 2,
    price: 5600000,
    pricing: {
      adult: 5600000,
      child: 3800000,
      notes: 'Bao gồm phòng villa khoáng nóng riêng.',
    },
    summary:
      'Thư giãn tại villa khoáng nóng, săn mây đồi chè Long Cốc và trải nghiệm trồng chè cùng người bản địa.',
    description:
      'Tour kết hợp wellness và khám phá: yoga buổi sáng, đạp xe Tân Sơn, thưởng thức rượu cọ truyền thống.',
    regions: ['Phú Thọ'],
    heroImage: '/anh/phu-tho-3n2d.jpg',
    gallery: [
      '/anh/phu-tho-3n2d.jpg',
      '/anh/phu-tho-3n2d-2.jpg',
      '/anh/phu-tho-3n2d-3.jpg',
    ],
    includes: [
      { label: 'Villa khoáng nóng riêng', included: true },
      { label: 'Tour đồi chè Long Cốc', included: true },
      { label: 'Yoga buổi sáng', included: true },
      { label: 'Lớp pha trà truyền thống', included: true },
      { label: 'Dịch vụ karaoke', included: false },
      { label: 'Chi phí xe điện cá nhân', included: false },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Ngày 1 – Thanh Thủy thư giãn',
        description:
          'Nhận villa khoáng nóng, thư giãn onsen, chiều đạp xe bờ sông Đà, tối thưởng thức cá lăng om mẻ.',
        image: '/anh/phu-tho-3n2d-1.jpg',
      },
      {
        day: 2,
        title: 'Ngày 2 – Đồi chè Long Cốc',
        description:
          'Dậy sớm săn mây, tham gia hái và sao chè với người dân. Chiều workshop pha trà, tối xem biểu diễn trống hội.',
        image: '/anh/phu-tho-3n2d-2.jpg',
      },
      {
        day: 3,
        title: 'Ngày 3 – Văn hoá bản địa',
        description:
          'Thăm làng văn hoá Tân Sơn, trải nghiệm làm rượu cọ. Trưa ăn xôi ngũ sắc rồi trở về Hà Nội.',
        image: '/anh/phu-tho-3n2d-3.jpg',
      },
    ],
    departureCity: 'Hà Nội',
    createdAt: new Date('2025-04-02T08:45:00').toISOString(),
  },
  {
    id: 'tour-phu-tho-4n3d-van-hoa-dat-to',
    name: '4N3Đ Phú Thọ – Văn hoá Đất Tổ & trekking Xuân Sơn',
    slug: '4n3d-phu-tho-van-hoa-dat-to',
    duration: '4 ngày 3 đêm',
    durationLabel: '4 ngày 3 đêm',
    durationDays: 4,
    durationNights: 3,
    price: 8450000,
    pricing: {
      adult: 8450000,
      child: 5600000,
      notes: 'Bao gồm trekking hướng dẫn viên & vé hang động Xuân Sơn.',
    },
    summary:
      'Khám phá di sản văn hoá Đất Tổ, trekking vườn quốc gia Xuân Sơn, ngủ homestay nhà sàn và thưởng thức cọ ỏm.',
    description:
      'Hành trình kết hợp văn hoá, sinh thái và trải nghiệm nông nghiệp, phù hợp nhóm bạn năng động.',
    regions: ['Phú Thọ'],
    heroImage: '/anh/phu-tho-4n3d.jpg',
    gallery: [
      '/anh/phu-tho-4n3d.jpg',
      '/anh/phu-tho-4n3d-2.jpg',
      '/anh/phu-tho-4n3d-3.jpg',
    ],
    includes: [
      { label: 'Homestay nhà sàn 2 đêm', included: true },
      { label: 'Trekking vườn quốc gia Xuân Sơn', included: true },
      { label: 'Thưởng thức hát xoan', included: true },
      { label: 'Workshop làm nón lá Gia Thanh', included: true },
      { label: 'Chi phí đồ uống đặc sản', included: false },
      { label: 'Phí thuê xe máy riêng', included: false },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Ngày 1 – Di sản Đền Hùng',
        description:
          'Dâng hương Đền Hùng, tham quan bảo tàng, tối xem hát xoan tại đình Hùng Lô.',
        image: '/anh/phu-tho-4n3d-1.jpg',
      },
      {
        day: 2,
        title: 'Ngày 2 – Trekking Xuân Sơn',
        description:
          'Trekking hang Lạng, suối Tiên trong vườn quốc gia Xuân Sơn, picnic rừng, tắm suối Nước Lạnh.',
        image: '/anh/phu-tho-4n3d-2.jpg',
      },
      {
        day: 3,
        title: 'Ngày 3 – Làng nghề Gia Thanh',
        description:
          'Tham gia làm nón lá, trải nghiệm giã bánh tai. Chiều chèo bè gỗ trên sông Bứa, tối giao lưu lửa trại.',
        image: '/anh/phu-tho-4n3d-3.jpg',
      },
      {
        day: 4,
        title: 'Ngày 4 – Nông trại & tạm biệt',
        description:
          'Thăm nông trại hữu cơ, thưởng thức cọ ỏm và gà nhiều cựa. Trưa trở lại Hà Nội.',
        image: '/anh/phu-tho-4n3d-4.jpg',
      },
    ],
    departureCity: 'Hà Nội',
    createdAt: new Date('2025-04-18T07:20:00').toISOString(),
  },
];

const INITIAL_TRANSPORT = [
  {
    id: 'transport-limousine-mientrung',
    name: 'Limousine Đà Nẵng - Huế',
    price: 1800000,
    description: 'Đưa đón riêng 2 chiều, phục vụ nước suối và wifi, kèm dừng chân check-in đầm Lập An.',
    vehicleType: 'Limousine',
    capacity: 9,
    route: 'Đà Nẵng – Lăng Cô – Huế',
    durationHours: 3,
    amenities: ['Wifi', 'Nước suối', 'Ghế ngả 180°'],
  },
  {
    id: 'transport-thuyphi-phuquoc',
    name: 'Thuỷ phi cơ ngắm biển Phú Quốc',
    price: 5200000,
    description: '35 phút ngắm toàn cảnh đảo ngọc, bao gồm đưa đón tại khách sạn.',
    vehicleType: 'Thuỷ phi cơ',
    capacity: 12,
    route: 'Sân bay Phú Quốc – bờ Tây đảo',
    durationHours: 0.6,
    amenities: ['Tai nghe chống ồn', 'Hướng dẫn viên tiếng Anh', 'Bảo hiểm bay'],
  },
  {
    id: 'transport-sapa-express',
    name: 'Xe giường nằm Sapa Express',
    price: 960000,
    description: 'Khoang giường đôi thoải mái, đón trả tận nơi tại Hà Nội và Sa Pa.',
    vehicleType: 'Xe giường nằm',
    capacity: 28,
    route: 'Hà Nội – Lào Cai – Sa Pa',
    durationHours: 5.5,
    amenities: ['Giường đôi', 'Đồ ăn nhẹ', 'Hướng dẫn viên đi cùng'],
  },
  {
    id: 'transport-hcm-vungtau-16',
    name: 'Xe limousine 16 chỗ TP.HCM - Vũng Tàu',
    price: 4200000,
    description: 'Khứ hồi trong ngày, ghế bọc da, wifi tốc độ cao, nước suối và khăn lạnh không giới hạn.',
    vehicleType: 'Limousine 16 chỗ',
    capacity: 16,
    route: 'TP.HCM – Long Thành – Vũng Tàu',
    durationHours: 2.5,
    amenities: ['Đón trả tận nơi', 'Tài xế song ngữ', 'Nước suối & khăn lạnh'],
  },
  {
    id: 'transport-hcm-vungtau-32',
    name: 'Xe coach 32 chỗ TP.HCM - Vũng Tàu',
    price: 5600000,
    description: 'Phù hợp đoàn team building, trang bị micro, màn hình LED và khoang hành lý lớn.',
    vehicleType: 'Coach 32 chỗ',
    capacity: 32,
    route: 'TP.HCM – Cao tốc Long Thành – Vũng Tàu',
    durationHours: 2.5,
    amenities: ['Micro & màn hình LED', 'Nước suối', 'Bảo hiểm hành khách'],
  },
  {
    id: 'transport-hcm-vungtau-45',
    name: 'Xe coach 45 chỗ TP.HCM - Vũng Tàu',
    price: 7200000,
    description: 'Xe đời mới 45 chỗ, ghế ngả, điều hòa hai chiều phù hợp đoàn lớn và công ty.',
    vehicleType: 'Coach 45 chỗ',
    capacity: 45,
    route: 'TP.HCM – Long Thành – Vũng Tàu',
    durationHours: 2.5,
    amenities: ['Ghế ngả sâu', 'Khoang hành lý lớn', 'Tài xế 10+ năm kinh nghiệm'],
  },
  {
    id: 'transport-danang-hoian-16',
    name: 'Xe riêng 16 chỗ Đà Nẵng - Hội An - Bà Nà',
    price: 1950000,
    description: 'Lịch trình trọn ngày tham quan Bà Nà Hills và phố cổ Hội An, linh hoạt thời gian đón trả.',
    vehicleType: 'Minibus 16 chỗ',
    capacity: 16,
    route: 'Đà Nẵng – Bà Nà – Hội An',
    durationHours: 10,
    amenities: ['Wifi', 'Khăn lạnh', 'Nước suối', 'Tài xế kiêm hướng dẫn'],
  },
  {
    id: 'transport-hue-hoian-32',
    name: 'Xe 32 chỗ Huế - Đà Nẵng - Hội An',
    price: 3900000,
    description: 'Đón đoàn tại trung tâm Huế, dừng chân Lăng Cô, đưa tới Hội An và Đà Nẵng trong ngày.',
    vehicleType: 'Coach 32 chỗ',
    capacity: 32,
    route: 'Huế – Đèo Hải Vân – Đà Nẵng – Hội An',
    durationHours: 8,
    amenities: ['Tài xế bản địa', 'Thùng đá & nước suối', 'Hỗ trợ khai thác vé thắng cảnh'],
  },
  {
    id: 'transport-cantho-phuquoc-45',
    name: 'Xe 45 chỗ Cần Thơ - Hà Tiên - Phú Quốc',
    price: 9800000,
    description: 'Bao gồm vé phà cao tốc Hà Tiên - Phú Quốc, hướng dẫn viên và hỗ trợ nhận phòng resort.',
    vehicleType: 'Coach 45 chỗ',
    capacity: 45,
    route: 'Cần Thơ – Rạch Giá – Hà Tiên – Phú Quốc',
    durationHours: 9,
    amenities: ['Vé phà cao tốc', 'Bữa sáng nhẹ trên xe', 'Hướng dẫn viên đồng hành'],
  },
  {
    id: 'transport-saigon-phuquoc-16',
    name: 'Xe 16 chỗ Sài Gòn - Hà Tiên - Phú Quốc',
    price: 8500000,
    description: 'Tuyến riêng cho gia đình 6-12 khách, bao gồm vé phà và hỗ trợ làm thủ tục lên cano riêng.',
    vehicleType: 'Minibus 16 chỗ',
    capacity: 16,
    route: 'TP.HCM – Rạch Giá – Hà Tiên – Phú Quốc',
    durationHours: 10,
    amenities: ['Ghế ngả da', 'Wifi 4G', 'Phí phà & bến bãi', 'Tài xế kinh nghiệm'],
  },
];

const INITIAL_STAYS = STAY_CATALOG.map((stay) => ({
  id: stay.id,
  name: stay.name,
  price: stay.price,
  description: stay.description,
  destination: stay.destination,
  type: stay.type,
  rating: stay.rating ?? 4.8,
  amenities: stay.amenities ?? [],
}));

const INITIAL_TOURS = RAW_INITIAL_TOURS.map((tour) => {
  const heroSlug = tour.slug || slugify(tour.name);
  const heroImage = `/anh/taotour/${heroSlug}.jpg`;
  const itinerary = (tour.itinerary ?? []).map((item) => ({
    ...item,
    image: `/anh/taotour/${slugify(item.title)}.jpg`,
  }));
  return {
    ...tour,
    heroImage,
    gallery: [heroImage],
    itinerary,
  };
});

const INITIAL_USERS = [
  {
    id: 'user-admin',
    role: 'admin',
    name: 'Admin SEVEN TRAVEL',
    email: 'admin@traveltour.com',
    phone: '0909000000',
    password: 'admin123',
    balance: 0,
    transactions: [],
  },
  {
    id: 'user-khach-01',
    role: 'customer',
    name: 'Nguyễn Minh Anh',
    email: 'minhanh@example.com',
    phone: '0901234567',
    password: '123456',
    balance: 5000000,
    transactions: [
      {
        id: 'tx-1',
        type: 'topup',
        status: 'completed',
        amount: 5000000,
        createdAt: new Date('2025-05-01T08:30:00').toISOString(),
      },
      {
        id: 'tx-2',
        type: 'payment',
        status: 'completed',
        category: 'tour',
        referenceId: 'tour-van-hoa-cong-dong',
        amount: 3200000,
        createdAt: new Date('2025-05-10T10:15:00').toISOString(),
      },
    ],
  },
];

const INITIAL_BOOKINGS = [
  {
    id: 'bk-1',
    userId: 'user-khach-01',
    category: 'tour',
    productId: 'tour-van-hoa-cong-dong',
    productName: 'Hành trình Văn hoá & Cộng đồng Việt Nam',
    amount: 3200000,
    createdAt: new Date('2025-05-10T10:15:00').toISOString(),
  },
];

const INITIAL_TRANSPORT_CONTACTS = [];

const INITIAL_TOPUPS = [
  {
    id: 'tu-1',
    userId: 'user-khach-01',
    amount: 1500000,
    status: 'pending',
    createdAt: new Date('2025-05-20T09:00:00').toISOString(),
  },
];

const INITIAL_SUPPORT_MESSAGES = [];

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [supabaseUser, setSupabaseUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [tours, setTours] = useState(INITIAL_TOURS);
  const [transportOptions, setTransportOptions] = useState(INITIAL_TRANSPORT);
  const [stayOptions, setStayOptions] = useState(INITIAL_STAYS);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [topUpRequests, setTopUpRequests] = useState(INITIAL_TOPUPS);
  const [transportContacts, setTransportContacts] = useState(INITIAL_TRANSPORT_CONTACTS);
  const [supportMessages, setSupportMessages] = useState(INITIAL_SUPPORT_MESSAGES);

  const currentUser = users.find((user) => user.id === currentUserId) ?? null;

  useEffect(() => {
    let mounted = true;
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!mounted) return;
        setSupabaseUser(data.session?.user ?? null);
      })
      .finally(() => {
        if (mounted) setAuthLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSupabaseUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!supabaseUser) {
      setCurrentUserId(null);
      return;
    }

    const existing =
      users.find((user) => user.id === supabaseUser.id) ??
      (supabaseUser.email ? users.find((user) => user.email === supabaseUser.email) : null);

    if (existing) {
      if (existing.id !== currentUserId) {
        setCurrentUserId(existing.id);
      }
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const {
          data: profile,
          error: profileError,
        } = await supabase.from('profiles').select('*').eq('id', supabaseUser.id).maybeSingle();

        let resolvedProfile = profile;
        if (profileError && profileError.code !== 'PGRST116') {
          throw new Error(profileError.message);
        }

        if (!resolvedProfile) {
          resolvedProfile = await syncProfileThroughFunction({
            fullName:
              supabaseUser.user_metadata?.full_name ??
              supabaseUser.email ??
              `Traveler ${supabaseUser.id.slice(0, 6)}`,
            phoneNumber: supabaseUser.user_metadata?.phone ?? '',
            role: 'customer',
          });
        }

        if (cancelled || !resolvedProfile) {
          return;
        }

        mergeProfileIntoState(resolvedProfile, {
          id: supabaseUser.id,
          role: resolvedProfile?.role ?? 'customer',
          name:
            resolvedProfile?.full_name ??
            supabaseUser.user_metadata?.full_name ??
            supabaseUser.email ??
            `Traveler ${supabaseUser.id.slice(0, 6)}`,
          email:
            supabaseUser.email ??
            buildAuthEmail(supabaseUser.user_metadata?.phone ?? supabaseUser.id),
          phone: resolvedProfile?.phone_number ?? supabaseUser.user_metadata?.phone ?? '',
          balance: 0,
          transactions: [],
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to hydrate Supabase profile', error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [supabaseUser, users, currentUserId]);

  const loginWithSupabase = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw new Error(error.message);
    }
    return data.user;
  };

  const registerWithSupabase = async ({ email, password, options }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options,
    });
    if (error) {
      throw new Error(error.message);
    }
    return data.user ?? data.session?.user ?? null;
  };

  const buildLocalProfile = (userId, { fullName, phoneNumber, role }) => ({
    id: userId,
    full_name: fullName ?? '',
    phone_number: phoneNumber ?? '',
    role: role ?? 'customer',
    updated_at: new Date().toISOString(),
  });

  const parseJsonSafely = async (response) => {
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return null;
    }
    try {
      return await response.json();
    } catch (error) {
      return null;
    }
  };

  const syncProfileThroughFunction = async ({ fullName, phoneNumber, role = 'customer' }) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) {
      throw new Error('Không tìm thấy phiên Supabase.');
    }

    const fallbackProfile = buildLocalProfile(session.user.id, { fullName, phoneNumber, role });

    const response = await fetch('/.netlify/functions/profile-sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: session.user.id,
        full_name: fullName,
        phone_number: phoneNumber,
        role,
      }),
    });

    if (response.status === 404) {
      return fallbackProfile;
    }

    const result = await parseJsonSafely(response);
    if (!response.ok) {
      throw new Error(result?.error || 'Không thể đồng bộ hồ sơ người dùng.');
    }
    return result?.profile ?? fallbackProfile;
  };

  const loginWithProvider = async (provider) => {
    const redirectTo = typeof window !== 'undefined' ? window.location.origin : undefined;
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
        scopes: 'email profile',
      },
    });
    if (error) {
      throw new Error(error.message);
    }
  };

  const mergeProfileIntoState = (profile, fallback) => {
    const composedUser = {
      id: profile?.id ?? fallback.id,
      role: profile?.role ?? fallback.role ?? 'customer',
      name: profile?.full_name ?? fallback.name ?? fallback.email,
      email: fallback.email,
      phone: profile?.phone_number ?? fallback.phone ?? '',
      balance: fallback.balance ?? 0,
      transactions: fallback.transactions ?? [],
    };
    setUsers((prev) => {
      const exists = prev.some((candidate) => candidate.id === composedUser.id);
      if (exists) {
        return prev.map((candidate) =>
          candidate.id === composedUser.id ? { ...candidate, ...composedUser } : candidate
        );
      }
      return [...prev, composedUser];
    });
    setCurrentUserId(composedUser.id);
    return composedUser;
  };

  const localLogin = (phone, password) => {
    const normalizedPhone = phone.trim();
    const user = users.find((candidate) => candidate.phone === normalizedPhone);
    if (!user || user.password !== password) {
      throw new Error('Thông tin đăng nhập không chính xác.');
    }
    setCurrentUserId(user.id);
    return user;
  };

  const login = async (identifier, password) => {
    const email = buildAuthEmail(identifier);
    let lastError = null;
    try {
      const user = await loginWithSupabase({ email, password });
      const {
        data: profile,
        error: profileError,
      } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();

      let resolvedProfile = profile;
      if (profileError && profileError.code !== 'PGRST116') {
        throw new Error(profileError.message);
      }

      if (!resolvedProfile) {
        resolvedProfile = await syncProfileThroughFunction({
          fullName: user.user_metadata?.full_name ?? user.email ?? identifier,
          phoneNumber: user.user_metadata?.phone ?? identifier,
          role: 'customer',
        });
      }

      return mergeProfileIntoState(resolvedProfile, {
        id: user.id,
        role: resolvedProfile?.role ?? 'customer',
        name: resolvedProfile?.full_name ?? user.email,
        email,
        phone: resolvedProfile?.phone_number ?? identifier,
        balance: 0,
        transactions: [],
      });
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Đăng nhập thất bại.');
    }

    try {
      return localLogin(identifier, password);
    } catch {
      throw lastError ?? new Error('Đăng nhập thất bại.');
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Supabase signOut failed', error);
    } finally {
      setCurrentUserId(null);
      setSupabaseUser(null);
    }
  };

  const register = async ({ name, phone, password }) => {
    const normalizedPhone = phone.trim();
    if (!normalizedPhone) {
      throw new Error('Số điện thoại không hợp lệ.');
    }
    const email = buildAuthEmail(normalizedPhone);

    const supabaseUser = await registerWithSupabase({
      email,
      password,
      options: {
        data: { full_name: name.trim(), phone: normalizedPhone },
      },
    });

    if (!supabaseUser) {
      throw new Error('Không thể đăng ký tài khoản.');
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      await loginWithSupabase({ email, password });
    }

    await syncProfileThroughFunction({
      fullName: name.trim(),
      phoneNumber: normalizedPhone,
      role: 'customer',
    });

    return mergeProfileIntoState(
      {
        id: supabaseUser.id,
        full_name: name.trim(),
        phone_number: normalizedPhone,
        role: 'customer',
      },
      {
        id: supabaseUser.id,
        role: 'customer',
        name: name.trim(),
        email,
        phone: normalizedPhone,
        balance: 0,
        transactions: [],
      }
    );
  };

  const updateUser = (userId, updater) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id !== userId) {
          return user;
        }
        const next = typeof updater === 'function' ? updater(user) : updater;
        return next;
      })
    );
  };

  const requestTopUp = (amount) => {
    if (!currentUser || currentUser.role !== 'customer') {
      throw new Error('Chỉ khách hàng mới có thể nạp tiền.');
    }
    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      throw new Error('Số tiền không hợp lệ.');
    }

    const requestId = createId('topup');
    const timestamp = new Date().toISOString();

    const request = {
      id: requestId,
      userId: currentUser.id,
      amount: numericAmount,
      status: 'pending',
      createdAt: timestamp,
    };

    setTopUpRequests((prev) => [request, ...prev]);
    updateUser(currentUser.id, (user) => ({
      ...user,
      transactions: [
        {
          id: requestId,
          type: 'topup',
          status: 'pending',
          amount: numericAmount,
          createdAt: timestamp,
        },
        ...user.transactions,
      ],
    }));

    return request;
  };

  const bookProduct = async ({ category, productId, amountOverride, details }) => {
    if (!currentUser || currentUser.role !== 'customer') {
      throw new Error('Bạn cần đăng nhập với vai trò khách hàng để đặt dịch vụ.');
    }

    const collections = {
      tour: tours,
      transport: transportOptions,
      stay: stayOptions,
    };

    const catalog = collections[category];
    if (!catalog) {
      throw new Error('Loại dịch vụ không hợp lệ.');
    }

    let product = catalog.find((item) => item.id === productId);
    if (!product && category === 'stay') {
      const fallback = STAY_CATALOG.find((item) => item.id === productId);
      if (fallback) {
        product = {
          id: fallback.id,
          name: fallback.name,
          price: fallback.price,
          description: fallback.description,
          destination: fallback.destination,
          type: fallback.type,
          rating: fallback.rating ?? 4.8,
          amenities: fallback.amenities ?? [],
        };
        setStayOptions((prev) => {
          if (prev.some((item) => item.id === product.id)) return prev;
          return [product, ...prev];
        });
      }
    }
    if (!product) {
      throw new Error('Không tìm thấy dịch vụ.');
    }

    const resolvedAmount = Number.isFinite(Number(amountOverride)) && Number(amountOverride) > 0
      ? Number(amountOverride)
      : product.price;

    const timestamp = new Date().toISOString();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.');
    }

    const bookingPayload = {
      items: [
        {
          product_type: category,
          product_id: product.id,
          title: product.name,
          start_date: details?.startDate ?? null,
          end_date: details?.endDate ?? null,
          quantity: details?.quantity ?? 1,
          unit_price: resolvedAmount,
          currency: details?.currency ?? 'VND',
          metadata: details ?? {},
        },
      ],
      total_amount: resolvedAmount,
      currency: details?.currency ?? 'VND',
      guest_count: details?.guestCount ?? 1,
      notes: details?.notes ?? '',
      start_date: details?.startDate ?? null,
      end_date: details?.endDate ?? null,
    };

    let remoteBooking = null;
    try {
      const response = await fetch('/.netlify/functions/bookings-create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(bookingPayload),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Không thể ghi nhận đặt dịch vụ.');
      }
      remoteBooking = result.booking;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to sync booking with Supabase:', error);
    }

    const bookingId = remoteBooking?.id ?? createId('booking');

    updateUser(currentUser.id, (user) => ({
      ...user,
      balance: Math.max(user.balance - resolvedAmount, 0),
      transactions: [
        {
          id: bookingId,
          type: 'payment',
          status: 'completed',
          category,
          referenceId: product.id,
          amount: resolvedAmount,
          createdAt: timestamp,
        },
        ...user.transactions,
      ],
    }));

    const booking = {
      id: bookingId,
      userId: currentUser.id,
      category,
      productId: product.id,
      productName: product.name,
      amount: resolvedAmount,
      details: details ?? null,
      createdAt: timestamp,
      confirmed: false,
    };

    setBookings((prev) => [booking, ...prev]);
    return booking;
  };

  const submitTransportContact = ({ destination, vehicle, date }) => {
    if (!currentUser || currentUser.role !== 'customer') {
      throw new Error('Vui lòng đăng nhập bằng tài khoản khách hàng để gửi yêu cầu di chuyển.');
    }

    const contactId = createId('transport-contact');
    const timestamp = new Date().toISOString();

    const contact = {
      id: contactId,
      userId: currentUser.id,
      destination,
      vehicle,
      date,
      status: 'pending',
      createdAt: timestamp,
    };

    setTransportContacts((prev) => [contact, ...prev]);
    return contact;
  };

const submitSupportMessage = ({ message }) => {
    if (!currentUser || currentUser.role !== 'customer') {
      throw new Error('Vui lòng đăng nhập bằng tài khoản khách hàng để trò chuyện với SEVEN TRAVEL.');
    }

    const trimmed = message?.trim();
    if (!trimmed) {
      throw new Error('Vui lòng nhập nội dung tin nhắn.');
    }

    const chatId = createId('support');
    const timestamp = new Date().toISOString();
  const chatMessage = {
    id: chatId,
    userId: currentUser.id,
    userName: currentUser.name,
    message: trimmed,
    createdAt: timestamp,
    status: 'pending',
    adminResponse: null,
    adminRespondedAt: null,
  };

  setSupportMessages((prev) => [chatMessage, ...prev]);
  return chatMessage;
};

  const adminRespondSupport = ({ id, response }) => {
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Chỉ quản trị viên mới có thể phản hồi tin nhắn hỗ trợ.');
    }
    const trimmed = response?.trim();
    if (!trimmed) {
      throw new Error('Vui lòng nhập nội dung phản hồi.');
    }
    const respondedAt = new Date().toISOString();
    let found = false;
    setSupportMessages((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        found = true;
        return {
          ...item,
          status: 'resolved',
          adminResponse: trimmed,
          adminRespondedAt: respondedAt,
        };
      })
    );
    if (!found) {
      throw new Error('Không tìm thấy tin nhắn để phản hồi.');
    }
    return { id, response: trimmed, respondedAt };
  };

  const adminApproveTopUp = (requestId) => {
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Chỉ quản trị viên được phép thao tác.');
    }

    setTopUpRequests((prev) =>
      prev.map((request) => {
        if (request.id !== requestId) {
          return request;
        }
        if (request.status !== 'pending') {
          return request;
        }

        updateUser(request.userId, (user) => ({
          ...user,
          balance: user.balance + request.amount,
          transactions: user.transactions.map((transaction) =>
            transaction.id === requestId
              ? { ...transaction, status: 'completed' }
              : transaction
          ),
        }));

        return { ...request, status: 'completed', processedAt: new Date().toISOString() };
      })
    );
  };

  const adminRejectTopUp = (requestId) => {
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Chỉ quản trị viên được phép thao tác.');
    }

    setTopUpRequests((prev) =>
      prev.map((request) => {
        if (request.id !== requestId) {
          return request;
        }
        if (request.status !== 'pending') {
          return request;
        }

        updateUser(request.userId, (user) => ({
          ...user,
          transactions: user.transactions.map((transaction) =>
            transaction.id === requestId
              ? { ...transaction, status: 'rejected' }
              : transaction
          ),
        }));

        return { ...request, status: 'rejected', processedAt: new Date().toISOString() };
      })
    );
  };

  const adminConfirmBooking = (bookingId) => {
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Chỉ quản trị viên được phép thao tác.');
    }
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId ? { ...booking, confirmed: true, confirmedAt: new Date().toISOString() } : booking
      )
    );
  };

  const adminCreateTour = ({
    name,
    price,
    summary,
    description,
    durationDays,
    durationNights,
    durationLabel,
    heroImage,
    regions,
    includes,
    itinerary,
    gallery,
    lodgings,
    departureCity,
    slug,
  }) => {
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Chỉ quản trị viên được phép thao tác.');
    }

    const trimmedName = name?.trim();
    if (!trimmedName) {
      throw new Error('Tên tour không được bỏ trống.');
    }

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      throw new Error('Giá tour không hợp lệ.');
    }

    const parsedDays = Number(durationDays) > 0 ? Number(durationDays) : 3;
    const parsedNightsValue =
      durationNights === 0 || durationNights
        ? Number(durationNights)
        : Math.max(parsedDays - 1, 0);
    const parsedNights = Number.isNaN(parsedNightsValue) ? Math.max(parsedDays - 1, 0) : parsedNightsValue;
    const label = durationLabel?.trim() || `${parsedDays} ngày ${parsedNights} đêm`;
    const hero = heroImage?.trim() || '/anh/image copy 4.png';

    const normalizedRegions = Array.isArray(regions)
      ? regions
          .map((item) => item?.trim())
          .filter(Boolean)
      : typeof regions === 'string'
        ? regions
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
        : [];

    const normalizedIncludes = Array.isArray(includes)
      ? includes
          .map((item) => ({
            label: item?.label?.trim() || '',
            included: Boolean(item?.included),
          }))
          .filter((item) => item.label)
      : [];

    const normalizedItinerary = Array.isArray(itinerary)
      ? itinerary
          .map((item, index) => ({
            day: item?.day ?? index + 1,
            title: item?.title?.trim() || `Ngày ${index + 1}`,
            description: item?.description?.trim() || '',
            image: item?.image?.trim() || hero,
          }))
          .filter((item) => item.description || item.image)
      : [];

    const normalizedGallery = Array.isArray(gallery)
      ? gallery.map((item) => item?.trim()).filter(Boolean)
      : hero
        ? [hero]
        : [];

    const normalizedLodgings = Array.isArray(lodgings)
      ? lodgings
          .map((item, index) => ({
            order: item?.order ?? index + 1,
            name: item?.name?.trim() || '',
            type: item?.type?.trim() || 'hotel',
            nights: Number(item?.nights) > 0 ? Number(item.nights) : 1,
            rating: Number(item?.rating) > 0 ? Number(item.rating) : null,
            amenities: Array.isArray(item?.amenities)
              ? item.amenities.map((amenity) => amenity?.trim()).filter(Boolean)
              : [],
            notes: item?.notes?.trim() || '',
            image: item?.image?.trim() || '',
          }))
          .filter((item) => item.name || item.notes || item.image)
      : [];

    const tour = {
      id: createId('tour'),
      name: trimmedName,
      slug: slug?.trim() || slugify(trimmedName),
      duration: label,
      durationLabel: label,
      durationDays: parsedDays,
      durationNights: parsedNights,
      price: numericPrice,
      summary: summary?.trim() || description?.trim() || '',
      description: description?.trim() || summary?.trim() || '',
      heroImage: hero,
      gallery: normalizedGallery.length > 0 ? normalizedGallery : [hero],
      regions: normalizedRegions,
      includes: normalizedIncludes,
      itinerary: normalizedItinerary,
      lodgings: normalizedLodgings,
      departureCity: departureCity?.trim() || 'Hà Nội',
      createdAt: new Date().toISOString(),
    };

    setTours((prev) => [tour, ...prev]);
    return tour;
  };

  const adminAddProduct = ({ category, name, price, description }) => {
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Chỉ quản trị viên được phép thao tác.');
    }

    const trimmedName = name.trim();
    if (!trimmedName) {
      throw new Error('Tên dịch vụ không được bỏ trống.');
    }
    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      throw new Error('Giá tiền không hợp lệ.');
    }

    const item = {
      id: createId(category),
      name: trimmedName,
      price: numericPrice,
      description: description?.trim() ?? '',
    };

    if (category === 'tour') {
      return adminCreateTour({
        name: trimmedName,
        price: numericPrice,
        summary: description,
        durationDays: 3,
        durationNights: 2,
        durationLabel: '3 ngày 2 đêm',
        heroImage: '/anh/image copy 4.png',
        regions: [],
        includes: [],
        itinerary: [],
      });
    } else if (category === 'transport') {
      setTransportOptions((prev) => [item, ...prev]);
    } else if (category === 'stay') {
      setStayOptions((prev) => [item, ...prev]);
    } else {
      throw new Error('Danh mục không hợp lệ.');
    }

    return item;
  };

  const adminRemoveProduct = ({ category, productId }) => {
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Chỉ quản trị viên được phép thao tác.');
    }

    if (category === 'tour') {
      setTours((prev) => prev.filter((item) => item.id !== productId));
    } else if (category === 'transport') {
      setTransportOptions((prev) => prev.filter((item) => item.id !== productId));
    } else if (category === 'stay') {
      setStayOptions((prev) => prev.filter((item) => item.id !== productId));
    } else {
      throw new Error('Danh mục không hợp lệ.');
    }
  };

  const customers = useMemo(() => users.filter((user) => user.role === 'customer'), [users]);

  const value = useMemo(
    () => ({
      currentUser,
      supabaseUser,
      authLoading,
      login,
      loginWithProvider,
      logout,
      register,
      requestTopUp,
      bookProduct,
      submitTransportContact,
      submitSupportMessage,
      adminRespondSupport,
      adminApproveTopUp,
      adminRejectTopUp,
      adminCreateTour,
      adminAddProduct,
      adminRemoveProduct,
      adminConfirmBooking,
      users,
      customers,
      tours,
      transportOptions,
      stayOptions,
      bookings,
      topUpRequests,
      transportContacts,
      supportMessages,
    }),
    [
      currentUser,
      supabaseUser,
      authLoading,
      loginWithProvider,
      users,
      customers,
      tours,
      transportOptions,
      stayOptions,
      bookings,
      topUpRequests,
      transportContacts,
      supportMessages,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
