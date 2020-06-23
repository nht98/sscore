Dùng lệnh trong terminal để thiết lập tài khoản test!! declare -x Username="DTC145D4801030038" declare -x Password="MatKhauTaiKhoan"

sau khi đã chạy xong, dùng lệnh npm test để chạy test!

Cài đặt vào dự án
npm i sscore

Sử dụng trong dự án
Lệnh import thư viện const sv = require('sscore');

Tiếp đó sử dụng phương thức sv.Open(<Mã Trường>) để mở trình phân tích dữ liệu tương ứng với trường đó. var ictu = sv.Open("ICTU");

Danh sách mã trường và trình phân tích được định nghĩa tại sv.Schools

Sau khi mở và thu được trình phân tích dữ liệu.

Sử dụng phương thức Login với 2 tham số là tên đăng nhập và mật khẩu. var login_ed = await ictu.Login("MaSinhVien", "MatKhau");

Lúc này login_ed sẽ có giá trị là true nếu thành công hoặc false nếu sai thông tin tài khoản.

Tiếp đó, sử dụng các phương thức khác của trình phân tích dữ liệu để lấy dữ liệu về sinh viên. Tham khảo thêm tại mẫu ví dụ: test.js