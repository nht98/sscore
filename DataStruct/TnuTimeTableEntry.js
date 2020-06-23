module.exports = function (hocPhan,maMon, thoiGian, tietHoc, diaDiem, hinhThuc, giaoVien, dot, soBaoDanh, ghiChu) {
    this.HocPhan = hocPhan || "";
    this.MaMon = maMon || "";
    this.ThoiGian = thoiGian || "";
    this.TietHoc = tietHoc || [];
    this.DiaDiem = diaDiem || "";
    this.HinhThuc = hinhThuc || "";
    this.GiaoVien = giaoVien || "";
    this.Dot = dot || "";
    this.SoBaoDanh = soBaoDanh || "";
    this.GhiChu = ghiChu || "";
};
