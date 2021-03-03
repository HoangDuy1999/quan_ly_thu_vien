const db = require("../utils/db");

const tblTacGia = "tacgia";
module.exports = {
  searchAuthors: function (key) {
    return db.load(`
    SELECT * FROM  ${tblTacGia}
    WHERE MATCH(TenTacGia) AGAINST('${key}')
    `);
  },
  getList: function () {
    return db.load(`
    SELECT * FROM  ${tblTacGia}
    `);
  },
  // addNewReader: function (entity) {
  //   return db.insert(tblSach, entity);
  // },
  // deletedStaff: function (entity, condition) {
  //   return db.update(tblSach, entity, condition);
  // },
};
