module.exports = function (id, link, time, title, tomtat, content, files) {
    this.Id = id || "";
    this.Link = link || "";
    this.ThoiGian = time || "";
    this.TieuDe = title || "";
    this.TomTat = tomtat || "";
    this.NoiDung = content || "";
    this.Files = files || [];
};
