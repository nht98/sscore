module.exports = function (id, _class, link, time, title) {
    this.Id = id || "";
    this.LoaiThongBao = _class || "";
    this.Link = link || "";
    this.ThoiGian = time || "";
    this.TieuDe = title || "";
};
