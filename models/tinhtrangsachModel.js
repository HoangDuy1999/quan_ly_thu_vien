const db = require("../utils/db");

const tblTinhTrangSach = "tinhtrangsach";
module.exports = {
  getList: function () {
    return db.load(`
    SELECT * FROM  ${tblTinhTrangSach}
    `);
  },
  // addNewReader: function (entity) {
  //   return db.insert(tblSach, entity);
  // },
  // deletedStaff: function (entity, condition) {
  //   return db.update(tblSach, entity, condition);
  // },
};
