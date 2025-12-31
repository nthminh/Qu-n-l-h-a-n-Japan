# Hướng dẫn Deploy lên Firebase (Chi tiết)

## Bước 1: Tạo Firebase Project

1. Truy cập https://console.firebase.google.com/
2. Click "Add project" (Thêm dự án)
3. Nhập tên project: `ql-e-japan` (hoặc tên bạn muốn)
4. (Optional) Bật Google Analytics nếu muốn theo dõi
5. Click "Create project"

## Bước 2: Thêm Web App

1. Trong Firebase Console, click vào icon web (</>) để thêm web app
2. Nhập nickname cho app: `QL-E-Japan Web`
3. Check vào "Also set up Firebase Hosting for this app"
4. Click "Register app"
5. **LƯU LẠI** cấu hình Firebase được hiển thị (sẽ dùng ở bước 4)

## Bước 3: Cấu hình Firebase Services

### 3.1. Bật Authentication

1. Trong Firebase Console, vào **Authentication** (ở menu bên trái)
2. Click tab **Sign-in method**
3. Click **Email/Password**
4. Bật **Enable** (switch on)
5. Click **Save**

### 3.2. Tạo Firestore Database

1. Vào **Firestore Database** (ở menu bên trái)
2. Click **Create database**
3. Chọn **Start in production mode**
4. Click **Next**
5. Chọn Cloud Firestore location (khuyến nghị: **asia-northeast1** cho Nhật Bản)
6. Click **Enable**

### 3.3. Deploy Firestore Rules và Indexes

Mở terminal trong project:

```bash
# Login vào Firebase (nếu chưa login)
firebase login

# Khởi tạo Firestore (chọn project vừa tạo)
firebase init firestore
# - Chọn "Use an existing project"
# - Chọn project của bạn
# - Firestore rules file: Enter (giữ mặc định firestore.rules)
# - Firestore indexes file: Enter (giữ mặc định firestore.indexes.json)

# Deploy rules
firebase deploy --only firestore:rules
```

## Bước 4: Cấu hình Firebase trong Code

### Cách 1: Dùng Environment Variables (Khuyến nghị)

1. Copy file `.env.example` thành `.env`:
   ```bash
   cp .env.example .env
   ```

2. Mở file `.env` và điền config từ bước 2:
   ```env
   REACT_APP_FIREBASE_API_KEY=AIzaSy...
   REACT_APP_FIREBASE_AUTH_DOMAIN=ql-e-japan.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=ql-e-japan
   REACT_APP_FIREBASE_STORAGE_BUCKET=ql-e-japan.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
   REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc...
   ```

### Cách 2: Sửa trực tiếp file config

Mở file `src/config/firebase.config.js` và thay thế các giá trị:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "ql-e-japan.firebaseapp.com",
  projectId: "ql-e-japan",
  storageBucket: "ql-e-japan.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
};
```

## Bước 5: Test Local

```bash
# Cài đặt dependencies (nếu chưa)
npm install

# Chạy local
npm start
```

Ứng dụng sẽ mở tại http://localhost:3000

Test các tính năng:
- Đăng ký tài khoản mới
- Đăng nhập
- Thêm/sửa/xóa kỹ sư
- Thêm/sửa/xóa hóa đơn

## Bước 6: Build Production

```bash
npm run build
```

Lệnh này sẽ tạo folder `build/` với các file đã được optimize.

## Bước 7: Deploy lên Firebase Hosting

### 7.1. Khởi tạo Firebase Hosting

```bash
# Nếu chưa login
firebase login

# Khởi tạo hosting
firebase init hosting
```

Trả lời các câu hỏi:
- **Use an existing project**: Chọn project của bạn
- **Public directory**: Nhập `build`
- **Configure as single-page app**: Nhập `Yes`
- **Set up automatic builds**: Nhập `No` (hoặc Yes nếu muốn)
- **Overwrite build/index.html**: Nhập `No`

### 7.2. Deploy

```bash
firebase deploy --only hosting
```

Sau khi deploy thành công, bạn sẽ thấy:

```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/ql-e-japan/overview
Hosting URL: https://ql-e-japan.web.app
```

## Bước 8: Kiểm tra App trên Production

1. Mở URL hosting (vd: https://ql-e-japan.web.app)
2. Tạo tài khoản và test các tính năng
3. Mở trên nhiều thiết bị/browser để test multi-user

## Bước 9: Thêm User cho Team

### Cách 1: Cho team tự đăng ký

Chia sẻ URL app cho team, họ có thể tự tạo tài khoản bằng email.

### Cách 2: Tạo tài khoản sẵn cho team

1. Vào Firebase Console > Authentication > Users
2. Click **Add user**
3. Nhập email và password
4. Click **Add user**
5. Chia sẻ thông tin đăng nhập cho team member

## Bước 10: Theo dõi và Quản lý

### Xem dữ liệu Firestore

1. Firebase Console > Firestore Database
2. Xem các collection: `engineers`, `invoices`
3. Có thể edit/delete trực tiếp từ đây

### Xem Users

1. Firebase Console > Authentication > Users
2. Xem danh sách users đã đăng ký
3. Có thể disable/delete users

### Xem Analytics (nếu đã bật)

1. Firebase Console > Analytics
2. Xem số lượng users, events, etc.

## Cập nhật App sau này

Khi có thay đổi code:

```bash
# 1. Pull code mới
git pull

# 2. Cài đặt dependencies mới (nếu có)
npm install

# 3. Test local
npm start

# 4. Build
npm run build

# 5. Deploy
firebase deploy --only hosting
```

## Troubleshooting

### Lỗi: "Firebase: Error (auth/invalid-api-key)"
- Kiểm tra lại API key trong config
- Đảm bảo đã copy đúng từ Firebase Console

### Lỗi: "Missing or insufficient permissions"
- Kiểm tra Firestore rules đã deploy chưa
- Chạy lại: `firebase deploy --only firestore:rules`

### Lỗi: "Target hosting is not defined"
- Chạy lại: `firebase init hosting`

### App không cập nhật sau khi deploy
- Clear browser cache (Ctrl+Shift+R hoặc Cmd+Shift+R)
- Đợi 1-2 phút để Firebase propagate changes

## Tính chi phí

Firebase Free Plan (Spark) bao gồm:
- **Authentication**: 10,000 verifications/month
- **Firestore**: 
  - 50,000 document reads/day
  - 20,000 document writes/day
  - 20,000 document deletes/day
  - 1 GB storage
- **Hosting**: 10 GB storage, 360 MB/day transfer

Đủ cho team nhỏ (< 10 người) sử dụng thường xuyên.

## Bảo mật bổ sung (Optional)

### Hạn chế domain

1. Firebase Console > Authentication > Settings
2. Scroll xuống "Authorized domains"
3. Chỉ giữ lại domain hosting của bạn

### Cải thiện Firestore Rules

Edit file `firestore.rules` để thêm validation:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isValidEngineer() {
      return request.resource.data.name is string &&
             request.resource.data.company is string;
    }

    match /engineers/{engineerId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn() && isValidEngineer();
      allow update: if isSignedIn() && isValidEngineer();
      allow delete: if isSignedIn();
    }

    match /invoices/{invoiceId} {
      allow read, write: if isSignedIn();
    }
  }
}
```

Sau đó deploy lại:
```bash
firebase deploy --only firestore:rules
```

## Tổng kết

Bây giờ bạn đã có một ứng dụng web hoàn chỉnh trên cloud Firebase, cho phép:
- ✅ Nhiều người dùng cùng truy cập
- ✅ Dữ liệu được đồng bộ real-time
- ✅ Bảo mật với authentication
- ✅ Scale tự động theo nhu cầu
- ✅ Có URL public để chia sẻ với team

Chúc bạn sử dụng hiệu quả! 🎉
