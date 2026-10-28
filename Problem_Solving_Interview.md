# MC-Lab02 — Fitness Pocket — Phần 2: Problem Solving và Phần 3: Interview Questions

**Option:** 2 — Fitness Pocket. **Phạm vi:** ứng dụng Expo + React Native + TypeScript, một tài khoản demo cục bộ, không có backend. Các tình huống phân tích và đoạn mã minh họa được đối chiếu với cấu trúc dự án `MC-Lab02`; đường dẫn tệp được tính từ thư mục gốc dự án.

## PHẦN 2 — PROBLEM SOLVING

### 2.1. Login đúng nhưng Profile không có dữ liệu

**Nguyên nhân.** `authService` có thể xác nhận đúng tài khoản, nhưng màn hình Fitness Dashboard cần `user` trong shared state chứ không đọc giá trị boolean từ service. Tình huống “No active session” xuất hiện khi `AuthContext.login()` không gọi `setUser(profile)`, `AuthProvider` đặt sai chỗ hoặc màn hình dùng một Context/Provider khác. Phải phân biệt việc service trả dữ liệu thành công với việc dữ liệu được lưu để màn hình đích sử dụng.

**File cần kiểm tra.** `src/features/auth/services/authService.ts`, `src/features/auth/AuthContext.tsx`, `src/app/_layout.tsx`, `src/features/fitness/FitnessScreen.tsx` và `src/app/fitness.tsx`.

**Hướng xử lý.** Root Layout bọc `Stack` bên trong một `AuthProvider`. Trong Context, dùng `setUser(profile)` với kết quả service và trả kết quả cho LoginScreen:

```tsx
async function login(username: string, password: string) {
  const profile = await loginWithUsernamePassword(username, password);
  setUser(profile);
  return profile;
}
```

Màn hình đích lấy người dùng từ `useAuth()`, không tạo `useState` riêng cho profile. Route `/fitness` dùng `<Redirect href="/login" />` nếu `user === null`.

**Cách kiểm thử/debug.** Kiểm tra lần lượt giá trị service trả về, `setUser`, Provider bọc `Stack`, sau đó `user` quan sát ở Dashboard. Đăng nhập với `fitmember01/123456` phải hiển thị `Nguyen Minh Anh`, mã `FIT-2408` và ba buổi tập. Đăng nhập sai phải ở Login; Logout phải xóa user và quay về Login.

### 2.2. Lỗi “Property profile does not exist”

**Nguyên nhân.** TypeScript báo lỗi vì khai báo `DEMO_ACCOUNT` chỉ gồm `username` và `password` nhưng code lại truy cập `DEMO_ACCOUNT.profile`; thuộc tính này không tồn tại trong kiểu dữ liệu đã khai báo. Không thể khắc phục đúng bằng cách bỏ type-check hoặc ép kiểu `any`.

**File cần sửa.** `src/features/auth/types.ts`, `src/features/auth/data/demoAccount.ts` và `src/features/auth/services/authService.ts`.

**Giải pháp.** Định nghĩa kiểu tài khoản chứa `profile: FitnessMember` và khai báo dữ liệu phù hợp. Service trả `Promise<FitnessMember | null>`:

```ts
interface DemoAccount {
  username: string;
  password: string;
  profile: FitnessMember;
}

const DEMO_ACCOUNT: DemoAccount = {
  username: 'fitmember01',
  password: '123456',
  profile: sampleMember,
};

return isValid ? DEMO_ACCOUNT.profile : null;
```

`sampleMember` trong đoạn minh họa đại diện cho đối tượng `FitnessMember` có đầy đủ trường; project thật đặt hồ sơ trực tiếp trong `demoAccount.ts`.

**Cách kiểm thử.** Chạy `npx tsc --noEmit` để xác nhận không còn lỗi thuộc tính. Đăng nhập đúng phải trả hồ sơ, đăng nhập sai phải trả `null`, và Dashboard phải hiển thị dữ liệu từ hồ sơ.

### 2.3. Sai import sau khi di chuyển component

**Nguyên nhân.** Đường dẫn tương đối được tính từ **file đang import**, không phải thư mục gốc project. Khi chuyển `TrainingSessionItem.tsx` vào `src/features/fitness/components/`, đường dẫn import type cũ trở nên sai; file `FitnessScreen.tsx` cũng phải cập nhật nơi import component.

**File ảnh hưởng.** `src/features/fitness/components/TrainingSessionItem.tsx` và `src/features/fitness/FitnessScreen.tsx`.

**Giải pháp.** Trong item component, từ `features/fitness/components` đi lên hai cấp rồi vào `auth/types`:

```tsx
// Trong TrainingSessionItem.tsx
import type { TrainingSession } from '../../auth/types';

// Trong FitnessScreen.tsx
import { TrainingSessionItem } from './components/TrainingSessionItem';
```

Các import chung như `theme` cũng phải xác định lại tương tự (`../../../constants/theme` tính từ item component). Không tạo component trùng lặp để né lỗi import.

**Cách kiểm thử.** Kiểm tra cây thư mục trên VS Code, chạy `npx tsc --noEmit`, sau đó mở Dashboard và xác nhận đủ ba buổi tập; sửa import không được làm thay đổi nội dung hoặc hành vi nút Logout.

### 2.4. Logout nhưng vẫn quay được vào màn hình bảo vệ

**Nguyên nhân.** `router.push()` thêm màn hình vào lịch sử, còn `router.replace()` thay màn hình hiện tại, nên `replace()` phù hợp hơn ở các bước Login/Logout. Tuy nhiên chỉ dùng `replace()` chưa đủ bảo vệ ứng dụng: deep link hoặc điều hướng thủ công vẫn có thể truy cập đường dẫn `/fitness` nếu route không kiểm tra `user`.

**File ảnh hưởng.** `src/features/fitness/FitnessScreen.tsx`, `src/app/fitness.tsx`, `src/features/auth/AuthContext.tsx` và `src/app/index.tsx`.

**Giải pháp.** Khi Logout phải xóa state và thay route; route bảo vệ kiểm tra state:

```tsx
// Trong handler logout
logout();
router.replace('/login');

// Trong src/app/fitness.tsx
const { user } = useAuth();
if (!user) return <Redirect href="/login" />;
return <FitnessScreen />;
```

**Cách kiểm thử.** Đăng nhập đúng, Logout, rồi thử Back và truy cập trực tiếp `/fitness` qua URL/deep link trong môi trường thử nghiệm. Khi `user` là `null`, kết quả mong đợi là Login, không phải Dashboard chứa dữ liệu người dùng.

### 2.5. Login bị bấm liên tục hoặc Promise bị throw

**Nguyên nhân.** Service mô phỏng thời gian chờ 500 ms tạo khoảng trống để người dùng nhấn nút nhiều lần. Nếu không có `loading/disabled`, nhiều yêu cầu đăng nhập có thể chạy song song, gây cập nhật state hoặc điều hướng lặp. Dù service hiện tại là local, Promise vẫn có thể bị reject trong tình huống giả lập.

**File ảnh hưởng.** `src/features/auth/LoginScreen.tsx`, `src/components/AppButton.tsx` và `src/features/auth/services/authService.ts`.

**Giải pháp.** Thiết lập `loading` trước khi await, vô hiệu hóa nút khi chờ; `try/catch/finally` xử lý lỗi và hoàn nguyên trạng thái. Để khóa ngay cả khi có hai sự kiện nhấn xảy ra trước lần render tiếp theo, dùng thêm `useRef`:

```tsx
if (inFlight.current) return;
inFlight.current = true;
setLoading(true);
try {
  const profile = await login(username, password);
  if (profile) router.replace('/fitness');
  else setError('Invalid credentials. Please try again.');
} catch {
  setError('Unable to sign in. Please try again.');
} finally {
  inFlight.current = false;
  setLoading(false);
}
```

**Cách kiểm thử.** Nhấn Login liên tục trong 500 ms, quan sát nút disabled/loading và bảo đảm chỉ một lần gọi đăng nhập có hiệu lực. Thử service giả lập `throw new Error('Network failed')` trong một bài kiểm tra tạm thời, xác nhận hiển thị thông báo, nút hoạt động trở lại, rồi khôi phục service về code Lab chuẩn.

### 2.6. Refactor làm hỏng chức năng

**Nguyên nhân.** Controlled input cần nhận đúng `value` và callback `onChangeText`. Nếu thay input bằng `<FormInput onChangeText={() => {}} />` thì người dùng gõ nhưng state không đổi; tương tự, nút không chạy nếu `AppButton` không truyền `onPress` đến `Pressable`. Khi tách item, props phải mang đúng kiểu và component không được tự xử lý authentication.

**File ảnh hưởng.** `src/components/FormInput.tsx`, `src/components/AppButton.tsx`, `src/features/auth/LoginScreen.tsx`, `src/features/fitness/components/TrainingSessionItem.tsx` và `src/features/fitness/FitnessScreen.tsx`.

**Giải pháp.** Truyền callback thật từ screen xuống component:

```tsx
<FormInput label="Username" value={username} onChangeText={setUsername} />
<AppButton title="Log In" onPress={handleLogin} disabled={loading} />
<TrainingSessionItem key={session.id} session={session} />
```

Trong `FormInput`, `TextInput` nhận `onChangeText={onChangeText}`; trong `AppButton`, `Pressable` nhận `onPress={onPress}`. Component chỉ nhận props và render, không tự gọi service.

**Cách kiểm thử.** Nhập username/password và xác nhận giá trị cập nhật; thử sai/rỗng/đúng, loading, logout, route guard và render ít nhất ba buổi tập. Chạy lại `npx tsc --noEmit` và kiểm tra hồi quy các chức năng bị ảnh hưởng bởi refactor.

---

## PHẦN 3 — INTERVIEW QUESTIONS

**Yêu cầu:** Trả lời ngắn (3–6 câu cho mỗi câu), liên hệ đúng project Fitness Pocket.

### Q1. React Native khác React Web trong các thành phần giao diện View, Text và Pressable như thế nào?
React Web chủ yếu dùng phần tử DOM như `div`, `p`, `button`, còn React Native sử dụng component tương ứng cho giao diện native. `View` dùng để bố trí, `Text` dùng hiển thị chữ và `Pressable` xử lý tương tác chạm. Các component React Native không tạo HTML thông thường trên Android. Fitness Pocket dùng `View` và `Text` để hiển thị thẻ hội viên, `Pressable` bên trong `AppButton` để tạo nút Login/Logout.

### Q2. JSX là gì? Tại sao React component trả về JSX?
JSX là cú pháp cho phép mô tả cây giao diện ngay trong mã JavaScript hoặc TypeScript. React xử lý JSX thành các phần tử tương ứng để render giao diện. Component trả về JSX để mô tả màn hình ứng với props và state hiện tại. Trong Fitness Pocket, `LoginScreen` trả JSX gồm `FormInput`, thông báo lỗi và `AppButton`.

### Q3. Controlled TextInput là gì? Giải thích value, onChangeText và useState.
Controlled `TextInput` là ô nhập liệu có giá trị do React state quản lý. Thuộc tính `value` nhận dữ liệu từ state, còn `onChangeText` cập nhật dữ liệu khi người dùng gõ. `useState` tạo state và hàm cập nhật cho username/password. Fitness Pocket truyền các giá trị này từ `LoginScreen` xuống `FormInput`.

### Q4. Event → setState → re-render diễn ra như thế nào khi nhập username?
Khi người dùng gõ một ký tự, `TextInput` gọi callback `onChangeText`. Callback trong `LoginScreen` chạy `setUsername(text)` để cập nhật state. React lập lịch render lại component với `username` mới. Thuộc tính `value` của `FormInput` nhận state vừa cập nhật nên nội dung ô nhập đồng bộ với dữ liệu.

### Q5. secureTextEntry có tác dụng gì? Tại sao không có nghĩa password đã được bảo mật ở server?
`secureTextEntry` làm ký tự mật khẩu bị che khi hiển thị trong `TextInput`. Tính năng này chỉ ảnh hưởng giao diện nhập liệu, không tự mã hóa kết nối hoặc bảo vệ dữ liệu trên máy chủ. Fitness Pocket không có server, và mật khẩu demo được lưu cục bộ để học tập. Ứng dụng thật cần cơ chế xác thực và lưu trữ bí mật phù hợp, không coi việc che ký tự là đủ.

### Q6. Phân biệt local state (username, password, error) và shared state (user).
Local state chỉ phục vụ trực tiếp một component, ví dụ `username`, `password`, `error` và `loading` trong `LoginScreen`. Shared state cần được truy cập từ nhiều màn hình, ví dụ `user` sau khi đăng nhập. Fitness Pocket giữ `user` trong `AuthContext`, để Login và Dashboard cùng sử dụng trạng thái xác thực. Điều này tránh việc mỗi màn hình tự giữ một bản user riêng và dễ lệch nhau.

### Q7. Promise và async/await hỗ trợ flow kiểm tra login như thế nào?
`Promise` biểu diễn kết quả của thao tác bất đồng bộ, có thể hoàn tất hoặc phát sinh lỗi. `async/await` giúp code xử lý đăng nhập theo thứ tự dễ đọc thay vì lồng nhiều callback. Trong `authService.ts`, Fitness Pocket giả lập thời gian chờ khoảng 500 ms rồi trả hồ sơ hoặc `null`. `LoginScreen` dùng `try/catch/finally` để hiển thị loading, thông báo kết quả và xử lý lỗi.

### Q8. Vì sao service trả UserProfile | null thay vì boolean ở giai đoạn nâng cấp?
Giá trị boolean chỉ cho biết tài khoản đúng hay sai, không cung cấp thông tin để hiển thị màn hình đích. Trả hồ sơ người dùng hoặc `null` giúp Context vừa xác định đăng nhập thành công vừa lưu dữ liệu cần dùng. Fitness Pocket sử dụng kiểu `FitnessMember | null`, tương ứng với hồ sơ hội viên hoặc xác thực thất bại. Dashboard đọc trực tiếp các trường `fullName`, `memberCode`, `planName` và `sessions` từ user.

### Q9. Separation of Concerns: vì sao không kiểm tra credential trực tiếp trong screen?
Separation of Concerns là nguyên tắc tách các trách nhiệm khác nhau thành những phần dễ hiểu và bảo trì. Screen nên quản lý giao diện, input, thông báo và tương tác, còn service xử lý quy tắc xác thực. Fitness Pocket đặt kiểm tra username/password trong `authService.ts` và giữ `LoginScreen` tập trung vào giao diện. Khi thay logic xác thực, không cần viết lại toàn bộ màn hình.

### Q10. Expo Router file-based routing hoạt động thế nào với app/login.tsx và app/<target>.tsx?
Expo Router tạo đường dẫn dựa trên vị trí file trong thư mục `app` hoặc `src/app`. File `src/app/login.tsx` tạo route `/login`, còn `src/app/fitness.tsx` tạo route `/fitness` trong Fitness Pocket. File `_layout.tsx` cấu hình Stack và Provider dùng chung. Route không chỉ hiển thị screen mà còn có thể kiểm tra quyền truy cập trước khi render nội dung.

### Q11. router.replace khác router.push khi login/logout như thế nào?
`router.push()` thêm một màn hình vào lịch sử điều hướng, còn `router.replace()` thay thế màn hình hiện tại. Với Login/Logout, `replace()` giúp tránh giữ lại một màn hình không còn phù hợp trong lịch sử quay lại. Fitness Pocket dùng `router.replace('/fitness')` sau đăng nhập và `router.replace('/login')` khi đăng xuất. Dù vậy, vẫn phải có route guard vì `replace()` không tự ngăn deep link vào route bảo vệ.

### Q12. Context, Provider và useAuth() giải quyết vấn đề gì?
Context cho phép chia sẻ dữ liệu giữa nhiều component mà không phải truyền props qua từng tầng trung gian. Provider cung cấp một giá trị Context cho toàn bộ cây component nằm trong nó. Custom hook `useAuth()` giúp đọc `user`, `login()` và `logout()` thuận tiện, đồng thời báo lỗi nếu gọi ngoài Provider. Fitness Pocket dùng các thành phần này để Login và Dashboard thống nhất trạng thái đăng nhập.

### Q13. Tại sao RootLayout phải bọc Stack bằng AuthProvider?
Nếu Provider nằm ngoài Stack, các route được tạo trong Stack có thể cùng truy cập một AuthContext. Nếu chỉ bọc Provider trong LoginScreen, Dashboard có thể không nhận được state đã cập nhật hoặc dùng state riêng. Fitness Pocket đặt `<AuthProvider>` bao quanh `<Stack>` trong `src/app/_layout.tsx`. Nhờ đó Login, Dashboard và route guard sử dụng cùng một nguồn `user`.

### Q14. Props là gì? Required/optional/default props dùng trong FormInput, AppButton và item thế nào?
Props là dữ liệu hoặc callback truyền từ component cha xuống component con. Required props phải được cung cấp, như `label`, `value`, `onChangeText` của `FormInput` và `session` của `TrainingSessionItem`. Optional props có thể bỏ qua, ví dụ `secureTextEntry` hoặc `loading`. Fitness Pocket đặt giá trị mặc định `secureTextEntry = false`, `loading = false`, `variant = 'primary'` để các component dùng thuận tiện và có kiểu rõ ràng.

### Q15. Tại sao item component không nên tự gọi authService hoặc router?
Item component có nhiệm vụ hiển thị thông tin của một đối tượng được truyền qua props. Nếu nó tự gọi service hoặc điều hướng, phần giao diện sẽ phụ thuộc vào nghiệp vụ đăng nhập và khó dùng lại. `TrainingSessionItem` trong Fitness Pocket chỉ nhận `session` và hiển thị tên, lịch và thời lượng buổi tập. `FitnessScreen` và các route chịu trách nhiệm đọc Context và điều hướng.

### Q16. Khi render danh sách bằng map(), vì sao cần key ổn định?
React sử dụng `key` để nhận biết từng phần tử trong danh sách giữa các lần render. `key` ổn định giúp React cập nhật đúng phần tử khi dữ liệu thay đổi và tránh nhầm state giữa các item. Nên dùng định danh có sẵn thay vì chỉ số mảng nếu dữ liệu có thể thay đổi thứ tự. Fitness Pocket dùng `key={session.id}` khi render các buổi tập bằng `map()`.

### Q17. Route guard là gì? Nếu user=null khi vào detail screen thì nên làm gì?
Route guard kiểm tra điều kiện truy cập một route trước khi cho hiển thị nội dung bảo vệ. Trong Fitness Pocket, điều kiện là `user !== null` từ `AuthContext`. Khi `user === null`, file `src/app/fitness.tsx` trả `<Redirect href="/login" />` thay vì render Dashboard. Điều này được kiểm tra khi Logout và khi mở thẳng route `/fitness`.

### Q18. Tại sao dữ liệu password hard-code chỉ phù hợp demo, không phù hợp production?
Mật khẩu hard-code trong mã nguồn có thể bị đọc từ repository hoặc bản ứng dụng được phát hành. Nó cũng không cung cấp cơ chế quản lý tài khoản, đổi mật khẩu và bảo vệ dữ liệu thực tế. Fitness Pocket dùng `fitmember01/123456` chỉ để mô phỏng một tình huống đăng nhập cục bộ theo phạm vi bài học. Với sản phẩm thật cần giải pháp xác thực và quản lý mật khẩu an toàn ở phía hệ thống phù hợp.

### Code Interview A — Gọi sai tên hàm service

**Lỗi.** Code gọi `checkLogin`, nhưng `authService.ts` của Fitness Pocket chỉ export `loginWithUsernamePassword`. TypeScript báo thiếu export hoặc `Cannot find name` tùy cách import. **Sửa:** import và gọi đúng hàm, xử lý giá trị `FitnessMember | null`:

```ts
import { loginWithUsernamePassword } from './services/authService';

const profile = await loginWithUsernamePassword(username, password);
if (profile !== null) {
  setUser(profile);
} else {
  setUser(null);
}
```

Đoạn minh họa trên đặt trong `AuthContext.tsx` (cùng thư mục với `services/`); project thật đã dùng cách gọi tương ứng. `boolean` không đủ vì Dashboard phải hiển thị thông tin hội viên.

### Code Interview B — Controlled input không cập nhật

**Lỗi.** `onChangeText={() => {}}` là callback rỗng nên không gọi `setUsername`, trong khi `value` vẫn lấy từ state cũ. **Sửa:**

```tsx
const [username, setUsername] = useState('');
<FormInput label="Username" value={username} onChangeText={setUsername} />
```

Khi gõ, callback cập nhật state, React render lại và `value` đổi theo. Có thể dùng callback dài hơn để đồng thời xóa lỗi cũ như trong `LoginScreen` thật.

### Code Interview C — “No active session” không bảo vệ route

**Khác biệt.** `if (!user) return <Text>No active session</Text>` chỉ hiển thị thông báo ở route hiện tại; địa chỉ vẫn là màn hình bảo vệ và trải nghiệm điều hướng chưa đúng. **Giải pháp tại route layer:**

```tsx
import { Redirect } from 'expo-router';
import { useAuth } from '../features/auth/AuthContext';
import { FitnessScreen } from '../features/fitness/FitnessScreen';

export default function FitnessRoute() {
  const { user } = useAuth();
  if (!user) return <Redirect href="/login" />;
  return <FitnessScreen />;
}
```

Đây là logic đã có trong `src/app/fitness.tsx`. Kiểm tra bằng cách Logout rồi thử quay lại hoặc mở trực tiếp `/fitness`: phải về Login.

---

## Ghi chú về phạm vi phân tích

Phần 2 trình bày lời giải cho sáu tình huống kỹ thuật giả định trong đề bài; Phần 3 trình bày 18 câu hỏi kiến thức và ba bài Code Interview. Các đoạn mã dùng để minh họa cách phân tích và xử lý tình huống, không đồng nghĩa với việc lỗi đó đã xuất hiện trong ứng dụng đang chạy. Việc đánh giá kết quả thực tế cần dựa trên kiểm thử và minh chứng riêng.
