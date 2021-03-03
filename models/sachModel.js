const db = require("../utils/db");

const tblSach = "sach";
module.exports = {
  getInfoBookByBookID: function (id) {
    return db.load(
      `SELECT s.*, nv.HoTenNV
      FROM ${tblSach} s, nhanvien nv
      WHERE s.MaSach = '${id}' and s.MaNVTiepNhan = nv.MaNhanVien`,
    );
  },
  updateBook: function (entity, condition) {
    return db.update(tblSach, entity, condition);
  },
  getManyRowByConditonID(condition) {
    return db.load(
      `SELECT s.MaSach, s.SoLuongDaMuon
      FROM ${tblSach} s
      WHERE s.MaSach in ${condition} AND s.TTS = 'TTS01'`,
    );
  },
  searchBook: function (key) {
    return db.load(`
      SELECT DISTINCT s.MaSach, s.TenSach, s.NgayXuatBan, s.SoLuong, s.SoLuongDaMuon, s.Ke, tg.TenTacGia, tls.TenTheLoai, nxb.TenNXB, tts.TenTinhTrang
      FROM  sach s, tacgia tg, nhaxuatban nxb, theloaisach tls, tinhtrangsach tts
      WHERE s.MaTacGia = tg.MaTacGia AND s.MaTheLoai = tls.MaTheLoai AND s.MaNXB = nxb.MaNXB AND s.TTS = tts.MaTTSach
      AND MATCH(s.TenSach, s.MaTheLoai, s.MaTacGia, s.MaNXB) AGAINST('${key}')
    `);
  },
  getLastRow: function () {
    return db.load(
      `SELECT MaSach FROM ${tblSach} ORDER BY MaSach DESC LIMIT 1`,
    );
  },
  getLists: function () {
    return db.load(`select s.*, tg.TenTacGia, nv.HoTenNV, tts.TenTinhTrang
    from ${tblSach} s, tacgia tg, nhanvien nv, tinhtrangsach tts
    where s.MaTacGia = tg.MaTacGia and s.MaNVTiepNhan = nv.MaNhanVien
    and s.TTS = MaTTSach
    `);
  },
  getFullLists: function () {
    return db.load(`select s.*, tg.TenTacGia, nv.HoTenNV, tts.TenTinhTrang
    from ${tblSach} s, tacgia tg, nhanvien nv, tinhtrangsach tts
    where s.MaTacGia = tg.MaTacGia and s.MaNVTiepNhan = nv.MaNhanVien
    and s.TTS = MaTTSach
    `);
  },
  getInfoBookByID: function (MaSach) {
    return db.load(`select s.MaSach, s.TenSach, s.SoLuong, s.GiaTien, s.NgayNhap, s.SoLuongDaMuon, s.Ke, s.NgayXuatBan, tg.TenTacGia, nv.HoTenNV, tts.TenTinhTrang, tls.TenTheLoai, nxb.TenNXB
    from ${tblSach} s, tacgia tg, nhanvien nv, tinhtrangsach tts, theloaisach tls, nhaxuatban nxb
    where s.MaTacGia = tg.MaTacGia and s.MaNVTiepNhan = nv.MaNhanVien
    and s.MaTheLoai = tls.MaTheLoai and s.MaNXB = nxb.MaNXB
    and s.TTS = MaTTSach and s.MaSach = '${MaSach}'
    `);
  },
  addNewBook: function (entity) {
    return db.insert(tblSach, entity);
  },
  blockBook: function (entity, condition) {
    return db.update(tblSach, entity, condition);
  },
};
