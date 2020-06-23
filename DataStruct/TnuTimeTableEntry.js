module.exports = function (theloai,hocPhan,maMon, thoiGian, tietHoc, diaDiem, hinhThuc, giaoVien, dot, soBaoDanh, ghiChu) {
    this.LoaiLich = theloai || "";
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
