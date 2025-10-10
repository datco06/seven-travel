# Seven Travel

## Local Development Setup

1. Cài đặt dependencies:
   ```bash
   npm install
   ```
2. Tạo file `.env` dựa trên `.env.example` và điền các biến Supabase:
   ```env
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   VITE_API_BASE_URL=http://localhost:4000
   ```
3. Chạy dự án:
   ```bash
   npm run dev
   ```

## Deploy

- Mỗi khi push lên `main`, Netlify sẽ tự động build.
- Đảm bảo đã cấu hình các biến môi trường sau trên Netlify:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_KEY`
