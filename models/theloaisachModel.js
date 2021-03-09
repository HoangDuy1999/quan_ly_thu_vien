const db = require("../utils/db");

const tblTheLoaiSach = "theloaisach";
module.exports = {
  searchTypeBook: function (key) {
    return db.load(`
    SELECT * FROM  ${tblTheLoaiSach}
    WHERE MATCH(TenTheLoai) AGAINST('${key}' IN BOOLEAN MODE)
    `);
  },
  getList: function () {
    return db.load(`
    SELECT * FROM  ${tblTheLoaiSach}
    `);
  },
  // addNewReader: function (entity) {
  //   return db.insert(tblSach, entity);
  // },
  // deletedStaff: function (entity, condition) {
  //   return db.update(tblSach, entity, condition);
  // },
};
