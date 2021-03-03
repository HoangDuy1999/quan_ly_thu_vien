const db = require("../utils/db");

const tblPhieuTraSach = "phieutrasach";
module.exports = {
  getListJoinManyTable: function () {
    return db.load(`
      SELECT pts.*, pms.NgayMuon, pms.NgayHetHan, dg.MaDocGia, dg.HoTenDG, dg.CMND_CCCD, nv.HoTenNV, pttp.MaPhieuThu
      FROM  phieutrasach pts
      Left Join phieumuonsach pms
      ON pts.MaPM = PMS.MaPM
      Left Join docgia dg
      ON pms.MaDG = dg.MaDocGia
      Left Join nhanvien nv
      ON pms.MaNVTN = nv.MaNhanVien
      Left Join phieuthutienphat pttp
      ON pts.MaPT = pttp.MaPT
    `);
  },
  fullDetailByID: function (id) {
    return db.load(`
    SELECT pts.*, pms.NgayMuon, pms.NgayHetHan, dg.MaDocGia, dg.HoTenDG, dg.CMND_CCCD, nv.HoTenNV 
    FROM  phieutrasach pts
    Left Join phieumuonsach pms
    ON pts.MaPM = PMS.MaPM
    Left Join docgia dg
    ON pms.MaDG = dg.MaDocGia
    Left Join nhanvien nv
    ON pms.MaNVTN = nv.MaNhanVien
    WHERE MaPT = '${id}'
  `);
  },
  getDataById: function (id) {
    return db.load(`
      select * from ${tblPhieuTraSach} where MaPM = '${id}'
    `);
  },
  TotalLiabilities: function (id) {
    return db.load(`
      select COALESCE(Sum(TienPhatKyNay), 0) as tongtienphat, COALESCE(Sum(TienNo), 0) as tongtienno
      from ${tblPhieuTraSach}
      where MaDocGia = '${id}' AND DaXoa = 0
    `);
  },
  getLastRow: function () {
    return db.load(
      `SELECT MaPT FROM ${tblPhieuTraSach} ORDER BY MaPT DESC LIMIT 1`,
    );
  },
  addCardGivenBook: function (entity) {
    return db.insert(tblPhieuTraSach, entity);
  },
  deletedCardGiveBook: function (entity, condition) {
    return db.update(tblPhieuTraSach, entity, condition);
  },
  getDetailIntoTreasurer: function () {
    return db.load(`
      SELECT pts.*, dg.HoTenDG, dg.CMND_CCCD
      FROM ${tblPhieuTraSach} pts, docgia dg
      WHERE pts.MaDocGia = dg.MaDocGia AND pts.DaXoa = 0 
    `);
  },
  updateMoney: function (entity, condition) {
    return db.update(tblPhieuTraSach, entity, condition);
  },
};
