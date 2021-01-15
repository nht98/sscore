module.exports = function (id, link, time, title, tomtat, content, files) {
    this.id = id || "";
    this.link = link || "";
    this.time = time || "";
    this.title = title || "";
    this.tomtat = tomtat || "";
    this.content = content || "";
    this.files = files || [];
};
