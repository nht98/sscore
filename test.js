const tnu = require('./TnuCore');
console.log(tnu.TnuSchools);

var ictu = tnu.Open("ICTU");

ictu.Login(process.argv[2], process.argv[3]).then(function (session) {
    if (session) {
        // Get News - Lấy thông báo
        ictu.GetNews().then(function (news) {
            console.log("\n\nDữ liệu về thông báo tại trang chủ:");
            console.log(news);
            ictu.GetNewsDetail(news[0].Id).then(function (data) {
                console.log("\n\nDữ liệu về thông báo đầu tiên:");
                console.log(JSON.stringify(data, null, "\t"));
            }, console.log);
        }, function (err) {
            console.log(err);
        });

        // Get Profile - Lấy thông tin cá nhân
        ictu.GetProfile().then(function (data) {
            console.log("\n\nThông tin tài khoản:");
            console.log(JSON.stringify(data, null, "\t"));
        }, console.log);

        // Get TimeTable - Lấy lịch học
        ictu.GetSemestersOfStudy().then(function (resp) {
            console.log("\n\nDanh sách kỳ học:");
            console.log(resp);
            var code = resp[2];
            console.log("Get: ", code);
            ictu.GetTimeTableOfStudy(code.MaKy).then(function (data) {
                console.log("\n\nLịch học:");
                console.log(JSON.stringify(data, null, "\t"));
            }, console.log);
        }, console.log);

        // Get ExamTable - Lấy lịch thi
        ictu.GetSemestersOfExam().then(function (resp) {
            console.log("\n\nDanh sách kỳ thi:");
            console.log(resp);
            var code = resp[2];
            console.log("Get: ", code);
            ictu.GetTimeTableOfExam(code.MaKy).then(function (data) {
                console.log("\n\nLịch thi:");
                console.log(JSON.stringify(data, null, "\t"));
            }, console.log);
        }, console.log);

        // Get MarkTable - Lấy bảng điểm
        ictu.GetMarkTable().then(function (data) {
            console.log("\n\nĐiểm thi:");
            console.log(JSON.stringify(data, null, "\t"));
        }, console.log);
    }
}, function (err) {
    console.log(err);
});
