import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { STAY_CATALOG } from '../data/stayCatalog.js';
import { supabase } from '../lib/supabaseClient.js';
import { useLanguage } from './LanguageContext.jsx';
import { TOUR_TRANSLATIONS } from '../data/tourTranslations.js';

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

function buildInitialTourAnalytics(tours) {
  return (tours ?? []).reduce((acc, tour) => {
    if (!tour?.id) {
      return acc;
    }
    acc[tour.id] = {
      tourId: tour.id,
      slug: tour.slug ?? '',
      clicks: 0,
      lastClickedAt: null,
    };
    return acc;
  }, {});
}

function mergeTourAnalyticsState(base, stored) {
  const merged = { ...base };
  if (stored && typeof stored === 'object') {
    Object.entries(stored).forEach(([tourId, payload]) => {
      if (!tourId) return;
      const safeClicks = Number.isFinite(payload?.clicks) ? Number(payload.clicks) : 0;
      merged[tourId] = {
        tourId,
        slug: payload?.slug ?? base[tourId]?.slug ?? '',
        clicks: safeClicks < 0 ? 0 : safeClicks,
        lastClickedAt: payload?.lastClickedAt ?? base[tourId]?.lastClickedAt ?? null,
      };
    });
  }
  return merged;
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
    id: 'tour-ha-noi-van-hien-1n',
    name: 'Hà Nội – Dấu ấn ngàn năm văn hiến',
    slug: 'ha-noi-dau-an-ngan-nam-van-hien',
    duration: '1 ngày',
    durationLabel: 'Tour 1 ngày',
    durationDays: 1,
    durationNights: 0,
    price: 1190000,
    pricing: {
      adult: 1190000,
      child: 790000,
      notes: 'Trẻ em dưới 5 tuổi miễn phí, ngủ chung với bố mẹ.',
    },
    summary:
      'Khám phá Hà Nội qua những biểu tượng nghìn năm: Lăng Bác, Chùa Một Cột, Văn Miếu và Hoàng thành Thăng Long.',
    description:
      'Tour thiết kế dành cho học sinh, sinh viên và du khách yêu lịch sử với lịch trình tinh gọn, giàu giá trị văn hóa.',
    regions: ['Hà Nội'],
    heroImage: '/anh/taotour/ngay-1-ha-noi-di-san.jpg',
    gallery: [
      '/anh/taotour/ngay-1-ha-noi-di-san.jpg',
      '/anh/taotour/ngay-1-pho-co-nghe-thuat-dem.jpg',
      '/anh/taotour/ngay-2-van-hien-ho-tay.jpg',
    ],
    includes: [
      { label: 'Xe đưa đón theo chương trình', included: true },
      { label: 'Hướng dẫn viên du lịch', included: true },
      { label: 'Vé tham quan các điểm trong lịch trình', included: true },
      { label: '01 bữa trưa đặc sản Hà Nội', included: true },
      { label: 'Chi phí cá nhân & mua sắm', included: false },
      { label: 'Bảo hiểm du lịch', included: false },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Hành trình văn hiến Hà Nội',
        description:
          'Một ngày trọn vẹn khám phá các biểu tượng nghìn năm của Thăng Long cùng những trải nghiệm văn hóa đậm nét.',
        schedule: [
          '07h30: Xe và HDV đón đoàn tại điểm hẹn.',
          '08h00: Tham quan Lăng Chủ tịch Hồ Chí Minh, Phủ Chủ tịch và Chùa Một Cột.',
          '10h00: Di chuyển tới Văn Miếu – Quốc Tử Giám, tìm hiểu “Bia Tiến sĩ”.',
          '11h30: Thưởng thức bữa trưa với chả cá, bún thang, phở cuốn.',
          '13h30: Tham quan Hoàng thành Thăng Long – di sản văn hóa thế giới.',
          '15h00: Dạo quanh Hồ Hoàn Kiếm, nghe truyền thuyết Rùa Vàng – Lê Lợi.',
          '16h30: Thưởng thức cà phê trứng, mua sắm tại phố cổ.',
          '17h30: Trả đoàn về điểm hẹn ban đầu.',
        ],
        image: '/anh/taotour/ngay-1-ha-noi-di-san.jpg',
      },
    ],
    departureCity: 'Hà Nội',
    createdAt: new Date('2025-04-10T08:00:00').toISOString(),
  },
  {
    id: 'tour-ha-noi-lang-que-2n1d',
    name: 'Hà Nội – Sắc xanh làng quê & nghệ thuật dân gian',
    slug: 'ha-noi-lang-que-nghe-thuat-dan-gian',
    duration: '2 ngày 1 đêm',
    durationLabel: 'Tour 2 ngày 1 đêm',
    durationDays: 2,
    durationNights: 1,
    price: 3290000,
    pricing: {
      adult: 3290000,
      child: 2490000,
      notes: 'Giảm 5% cho đoàn từ 6 khách trở lên.',
    },
    summary:
      'Trải nghiệm làng cổ Đường Lâm, làng gốm Bát Tràng, làng lụa Vạn Phúc và nghệ thuật rối nước Thăng Long.',
    description:
      'Tour sinh thái làng nghề dành cho du khách yêu văn hóa dân gian, kết hợp lưu trú trung tâm Hà Nội và nhiều hoạt động trải nghiệm.',
    regions: ['Hà Nội'],
    heroImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIv0QEvkD_o9FW_AWxhiRkxplHc8sl7LlxvA&s',
    gallery: [
      '/anh/taotour/ngay-1-lang-co-dac-san.jpg',
      '/anh/taotour/ngay-2-tam-coc-lang-nghe.jpg',
      '/anh/taotour/ngay-3-nghi-ngoi-mua-sam.jpg',
    ],
    includes: [
      { label: 'Xe đưa đón theo chương trình', included: true },
      { label: '01 đêm khách sạn 3* trung tâm Hà Nội', included: true },
      { label: 'Vé tham quan Đường Lâm, Bát Tràng, Vạn Phúc', included: true },
      { label: 'Vé xem rối nước Thăng Long', included: true },
      { label: 'Trải nghiệm nặn gốm thủ công', included: true },
      { label: 'Chi phí cá nhân ngoài chương trình', included: false },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Ngày 1 – Làng cổ Đường Lâm',
        description:
          'Ngày đầu tiên đưa bạn về với những làng cổ xứ Đoài và không gian nghệ thuật truyền thống đặc sắc.',
        schedule: [
          '07h00: Khởi hành từ Hà Nội đi Sơn Tây.',
          '09h00: Tham quan đình Mông Phụ, nhà cổ hơn 300 năm và chùa Mía.',
          '11h30: Ăn trưa với gà mía, chè lam, kẹo dồi.',
          '14h00: Di chuyển tới làng gốm Bát Tràng, trải nghiệm nặn gốm thủ công.',
          '17h00: Nhận phòng khách sạn/nhà nghỉ trung tâm Hà Nội.',
          '19h00: Xem biểu diễn rối nước Thăng Long, tự do dạo phố.',
        ],
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIv0QEvkD_o9FW_AWxhiRkxplHc8sl7LlxvA&s',
      },
      {
        day: 2,
        title: 'Ngày 2 – Nghệ thuật lụa Vạn Phúc',
        description:
          'Sáng ngày hai dành cho việc khám phá làng nghề lụa truyền thống và mua sắm sản phẩm thủ công tinh xảo.',
        schedule: [
          '07h30: Ăn sáng tại khách sạn.',
          '09h00: Tham quan làng lụa Vạn Phúc, trải nghiệm dệt lụa.',
          '10h30: Mua sắm quà tặng thủ công mỹ nghệ.',
          '12h00: Ăn trưa, nghỉ ngơi.',
          '13h30: Trở về điểm đón ban đầu, kết thúc hành trình.',
        ],
        image: '/anh/taotour/ngay-2-tam-coc-lang-nghe.jpg',
      },
    ],
    departureCity: 'Hà Nội',
    createdAt: new Date('2025-04-14T08:30:00').toISOString(),
  },
  {
    id: 'tour-ha-noi-ba-vi-2n1d',
    name: 'Hà Nội – Vùng ngoại ô thanh bình & tâm linh núi Tản',
    slug: 'ha-noi-ngoai-o-thanh-binh-nui-tan',
    duration: '2 ngày 1 đêm',
    durationLabel: 'Tour 2 ngày 1 đêm',
    durationDays: 2,
    durationNights: 1,
    price: 3890000,
    pricing: {
      adult: 3890000,
      child: 2790000,
      notes: 'Đã bao gồm vé vào Vườn quốc gia Ba Vì và Khoang Xanh.',
    },
    summary:
      'Khám phá Ba Vì, trải nghiệm tâm linh núi Tản, giao lưu lửa trại cùng đồng bào Mường và thưởng trà đồi chè Ba Trại.',
    description:
      'Lịch trình cân bằng giữa thiên nhiên, văn hóa và hoạt động cộng đồng – phù hợp khách nội địa, sinh viên du lịch và người yêu du lịch bền vững.',
    regions: ['Hà Nội'],
    heroImage: '/anh/taotour/ngay-1-song-da-huyen-thoai.jpg',
    gallery: [
      '/anh/taotour/ngay-1-song-da-huyen-thoai.jpg',
      '/anh/taotour/ngay-2-ban-phieng-cam-tra.jpg',
      '/anh/taotour/ngay-3-lang-co-suoi-khoang.jpg',
    ],
    includes: [
      { label: 'Xe du lịch đời mới, điều hòa', included: true },
      { label: '01 đêm resort/homestay Ba Vì', included: true },
      { label: 'Vé tham quan Ba Vì & Khoang Xanh', included: true },
      { label: 'BBQ tối & chương trình lửa trại', included: true },
      { label: 'Hướng dẫn viên kinh nghiệm', included: true },
      { label: 'Chi phí cá nhân, đồ uống ngoài chương trình', included: false },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Ngày 1 – Huyền thoại núi Tản',
        description:
          'Khám phá núi rừng Ba Vì, hòa mình vào không khí linh thiêng và văn hóa cộng đồng bản địa.',
        schedule: [
          '07h00: Đón khách và khởi hành đi Ba Vì.',
          '09h00: Tham quan Vườn quốc gia Ba Vì, chinh phục đền Thượng – đền Trung – đền Hạ.',
          '11h30: Ăn trưa với đặc sản gà đồi, lợn mán.',
          '13h30: Ghé nhà thờ cổ Ba Vì chụp ảnh, khám phá kiến trúc Pháp.',
          '15h00: Thư giãn tại Khoang Xanh – Suối Tiên, ngâm chân suối khoáng.',
          '17h00: Nhận phòng resort/homestay ven núi.',
          '20h00: Đốt lửa trại, giao lưu văn nghệ với đồng bào Mường.',
        ],
        image: '/anh/taotour/ngay-1-song-da-huyen-thoai.jpg',
      },
      {
        day: 2,
        title: 'Ngày 2 – Hương trà xứ Đoài',
        description:
          'Ngày cuối tận hưởng không khí thanh bình, trải nghiệm làng nghề chè và dừng chân bên Hồ Tây.',
        schedule: [
          '06h30: Dậy sớm ngắm bình minh trên núi Tản.',
          '07h00: Ăn sáng tại khu nghỉ.',
          '08h00: Trải nghiệm hái, sao chè tại làng chè Ba Trại, thưởng trà nóng.',
          '11h30: Ăn trưa tại nhà dân với đặc sản đồng quê.',
          '13h00: Trở về trung tâm Hà Nội.',
          '15h00: Dừng chân Hồ Tây, thăm chùa Trấn Quốc, chụp ảnh kỷ niệm.',
          '16h00: Trả khách tại điểm đón ban đầu.',
        ],
        image: '/anh/taotour/ngay-2-ban-phieng-cam-tra.jpg',
      },
    ],
    departureCity: 'Hà Nội',
    createdAt: new Date('2025-04-20T09:00:00').toISOString(),
  },
  {
    id: 'tour-hai-phong-2n1d-cat-ba',
    name: 'Hải Phòng – Cát Bà 2N1Đ',
    slug: 'hai-phong-cat-ba-2n1d',
    duration: '2 ngày 1 đêm',
    durationLabel: '2 ngày 1 đêm',
    durationDays: 2,
    durationNights: 1,
    price: 3950000,
    pricing: {
      adult: 3950000,
      child: 2650000,
      notes: 'Bao gồm vé tàu cao tốc và 3 bữa chính.',
    },
    summary:
      'Trải nghiệm trọn vẹn Cát Bà trong 2 ngày 1 đêm: vườn quốc gia, pháo đài Thần Công và BBQ hải sản ven biển.',
    description:
      'Tour kết hợp thành phố Cảng và đảo Cát Bà thơ mộng, phù hợp gia đình mong muốn nghỉ dưỡng nhanh mà vẫn đầy đủ điểm nhấn.',
    regions: ['Hải Phòng'],
    hiddenFromExplorer: false,
    heroImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4aQuMqJSbyWro_9OxooVJLHvpkY5QLu50hA&s',
    gallery: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4aQuMqJSbyWro_9OxooVJLHvpkY5QLu50hA&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnMygT_edTgFPyuuRvQOqJtPvwKUuFnRvMRg&s',
      'https://vcdn1-dulich.vnecdn.net/2025/03/08/image001-1741420642-1741424652-8774-1741441189.png?w=500&h=300&q=100&dpr=1&fit=crop&s=7HQpi215_d3IOgWN4SVPGQ',
    ],
    includes: [
      { label: 'Khách sạn 3* trung tâm Cát Bà', included: true },
      { label: 'BBQ hải sản buổi tối', included: true },
      { label: 'Vé tàu cao tốc Hải Phòng - Cát Bà', included: true },
      { label: 'Vé tham quan vườn quốc gia, pháo đài', included: true },
      { label: 'Đồ uống có cồn', included: false },
      { label: 'Chi phí cá nhân phát sinh', included: false },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Ngày 1 – Hải Phòng • Cát Bà',
        description:
          'Khởi hành từ trung tâm thành phố Cảng, lên tàu cao tốc tới đảo Cát Bà và khám phá vườn quốc gia.',
        schedule: [
          '07h00: Đón khách tại trung tâm TP. Hải Phòng.',
          '08h00: Di chuyển ra bến Bính, lên tàu cao tốc đi Cát Bà.',
          '09h30: Đến Cát Bà, nhận phòng khách sạn, nghỉ ngơi.',
          '12h00: Ăn trưa hải sản tươi sống.',
          '14h00: Tham quan vườn quốc gia Cát Bà.',
          '15h30: Check-in pháo đài Thần Công ngắm toàn cảnh vịnh Lan Hạ.',
          '16h30: Tắm biển tại bãi Cát Cò 1/2/3.',
          '19h00: Dùng bữa tối BBQ hải sản, tự do dạo phố biển hoặc thưởng thức café ven biển.',
        ],
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnMygT_edTgFPyuuRvQOqJtPvwKUuFnRvMRg&s',
      },
      {
        day: 2,
        title: 'Ngày 2 – Vịnh Lan Hạ • Trở về Hải Phòng',
        description:
          'Hành trình vịnh Lan Hạ, làng chài Cái Bèo, đảo Khỉ trước khi quay về đất liền.',
        schedule: [
          '07h00: Ăn sáng tại khách sạn.',
          '08h00: Lên tàu tham quan vịnh Lan Hạ, làng chài Cái Bèo, đảo Khỉ; chụp ảnh, tắm biển hoặc chèo kayak.',
          '12h00: Ăn trưa trên tàu.',
          '13h30: Tàu đưa đoàn trở về đất liền.',
          '14h30: Xe đón đoàn về trung tâm TP. Hải Phòng, kết thúc chương trình.',
        ],
        image: 'https://vcdn1-dulich.vnecdn.net/2025/03/08/image001-1741420642-1741424652-8774-1741441189.png?w=500&h=300&q=100&dpr=1&fit=crop&s=7HQpi215_d3IOgWN4SVPGQ',
      },
    ],
    departureCity: 'Hải Phòng',
    createdAt: new Date('2025-04-08T07:00:00').toISOString(),
  },
  {
    id: 'tour-hai-phong-3n2d-do-son-cat-ba',
    name: 'Hải Phòng – Đồ Sơn – Cát Bà 3N2Đ',
    slug: 'hai-phong-do-son-cat-ba-3n2d',
    duration: '3 ngày 2 đêm',
    durationLabel: '3 ngày 2 đêm',
    durationDays: 3,
    durationNights: 2,
    price: 7850000,
    pricing: {
      adult: 7850000,
      child: 5200000,
      notes: 'Bao gồm vé tàu cao tốc và tiệc BBQ hải sản.',
    },
    summary:
      'Ba ngày kết hợp Đồ Sơn – Cát Bà – vịnh Lan Hạ với những trải nghiệm biển đảo, văn hóa và ẩm thực đặc sắc.',
    description:
      'Tour lý tưởng cho gia đình muốn nghỉ dưỡng dài ngày tại Hải Phòng: tắm biển Đồ Sơn, du thuyền Lan Hạ, BBQ giao lưu.',
    regions: ['Hải Phòng'],
    hiddenFromExplorer: false,
    heroImage: 'https://bizweb.dktcdn.net/100/101/075/files/do-son-hai-phong.jpg?v=1728053345846',
    gallery: [
      'https://bizweb.dktcdn.net/100/101/075/files/do-son-hai-phong.jpg?v=1728053345846',
      'https://cafefcdn.com/203337114487263232/2023/8/8/photo-1-16914842509611381562830-1691502928818-1691502928982795189168.jpg',
      'https://vcdn1-dulich.vnecdn.net/2025/03/08/image001-1741420642-1741424652-8774-1741441189.png?w=500&h=300&q=100&dpr=1&fit=crop&s=7HQpi215_d3IOgWN4SVPGQ',
    ],
    includes: [
      { label: 'Khách sạn Đồ Sơn & Cát Bà 3-4*', included: true },
      { label: 'Vé tàu cao tốc Đình Vũ – Cát Bà', included: true },
      { label: 'Du thuyền tham quan vịnh Lan Hạ', included: true },
      { label: 'BBQ hải sản & giao lưu văn nghệ', included: true },
      { label: 'Vé casino Đồ Sơn', included: false },
      { label: 'Đồ uống minibar', included: false },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Ngày 1 – Thành phố Cảng • Đồ Sơn',
        description:
          'Khởi hành khám phá Đồ Sơn, tham quan biểu tượng thành phố và thưởng thức đặc sản biển.',
        schedule: [
          '08h00: Đón đoàn tại trung tâm TP. Hải Phòng.',
          '09h00: Tham quan khu du lịch Đồ Sơn, tắm biển, chụp ảnh.',
          '11h30: Ăn trưa tại nhà hàng ven biển.',
          '14h00: Thăm Biệt thự Bảo Đại, Casino Đồ Sơn (nếu mở cửa).',
          '16h00: Tự do tắm biển, dạo chơi.',
          '18h30: Ăn tối, thưởng thức đặc sản biển Đồ Sơn.',
          '20h00: Nghỉ đêm tại khách sạn Đồ Sơn.',
        ],
        image: 'https://bizweb.dktcdn.net/100/101/075/files/do-son-hai-phong.jpg?v=1728053345846',
      },
      {
        day: 2,
        title: 'Ngày 2 – Cát Bà • Vịnh Lan Hạ',
        description:
          'Di chuyển sang đảo Cát Bà, đi du thuyền vịnh Lan Hạ, chèo kayak và thưởng thức BBQ hải sản.',
        schedule: [
          '07h00: Ăn sáng tại khách sạn.',
          '08h00: Ra bến Đình Vũ, đi tàu cao tốc sang Cát Bà.',
          '11h30: Ăn trưa tại nhà hàng địa phương.',
          '13h30: Tham quan vịnh Lan Hạ, làng chài Cái Bèo, đảo Khỉ; chèo kayak, tắm biển.',
          '18h30: Ăn tối BBQ hải sản – giao lưu văn nghệ.',
          '20h30: Nghỉ đêm tại khách sạn Cát Bà.',
        ],
        image: 'https://cafefcdn.com/203337114487263232/2023/8/8/photo-1-16914842509611381562830-1691502928818-1691502928982795189168.jpg',
      },
      {
        day: 3,
        title: 'Ngày 3 – Cát Bà • Trở về Hải Phòng',
        description:
          'Tham quan pháo đài Thần Công, mua đặc sản trước khi trở lại đất liền.',
        schedule: [
          '07h00: Ăn sáng tại khách sạn.',
          '08h30: Tham quan pháo đài Thần Công ngắm toàn cảnh Cát Bà.',
          '10h00: Mua sắm đặc sản tại chợ Cát Bà.',
          '11h30: Ăn trưa tại nhà hàng hải sản.',
          '13h30: Lên tàu về đất liền, xe đưa đoàn về trung tâm Hải Phòng – kết thúc tour.',
        ],
        image: 'https://vcdn1-dulich.vnecdn.net/2025/03/08/image001-1741420642-1741424652-8774-1741441189.png?w=500&h=300&q=100&dpr=1&fit=crop&s=7HQpi215_d3IOgWN4SVPGQ',
      },
    ],
    departureCity: 'Hải Phòng',
    createdAt: new Date('2025-04-16T09:00:00').toISOString(),
  },
  {
    id: 'tour-hai-phong-4n3d-do-son-cat-ba-ha-long',
    name: 'Hải Phòng – Đồ Sơn – Cát Bà – Hạ Long 4N3Đ',
    slug: 'hai-phong-do-son-cat-ba-ha-long-4n3d',
    duration: '4 ngày 3 đêm',
    durationLabel: '4 ngày 3 đêm',
    durationDays: 4,
    durationNights: 3,
    price: 10400000,
    pricing: {
      adult: 10400000,
      child: 7200000,
      notes: 'Bao gồm vé tham quan Lan Hạ và Hạ Long.',
    },
    summary:
      'Hành trình 4 ngày 3 đêm kết hợp Đồ Sơn, Cát Bà, vịnh Lan Hạ và Hạ Long với nhiều trải nghiệm biển đảo đặc sắc.',
    description:
      'Tour mở rộng dành cho du khách muốn khám phá trọn vẹn Hải Phòng – Cát Bà – Lan Hạ – Hạ Long, phù hợp nhóm gia đình, công ty.',
    regions: ['Hải Phòng'],
    hiddenFromExplorer: false,
    heroImage: 'https://cafefcdn.com/203337114487263232/2023/8/8/photo-1-16914842509611381562830-1691502928818-1691502928982795189168.jpg',
    gallery: [
      'https://cafefcdn.com/203337114487263232/2023/8/8/photo-1-16914842509611381562830-1691502928818-1691502928982795189168.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4aQuMqJSbyWro_9OxooVJLHvpkY5QLu50hA&s',
      'https://vcdn1-dulich.vnecdn.net/2025/03/08/image001-1741420642-1741424652-8774-1741441189.png?w=500&h=300&q=100&dpr=1&fit=crop&s=7HQpi215_d3IOgWN4SVPGQ',
    ],
    includes: [
      { label: 'Khách sạn/Resort 4* Đồ Sơn & Cát Bà', included: true },
      { label: 'Du thuyền tham quan Lan Hạ & Hạ Long', included: true },
      { label: 'Vé tham quan vườn quốc gia Cát Bà', included: true },
      { label: 'Chương trình lửa trại giao lưu', included: true },
      { label: 'Đồ uống đặc biệt & minibar', included: false },
      { label: 'Chi phí cá nhân ngoài chương trình', included: false },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Ngày 1 – Hà Nội/Hải Phòng • Đồ Sơn',
        description:
          'Xuất phát từ Hà Nội hoặc Hải Phòng, tham quan biểu tượng thành phố trước khi về Đồ Sơn tắm biển.',
        schedule: [
          '07h00: Khởi hành đi Hải Phòng (nếu từ Hà Nội).',
          '10h00: Tham quan Nhà hát lớn, cầu Bính, chùa Dư Hàng, bảo tàng Hải Phòng.',
          '12h00: Ăn trưa đặc sản nem cua bể, bánh đa cua.',
          '14h30: Di chuyển đến Đồ Sơn, nhận phòng, tắm biển.',
          '18h30: Ăn tối tại nhà hàng ven biển, nghỉ đêm tại Đồ Sơn.',
        ],
        image: 'https://bizweb.dktcdn.net/100/101/075/files/do-son-hai-phong.jpg?v=1728053345846',
      },
      {
        day: 2,
        title: 'Ngày 2 – Đồ Sơn • Cát Bà',
        description:
          'Từ Đồ Sơn đi tàu cao tốc sang Cát Bà, tham quan vườn quốc gia và pháo đài Thần Công.',
        schedule: [
          '07h00: Ăn sáng tại khách sạn.',
          '08h00: Di chuyển ra bến Đình Vũ, đi tàu cao tốc sang Cát Bà.',
          '10h30: Tham quan vườn quốc gia Cát Bà, pháo đài Thần Công.',
          '12h30: Ăn trưa tại nhà hàng hải sản.',
          '14h30: Tắm biển tại bãi Cát Cò.',
          '18h30: Ăn tối và nghỉ đêm tại khách sạn Cát Bà.',
        ],
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4aQuMqJSbyWro_9OxooVJLHvpkY5QLu50hA&s',
      },
      {
        day: 3,
        title: 'Ngày 3 – Vịnh Lan Hạ • Hạ Long nhỏ',
        description:
          'Lên du thuyền khám phá Lan Hạ, hang Sáng – Tối, đảo Khỉ, chèo kayak và tham gia lửa trại.',
        schedule: [
          '08h00: Lên tàu khám phá vịnh Lan Hạ, hang Sáng – hang Tối, đảo Khỉ, làng chài Cái Bèo.',
          '12h00: Ăn trưa trên tàu.',
          '14h30: Tự do tắm biển, chèo kayak.',
          '19h00: Ăn tối trên đảo, đốt lửa trại – giao lưu văn nghệ.',
          '22h00: Nghỉ đêm tại Cát Bà.',
        ],
        image: 'https://vcdn1-dulich.vnecdn.net/2025/03/08/image001-1741420642-1741424652-8774-1741441189.png?w=500&h=300&q=100&dpr=1&fit=crop&s=7HQpi215_d3IOgWN4SVPGQ',
      },
      {
        day: 4,
        title: 'Ngày 4 – Cát Bà • Hải Phòng • Hà Nội',
        description:
          'Trả phòng, mua đặc sản và trở về Hải Phòng/Hà Nội, kết thúc hành trình.',
        schedule: [
          '07h00: Ăn sáng, trả phòng khách sạn.',
          '08h30: Mua đặc sản nước mắm Cát Hải, mực khô, cá khô.',
          '10h00: Tàu về lại Hải Phòng, tham quan chợ Sắt hoặc Vincom Plaza.',
          '12h00: Ăn trưa tại thành phố Cảng.',
          '14h30: Khởi hành về Hà Nội hoặc sân bay Cát Bi, kết thúc tour.',
        ],
        image: 'https://cafefcdn.com/203337114487263232/2023/8/8/photo-1-16914842509611381562830-1691502928818-1691502928982795189168.jpg',
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
    hiddenFromExplorer: true,
    heroImage: 'https://trangandanhthang.vn/wp-content/uploads/2025/06/khu-du-lich-trang-an-1.png',
    gallery: [
      'https://trangandanhthang.vn/wp-content/uploads/2025/06/khu-du-lich-trang-an-1.png',
      'https://media.vietravel.com/images/Content/du-lich-tam-coc-mua-lua-chin-1.jpg',
    ],
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
        image: 'https://trangandanhthang.vn/wp-content/uploads/2025/06/khu-du-lich-trang-an-1.png',
      },
      {
        day: 2,
        title: 'Tam Cốc – Picnic đồng lúa',
        description:
          'Sáng đạp xe xuyên đồng lúa Tam Cốc, thăm chùa Bích Động. Trưa thưởng thức đặc sản dê núi, chiều trở lại Hà Nội, kết thúc hành trình lúc 17:30.',
        image: 'https://media.vietravel.com/images/Content/du-lich-tam-coc-mua-lua-chin-1.jpg',
      },
    ],
    departureCity: 'Hà Nội',
    createdAt: new Date('2025-04-01T08:00:00').toISOString(),
  },
  {
    id: 'tour-ninh-binh-3n2d-trang-an',
    name: 'Hà Nội – Ninh Bình 3N2Đ • Tràng An – Hang Múa – Bái Đính',
    slug: 'ha-noi-ninh-binh-3n2d-trang-an',
    duration: '3 ngày 2 đêm',
    durationLabel: '3 ngày 2 đêm',
    durationDays: 3,
    durationNights: 2,
    price: 8450000,
    pricing: {
      adult: 8450000,
      child: 5800000,
      notes: 'Bao gồm vé thắng cảnh Tràng An, Hang Múa, Bái Đính, Thung Nham và Cúc Phương.',
    },
    summary:
      'Trọn vẹn Ninh Bình 3 ngày 2 đêm: Tràng An, Hang Múa, Bái Đính, Tam Cốc, Thung Nham, Cúc Phương và cố đô Hoa Lư.',
    description:
      'Lịch trình kết hợp thiên nhiên – tâm linh – văn hóa với xe du lịch đời mới, khách sạn 3-4*, ẩm thực dê núi, cơm cháy và các trải nghiệm thuyền trên sông Ngô Đồng.',
    regions: ['Ninh Bình'],
    heroImage:
      'https://xpscntm-asset-6aaa6adb24ad2493.s3.ap-southeast-1.amazonaws.com/4177096526555/Ninh-Binh-Premium-Tour-%2528Hoa-Lu-Tam-Coc-Trang-An-Mua-Cave-Bai-Dinh-Pagoda%2529---1-Day-Tour-98bb62c8-ba0f-4864-ad5f-ffeaf8ff6414.jpeg?tr=q-70,c-at_max,w-500,h-300,dpr-2',
    gallery: [
      'https://xpscntm-asset-6aaa6adb24ad2493.s3.ap-southeast-1.amazonaws.com/4177096526555/Ninh-Binh-Premium-Tour-%2528Hoa-Lu-Tam-Coc-Trang-An-Mua-Cave-Bai-Dinh-Pagoda%2529---1-Day-Tour-98bb62c8-ba0f-4864-ad5f-ffeaf8ff6414.jpeg?tr=q-70,c-at_max,w-500,h-300,dpr-2',
      'https://media.vietravel.com/images/Content/du-lich-tam-coc-mua-lua-chin-1.jpg',
      'https://media.vietravel.com/images/Content/trai-nghiem-o-vuon-quoc-gia-cuc-phuong-1-2158.jpg',
    ],
    includes: [
      { label: 'Khách sạn 3-4* trung tâm Ninh Bình', included: true },
      { label: 'Xe du lịch Hà Nội – Ninh Bình', included: true },
      { label: 'Vé thuyền Tràng An, Tam Cốc', included: true },
      { label: 'Vé tham quan Bái Đính, Thung Nham, Cúc Phương', included: true },
      { label: 'Chi phí mua sắm cá nhân', included: false },
      { label: 'Đồ uống ngoài chương trình', included: false },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Ngày 1 – Hà Nội • Tràng An • Hang Múa',
        description:
          'Khởi hành từ Hà Nội, tham quan Tràng An, Hang Múa và nhận phòng khách sạn tại Ninh Bình.',
        schedule: [
          '07h30: Xe và HDV đón đoàn tại trung tâm Hà Nội, khởi hành đi Ninh Bình.',
          '10h00: Tham quan khu du lịch sinh thái Tràng An – di sản thiên nhiên & văn hóa thế giới.',
          '12h30: Ăn trưa đặc sản dê núi, cơm cháy, cá rô đồng.',
          '14h30: Tham quan Hang Múa, leo 500 bậc đá ngắm toàn cảnh Tam Cốc.',
          '18h00: Nhận phòng khách sạn, ăn tối, tự do khám phá Ninh Bình về đêm.',
        ],
        image: 'https://www.bambooairways.com/documents/d/global/du-lich-hang-mua-1-jpg',
      },
      {
        day: 2,
        title: 'Ngày 2 – Bái Đính • Tam Cốc • Thung Nham',
        description:
          'Khám phá chùa Bái Đính, trải nghiệm thuyền Tam Cốc – Bích Động và khu sinh thái Thung Nham.',
        schedule: [
          '07h00: Ăn sáng tại khách sạn.',
          '08h00: Tham quan chùa Bái Đính – quần thể chùa lớn nhất Việt Nam.',
          '11h30: Ăn trưa tại nhà hàng địa phương.',
          '13h30: Tham quan Tam Cốc – Bích Động, ngồi thuyền trên sông Ngô Đồng.',
          '15h30: Khám phá Thung Nham – Vườn chim, hang Bụt, cây duối nghìn năm.',
          '18h00: Về khách sạn, ăn tối và nghỉ ngơi.',
        ],
        image: 'https://media.vietravel.com/images/Content/du-lich-tam-coc-mua-lua-chin-1.jpg',
      },
      {
        day: 3,
        title: 'Ngày 3 – Cúc Phương • Hoa Lư • Trở về Hà Nội',
        description:
          'Thăm vườn quốc gia Cúc Phương, cố đô Hoa Lư và kết thúc hành trình tại Hà Nội.',
        schedule: [
          '07h00: Ăn sáng, làm thủ tục trả phòng.',
          '08h00: Tham quan vườn quốc gia Cúc Phương – trung tâm cứu hộ linh trưởng, cây chò nghìn năm.',
          '11h30: Ăn trưa tại nhà hàng địa phương.',
          '13h30: Tham quan cố đô Hoa Lư, viếng đền vua Đinh – vua Lê.',
          '15h00: Lên xe về Hà Nội.',
          '18h00: Về tới điểm hẹn ban đầu, kết thúc tour.',
        ],
        image: 'https://media.vietravel.com/images/Content/trai-nghiem-o-vuon-quoc-gia-cuc-phuong-1-2158.jpg',
      },
    ],
    departureCity: 'Hà Nội',
    createdAt: new Date('2025-05-05T09:00:00').toISOString(),
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
    heroImage: 'https://media.vietravel.com/images/Content/trai-nghiem-o-vuon-quoc-gia-cuc-phuong-1-2158.jpg',
    gallery: [
      'https://media.vietravel.com/images/Content/trai-nghiem-o-vuon-quoc-gia-cuc-phuong-1-2158.jpg',
      'https://www.bambooairways.com/documents/d/global/du-lich-hang-mua-1-jpg',
      'https://phuotvivu.com/blog/wp-content/uploads/2021/06/co-do-Hoa-Lu.jpg',
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
        image: 'https://media.vietravel.com/images/Content/trai-nghiem-o-vuon-quoc-gia-cuc-phuong-1-2158.jpg',
      },
      {
        day: 2,
        title: 'Ngày 2 – Rừng Cúc Phương',
        description:
          'Khám phá vườn quốc gia Cúc Phương, thăm trung tâm cứu hộ linh trưởng và cây chò ngàn năm.',
        image: 'https://media.vietravel.com/images/Content/trai-nghiem-o-vuon-quoc-gia-cuc-phuong-1-2158.jpg',
      },
      {
        day: 3,
        title: 'Ngày 3 – Làng cổ & suối khoáng',
        description:
          'Đạp xe làng cổ Đường Lâm, workshop làm nón lá. Chiều tắm suối khoáng Kênh Gà, tối câu cá và karaoke gia đình.',
        image: 'https://phuotvivu.com/blog/wp-content/uploads/2021/06/co-do-Hoa-Lu.jpg',
      },
      {
        day: 4,
        title: 'Ngày 4 – Thư giãn & tạm biệt',
        description:
          'Sáng yoga suối khoáng, brunch đặc sản, trả phòng và trở về Hà Nội.',
        image: 'https://www.bambooairways.com/documents/d/global/du-lich-hang-mua-1-jpg',
      },
    ],
    departureCity: 'Ninh Bình',
    createdAt: new Date('2025-04-22T10:45:00').toISOString(),
  },
  {
    id: 'tour-son-la-2n1d-ta-xua',
    name: 'Hà Nội – Tà Xùa – Bắc Yên 2N1Đ',
    slug: 'ha-noi-ta-xua-2n1d',
    duration: '2 ngày 1 đêm',
    durationLabel: '2 ngày 1 đêm',
    durationDays: 2,
    durationNights: 1,
    price: 1980000,
    pricing: {
      adult: 1980000,
      child: 1380000,
      notes: 'Giá tour áp dụng cho đoàn từ 10 khách, chưa bao gồm bữa sáng ngày 1.',
    },
    summary:
      'Săn mây Tà Xùa, check-in Mỏm Cá Heo, Cây Cô Đơn và thảo nguyên Bắc Yên chỉ trong 2 ngày 1 đêm.',
    description:
      'Lịch trình lý tưởng cho tín đồ khám phá với săn mây Háng Đồng, trải nghiệm hồ Suối Chiếu và ẩm thực vùng cao.',
    regions: ['Sơn La'],
    hiddenFromExplorer: true,
    heroImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3TVibuQGsfB7jk5x3Co1zUHgyhlrSlblcow&s',
    gallery: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3TVibuQGsfB7jk5x3Co1zUHgyhlrSlblcow&s',
      'https://cdn.tgdd.vn/Files/2023/03/14/1518123/du-lich-bac-yen-son-la-4-dia-diem-du-lich-hap-dan-nhat-202303151352434003.jpg',
    ],
    includes: [
      { label: 'Xe du lịch Hà Nội – Tà Xùa – Hà Nội', included: true },
      { label: 'Homestay trung tâm Tà Xùa', included: true },
      { label: 'Bữa trưa & tối ngày 1, sáng & trưa ngày 2', included: true },
      { label: 'Vé tham quan theo chương trình', included: true },
      { label: 'Ăn sáng ngày đầu tiên', included: false },
      { label: 'Chi phí cá nhân & đồ uống riêng', included: false },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Ngày 1 – Hà Nội • Tà Xùa • Mỏm Cá Heo',
        description:
          'Khởi hành từ Hà Nội, ghé đồi chè Thanh Sơn, chinh phục Cây Cô Đơn và Mỏm Cá Heo, ngắm hoàng hôn tại Đỉnh Gió.',
        schedule: [
          '06h00: Xe và HDV đón khách tại Hà Nội, khởi hành đi Tà Xùa (ăn sáng tự túc).',
          '09h00: Dừng chân đồi chè Thanh Sơn – Phú Thọ, chụp ảnh check-in.',
          '11h00: Ăn trưa tại thị trấn Bắc Yên.',
          '13h30: Check-in Cây Cô Đơn, thảo nguyên Tà Xùa.',
          '15h30: Tham quan Mỏm Cá Heo, săn mây chụp ảnh.',
          '17h30: Ngắm hoàng hôn Đỉnh Gió, nhận phòng homestay.',
          '19h00: Thưởng thức lẩu đặc sản vùng cao, giao lưu buổi tối.',
        ],
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3TVibuQGsfB7jk5x3Co1zUHgyhlrSlblcow&s',
      },
      {
        day: 2,
        title: 'Ngày 2 – Sống lưng khủng long • Hồ Suối Chiếu',
        description:
          'Khám phá sống lưng khủng long Háng Đồng, tham quan hồ Suối Chiếu trước khi trở về Hà Nội.',
        schedule: [
          '06h00: Ăn sáng tại homestay.',
          '07h00: Lên xe chinh phục sống lưng khủng long Háng Đồng, săn mây và chụp ảnh.',
          '11h00: Ăn trưa tại nhà hàng thị trấn Phù Yên.',
          '13h00: Tham quan hồ Suối Chiếu, đi thuyền ngoạn cảnh.',
          '14h30: Lên xe về Hà Nội.',
          '19h00: Về tới Hà Nội, kết thúc tour.',
        ],
        image: 'https://cdn.tgdd.vn/Files/2023/03/14/1518123/du-lich-bac-yen-son-la-4-dia-diem-du-lich-hap-dan-nhat-202303151352434003.jpg',
      },
    ],
    departureCity: 'Hà Nội',
    createdAt: new Date('2025-03-30T06:30:00').toISOString(),
  },
  {
    id: 'tour-son-la-3n2d-son-la-dien-bien',
    name: 'Hà Nội – Sơn La – Điện Biên Phủ 3N2Đ',
    slug: 'ha-noi-son-la-dien-bien-3n2d',
    duration: '3 ngày 2 đêm',
    durationLabel: '3 ngày 2 đêm',
    durationDays: 3,
    durationNights: 2,
    price: 2850000,
    pricing: {
      adult: 2850000,
      child: 1950000,
      notes: 'Giá tham khảo, bao gồm 3 bữa chính/ngày và vé tham quan theo chương trình.',
    },
    summary:
      'Khám phá Hà Nội – Mộc Châu – Tuần Giáo – Điện Biên với đèo Thung Khe, đồi chè trái tim và chiến trường Điện Biên Phủ.',
    description:
      'Lịch trình kết hợp cảnh quan thiên nhiên và di tích lịch sử: đồi chè Mộc Châu, đèo Pha Đin, Mường Phăng, đồi A1 và thành phố Điện Biên.',
    regions: ['Sơn La'],
    hiddenFromExplorer: true,
    heroImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcVIOt-tAVOA_ApUuydQ1SxIPGOfpC9F3gdQ&s',
    gallery: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcVIOt-tAVOA_ApUuydQ1SxIPGOfpC9F3gdQ&s',
      'https://cdn.tgdd.vn/Files/2023/03/14/1518123/du-lich-bac-yen-son-la-4-dia-diem-du-lich-hap-dan-nhat-202303151352434003.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3TVibuQGsfB7jk5x3Co1zUHgyhlrSlblcow&s',
    ],
    includes: [
      { label: 'Xe du lịch Hà Nội – Tây Bắc', included: true },
      { label: 'Khách sạn Tuần Giáo & Điện Biên', included: true },
      { label: 'Vé tham quan Mường Phăng, đồi A1', included: true },
      { label: 'Bữa ăn theo chương trình', included: true },
      { label: 'Chi phí giao lưu văn nghệ', included: false },
      { label: 'Đồ uống ngoài chương trình', included: false },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Ngày 1 – Hà Nội • Mộc Châu • Tuần Giáo',
        description:
          'Khởi hành từ Hà Nội, dừng chân đèo Thung Khe, tham quan đồi chè trái tim Mộc Châu rồi tiếp tục đi Tuần Giáo.',
        schedule: [
          '05h00: Đón khách tại điểm hẹn Hà Nội, khởi hành đi Tây Bắc.',
          '08h00: Nghỉ chân tại đèo Thung Khe, thưởng thức sản vật địa phương.',
          '09h30: Chụp hình cung đường chữ S Mộc Châu, tham quan đồi chè Trái Tim.',
          '12h00: Ăn trưa tại Mộc Châu.',
          '14h00: Lên xe đi Điện Biên, dừng chụp ảnh Ngã ba Cò Nòi và đỉnh đèo Pha Đin.',
          '18h30: Đến Tuần Giáo, ăn tối, nhận phòng khách sạn, tự do nghỉ ngơi.',
        ],
        image: 'https://cdn.tgdd.vn/Files/2023/03/14/1518123/du-lich-bac-yen-son-la-4-dia-diem-du-lich-hap-dan-nhat-202303151352434003.jpg',
      },
      {
        day: 2,
        title: 'Ngày 2 – Tuần Giáo • Điện Biên Phủ',
        description:
          'Khám phá các di tích lịch sử Điện Biên Phủ: Mường Phăng, cầu Mường Thanh, hầm Đờ Cát, đồi A1 và tượng đài chiến thắng.',
        schedule: [
          '07h00: Ăn sáng, trả phòng, lên xe đi Điện Biên.',
          '09h00: Tham quan tượng đài kéo pháo, khu di tích Mường Phăng.',
          '12h00: Ăn trưa tại thành phố Điện Biên, nhận phòng khách sạn.',
          '14h00: Tham quan cầu Mường Thanh, sông Nậm Rốm, hầm Đờ Cát, đồi A1.',
          '17h00: Ngắm tượng đài chiến thắng Điện Biên, bao quát toàn thành phố.',
          '19h00: Ăn tối, tự do tham gia lễ hội Hoa Ban hoặc giao lưu văn nghệ (tự túc).',
        ],
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcVIOt-tAVOA_ApUuydQ1SxIPGOfpC9F3gdQ&s',
      },
      {
        day: 3,
        title: 'Ngày 3 – Điện Biên • Sơn La • Hà Nội',
        description:
          'Trở về Hà Nội, dừng chân Sơn La thưởng thức đặc sản và mua quà.',
        schedule: [
          '06h30: Ăn sáng, trả phòng khách sạn.',
          '07h00: Lên xe về Hà Nội, ngắm cảnh núi rừng Tây Bắc.',
          '11h30: Ăn trưa tại thành phố Sơn La.',
          '14h30: Dừng mua đặc sản Tây Bắc làm quà.',
          '19h00: Về tới Hà Nội, HDV chia tay đoàn.',
        ],
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcVIOt-tAVOA_ApUuydQ1SxIPGOfpC9F3gdQ&s',
      },
    ],
    departureCity: 'Hà Nội',
    createdAt: new Date('2025-04-05T07:45:00').toISOString(),
  },
  {
    id: 'tour-son-la-3n2d-pa-khoang',
    name: 'Hà Nội – Sơn La – Điện Biên – Hồ Pá Khoang 3N2Đ',
    slug: 'ha-noi-son-la-dien-bien-ho-pa-khoang-3n2d',
    duration: '3 ngày 2 đêm',
    durationLabel: '3 ngày 2 đêm',
    durationDays: 3,
    durationNights: 2,
    price: 2650000,
    pricing: {
      adult: 2650000,
      child: 1800000,
      notes: 'Giá tham khảo, bao gồm khách sạn, ăn uống theo chương trình và vé tham quan Hồ Pá Khoang.',
    },
    summary:
      'Hành trình kết hợp Sơn La – Điện Biên với điểm nhấn Hồ Pá Khoang, đèo Pha Đin và các di tích Điện Biên Phủ.',
    description:
      'Tour 3 ngày khởi hành từ Hà Nội, khám phá Bảo tàng Sơn La, Nhà tù Sơn La, Hồ Pá Khoang cùng những dấu ấn lịch sử.',
    regions: ['Sơn La', 'Điện Biên'],
    hiddenFromExplorer: true,
    heroImage: '/anh/son-la-4n3d.jpg',
    gallery: [
      '/anh/son-la-4n3d.jpg',
      '/anh/son-la-4n3d-2.jpg',
      '/anh/son-la-4n3d-3.jpg',
    ],
    includes: [
      { label: 'Khách sạn tại Sơn La & Điện Biên', included: true },
      { label: 'Xe du lịch đời mới', included: true },
      { label: 'Vé tham quan Bảo tàng Sơn La, hồ Pá Khoang, đồi A1', included: true },
      { label: 'Hướng dẫn viên kinh nghiệm', included: true },
      { label: 'Chi phí vui chơi buổi tối', included: false },
      { label: 'Đồ uống ngoài chương trình', included: false },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Ngày 1 – Hà Nội • Sơn La',
        description:
          'Khởi hành từ Hà Nội đi Sơn La, tham quan Bảo tàng Sơn La, Nhà tù Sơn La và cây đào Tô Hiệu.',
        schedule: [
          '06h00: Xe và HDV đón khách tại Nhà Hát Lớn Hà Nội, khởi hành đi Mộc Châu (ăn sáng tự túc).',
          '08h30: Nghỉ chân tại đèo Thung Khe (Đá Trắng), ngắm cảnh và thưởng thức đặc sản.',
          '11h30: Đến Mộc Châu, dùng bữa trưa với đặc sản địa phương.',
          '15h00: Đến thành phố Sơn La, tham quan Bảo tàng Sơn La, Nhà tù Sơn La, Cây đào Tô Hiệu.',
          '17h00: Nhận phòng khách sạn nghỉ ngơi.',
          '19h00: Ăn tối thưởng thức ẩm thực Tây Bắc, tự do dạo phố.',
        ],
        image: '/anh/son-la-4n3d-1.jpg',
      },
      {
        day: 2,
        title: 'Ngày 2 – Sơn La • Hồ Pá Khoang • Điện Biên',
        description:
          'Khởi hành đi Điện Biên, tham quan hồ Pá Khoang, Bảo tàng Điện Biên Phủ và các di tích nổi tiếng.',
        schedule: [
          '05h00: Dùng bữa sáng, khởi hành đi Điện Biên qua đèo Pha Đin.',
          '10h00: Tham quan Khu du lịch Hồ Pá Khoang, Đảo hoa anh đào, thưởng ngoạn cảnh sắc hồ.',
          '11h30: Ăn trưa tại nhà hàng địa phương.',
          '13h00: Tham quan Bảo tàng lịch sử Điện Biên Phủ với 5 khu trưng bày.',
          '14h30: Viếng Nghĩa trang liệt sỹ A1, đồi A1.',
          '16h00: Tham quan hầm Đờ Cát, cầu Mường Thanh, sông Nậm Rốm, tượng đài chiến thắng Điện Biên Phủ.',
          '17h30: Nhận phòng khách sạn tại Điện Biên, nghỉ ngơi.',
          '18h30: Ăn tối tại nhà hàng; tối tự do hoặc giao lưu văn nghệ tại bản người Thái (tự túc).',
        ],
        image: '/anh/son-la-4n3d-2.jpg',
      },
      {
        day: 3,
        title: 'Ngày 3 – Điện Biên • Mộc Châu • Hà Nội',
        description:
          'Trở về Hà Nội, ghé Mộc Châu mua đặc sản Tây Bắc làm quà.',
        schedule: [
          '06h30: Trả phòng khách sạn, ăn sáng.',
          '07h00: Khởi hành về Hà Nội, chiêm ngưỡng cảnh núi rừng Tây Bắc.',
          '11h30: Ăn trưa tại thành phố Sơn La.',
          '14h30: Dừng chân Mộc Châu mua đặc sản như sữa chua nếp cẩm, trà, thịt trâu gác bếp.',
          '19h30: Về tới Hà Nội, kết thúc tour.',
        ],
        image: '/anh/son-la-4n3d-3.jpg',
      },
    ],
    departureCity: 'Hà Nội',
    createdAt: new Date('2025-04-10T07:00:00').toISOString(),
  },
  {
    id: 'tour-lao-cai-5n4d-sapa-ha-long',
    name: 'TP.HCM – Sapa – Fansipan – Hà Nội – Hạ Long 5N4Đ',
    slug: 'tphcm-sapa-fansipan-ha-long-5n4d',
    duration: '5 ngày 4 đêm',
    durationLabel: '5 ngày 4 đêm',
    durationDays: 5,
    durationNights: 4,
    price: 6900000,
    pricing: {
      adult: 6900000,
      child: 4700000,
      notes: 'Đã bao gồm vé máy bay khứ hồi TP.HCM – Hà Nội, cáp treo Fansipan và du thuyền Hạ Long.',
    },
    summary:
      'Hành trình 5 ngày đưa bạn từ TP.HCM tới Sapa, chinh phục Fansipan, khám phá Hà Nội và nghỉ đêm tại Hạ Long.',
    description:
      'Lịch trình kết hợp trải nghiệm núi rừng Tây Bắc và biển xanh Hạ Long với khách sạn 4*, ẩm thực phong phú và dịch vụ trọn gói.',
    regions: ['TP.HCM', 'Lào Cai', 'Hà Nội', 'Quảng Ninh'],
    hiddenFromExplorer: true,
    heroImage: 'https://imagev3.vietnamplus.vn/w820/Uploaded/2024/ngtnvak/2023_11_25/sa_pa_1.jpg',
    gallery: [
      'https://imagev3.vietnamplus.vn/w820/Uploaded/2024/ngtnvak/2023_11_25/sa_pa_1.jpg',
      'https://d2e5ushqwiltxm.cloudfront.net/wp-content/uploads/sites/172/2018/12/21094210/Fan-pano-01-1500x690.jpg',
      'https://cdn.tuoitre.vn/zoom/730_487/2020/5/12/vinh-ha-long-15892973196512191238629.jpg',
    ],
    includes: [
      { label: 'Vé máy bay khứ hồi TP.HCM – Hà Nội', included: true },
      { label: 'Khách sạn 4* tại Sapa, Hà Nội, Hạ Long', included: true },
      { label: 'Vé cáp treo Fansipan Legend', included: true },
      { label: 'Du thuyền thăm vịnh Hạ Long', included: true },
      { label: 'Chi phí cá nhân ngoài chương trình', included: false },
      { label: 'Đồ uống đặc biệt', included: false },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Ngày 1 – TP.HCM • Hà Nội • Sapa',
        description:
          'Bay ra Hà Nội, di chuyển theo cao tốc Nội Bài – Lào Cai và nhận phòng khách sạn tại Sapa.',
        schedule: [
          '05:30: Tập trung tại sân bay Tân Sơn Nhất, làm thủ tục bay ra Hà Nội.',
          '08:30: Hạ cánh Nội Bài, xe đón đoàn khởi hành đi Sapa theo cao tốc Nội Bài – Lào Cai (khoảng 5 giờ).',
          '12:30: Dừng ăn trưa tại Nhà hàng Hải Yến – Lào Cai với đặc sản vùng cao.',
          '15:30: Đến Sapa, nhận phòng Bamboo Sapa Hotel 4*.',
          '16:30: Tham quan Nhà thờ đá, hồ Sapa, phố Cầu Mây và chợ trung tâm.',
          '18:30: Ăn tối tại Nhà hàng Red Dao House – thưởng thức lẩu cá hồi, rau rừng.',
          '20:00: Tự do dạo phố, uống trà thảo mộc hoặc cà phê Fansipan Terrace.',
        ],
        image: 'https://statics.vietnamtourism.gov.vn/Images/Upload/2020/9/sapa-thi-tran.jpg',
      },
      {
        day: 2,
        title: 'Ngày 2 – Fansipan Legend & bản Cát Cát',
        description:
          'Chinh phục nóc nhà Đông Dương, tham quan bản Cát Cát và thưởng thức ẩm thực đặc sản.',
        schedule: [
          '07:00: Ăn sáng tại khách sạn.',
          '08:30: Lên khu du lịch Fansipan Legend, đi cáp treo chinh phục đỉnh Fansipan 3.143m.',
          '10:30: Tham quan tượng Phật A Di Đà, Bích Vân Thiền Tự.',
          '12:00: Ăn trưa tại Nhà hàng Vân Sam.',
          '14:00: Tham quan bản Cát Cát, chụp ảnh thác Tiên Sa.',
          '18:00: Ăn tối tại Nhà hàng Cá Hồi Sapa, tối tự do dạo phố hoặc uống cà phê.',
        ],
        image: 'https://d2e5ushqwiltxm.cloudfront.net/wp-content/uploads/sites/172/2018/12/21094210/Fan-pano-01-1500x690.jpg',
      },
      {
        day: 3,
        title: 'Ngày 3 – Sapa • Hà Nội',
        description:
          'Chia tay Sapa, trở về Hà Nội và khám phá ẩm thực phố cổ.',
        schedule: [
          '07:00: Ăn sáng, trả phòng khách sạn.',
          '08:00: Tham quan chợ Cốc Lếu, chụp ảnh cửa khẩu Việt – Trung (nếu thời gian cho phép).',
          '12:30: Ăn trưa tại Nhà hàng Đức Anh – Lào Cai.',
          '13:00: Khởi hành về Hà Nội.',
          '18:00: Nhận phòng khách sạn The Light Hotel 4*, tự do khám phá phố cổ.',
        ],
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDZ3fT2Ip9OwIydGCf0ObZLKROkcxQThOnZA&s',
      },
      {
        day: 4,
        title: 'Ngày 4 – Hà Nội • Hạ Long',
        description:
          'Khởi hành đi Hạ Long, tham quan động Thiên Cung, đảo Ti Tốp và thưởng thức hải sản.',
        schedule: [
          '07:00: Ăn sáng tại khách sạn.',
          '08:00: Thăm Hồ Hoàn Kiếm – Đền Ngọc Sơn – Cầu Thê Húc.',
          '09:00: Lên xe đi Hạ Long.',
          '12:30: Lên du thuyền và ăn trưa trên tàu.',
          '14:30: Tham quan Động Thiên Cung, Hòn Trống Mái, Hòn Đỉnh Hương; tắm biển đảo Ti Tốp.',
          '17:30: Về bến tàu, nhận phòng khách sạn Hạ Long Plaza Hotel 4*.',
          '18:30: Ăn tối tại Nhà hàng Cua Vàng, tối tự do khám phá Bãi Cháy.',
        ],
        image: 'https://statics.vinpearl.com/production/vinh-ha-long-1.jpg',
      },
      {
        day: 5,
        title: 'Ngày 5 – Hạ Long • Hà Nội • TP.HCM',
        description:
          'Tham quan Bảo tàng Quảng Ninh, Cung Cá Heo rồi bay về TP.HCM.',
        schedule: [
          '07:00: Ăn sáng tại khách sạn.',
          '08:00: Tham quan Bảo tàng Quảng Ninh và Cung Cá Heo.',
          '11:00: Ăn trưa tại Nhà hàng Sen Á Đông.',
          '12:30: Khởi hành về Hà Nội.',
          '15:30: Xe đưa đoàn ra sân bay Nội Bài làm thủ tục bay về TP.HCM.',
          '18:00: Kết thúc chương trình.',
        ],
        image: 'https://dulichhalongtour.com.vn/wp-content/uploads/2023/04/bai-chay-ha-long.jpg',
      },
    ],
    departureCity: 'TP.HCM',
    createdAt: new Date('2025-04-05T05:30:00').toISOString(),
  },
  {
    id: 'tour-lao-cai-5n4d-fansipan-legacy',
    name: 'Hành trình Tây Bắc – Chinh phục Fansipan 5N4Đ',
    slug: 'tay-bac-chinh-phuc-fansipan-5n4d',
    duration: '5 ngày 4 đêm',
    durationLabel: '5 ngày 4 đêm',
    durationDays: 5,
    durationNights: 4,
    price: 6500000,
    pricing: {
      adult: 6500000,
      child: 4300000,
      notes: 'Bao gồm cáp treo Fansipan, xe di chuyển toàn tuyến và homestay Bản Liền.',
    },
    summary:
      'Khởi hành từ TP.HCM, khám phá Hà Nội, Bản Liền, Bắc Hà, Sapa và chinh phục đỉnh Fansipan.',
    description:
      'Tour kết hợp văn hoá dân tộc Tày, chợ phiên Bắc Hà và trải nghiệm săn mây Fansipan với hành trình 5 ngày đặc sắc.',
    regions: ['TP.HCM', 'Hà Nội', 'Lào Cai'],
    hiddenFromExplorer: true,
    heroImage: 'https://images.vietnamtourism.gov.vn/vn/images/2022/thang_4/0804.ban_lien_-_diem_den_an_tuong1.jpg',
    gallery: [
      'https://images.vietnamtourism.gov.vn/vn/images/2022/thang_4/0804.ban_lien_-_diem_den_an_tuong1.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwxXSszkoSwGQBGBQbVJNpyxQ2b4OHg50Gjg&s',
      'https://doingoailaocai.vn/storage/12299/Khu-ngh%E1%BB%89-d%C6%B0%E1%BB%A1ng-topas-Ecolodge.jpg',
    ],
    includes: [
      { label: 'Vé máy bay TP.HCM – Hà Nội – TP.HCM', included: true },
      { label: 'Homestay Bản Liền & khách sạn 4* Sapa', included: true },
      { label: 'Xe du lịch và xe jeep địa phương', included: true },
      { label: 'Trải nghiệm văn hoá Tày, đốt lửa trại', included: true },
      { label: 'Chi phí spa, massage', included: false },
      { label: 'Đồ uống đặc biệt', included: false },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Ngày 1 – TP.HCM • Hà Nội',
        description:
          'Bay ra Hà Nội, nhận phòng khách sạn và tham quan các điểm nổi bật của Thủ đô.',
        schedule: [
          'Sáng: Làm thủ tục tại sân bay Tân Sơn Nhất, bay ra Hà Nội.',
          'Trưa: Tự do thưởng thức ẩm thực Hà Nội: phở Bát Đàn, bún chả Hàng Quạt, bún thang Cầu Gỗ.',
          'Chiều: Nhận phòng khách sạn, tham quan Hồ Hoàn Kiếm, Cầu Thê Húc, Đền Ngọc Sơn, dạo phố cổ.',
          'Tối: Ăn tối tự do, gợi ý Quán Ăn Ngon, Chả cá Lã Vọng hoặc Bún đậu Mã Mây.',
        ],
        image: 'https://bcp.cdnchinhphu.vn/334894974524682240/2022/12/19/img-bgt-2021-440-1671268329-width700height393-16714402008681193255999.jpeg',
      },
      {
        day: 2,
        title: 'Ngày 2 – Hà Nội • Bản Liền',
        description:
          'Khởi hành đi Bắc Hà – Bản Liền, trải nghiệm hái chè shan tuyết và đời sống người Tày.',
        schedule: [
          '06:30: Dùng bữa sáng tại khách sạn.',
          '07:30: Khởi hành đi Bắc Hà – Bản Liền (khoảng 6 giờ).',
          '12:00: Ăn trưa tại nhà hàng Hoa Ban Quán – Bắc Hà.',
          '14:30: Đến Bản Liền, tham quan đồi chè Shan Tuyết, trải nghiệm hái chè, sao chè và pha trà.',
          '18:30: Ăn tối tại homestay Bản Liền với cá suối, thịt trâu gác bếp, măng rừng.',
          '20:00: Đốt lửa trại, uống rượu ngô, nghe hát then, đàn tính.',
        ],
        image: 'https://luhanhvietnam.com.vn/du-lich/vnt_upload/news/02_2023/xa-ban-lien-bac-ha-4.jpg',
      },
      {
        day: 3,
        title: 'Ngày 3 – Bắc Hà • Sapa',
        description:
          'Tham quan chợ Bắc Hà, di chuyển đến Sapa nhận phòng khách sạn 4*.',
        schedule: [
          '06:30: Ăn sáng tại homestay.',
          '07:30: Tham quan chợ Bắc Hà (nếu đi vào Chủ nhật).',
          '10:30: Di chuyển đến Sapa (khoảng 3 giờ).',
          '12:30: Ăn trưa tại nhà hàng Hotpot Center Sapa.',
          '14:00: Nhận phòng Bamboo Sapa Hotel 4* hoặc tương đương.',
          '15:00: Tham quan bản Cát Cát, thác Tiên Sa, nghề dệt thổ cẩm.',
          '18:30: Ăn tối tại nhà hàng Red Dao House, tối dạo phố đi bộ Cầu Mây, chợ đêm Sapa.',
        ],
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwxXSszkoSwGQBGBQbVJNpyxQ2b4OHg50Gjg&s',
      },
      {
        day: 4,
        title: 'Ngày 4 – Fansipan – Chinh phục nóc nhà Đông Dương',
        description:
          'Chinh phục đỉnh Fansipan, tham quan hệ thống chùa tháp và trở về Sapa nghỉ ngơi.',
        schedule: [
          '06:00: Ăn sáng tại khách sạn.',
          '07:00: Lên ga cáp treo Fansipan Legend, chinh phục đỉnh cao 3.143m.',
          '08:30 – 11:00: Tham quan Tượng Phật A Di Đà, Bảo An Thiền Tự, Đại Hồng Chung, Bích Vân Thiền Tự.',
          '12:00: Ăn trưa tại Nhà hàng Vân Sam.',
          '14:30: Trở về thị trấn Sapa, tham quan nhà thờ đá, hồ Sapa.',
          '18:30: Ăn tối tại nhà hàng Moment Romantic Sapa, thư giãn tại spa hoặc tham gia chợ tình (nếu có).',
        ],
        image: 'https://balitourist.com.vn/public/uploads/images/H%C3%A0nh%20tr%C3%ACnh%20tour%20HQ%2031.1/Rew/1-cam-nang-du-lich-sapa.png',
      },
      {
        day: 5,
        title: 'Ngày 5 – Sapa • Sân bay Nội Bài • TP.HCM',
        description:
          'Trả phòng, về Hà Nội ăn trưa và làm thủ tục bay về TP.HCM.',
        schedule: [
          '06:00: Ăn sáng tại khách sạn.',
          '07:00: Khởi hành về Hà Nội (khoảng 5 giờ).',
          '12:00: Ăn trưa tại nhà hàng Sen Tây Hồ.',
          '14:00: Xe đưa đoàn ra sân bay Nội Bài, làm thủ tục bay về TP.HCM.',
          '17:00: Đến sân bay Tân Sơn Nhất, kết thúc hành trình.',
        ],
        image: 'https://vj-prod-website-cms.s3.ap-southeast-1.amazonaws.com/1661333814636-1679391995463.jpg',
      },
    ],
    departureCity: 'TP.HCM',
    createdAt: new Date('2025-04-07T06:00:00').toISOString(),
  },
  {
    id: 'tour-lao-cai-3n2d-ha-noi-lc',
    name: 'Hà Nội – Lào Cai – Sapa – Fansipan 3N2Đ',
    slug: 'ha-noi-lao-cai-sapa-3n2d',
    duration: '3 ngày 2 đêm',
    durationLabel: '3 ngày 2 đêm',
    durationDays: 3,
    durationNights: 2,
    price: 6200000,
    pricing: {
      adult: 6200000,
      child: 4100000,
      notes: 'Bao gồm cáp treo Fansipan và vé tàu Hà Nội – Lào Cai khứ hồi.',
    },
    summary:
      'Trải nghiệm Sapa trong 3 ngày: Fansipan, Cổng Trời Ô Quy Hồ, thác Bạc và bản Tả Van.',
    description:
      'Khởi hành từ Hà Nội, nghỉ tại khách sạn 4*, khám phá các bản làng nổi tiếng và ẩm thực đặc sản vùng cao.',
    regions: ['Hà Nội', 'Lào Cai'],
    hiddenFromExplorer: true,
    heroImage: 'https://viettrekking.vn/wp-content/uploads/2025/05/image1-3.png',
    gallery: [
      'https://viettrekking.vn/wp-content/uploads/2025/05/image1-3.png',
      'https://sinhtour.vn/wp-content/uploads/2022/01/thac-bac-sapa.jpg',
      'https://cdn.tuoitre.vn/zoom/700_467/2020/9/22/cat-cat-1600740538350844213103.jpg',
    ],
    includes: [
      { label: 'Khách sạn Sapa Charm Hotel 4*', included: true },
      { label: 'Vé cáp treo Fansipan', included: true },
      { label: 'Vé tàu Hà Nội – Lào Cai – Hà Nội', included: true },
      { label: 'Hướng dẫn viên địa phương', included: true },
      { label: 'Chi phí café đặc biệt', included: false },
      { label: 'Tip tự nguyện', included: false },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Ngày 1 – Hà Nội • Sapa • Bản Cát Cát',
        description:
          'Di chuyển theo cao tốc Nội Bài – Lào Cai, nhận phòng Sapa Charm và khám phá bản Cát Cát.',
        schedule: [
          '06:00 – 11:30: Khởi hành từ Hà Nội đi Sapa theo cao tốc Nội Bài – Lào Cai, nghỉ chân tại Km237 Lào Cai.',
          '11:30 – 12:30: Nhận phòng Sapa Charm Hotel 4*, ăn trưa tại Nhà hàng Good Morning View.',
          '13:30 – 16:30: Tham quan Bản Cát Cát – ngắm thác Tiên Sa, cầu Si, nhà truyền thống.',
          '17:00 – 18:30: Về khách sạn nghỉ ngơi.',
          '18:30 – 19:30: Ăn tối tại Nhà hàng A Phủ – thưởng thức lẩu cá tầm, gà đồi, thắng cố.',
          '20:00 – 22:00: Dạo phố Cầu Mây, quảng trường Sapa, uống cà phê view núi.',
        ],
        image: 'https://cdn3.ivivu.com/2024/07/ban-cat-cat-ivivu-17.jpg',
      },
      {
        day: 2,
        title: 'Ngày 2 – Fansipan • Thác Bạc • Đèo Ô Quy Hồ',
        description:
          'Chinh phục Fansipan, tham quan thác Bạc và check-in Cổng Trời.',
        schedule: [
          '06:30 – 07:30: Ăn sáng buffet tại khách sạn.',
          '08:00 – 11:30: Đi cáp treo Fansipan, tham quan đền Trình, tượng Phật A Di Đà.',
          '12:00 – 13:00: Ăn trưa tại Nhà hàng Hoa Đào.',
          '13:30 – 15:00: Tham quan Thác Bạc.',
          '15:15 – 16:30: Check-in Đèo Ô Quy Hồ – Cổng Trời Sapa, thưởng thức cà phê tại Cổng Trời Coffee.',
          '17:00 – 18:00: Về lại trung tâm Sapa nghỉ ngơi.',
          '18:30 – 19:30: Ăn tối tại Nhà hàng Cầu Mây BBQ & Grill – buffet nướng vùng cao.',
          '20:00 – 22:00: Tự do vui chơi buổi tối.',
        ],
        image: 'https://sinhtour.vn/wp-content/uploads/2022/01/thac-bac-sapa.jpg',
      },
      {
        day: 3,
        title: 'Ngày 3 – Nhà thờ đá • Bản Tả Van • Hà Nội',
        description:
          'Tham quan nhà thờ đá, bản Tả Van rồi khởi hành về Hà Nội.',
        schedule: [
          '06:30 – 07:30: Ăn sáng, làm thủ tục trả phòng.',
          '08:00 – 09:00: Tham quan Nhà thờ đá Sapa, chụp ảnh tại quảng trường.',
          '09:30 – 11:30: Tham quan Bản Tả Van – Lao Chải, tìm hiểu phong tục người Giáy.',
          '12:30 – 13:30: Ăn trưa tại Nhà hàng Lotus Sapa.',
          '13:30 – 17:30: Khởi hành về Hà Nội, nghỉ chân tại trạm Lào Cai 20 phút.',
          '17:30 – 18:00: Về tới Hà Nội, kết thúc tour.',
        ],
        image: 'https://viettrekking.vn/wp-content/uploads/2025/05/image1-3.png',
      },
    ],
    departureCity: 'Hà Nội',
    createdAt: new Date('2025-04-20T06:00:00').toISOString(),
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
    id: 'tour-phu-tho-ve-dat-to-1n',
    name: 'Phú Thọ 1N – Về với Đất Tổ & tour đêm Đền Hùng',
    slug: 'phu-tho-ve-voi-dat-to-tour-dem-den-hung',
    duration: '1 ngày',
    durationLabel: '1 ngày',
    durationDays: 1,
    durationNights: 0,
    price: 890000,
    pricing: {
      adult: 890000,
      notes: 'Đã bao gồm xe đưa đón, vé tham quan Đền Hùng và trải nghiệm tour đêm.',
    },
    summary:
      'Một ngày trọn vẹn về với Đền Hùng, kết hợp tour đêm linh thiêng và khám phá làng cổ Hùng Lô.',
    description:
      'Lịch trình tinh gọn dành cho khách mong muốn tìm về cội nguồn dân tộc, trải nghiệm không gian tâm linh khi đêm xuống.',
    regions: ['Phú Thọ'],
    heroImage: '/anh/taotour/ngay-1-ve-dat-to.jpg',
    gallery: [
      '/anh/taotour/ngay-1-ve-dat-to.jpg',
      '/anh/taotour/ngay-1-di-san-den-hung.jpg',
      '/anh/taotour/ngay-2-doi-che-long-coc.jpg',
    ],
    includes: [
      { label: 'Xe đón trả trong ngày', included: true },
      { label: 'Vé tham quan quần thể đền Hùng', included: true },
      { label: 'Tour đêm “Trở về cội nguồn”', included: true },
      { label: 'Hướng dẫn viên theo đoàn', included: true },
      { label: 'Bữa tối tự chọn', included: false },
      { label: 'Chi phí lễ vật phát sinh', included: false },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Ngày 1 – Về với Đất Tổ',
        description:
          'Hành trình trong ngày kết hợp chiêm bái, văn hoá làng cổ và tour đêm linh thiêng tại Đền Hùng.',
        schedule: [
          'Sáng: Xe đón khách tại điểm hẹn, di chuyển về Phú Thọ.',
          '09h30: Thăm đền Hạ, đền Trung, đền Thượng và đền Giếng; tìm hiểu lịch sử vua Hùng.',
          '12h00: Ăn trưa tự do với đặc sản Phú Thọ (chi phí tự túc).',
          '14h00: Tham quan Làng cổ Hùng Lô, ghé Miếu Lãi Lèn nếu kịp thời gian.',
          '18h30: Chuẩn bị tham gia tour đêm Đền Hùng – Trở về cội nguồn.',
          '19h00 – 22h30: Trải nghiệm tour đêm, nghe hướng dẫn viên kể chuyện linh thiêng, tham gia nghi lễ tâm linh.',
          '22h30 – 23h00: Xe đưa đoàn trở lại điểm đón ban đầu, kết thúc chương trình.',
        ],
        image: '/anh/taotour/ngay-1-ve-dat-to.jpg',
      },
    ],
    departureCity: 'Hà Nội',
    createdAt: new Date('2025-05-28T08:00:00').toISOString(),
  },
  {
    id: 'tour-phu-tho-2n1d-thanh-thuy',
    name: 'Phú Thọ 2N1Đ – Khám phá thiên nhiên & nghỉ dưỡng Thanh Thủy',
    slug: 'phu-tho-2n1d-thanh-thuy',
    duration: '2 ngày 1 đêm',
    durationLabel: '2 ngày 1 đêm',
    durationDays: 2,
    durationNights: 1,
    price: 1080000,
    pricing: {
      adult: 1080000,
      notes:
        'Giá lưu trú nhà sàn ~1.080.000 đ/khách; khách sạn cao cấp từ 1.290.000 đ/khách (bao gồm xe, ăn uống, HDV, vé tham quan, bảo hiểm).',
    },
    summary:
      'Hành trình kết hợp nghỉ dưỡng suối khoáng Thanh Thủy với trải nghiệm văn hoá Đền Hùng trong 2 ngày 1 đêm.',
    description:
      'Phù hợp gia đình và nhóm bạn cần lịch trình nhẹ nhàng, thư giãn tại resort khoáng nóng nhưng vẫn đủ thời gian khám phá Đền Hùng.',
    regions: ['Phú Thọ'],
    heroImage: '/anh/taotour/2n1d-phu-tho-den-hung-thanh-thuy.jpg',
    gallery: [
      '/anh/taotour/2n1d-phu-tho-den-hung-thanh-thuy.jpg',
      '/anh/taotour/ngay-1-thanh-thuy-thu-gian.jpg',
      '/anh/taotour/ngay-1-di-san-den-hung.jpg',
    ],
    includes: [
      { label: 'Xe đưa đón trọn gói', included: true },
      { label: '01 đêm lưu trú nhà sàn hoặc khách sạn', included: true },
      { label: 'Vé tham quan Đền Hùng & dịch vụ suối khoáng', included: true },
      { label: 'Hướng dẫn viên & bảo hiểm du lịch', included: true },
      { label: 'Nâng hạng phòng khách sạn', included: false },
      { label: 'Chi phí dịch vụ spa cao cấp', included: false },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Ngày 1 – Nghỉ dưỡng Thanh Thủy',
        description: 'Thư giãn tại Thanh Thủy Resort và trải nghiệm suối khoáng nóng.',
        schedule: [
          'Sáng: Xe đón đoàn khởi hành tới Thanh Thủy.',
          'Trưa: Ăn trưa tại khu du lịch, nhận phòng nghỉ ngơi.',
          'Chiều: Tự do vui chơi, tắm khoáng nóng và khám phá khu resort.',
          'Tối: Nghỉ đêm tại nhà sàn hoặc khách sạn theo lựa chọn, thưởng thức đặc sản địa phương.',
        ],
        image: '/anh/taotour/ngay-1-thanh-thuy-thu-gian.jpg',
      },
      {
        day: 2,
        title: 'Ngày 2 – Về Đền Hùng',
        description: 'Khám phá quần thể Đền Hùng trước khi trở lại điểm xuất phát.',
        schedule: [
          'Sáng: Trả phòng, di chuyển tới Đền Hùng.',
          'Tham quan đền Hạ, đền Trung, đền Thượng và đền Giếng.',
          'Trưa: Ăn trưa với món đặc sản địa phương.',
          'Chiều: Khởi hành về điểm xuất phát, kết thúc hành trình.',
        ],
        image: '/anh/taotour/ngay-1-di-san-den-hung.jpg',
      },
    ],
    departureCity: 'Hà Nội',
    createdAt: new Date('2025-03-22T07:30:00').toISOString(),
  },
  {
    id: 'tour-phu-tho-3n2d-mien-nui',
    name: 'Phú Thọ 3N2Đ – Miền núi, đồi chè & rừng quốc gia',
    slug: 'phu-tho-3n2d-mien-nui-doi-che',
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
      'Khám phá Đền Hùng, đồi chè Long Cốc và trekking nhẹ Vườn quốc gia Xuân Sơn trong 3 ngày 2 đêm.',
    description:
      'Hành trình dành cho người yêu thiên nhiên miền núi trung du Bắc Bộ, kết hợp trải nghiệm văn hoá bản địa và nghỉ dưỡng thung lũng.',
    regions: ['Phú Thọ'],
    heroImage: '/anh/taotour/3n2d-phu-tho-thanh-thuy-long-coc.jpg',
    gallery: [
      '/anh/taotour/3n2d-phu-tho-thanh-thuy-long-coc.jpg',
      '/anh/taotour/ngay-2-doi-che-long-coc.jpg',
      '/anh/taotour/ngay-2-trekking-xuan-son.jpg',
    ],
    includes: [
      { label: 'Khách sạn/nhà sàn 2 đêm', included: true },
      { label: 'Tham quan đồi chè Long Cốc', included: true },
      { label: 'Vé tham quan Vườn quốc gia Xuân Sơn', included: true },
      { label: 'Hướng dẫn viên trekking', included: true },
      { label: 'Chi phí trải nghiệm riêng (zipline, spa)', included: false },
      { label: 'Đồ uống có cồn', included: false },
    ],
    itinerary: [
      {
        day: 1,
        title: 'Ngày 1 – Đền Hùng & đồi chè Long Cốc',
        description: 'Hành trình về Đất Tổ và thưởng ngoạn đồi chè trùng điệp.',
        schedule: [
          'Sáng: Khởi hành từ điểm xuất phát, đến Phú Thọ và tham quan quần thể Đền Hùng.',
          'Trưa: Thưởng thức đặc sản địa phương trước khi di chuyển lên Long Cốc.',
          'Chiều: Tham quan đồi chè Long Cốc, trải nghiệm hái và sao chè cùng người dân.',
          'Tối: Nhận phòng khách sạn hoặc homestay trong thung lũng, thưởng thức ẩm thực núi rừng.',
        ],
        image: '/anh/taotour/ngay-2-doi-che-long-coc.jpg',
      },
      {
        day: 2,
        title: 'Ngày 2 – Trekking Xuân Sơn',
        description: 'Khám phá thiên nhiên rừng quốc gia với hoạt động trekking nhẹ.',
        schedule: [
          'Sáng: Di chuyển tới Vườn quốc gia Xuân Sơn, trekking nhẹ tuyến suối Tiên hoặc hang Na.',
          'Trưa: Picnic giữa rừng hoặc ăn trưa tại bản, thưởng thức món cá suối, gà đồi.',
          'Chiều: Trở về homestay, ghé thăm bản làng trải nghiệm văn hoá địa phương.',
          'Tối: Giao lưu lửa trại, thưởng thức rượu men lá và đặc sản vùng cao.',
        ],
        image: '/anh/taotour/ngay-2-trekking-xuan-son.jpg',
      },
      {
        day: 3,
        title: 'Ngày 3 – Thư giãn & mua sắm',
        description: 'Hoạt động nhẹ nhàng trước khi trở về.',
        schedule: [
          'Sáng: Tản bộ ngắm bình minh, mua đặc sản chè, thịt chua về làm quà.',
          '10h00: Trả phòng, di chuyển về trung tâm tỉnh.',
          'Trưa: Ăn trưa và nghỉ ngơi ngắn.',
          'Chiều: Khởi hành về điểm xuất phát, kết thúc chương trình.',
        ],
        image: '/anh/taotour/ngay-3-rung-quoc-gia-mua-sam.jpg',
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

function applyTourTranslations(tour, language) {
  if (language === 'vi') {
    return tour;
  }

  const translations = TOUR_TRANSLATIONS[tour.id]?.[language];
  if (!translations) {
    return tour;
  }

  const localized = { ...tour };

  if (translations.name) localized.name = translations.name;
  if (translations.summary) localized.summary = translations.summary;
  if (translations.description) localized.description = translations.description;
  if (translations.duration) localized.duration = translations.duration;
  if (translations.durationLabel) localized.durationLabel = translations.durationLabel;
  if (translations.regions) localized.regions = [...translations.regions];
  if (translations.heroImage) localized.heroImage = translations.heroImage;

  if (translations.pricing && tour.pricing) {
    localized.pricing = { ...tour.pricing, ...translations.pricing };
  }

  if (Array.isArray(tour.includes)) {
    const translatedIncludes = translations.includes ?? [];
    localized.includes = tour.includes.map((item, index) => ({
      ...item,
      label: translatedIncludes[index] ?? item.label,
    }));
  }

  if (Array.isArray(tour.itinerary)) {
    const translatedItinerary = translations.itinerary ?? [];
    localized.itinerary = tour.itinerary.map((item, index) => {
      const translated = translatedItinerary[index];
      if (!translated) {
        return { ...item };
      }

      const schedule =
        Array.isArray(translated.schedule) && translated.schedule.length > 0
          ? [...translated.schedule]
          : Array.isArray(item.schedule)
            ? [...item.schedule]
            : undefined;

      const entry = {
        ...item,
        title: translated.title ?? item.title,
        description: translated.description ?? item.description,
      };

      if (schedule) {
        entry.schedule = schedule;
      } else if ('schedule' in entry) {
        delete entry.schedule;
      }

      return entry;
    });
  }

  return localized;
}

function localizeTours(tours, language) {
  if (language === 'vi') {
    return tours;
  }
  return tours.map((tour) => applyTourTranslations(tour, language));
}

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
  const heroImage = tour.heroImage ?? `/anh/taotour/${heroSlug}.jpg`;
  const itinerary = (tour.itinerary ?? []).map((item) => ({
    ...item,
    image: item.image ?? `/anh/taotour/${slugify(item.title)}.jpg`,
  }));
  return {
    ...tour,
    heroImage,
    gallery: [heroImage],
    itinerary,
  };
});

const STORAGE_KEYS = {
  users: 'sevenTravelUsers',
  currentUserId: 'sevenTravelCurrentUserId',
  bookings: 'sevenTravelBookings',
  topups: 'sevenTravelTopUps',
  transportContacts: 'sevenTravelTransportContacts',
  supportMessages: 'sevenTravelSupportMessages',
  tourAnalytics: 'sevenTravelTourAnalytics',
};

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
  const { language } = useLanguage();
  const [users, setUsers] = useState(INITIAL_USERS);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [supabaseUser, setSupabaseUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [tours, setTours] = useState(INITIAL_TOURS);
  const [tourAnalytics, setTourAnalytics] = useState(() => {
    const base = buildInitialTourAnalytics(INITIAL_TOURS);
    if (typeof window === 'undefined') {
      return base;
    }
    try {
      const raw = window.localStorage.getItem(STORAGE_KEYS.tourAnalytics);
      if (!raw) {
        return base;
      }
      const parsed = JSON.parse(raw);
      return mergeTourAnalyticsState(base, parsed);
    } catch (error) {
      console.warn('Không thể đọc thống kê lượt xem tour từ localStorage.', error);
      return base;
    }
  });
  const [transportOptions, setTransportOptions] = useState(INITIAL_TRANSPORT);
  const [stayOptions, setStayOptions] = useState(INITIAL_STAYS);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [topUpRequests, setTopUpRequests] = useState(INITIAL_TOPUPS);
  const [transportContacts, setTransportContacts] = useState(INITIAL_TRANSPORT_CONTACTS);
  const [supportMessages, setSupportMessages] = useState(INITIAL_SUPPORT_MESSAGES);
  const localizedTours = useMemo(() => localizeTours(tours, language), [tours, language]);

  useEffect(() => {
    setTourAnalytics((prev) => {
      let changed = false;
      const next = { ...prev };
      tours.forEach((tour) => {
        if (!tour?.id) {
          return;
        }
        const current = next[tour.id];
        if (!current) {
          next[tour.id] = {
            tourId: tour.id,
            slug: tour.slug ?? '',
            clicks: 0,
            lastClickedAt: null,
          };
          changed = true;
          return;
        }
        if (tour.slug && current.slug !== tour.slug) {
          next[tour.id] = { ...current, slug: tour.slug };
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [tours]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEYS.tourAnalytics, JSON.stringify(tourAnalytics));
    } catch (error) {
      console.warn('Không thể lưu thống kê lượt xem tour vào localStorage.', error);
    }
  }, [tourAnalytics]);

  const currentUser = users.find((user) => user.id === currentUserId) ?? null;

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      const rawUsers = window.localStorage.getItem(STORAGE_KEYS.users);
      if (rawUsers) {
        const parsed = JSON.parse(rawUsers);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setUsers(parsed);
        }
      }
    } catch (error) {
      console.warn('Không thể đọc dữ liệu người dùng từ localStorage.', error);
    }
    const savedUserId = window.localStorage.getItem(STORAGE_KEYS.currentUserId);
    if (savedUserId) {
      setCurrentUserId(savedUserId);
    }
    try {
      const rawBookings = window.localStorage.getItem(STORAGE_KEYS.bookings);
      if (rawBookings) {
        const parsed = JSON.parse(rawBookings);
        if (Array.isArray(parsed)) {
          setBookings(parsed);
        }
      }
    } catch (error) {
      console.warn('Không thể đọc dữ liệu đặt dịch vụ từ localStorage.', error);
    }
    try {
      const rawTopups = window.localStorage.getItem(STORAGE_KEYS.topups);
      if (rawTopups) {
        const parsed = JSON.parse(rawTopups);
        if (Array.isArray(parsed)) {
          setTopUpRequests(parsed);
        }
      }
    } catch (error) {
      console.warn('Không thể đọc yêu cầu nạp tiền từ localStorage.', error);
    }
    try {
      const rawTransportContacts = window.localStorage.getItem(STORAGE_KEYS.transportContacts);
      if (rawTransportContacts) {
        const parsed = JSON.parse(rawTransportContacts);
        if (Array.isArray(parsed)) {
          setTransportContacts(parsed);
        }
      }
    } catch (error) {
      console.warn('Không thể đọc liên hệ vận chuyển từ localStorage.', error);
    }
    try {
      const rawSupports = window.localStorage.getItem(STORAGE_KEYS.supportMessages);
      if (rawSupports) {
        const parsed = JSON.parse(rawSupports);
        if (Array.isArray(parsed)) {
          setSupportMessages(parsed);
        }
      }
    } catch (error) {
      console.warn('Không thể đọc tin nhắn hỗ trợ từ localStorage.', error);
    }
  }, []);

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
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
    } catch (error) {
      console.warn('Không thể lưu dữ liệu người dùng.', error);
    }
  }, [users]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (currentUserId) {
      window.localStorage.setItem(STORAGE_KEYS.currentUserId, currentUserId);
    } else {
      window.localStorage.removeItem(STORAGE_KEYS.currentUserId);
    }
  }, [currentUserId]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEYS.bookings, JSON.stringify(bookings));
    } catch (error) {
      console.warn('Không thể lưu dữ liệu đặt dịch vụ.', error);
    }
  }, [bookings]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEYS.topups, JSON.stringify(topUpRequests));
    } catch (error) {
      console.warn('Không thể lưu dữ liệu nạp tiền.', error);
    }
  }, [topUpRequests]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEYS.transportContacts, JSON.stringify(transportContacts));
    } catch (error) {
      console.warn('Không thể lưu dữ liệu liên hệ vận chuyển.', error);
    }
  }, [transportContacts]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEYS.supportMessages, JSON.stringify(supportMessages));
    } catch (error) {
      console.warn('Không thể lưu dữ liệu hỗ trợ khách hàng.', error);
    }
  }, [supportMessages]);

  const recordTourView = useCallback(
    (tourId) => {
      if (!tourId) {
        return;
      }
      setTourAnalytics((prev) => {
        const now = new Date().toISOString();
        const matchedTour = tours.find((item) => item.id === tourId) ?? null;
        const existing = prev?.[tourId] ?? {
          tourId,
          slug: matchedTour?.slug ?? '',
          clicks: 0,
          lastClickedAt: null,
        };
        return {
          ...prev,
          [tourId]: {
            ...existing,
            slug: matchedTour?.slug ?? existing.slug ?? '',
            clicks: (existing.clicks ?? 0) + 1,
            lastClickedAt: now,
          },
        };
      });
    },
    [tours]
  );

  const resetTourAnalytics = useCallback(() => {
    setTourAnalytics(buildInitialTourAnalytics(tours));
  }, [tours]);

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
        console.warn('Failed to hydrate Supabase profile', error);
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

  const shouldSkipProfileSync =
    typeof window !== 'undefined' &&
    ['localhost', '127.0.0.1'].includes(window.location.hostname) &&
    import.meta.env.VITE_ENABLE_PROFILE_SYNC !== 'true';

  const syncProfileThroughFunction = async ({ fullName, phoneNumber, role = 'customer' }) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) {
      throw new Error('Không tìm thấy phiên Supabase.');
    }

    const fallbackProfile = buildLocalProfile(session.user.id, { fullName, phoneNumber, role });

    if (shouldSkipProfileSync) {
      return fallbackProfile;
    }

    try {
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
        console.warn('Không thể đồng bộ hồ sơ người dùng.', {
          status: response.status,
          error: result?.error,
        });
        return fallbackProfile;
      }
      return result?.profile ?? fallbackProfile;
    } catch (error) {
      console.warn('Gặp lỗi khi gọi hàm profile-sync, dùng dữ liệu dự phòng.', error);
      return fallbackProfile;
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
      transactions: Array.isArray(fallback.transactions) ? fallback.transactions : [],
    };

    let mergedUser = composedUser;

    setUsers((prev) => {
      const existing = prev.find((candidate) => candidate.id === composedUser.id);
      if (existing) {
        mergedUser = {
          ...existing,
          ...composedUser,
          balance:
            profile?.balance ??
            (fallback.balance !== undefined ? fallback.balance : existing.balance ?? 0),
          transactions:
            Array.isArray(composedUser.transactions) && composedUser.transactions.length > 0
              ? composedUser.transactions
              : Array.isArray(existing.transactions)
                ? existing.transactions
                : [],
        };
        return prev.map((candidate) =>
          candidate.id === mergedUser.id ? mergedUser : candidate
        );
      }
      mergedUser = {
        ...composedUser,
        balance:
          profile?.balance ??
          (fallback.balance !== undefined ? fallback.balance : 0),
        transactions: Array.isArray(composedUser.transactions)
          ? composedUser.transactions
          : [],
      };
      return [...prev, mergedUser];
    });

    setCurrentUserId(mergedUser.id);
    return mergedUser;
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

      const existingUser = users.find((candidate) => candidate.id === user.id);

      return mergeProfileIntoState(resolvedProfile, {
        id: user.id,
        role: resolvedProfile?.role ?? existingUser?.role ?? 'customer',
        name:
          resolvedProfile?.full_name ??
          existingUser?.name ??
          user.email,
        email,
        phone: resolvedProfile?.phone_number ?? existingUser?.phone ?? identifier,
        balance: existingUser?.balance ?? 0,
        transactions: existingUser?.transactions ?? [],
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

    if ((currentUser.balance ?? 0) < resolvedAmount) {
      throw new Error('Số dư không đủ. Vui lòng nạp thêm tiền trước khi đặt tour.');
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

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
    if (!session?.access_token) {
      // eslint-disable-next-line no-console
      console.warn('Không tìm thấy phiên Supabase khi đặt dịch vụ, lưu vào bộ nhớ cục bộ.');
    }
    if (session?.access_token) {
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
    const hasConversation = supportMessages.some((item) => item.userId === currentUser.id);
    const autoReply = AUTO_SUPPORT_REPLY[language] ?? AUTO_SUPPORT_REPLY.vi;

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

    if (!hasConversation && autoReply?.message) {
      chatMessage.adminResponse = autoReply.message;
      chatMessage.adminRespondedAt = timestamp;
    }

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

const AUTO_SUPPORT_REPLY = {
  vi: {
    message:
      'SEVEN TRAVEL xin chào! Cảm ơn bạn đã liên hệ. Đội ngũ tư vấn sẽ phản hồi trong thời gian sớm nhất. Bạn có thể chia sẻ thêm nhu cầu cụ thể để chúng tôi hỗ trợ nhanh hơn nhé.',
  },
  en: {
    message:
      'Hi there! Thanks for reaching out to SEVEN TRAVEL. Our team will be with you shortly. Feel free to share more details so we can assist faster.',
  },
};

const customers = useMemo(() => users.filter((user) => user.role === 'customer'), [users]);

  const value = useMemo(
    () => ({
      currentUser,
      supabaseUser,
      authLoading,
      login,
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
      tours: localizedTours,
      tourAnalytics,
      recordTourView,
      resetTourAnalytics,
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
      users,
      customers,
      localizedTours,
      tourAnalytics,
      recordTourView,
      resetTourAnalytics,
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
