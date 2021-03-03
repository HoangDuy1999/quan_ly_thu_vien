const db = require("../utils/db");

const tblBoPhan = "bophan";
module.exports = {
  getNameById: function (mabp) {
    return db.load(`select * from ${tblBoPhan} where MaBoPhan= '${mabp}'`);
  },
  GetFullInFoParts: function (MaBoPhan) {
    return db.load(
      `select * from ${tblBoPhan} where MaBoPhan != '${MaBoPhan}'`,
    );
  },
  getInfoPartbyMaBP: function (MaBoPhan) {
    return db.load(`select * from ${tblBoPhan} where MaBoPhan = '${MaBoPhan}'`);
  },
};
