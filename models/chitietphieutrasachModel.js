const db = require("../utils/db");

const tblCT_PhieuTra = "ct_phieutra";
module.exports = {
  getDataByID: function (id) {
    return db.load(`
      select ctpt.*, s.TenSach, s.SoLuong, s.SoLuongDaMuon
      from ${tblCT_PhieuTra} ctpt, sach s
      where ctpt.MaPT = '${id}' and ctpt.MaSach = s.MaSach
    `);
  },
  addDetailGivenBook: function (entity) {
    return db.insert(tblCT_PhieuTra, entity);
  },
  deletedDetailGivenBook: function (entity, condition) {
    return db.catch(tblCT_PhieuTra, condition);
  },
  updateDetailGivenBook: function (entity, condition) {
    return db.update(tblCT_PhieuTra, entity, condition);
  },
};
