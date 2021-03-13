const db = require("../utils/db");

module.exports = {
  getListBookType: function () {
    return db.load(`
      SELECT *
      FROM theloaisach
    `);
  },
  getCountTypeBorrow: function (NgayBatDau, NgayKetThuc) {
    return db.load(`
        SELECT s.MaTheLoai, tls.TenTheLoai, COUNT(s.MaTheLoai) as SoLuong
        FROM phieumuonsach pms, ct_phieumuon ctpm, sach s, theloaisach tls
        WHERE pms.NgayMuon BETWEEN '${NgayBatDau}' AND '${NgayKetThuc}' and pms.MaPM = ctpm.MaPM and pms.DaXoa = 0
        AND ctpm.MaSach = s.MaSach and s.MaTheLoai = tls.MaTheLoai
        GROUP BY s.MaTheLoai
    `);
  },
  getListLateBook: function (NgayBatDau, NgayKetThuc) {
    return db.load(`
      SELECT pms.NgayMuon, pts.SoNgayTraTre, s.TenSach
      FROM phieutrasach pts, ct_phieutra ctpt, phieumuonsach pms, sach s
      WHERE pts.MaPM = pms.MaPM and pts.MaPT = ctpt.MaPT and ctpt.MaSach = s.MaSach and  pts.SoNgayTraTre > 0
      and pts.NgayTra BETWEEN '${NgayBatDau}' AND '${NgayKetThuc}' and pts.DaXoa = 0
    `);
  },
  getListReaderForeit: function (NgayBatDau, NgayKetThuc) {
    return db.load(
      `
      SELECT dg.MaDocGia, dg.HoTenDG, SUM(pts.TienNo) as TienNo
      FROM phieumuonsach pms, docgia dg, phieutrasach pts
      WHERE pms.MaDG = dg.MaDocGia AND pms.MaPM = pts.MaPM
      and pts.NgayTra BETWEEN '${NgayBatDau}' AND '${NgayKetThuc}' and pts.DaXoa = 0 
      and pms.DaXoa = 0
      GROUP BY dg.MaDocGia
      `,
    );
  },
};
