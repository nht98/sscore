const TnuMarkTableEntry = require('../DataStruct/TnuMarkTableEntry');

module.exports = function () {
    this.TongSoTC = 0;
    this.SoTCTuongDuong = 0;
    this.STCTLN = 0;
    this.DTBC = 0;
    this.DTBCQD = 0;
    this.SoMonKhongDat = 0;
    this.SoTCKhongDat = 0;
    this.DTBXLTN = 0;
    this.DTBMonTN = 0;
    this.Entries = [];

    this.AddEntry = function (MaMon, TenMon, SoTC, TenMonDayDu, CC, Thi, TKHP, DiemChu, raw) {
        this.Entries.push(new TnuMarkTableEntry(MaMon, TenMon, SoTC, TenMonDayDu, CC, Thi, TKHP, DiemChu, raw));
    }
};
