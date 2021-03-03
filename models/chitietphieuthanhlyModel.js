const db = require("../utils/db");

const tblct_thanhlysach = "ct_phieuthanhly";
module.exports = {
  searchAuthors: function (key) {
    return db.load(`
    SELECT * FROM  ${tblct_thanhlysach}
    WHERE MATCH(TenTacGia) AGAINST('${key}')
    `);
  },
  getList: function () {
    return db.load(`
    SELECT * FROM  ${tblct_thanhlysach}
    `);
  },
  getDetailByID: function (id) {
    return db.load(`
      SELECT ctptts.*, s.TenSach
      From  ${tblct_thanhlysach} ctptts, sach s
      where ctptts.MaSach = s.MaSach and ctptts.MaPhieuThanhLy = '${id}'
    `);
  },
  addDetailLiquidation: function (entity) {
    console.log(entity);
    return db.insert(tblct_thanhlysach, entity);
  },
  deletedDetailLiquidation: function (condition) {
    return db.catch(tblct_thanhlysach, condition);
  },
  getBookNotLiquidation: function () {
    return db.load(`
    SELECT ms.MaPT, ms.MaSach, S.TenSach
    FROM matsach ms, sach s
    WHERE ms.MaSach = s.MaSach AND ms.DaThanhLy = 0
    `);
  },
};
