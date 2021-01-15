const TnuMarkTableEntry = require('../DataStruct/TnuMarkTableEntry');

module.exports = function () {
    this.tongsotc = 0;
    this.sotctuongduong = 0;
    this.stctln = 0;
    this.dtbc = 0;
    this.dtbcqd = 0;
    this.somonkhongdat = 0;
    this.sotckhongdat = 0;
    this.dtbxltn = 0;
    this.dtbmontn = 0;
    this.entries = [];

    this.AddEntry = function (MaMon, TenMon, SoTC, TenMonDayDu, CC, Thi, TKHP, DiemChu, raw) {
        this.entries.push(new TnuMarkTableEntry(MaMon, TenMon, SoTC, TenMonDayDu, CC, Thi, TKHP, DiemChu, raw));
    }
};
