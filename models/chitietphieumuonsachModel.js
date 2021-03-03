const db = require("../utils/db");

const tblCTphieumuon = "ct_phieumuon";
module.exports = {
  addMaNyRows: function (entity) {
    return db.insertManyDetailBorrowBooks(tblCTphieumuon, entity);
  },
  deletedDetailCardBorrowBook: function (entity,condition) {
    return db.update(tblCTphieumuon, entity, condition);
  },
  getDataJoinTblBook: function(id){
    return db.load(`
      select s.MaSach, s.SoLuongDaMuon
      from ${tblCTphieumuon} ctpm, sach s
      where ctpm.MaSach = s.MaSach AND ctpm.MaPM = '${id}'
    `);
  },
  getFullInfoByID: function(id){
    return db.load(`
      SELECT ctpm.MaSach, s.TenSach, tls.TenTheLoai, tg.TenTacGia, s.SoLuongDaMuon
      FROM ${tblCTphieumuon} ctpm, sach s, theloaisach tls,tacgia tg
      WHERE ctpm.MaSach = s.MaSach AND s.MaTheLoai = tls.MaTheLoai
      AND s.MaTacGia = tg.MaTacGia AND ctpm.MaPM = '${id}'
    `);
  },
  // addNewReader: function (entity) {
  //   return db.insert(tblSach, entity);
  // },
  addNewDetailcardBorrowBook: function (entity) {
    return db.insert(tblCTphieumuon, entity);
  },
  deletedCardBorrowBooks: function (condition) {
    return db.catch(tblCTphieumuon, condition);
  },
  getListForMat: function (id){
    return db.load(`
    SELECT ctpm.*, s.TenSach, s.GiaTien, pms.NgayMuon, DATEDIFF(CURRENT_DATE(), pms.NgayMuon) as 'SoNgayMuon'
      FROM ${tblCTphieumuon} ctpm
      LEFT JOIN sach s
      ON ctpm.MaSach = s.MaSach
      LEFT JOIN phieumuonsach pms
      ON ctpm.MaPM = pms.MaPM
      WHERE ctpm.DaXoa = 0 AND ctpm.MaPM = '${id}'
    `);
  }
};
