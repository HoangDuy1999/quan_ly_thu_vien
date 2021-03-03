const db = require("../utils/db");

const tblChucVu = "chucvu";
module.exports = {
  getPosition: function (conditions) {
    return db.load(`select * from ${tblChucVu} where MaChucVu not in ` + conditions);
  },
};
