const os = require('os');
const fs = require('fs');
const md5 = require('md5');
const path = require('path');
const moment = require('moment');
const xlsParse = require("xls-parse");

const TnuBase = require('./TnuBase');
const TnuFile = require('../DataStruct/TnuFile');
const TnuNews = require('../DataStruct/TnuNews');
const TnuNewsDetail = require('../DataStruct/TnuNewsDetail');
const TnuProfile = require('../DataStruct/TnuProfile');
const TnuSemester = require('../DataStruct/TnuSemester');
const TnuSubject = require('../DataStruct/TnuSubject');
const TnuTimeTableEntry = require('../DataStruct/TnuTimeTableEntry');
const TnuTimeTable = require('../DataStruct/TnuTimeTable');
const TnuMarkTable = require('../DataStruct/TnuMarkTable');

const Endpoints = {
    Raw: function (path) {
        return "http://dangkytinchi.ictu.edu.vn/" + path;
    },
    Make: function (endpoint) {
        return Endpoints.Raw("kcntt/" + endpoint);
    }
};
Endpoints.Login = function () {
    // test env
    return "http://localhost:8080/DangNhap.html";
};
Endpoints.Login = function (token) {
    token = token || "";
    return Endpoints.Make(token + "Login.aspx");
};
Endpoints.Home = function (token) {
    token = token || "";
    return Endpoints.Make(token + "Home.aspx");
};

var ICTU_WDAY = {
    "CN": 0,
    "2": 1,
    "3": 2,
    "4": 3,
    "5": 4,
    "6": 5,
    "7": 6,
};

module.exports = function () {
    this["Name"] = "ICTU";
    this["Title"] = "Đại học Công Nghệ Thông Tin và Truyền Thông";
    this["Description"] = "ICTU";

    var __URLTOKEN__ = "";

    var base = new TnuBase();

    var User = {
        Username: null,
        Password: null
    };
    User.IsLogined = function () {
        return User.Username != null && User.Password != null;
    }

    this.Login = function (username, password) {
        username = username || false;
        password = password || false;
        return new Promise(function (resolve, reject) {
            if (!username || !password) {
                resolve(false);
            }
            resolve = resolve || function () {};
            reject = reject || function () {};
            base.Get(Endpoints.Login()).then(function (resp) {
                var $ = base.ParseHtml(resp);
                var post = {};
                $("#Form1").serializeArray().forEach(function (entry) {
                    post[entry.name] = entry.value;
                });

                post["txtUserName"] = username;
                post["txtPassword"] = md5(password);
                post["btnSubmit"] = "Đăng nhập";

                base.Post(Endpoints.Login(), post).then(function (resp) {
                    resolve(resp);
                }, function (err) {
                    if (err.response.statusCode == 302) {
                        __URLTOKEN__ = (err.response.headers.location.match(/\(S\(.*?\)\)/gi)[0] || "") + "/";

                        base.Post(Endpoints.Login(__URLTOKEN__), post).then(function (resp) {
                            // if (resp.indexOf("(" + username + ")") > -1) {
                            //     resolve(true);
                            //     User.Username = username;
                            //     User.Password = password;
                            // } else {
                            resolve(false);
                            // }
                        }, function (err) {
                            if (!!err.response.headers["set-cookie"]) {
                                resolve(true);
                                base.SetCookies(err.response.headers["set-cookie"]);
                                User.Username = username;
                                User.Password = password;
                            } else {
                                resolve(false);
                            }
                        });
                    } else {
                        reject(err);
                    }
                });
            }, reject);
        });
    };

    this.GetNews = function () {
        return new Promise(function (resolve, reject) {
            base.Get(Endpoints.Home()).then(function (resp) {
                var $ = base.ParseHtml(resp);
                try {
                    var arr = [];
                    $("#ctl05_MyList").find(".important_news A").each(function (k, A) {
                        var A = $(A);
                        var uri = A.attr("href");
                        var link = Endpoints.Make(uri);
                        var id = uri.substr(uri.indexOf("?IDThongBao=") + "?IDThongBao=".length);
                        var _class = "important_news";
                        var title = A.text().trim();
                        var time = title.substr(-11, 10);
                        arr.push(new TnuNews(id, _class, link, time, title));
                    });
                    $("#ctl05_MyList").find(".old_news A").each(function (k, A) {
                        var A = $(A);
                        var uri = A.attr("href");
                        var link = Endpoints.Make(uri);
                        var id = uri.substr(uri.indexOf("?IDThongBao=") + "?IDThongBao=".length);
                        var _class = "old_news";
                        var title = A.text().trim();
                        var time = title.substr(-11, 10);
                        arr.push(new TnuNews(id, _class, link, time, title));
                    });
                    resolve(arr);
                } catch (err) {
                    reject(err);
                }
            }, function (err) {
                reject(err);
            });
        });
    }

    this.GetProfile = function () {
        return new Promise(function (resolve, reject) {
            base.Get(Endpoints.Make("MarkAndView.aspx")).then(function (resp) {
                var $ = base.ParseHtml(resp);
                var idElement = $("#drpStudent option[selected]");
                var id = idElement.val(),
                    truong = "ICTU",
                    code = User.Username,
                    name = idElement.text(),
                    _class = $("#drpAdminClass option[selected]").text(),
                    major = $("#drpField option[selected]").text(),
                    academicYear = $("#drpAcademicYear option[selected]").text(),
                    hedaotao = $("#drpHeDaoTaoId option[selected]").text();
                resolve(new TnuProfile(truong, id, code, name, _class, major, academicYear, hedaotao));
            }, reject);
        });
    }

    this.GetSemestersIn = function (uri) {
        return new Promise(function (resolve, reject) {
            base.Get(Endpoints.Make(uri)).then(function (resp) {
                var $ = base.ParseHtml(resp);
                var result = [];
                $("select[name='drpSemester'] option").each(function (k, opt) {
                    opt = $(opt);

                    result.push(new TnuSemester(
                        opt.val(),
                        opt.text(),
                        !!opt.attr("selected")
                    ));
                });
                resolve(result);
            }, reject);
        });
    };

    this.GetSemestersOfStudy = function () {
        return this.GetSemestersIn("Reports/Form/StudentTimeTable.aspx");
    };

    this.GetSemestersOfExam = function () {
        return this.GetSemestersIn("StudentViewExamList.aspx");
    };

    this.GetTimeTableOfStudy = function (semesterId) {
        return new Promise(function (resolve, reject) {
            base.Get(Endpoints.Make("Reports/Form/StudentTimeTable.aspx")).then(function (resp) {
                var $ = base.ParseHtml(resp);
                var post = {};
                $("#Form1").serializeArray().forEach(function (entry) {
                    post[entry.name] = entry.value;
                });
                post["drpSemester"] = semesterId;
                post["drpType"] = "B";
                var drpTerms = [];
                $("select[name='drpTerm'] option").each(function (k, drpTerm) {
                    drpTerms.push($(drpTerm).val());
                });
                if (drpTerms.length > 0) {
                    post["drpTerm"] = drpTerms[0];
                }

                base.Post(Endpoints.Make(__URLTOKEN__ + "Reports/Form/StudentTimeTable.aspx"), post).then(function (resp) {
                    var $ = base.ParseHtml(resp);

                    $("#Form1").serializeArray().forEach(function (entry) {
                        post[entry.name] = entry.value;
                    });

                    post["drpSemester"] = semesterId;
                    post["drpType"] = "B";

                    var drpTerms = [];
                    $("select[name='drpTerm'] option").each(function (k, drpTerm) {
                        drpTerms.push($(drpTerm).val());
                    });

                    if (drpTerms.length <= 0) {
                        drpTerms = [-1];
                    }

                    post["btnView"] = "Xuất file Excel";
                    var progress = 0;
                    var data = [];
                    var tkb = new TnuTimeTable();

                    drpTerms.forEach(function (drpTerm) {
                        if (drpTerm > -1) {
                            post["drpTerm"] = drpTerm;
                        } else {
                            delete post["drpTerm"];
                            post["drpTerm"] = $("select[name='drpTerm']").val();
                        }
                        var xlsFilePath = path.join(os.tmpdir(), parseInt(Math.random() * 1000) + (new Date().getTime()) + ".xls");

                        base.Post(Endpoints.Make(__URLTOKEN__ + "Reports/Form/StudentTimeTable.aspx"), post)
                            .pipe(fs.createWriteStream(xlsFilePath))
                            .on("unpipe", function () {
                                s
                                progress++;
                                if (progress >= drpTerms.length) {
                                    resolve(tkb.Entries);
                                }
                            })
                            .on("finish", function () {
                                var sheets = xlsParse.xls2Obj(xlsFilePath);
                                var raw = fs.readFileSync(xlsFilePath, "utf8");
                                //fs.writeFileSync(xlsFilePath, "utf8"); 
                                //console.log(xlsFilePath);
                                fs.unlinkSync(xlsFilePath);
                                // data.push(xlsFilePath, sheets);
                                var $ = base.ParseHtml(raw.substr(raw.indexOf('<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >')));

                                for (var sheetName in sheets) {
                                    var sheet = sheets[sheetName];

                                    for (var i = 10; i < sheet.length - 9; i++) {
                                        // console.log( i+" "+sheet[i]);
                                        var row = sheet[i];
                                        var thu = ICTU_WDAY[row[0]];
                                        var maMon = row[1];
                                        var hocPhan = row[4];
                                        var giaoVien = row[7];
                                        var dot = $("#drpTerm option[selected]").text().trim();
                                        var hinhThuc =
                                            hocPhan.match(/\.TL[0-9]/ig) ? "TL" : false ||
                                            hocPhan.match(/\.TH[0-9]/ig) ? "TH" : false ||
                                            "LT";
                                        var tiets = [];
                                        if (row.length == 12) {
                                            tiets = [
                                                parseInt(row[8].substr(1)),
                                                parseInt(row[9]),
                                            ];

                                        }
                                        if (row.length == 13) {
                                            tiets = [
                                                parseInt(row[8].substr(1)),
                                                parseInt(row[9]),
                                                parseInt(row[10]),
                                            ];
                                        }
                                        if (row.length == 14) {
                                            tiets = [
                                                parseInt(row[8].substr(1)),
                                                parseInt(row[9]),
                                                parseInt(row[10]),
                                                parseInt(row[11]),
                                            ];
                                        }
                                        if (row.length == 15) {
                                            tiets = [
                                                parseInt(row[8].substr(1)),
                                                parseInt(row[9]),
                                                parseInt(row[10]),
                                                parseInt(row[11]),
                                                parseInt(row[12]),
                                            ];
                                        }
                                        var diaDiem = row[8 + tiets.length + 0];
                                        var timeRange = row[8 + tiets.length + 1].split("-");
                                        var startTime = moment(timeRange[0], "DD/MM/YYYY").toDate();
                                        var endTime = moment(timeRange[1], "DD/MM/YYYY").toDate();
                                        // var subject = tkb.Subjects.filter(function (s) {
                                        //     return s.MaMon == maMon;
                                        // })[0];

                                        // if (!subject) {
                                        //     subject = new TnuSubject(maMon, tenMon, hocPhan, 0);
                                        //     tkb.Subjects.push(subject);
                                        // }

                                        for (var pivot = startTime; pivot.getTime() <= endTime.getTime(); pivot.setDate(pivot.getDate() + 7)) {
                                            while (pivot.getDay() != thu) {
                                                pivot.setDate(pivot.getDate() + 1);
                                            }
                                            var date = new Date(pivot.setDate(pivot.getDate()));
                                            var year = date.getFullYear();

                                            var month = (1 + date.getMonth()).toString();
                                            month = month.length > 1 ? month : '0' + month;

                                            var day = date.getDate().toString();
                                            day = day.length > 1 ? day : '0' + day;

                                            var time = day + '/' + month + '/' + year;
                                            var entry = new TnuTimeTableEntry("LichHoc", hocPhan, maMon, time, tiets.toString(), diaDiem, hinhThuc, giaoVien, dot);
                                            tkb.Entries.push(entry);
                                        }
                                    }
                                }

                                progress++;
                                if (progress >= drpTerms.length) {
                                    resolve(tkb);
                                }
                            });
                    });
                }, reject);
            }, reject);
        });
    };

    this.GetTimeTableOfExam = function (semesterId) {
        return new Promise(function (resolve, reject) {
            base.Get(Endpoints.Make("StudentViewExamList.aspx")).then(function (resp) {
                var $ = base.ParseHtml(resp);

                var post = {};
                $("#Form1").serializeArray().forEach(function (entry) {
                    post[entry.name] = entry.value;
                });

                post["drpSemester"] = semesterId;

                base.Post(Endpoints.Make(__URLTOKEN__ + "StudentViewExamList.aspx"), post).then(function (resp) {
                    $ = base.ParseHtml(resp);

                    $("#Form1").serializeArray().forEach(function (entry) {
                        post[entry.name] = entry.value;
                    });

                    post["drpSemester"] = semesterId;

                    var DotThis = [];

                    $("#drpDotThi option").each(function (k, dotThi) {
                        if (k > 0) {
                            DotThis.push($(dotThi).val());
                        }
                    });

                    var Result = new TnuTimeTable();
                    var ResultStep = 0;

                    var processExamData = function (html) {
                        var $ = base.ParseHtml(html);

                        $("#tblCourseList tr").each(function (i, tr) {
                            if (i > 0) {
                                var arr = [];
                                $(tr).find("td").each(function (i, td) {
                                    arr.push($(td).text().trim());
                                });

                                if (arr.length < 10) {
                                    return;
                                }
                                var entry = new TnuTimeTableEntry(
                                    "LichThi",
                                    arr[2],
                                    arr[1],
                                    arr[4],
                                    arr[5],
                                    arr[8],
                                    arr[6],
                                    "",
                                    $("#drpDotThi option[selected]").text().trim() + " | " + $("#drpExaminationNumber option[selected]").text().trim(),
                                    arr[7],
                                    arr[9],
                                );
                                Result.Entries.push(entry);
                            }
                        });

                        ResultStep++;
                        if (ResultStep >= DotThis.length * 2) {
                            resolve(Result);
                        }
                    }

                    if (DotThis.length == 0) {
                        DotThis.push(false);
                    }
                    DotThis.forEach(function (dotThi) {
                        if (!!dotThi) {
                            post["drpDotThi"] = dotThi;
                        } else {
                            delete post["drpDotThi"];
                        }
                        for (var drpExaminationNumber = 0; drpExaminationNumber <= 1; drpExaminationNumber++) {
                            post["drpExaminationNumber"] = drpExaminationNumber;

                            base.Post(Endpoints.Make(__URLTOKEN__ + "StudentViewExamList.aspx"), post)
                                .then(processExamData, reject);
                        }
                    });
                }, reject);
            }, reject);
        });
    }

    this.GetMarkTable = function () {
        return new Promise(function (resolve, reject) {
            base.Get(Endpoints.Make(__URLTOKEN__ + "MarkAndView.aspx")).then(function (resp) {
                var $ = base.ParseHtml(resp);

                var post = {};
                $("#Form1").serializeArray().forEach(function (entry) {
                    post[entry.name] = entry.value;
                });

                post["btnView"] = "Xem";

                base.Post(Endpoints.Make(__URLTOKEN__ + "MarkAndView.aspx"), post).then(function (resp) {
                    var $ = base.ParseHtml(resp);

                    var arr = {
                        labels: [],
                        keys: [],
                        values: []
                    };

                    $("#tblStudentMark tr").each(function (k, tr) {
                        if (k == 0) {
                            $(tr).find("td").each(function (_k, td) {
                                arr.labels.push($(td));
                            });
                        } else if (k == 1) {
                            $(tr).find("td").each(function (_k, td) {
                                arr.keys.push($(td));
                            });
                        } else if (k == 2) {
                            $(tr).find("td").each(function (_k, td) {
                                arr.values.push($(td));
                            });
                        }
                    });

                    var tb = new TnuMarkTable();
                    tb.tongsotc = arr.values[4].text();
                    tb.sotctuongduong = arr.values[5].text();
                    tb.stctln = arr.values[6].text();
                    tb.dtbc = arr.values[7].text();
                    tb.dtbcqd = arr.values[8].text();
                    tb.somonkhongdat = arr.values[9].text();
                    tb.sotckhongdat = arr.values[10].text();
                    tb.dtbxltn = arr.values[11].text();
                    tb.dtbmontn = arr.values[12].text();
                    pivot = 11;
                    for (var i = 1; i < arr.labels.length; i++) {
                            var label = arr.labels[i];
                            var numCols = parseInt(label.attr("colspan"));
                            var txt = label.text().trim();
                            var txts = txt.split("_", 2);
                            if (numCols && txts.length == 2) {

                                var maMon = txts[0];
                                var tenMon = txts[1].substr(0, txts[1].length - 4);
                                var soTC = txts[1].substr(-2, 1);

                                var point = {
                                    CC: "",
                                    THI: "",
                                    TKHP: "",
                                    "Chữ": ""
                                };
                                pivot += numCols
                                let tmep = pivot - numCols;
                                console.log(tmep)
                                for (var j = tmep; j < pivot; j++) {
                                    try {
                                        var key = arr.keys[j].text().trim();
                                        var val = arr.values[j].text().trim();
                                        point[key] = val;
                                        console.log(key)
                                        console.log(val)
                                    } catch (ex) {

                                        console.log(numCols)
                                    }
                                }

                                tb.AddEntry(maMon, tenMon, soTC, txt, point.CC, point.THI, point.TKHP, point["Chữ"], point);
                            }
                    }
                    resolve([tb]);
                }, reject);
            }, reject);
        });
    }
};

module.exports["Name"] = "ICTU";
module.exports["Title"] = "Đại học Công Nghệ Thông Tin và Truyền Thông";
module.exports["Description"] = "ICTU";