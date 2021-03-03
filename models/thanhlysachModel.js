const db = require("../utils/db");

const tblthanhlysach = "thanhlysach";
module.exports = {
  getList: function () {
    return db.load(`
    SELECT tls.*, ldtl.MoTa, nv.HoTenNV
    FROM  ${tblthanhlysach} tls, lydothanhly ldtl, nhanvien nv
    WHERE tls.LyDoThanhLy = ldtl.MaLyDoThanhLy and tls.MaNV = nv.MaNhanVien
    `);
  },
  getLastRow: function () {
    return db.load(
      `SELECT MaPhieuThanhLy FROM ${tblthanhlysach} ORDER BY MaPhieuThanhLy DESC LIMIT 1`,
    );
  },
  addLiquidation: function (entity) {
    return db.insert(tblthanhlysach, entity);
  },
  deletedLiquidation: function (condition) {
    return db.catch(tblthanhlysach, condition);
  },
};
