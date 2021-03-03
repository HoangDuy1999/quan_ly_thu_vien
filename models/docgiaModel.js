const db = require("../utils/db");

const tblDocGia = "docgia";
module.exports = {
  getInfoReadersByPassPort: function (cmnd_cccd) {
    return db.load(
      `SELECT dg.*
      FROM ${tblDocGia} dg
      WHERE dg.CMND_CCCD = '${cmnd_cccd}'`,
    );
  },
  getInfoReadersByPassPortWithManyCondition: function (cmnd_cccd, MaDocGia) {
    return db.load(
      `SELECT dg.*
      FROM ${tblDocGia} dg
      WHERE dg.CMND_CCCD = '${cmnd_cccd}' and dg.MaDocGia != '${MaDocGia}'`,
    );
  },
  getInfoReadersByID: function (MaDocGia) {
    return db.load(
      `SELECT dg.*, nv.HoTenNV, ldg.TenLoaiDG
      FROM ${tblDocGia} dg, nhanvien nv, loaidocgia ldg
      WHERE dg.MaDocGia = '${MaDocGia}' and dg.NVLapThe = nv.MaNhanVien and dg.MaLoaiDG = ldg.MaLoaiDG`
    );
  },
  getLastRow: function () {
    return db.load(
      `SELECT MaDocGia FROM ${tblDocGia} ORDER BY MaDocGia DESC LIMIT 1`,
    );
  },
  getListNotIsDeleted: function () {
    return db.load(
      `SELECT * 
      FROM ${tblDocGia}
      WHERE TTDG = 'TTDG01'`,
    );
  },
  getList: function () {
    return db.load(
      `SELECT dg.*, ttdg.LoaiTinhTrangDG, ldg.TenLoaiDG, nv.HoTenNV
      FROM ${tblDocGia} dg, tinhtrangdocgia ttdg, loaidocgia ldg, nhanvien nv
      WHERE dg.MaLoaiDG = ldg.MaLoaiDG and dg.TTDG = ttdg.MaTinhTrangDG
       and dg.NVLapThe = nv.MaNhanVien`,
    );
  },
  addNewReader: function (entity) {
    return db.insert(tblDocGia, entity);
  },
  updateReader: function (entity, condition) {
    return db.update(tblDocGia, entity, condition);
  },
  deletedReader: function (entity, condition) {
    return db.update(tblDocGia, entity, condition);
  },
  totalLiabilities: function (MaDocGia){
    return db.load(
      `
      Select COALESCE(Sum(TienNo), 0) as TongNo
      FROM phieutrasach
      WHERE MaDocGia = '${MaDocGia}'
      `
    );
  }
};
