const db = require("../utils/db");

const tblBangCap = "bangcap";
module.exports = {
  getFullDegrees: function (mabp) {
    return db.load(`select * from ${tblBangCap}`);
  }
};
