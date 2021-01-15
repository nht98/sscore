module.exports = function (theloai,hocPhan,maMon, thoiGian, tietHoc, diaDiem, hinhThuc, giaoVien, dot, soBaoDanh, ghiChu) {
    this.loailich = theloai || "";
    this.hocphan = hocPhan || "";
    this.mamon = maMon || "";
    this.thoigian = thoiGian || "";
    this.tiethoc = tietHoc || [];
    this.diadiem = diaDiem || "";
    this.hinhthuc = hinhThuc || "";
    this.giaovien = giaoVien || "";
    this.dot = dot || "";
    this.sobaodanh = soBaoDanh || "";
    this.ghichu = ghiChu || "";
};
