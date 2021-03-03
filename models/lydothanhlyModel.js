const db = require("../utils/db");

const tblLyDoThanhLy = "lydothanhly";
module.exports = {
  getList: function () {
    return db.load(`
    SELECT * FROM  ${tblLyDoThanhLy} WHERE MaLyDoThanhLy != 'LDTL002'
    `);
  },
  // addNewReader: function (entity) {
  //   return db.insert(tblSach, entity);
  // },
  // deletedStaff: function (entity, condition) {
  //   return db.update(tblSach, entity, condition);
  // },
};
