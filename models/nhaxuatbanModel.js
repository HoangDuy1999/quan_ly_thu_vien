const db = require("../utils/db");

const tblNhaXuatBan = "nhaxuatban";
module.exports = {
  searchPublishingCompany: function (key) {
    return db.load(`
    SELECT * FROM  ${tblNhaXuatBan}
    WHERE MATCH(TenNXB) AGAINST('${key}' IN BOOLEAN MODE)
    `);
  },
  searchLike: function () {
    console.log(`
    SELECT * FROM  ${tblNhaXuatBan} where TenNXB like "%${key}%"`);
    return db.load(`
    SELECT * FROM  ${tblNhaXuatBan} where TenNXB like N'%${key}%'`);
  },
  getList: function () {
    return db.load(`
    SELECT * FROM  ${tblNhaXuatBan}`);
  },
  // addNewReader: function (entity) {
  //   return db.insert(tblSach, entity);
  // },
  // deletedStaff: function (entity, condition) {
  //   return db.update(tblSach, entity, condition);
  // },
};
