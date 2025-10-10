INSERT INTO users (id, role, name, email, phone, password_hash, balance)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'admin',
    'Admin Travel Tour',
    'admin@traveltour.com',
    '0909000000',
    '$2b$10$E8/m2/tGMcRM6TsmB0iiduvhtiSYQ79z7hoQGXZzoSWkI8ciI1XR6', -- bcrypt hash for "admin123"
    0
)
ON CONFLICT (email) DO NOTHING;

INSERT INTO products (id, category, name, price, description, duration)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'tour',
    'Kỳ Quan Biển Xanh Phú Quốc',
    8590000,
    'Lặn ngắm san hô, khám phá làng chài và thưởng thức hải sản tươi.',
    '4 Ngày 3 Đêm'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'transport',
    'Limousine Đà Nẵng - Huế',
    1800000,
    'Đưa đón riêng hai chiều với tài xế chuyên nghiệp.',
    NULL
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'stay',
    'Private Pool Villa Phú Quốc',
    6850000,
    'Biệt thự sát biển với hồ bơi riêng và quản gia 24/7.',
    NULL
  )
ON CONFLICT (id) DO NOTHING;
