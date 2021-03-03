const db = require("../utils/db");

const tblPhieuThuTienPhat = "phieuthutienphat";
module.exports = {
  getList: function () {
    return db.load(` 
    SELECT pttp.*, nv.HoTenNV FROM  ${tblPhieuThuTienPhat} pttp, nhanvien nv
    where pttp.MaNV = nv.MaNhanVien
    `);
  },
  addCard: function (entity) {
    return db.insert(tblPhieuThuTienPhat, entity);
  },
  deletedCard: function (entity, condition) {
    return db.catch(tblPhieuThuTienPhat, condition);
  },
};
