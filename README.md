# 📚 Read Stories

Ứng dụng đọc truyện online được xây dựng với React, Vite và Firebase.

## ✨ Tính năng

- 🏠 **Trang chủ** - Hiển thị danh sách truyện mới nhất
- 📖 **Đọc truyện** - Giao diện đọc chapter tối ưu
- 🔍 **Tìm kiếm** - Tìm kiếm truyện theo tên
- 📂 **Thể loại** - Phân loại truyện theo thể loại
- ❤️ **Yêu thích** - Lưu truyện yêu thích
- 📜 **Lịch sử** - Xem lại các truyện đã đọc
- ✅ **Truyện hoàn thành** - Danh sách truyện đã hoàn thành
- 🆕 **Truyện mới** - Danh sách truyện mới cập nhật
- 👤 **Hồ sơ** - Quản lý tài khoản người dùng
- 🔐 **Xác thực** - Đăng nhập/Đăng ký với Firebase Auth

## 🛠️ Công nghệ

| Công nghệ | Phiên bản |
|-----------|-----------|
| React | 19.1.1 |
| Vite | 7.1.2 |
| TypeScript | 5.8.3 |
| Firebase | 12.2.1 |
| Tailwind CSS | 4.1.13 |
| React Router DOM | 7.8.2 |

## 📋 Yêu cầu

- Node.js >= 18
- npm hoặc yarn

## 🚀 Cài đặt

### 1. Clone repository

```bash
git clone https://github.com/hungsinh2k4/Read_Stories.git
cd Read_Stories
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình biến môi trường

Tạo file `.env` trong thư mục gốc:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 4. Chạy ứng dụng

```bash
# Development
npm run dev

# Build production
npm run build

# Preview production build
npm run preview
```

## 📁 Cấu trúc thư mục

```
src/
├── api/          # API services
├── assets/       # Static assets (images, fonts)
├── components/   # React components
├── contexts/     # React contexts (Auth, etc.)
├── hooks/        # Custom React hooks
├── pages/        # Page components
├── routers/      # Route definitions
├── services/     # Firebase & other services
├── styles/       # Global styles
├── types/        # TypeScript type definitions
└── utils/        # Utility functions
```

## 📄 Scripts

| Script | Mô tả |
|--------|-------|
| `npm run dev` | Chạy development server |
| `npm run build` | Build production |
| `npm run preview` | Preview production build |
| `npm run lint` | Kiểm tra lỗi ESLint |

## 🔗 Routes

| Route | Mô tả |
|-------|-------|
| `/` | Trang chủ |
| `/login` | Đăng nhập |
| `/register` | Đăng ký |
| `/new` | Truyện mới |
| `/completed` | Truyện hoàn thành |
| `/genres` | Danh sách thể loại |
| `/genre/:slug` | Truyện theo thể loại |
| `/story/:slug` | Chi tiết truyện |
| `/story/:storySlug/chapter/:chapterFilename` | Đọc chapter |
| `/search` | Tìm kiếm |
| `/favorites` | Truyện yêu thích |
| `/history` | Lịch sử đọc |
| `/profile` | Hồ sơ cá nhân |

## 📝 License

MIT License

## 👨‍💻 Tác giả

- **hungsinh2k4** - [GitHub](https://github.com/hungsinh2k4)
