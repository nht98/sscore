module.exports = function (truong,id, code, name, _class, major, academicYear, hedaotao) {
    this.Truong = truong || "";
    this.Id = id || "";
    this.MaSinhVien = code || "";
    this.HoTen = name || "";
    this.Lop = _class || "";
    this.Nganh = major || "";
    this.NienKhoa = academicYear || "";
    this.HeDaoTao = hedaotao || "";
};
