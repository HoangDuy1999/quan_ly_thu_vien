const db = require("../utils/db");

const tblmatsach = "matsach";
module.exports = {
  addNewLostBook: function (entity) {
    return db.insert(tblmatsach, entity);
  },
  updateLostBook: function (MaPT, MaSach) {
    return db.load(`
      UPDATE ${tblmatsach} set DaThanhLy = 1 Where MaPT = '${MaPT}' and MaSach = '${MaSach}'
    `)
  },
  deletedLostBook: function (MaSach, MaPT) {
    return db.load(`
        update ${tblmatsach} set DaXoa = 1 where MaSach = '${MaSach}'AND MaPT = '${MaPT}'
    `);
  },
};
