const db = require("../utils/db");

const tblLichSu = "lichsu";
module.exports = {
  addNewHistory: function (entity) {
    return db.insert(tblLichSu, entity);
  },
};
