# Fitness Pocket — MC-Lab02

**Môn học:** Tính toán di động (Mobile Computing)
**Bài thực hành:** MC-Lab02 — Option 2: Fitness Pocket
**Công nghệ:** React Native, Expo SDK 57, Expo Router và TypeScript

## 1. Giới thiệu

Fitness Pocket là ứng dụng mẫu dành cho hội viên phòng gym. Hội viên đăng nhập để xem thông tin cá nhân, gói tập và danh sách các buổi tập. Ứng dụng có hai màn hình chính: **Member Login** và **Fitness Dashboard**, hỗ trợ đăng xuất và chuyển hướng người dùng chưa đăng nhập về màn hình Login.

Ứng dụng sử dụng dữ liệu cục bộ để mô phỏng xác thực, không kết nối máy chủ và không lưu phiên đăng nhập sau khi khởi động lại.

## 2. Chức năng

- Nhập tên đăng nhập và mật khẩu bằng các ô nhập có quản lý trạng thái.
- Kiểm tra dữ liệu rỗng, thông báo khi thông tin đăng nhập không đúng, hiển thị trạng thái chờ và vô hiệu hóa nút trong lúc xác thực.
- Đăng nhập thành công để xem họ tên, mã hội viên, gói tập và ba buổi tập.
- Đăng xuất, xóa trạng thái hội viên và điều hướng về màn hình Login.
- Bảo vệ route `/fitness`: khi chưa đăng nhập, ứng dụng chuyển về `/login`.

## 3. Yêu cầu môi trường

- Node.js và npm.
- Máy tính Windows, macOS hoặc Linux để chạy Expo CLI.
- Điện thoại Android có Expo Go tương thích với SDK 57 hoặc môi trường chạy ứng dụng phù hợp.
- Kết nối mạng giữa máy tính chạy Expo và thiết bị thử nghiệm.

## 4. Cài đặt và chạy

Giải nén hoặc lấy mã nguồn vào một thư mục dự án, sau đó mở thư mục **chứa `package.json`** bằng VS Code hoặc Terminal. Chạy lần lượt:

```powershell
npm install
npx tsc --noEmit
npx expo start
```

Khi Terminal hiển thị mã QR, mở **Expo Go → Scan QR** trên điện thoại Android và quét mã để mở ứng dụng.

Trên điện thoại Android, dùng **Expo Go dành cho SDK 57** để mở project. Nếu máy đang cài Expo Go cho SDK khác, ứng dụng sẽ báo không tương thích; cần chọn bản Expo Go phù hợp với SDK của project.

Nếu mạng nội bộ không cho phép điện thoại truy cập Metro, cần kiểm tra địa chỉ IP của máy tính, cổng Expo và Windows Firewall. Khi máy tính đồng thời dùng Ethernet và Wi-Fi, Expo có thể công bố IP không thuộc kết nối với điện thoại. Khi đó có thể chỉ định thủ công IP của giao diện Wi-Fi trong PowerShell:

```powershell
# Ví dụ: thay <IP-Wi-Fi-cua-may-tinh> bằng IPv4 hiện tại của card Wi-Fi.
$env:EXPO_PACKAGER_PROXY_URL = "http://<IP-Wi-Fi-cua-may-tinh>:8081"
npx expo start --go
```

Trong lần thử nghiệm với Galaxy A07, máy tính sử dụng Ethernet để truy cập Internet, đồng thời kết nối Wi-Fi đến điểm truy cập do điện thoại phát. Sau khi đặt địa chỉ Metro theo IPv4 của giao diện Wi-Fi, ứng dụng đã tải thành công và chạy được luồng Login → Dashboard → Logout. Địa chỉ IP do mạng cấp có thể thay đổi ở lần chạy sau; không sử dụng cố định một IP cũ.

Chế độ Tunnel (`npx expo start --tunnel`) là phương án hỗ trợ khi không thể kết nối trực tiếp, có thể cần `@expo/ngrok`; phương án này chưa được xác nhận hoạt động trong môi trường thử nghiệm nêu trên. Không cần thay đổi dependencies hoặc tắt toàn bộ Firewall chỉ để khắc phục lỗi mạng.

Project đã có `package.json` và cấu trúc `src/`, vì vậy không cần chạy `create-expo-app` bên trong thư mục này. Giữ các phiên bản thư viện tương thích với cấu hình Expo hiện tại khi cài đặt.

## 5. Tài khoản dùng thử

| Thông tin | Giá trị |
|---|---|
| Username | `fitmember01` |
| Password | `123456` |

Tài khoản này chỉ chứa dữ liệu giả phục vụ bài thực hành. Mật khẩu được khai báo trong mã nguồn để mô phỏng đăng nhập cục bộ và **không phải giải pháp bảo mật cho sản phẩm thực tế**.

## 6. Cấu trúc mã nguồn

| Đường dẫn | Vai trò |
|---|---|
| `src/app/` | Các route, Root Layout, chuyển hướng và bảo vệ màn hình |
| `src/features/auth/types.ts` | Kiểu dữ liệu hội viên, buổi tập và tài khoản mẫu |
| `src/features/auth/data/demoAccount.ts` | Thông tin tài khoản, hồ sơ và lịch tập mẫu |
| `src/features/auth/services/authService.ts` | Hàm xác thực bất đồng bộ; trả hội viên hoặc `null` |
| `src/features/auth/AuthContext.tsx` | Trạng thái đăng nhập dùng chung, `login()`, `logout()` và `useAuth()` |
| `src/features/auth/LoginScreen.tsx` | Giao diện và xử lý tương tác đăng nhập |
| `src/features/fitness/FitnessScreen.tsx` | Hồ sơ hội viên, gói tập, danh sách buổi tập và đăng xuất |
| `src/features/fitness/components/TrainingSessionItem.tsx` | Thành phần hiển thị từng buổi tập |
| `src/components/` | `FormInput` và `AppButton` có thể tái sử dụng |
| `src/constants/theme.ts` | Các màu giao diện dùng chung |

Luồng điều hướng: `/` → `/login` → `/fitness` → **Logout** → `/login`.

## 7. Kiểm tra chức năng

Sau khi cài đặt, kiểm tra `npx tsc --noEmit` và thử các trường hợp: bỏ trống thông tin, nhập sai mật khẩu, đăng nhập đúng, hiển thị danh sách ba buổi tập, đăng xuất, truy cập màn hình bảo vệ khi chưa đăng nhập, nhấn Login lặp lúc đang chờ và khởi động lại ứng dụng.

Kết quả chạy và kiểm thử trên thiết bị thực tế cần được ghi nhận từ môi trường sử dụng; tài liệu này không thay thế ảnh minh chứng hoặc biên bản kiểm thử.

## 8. Nội dung bài tập liên quan

Tệp `Problem_Solving_Interview.md` chứa phần phân tích sáu tình huống Problem Solving, 18 câu hỏi phỏng vấn và ba bài Code Interview, có đối chiếu với cấu trúc mã nguồn Fitness Pocket.

**Giới hạn:** Đây là ứng dụng mô phỏng cục bộ cho học tập, không bao gồm backend, cơ sở dữ liệu, xác thực production, lưu phiên đăng nhập lâu dài hoặc các tính năng quản lý phòng gym nâng cao.
