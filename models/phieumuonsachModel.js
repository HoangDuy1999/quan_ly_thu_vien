const db = require("../utils/db");

const tblPhieuMuonSach = "phieumuonsach";
module.exports = {
  getLastRow: function () {
    return db.load(
      `SELECT * FROM ${tblPhieuMuonSach} ORDER BY MaPM DESC LIMIT 1`,
    );
  },
  getInfoByID: function (id) {
    return db.load(`
      SELECT distinct pms.MaPM, dg.HoTenDG, dg.CMND_CCCD, pms.NgayHetHan, pms.NgayMuon, pms.GhiChu, NV.HoTenNV, pms.DaXoa, pms.MaDG
      FROM ${tblPhieuMuonSach} pms, ct_phieumuon ctpm, docgia dg, nhanvien nv
      WHERE pms.MaPM = ctpm.MaPM AND pms.MaDG = dg.MaDocGia 
      AND pms.MaNVTN = nv.MaNhanVien AND pms.MaPM = '${id}'
    `);
  },
  getList: function () {
    return db.load(`
      SELECT Distinct pms.*, pts.MaPT, pts.DaXoa as 'ptsDaXoa', dg.HoTenDG, dg.CMND_CCCD
      FROM  ${tblPhieuMuonSach} pms
      LEFT JOIN phieutrasach pts
      ON pms.MaPM = pts.MaPM
      LEFT JOIN docgia dg
      ON pms.MaDG = dg.MaDocGia
    `);
  },
  getListConditionIsDeleted: function () {
    return db.load(`
      SELECT pms.*, pts.MaPT, pts.DaXoa as ptsDaXoa, dg.HoTenDG, dg.CMND_CCCD
      FROM  ${tblPhieuMuonSach} pms
      LEFT JOIN phieutrasach pts
      ON pms.MaPM = pts.MaPM
      LEFT JOIN docgia dg
      ON pms.MaDG = dg.MaDocGia
      where pms.DaXoa = 0 
    `);
  },
  getListExpiredByID: function (MaDocGia) {
    return db.load(`
    SELECT pms.*, DATEDIFF(pms.NgayHetHan, CURDATE()) as days, pts.MaPT
    FROM ${tblPhieuMuonSach} pms
    LEFT JOIN phieutrasach pts
    ON pms.MaPM = pts.MaPM
    WHERE pms.MaDG = '${MaDocGia}' AND DATEDIFF(pms.NgayHetHan, CURDATE()) < 0 
    AND pms.DaXoa = 0
    `);
  },
  getDetailBorrowBookByIDSinceFourDay(MaDocGia) {
    return db.load(`
      SELECT pms.*, ctpm.*
      FROM ${tblPhieuMuonSach} pms, ct_phieumuon ctpm
      WHERE MaDG = '${MaDocGia}' AND pms.MaPM = ctpm.MaPM AND DATEDIFF(CURDATE(), pms.NgayMuon) >= 0 AND DATEDIFF(CURDATE(), pms.NgayMuon) <= 4
      AND pms.DaXoa = 0 AND ctpm.DaXoa = 0
    `);
  },
  countCardBorrowBooksOfReader: async function (MaPM, MaDG) {
    const info = await db.load(`
      SELECT distinct * 
      FROM ct_phieumuon ctpm, phieumuonsach pms
      WHERE pms.MaPM = ctpm.MaPM AND pms.MaDG = '${MaDG}' AND pms.MaPM != '${MaPM}'
      AND DATEDIFF(CURDATE(),pms.NgayMuon) >= 0 AND DATEDIFF(CURDATE(), pms.NgayMuon) <= 4
      AND pms.DaXoa = 0 AND ctpm.DaXoa = 0
    `);
    return info.length;
  },
  addNewcardBorrowBook: function (entity) {
    return db.insert(tblPhieuMuonSach, entity);
  },
  updateCardBorrowBook: function (entity, condition) {
    return db.update(tblPhieuMuonSach, entity, condition);
  },
  deletedCardBorrowBook: function (entity, condition) {
    return db.update(tblPhieuMuonSach, entity, condition);
  },
  calculationLateDate: function (id) {
    return db.load(`
        SELECT DATEDIFF(CURDATE(), pms.NgayHetHan) as days, pms.MaDG
        FROM ${tblPhieuMuonSach} pms
        WHERE pms.MaPM = '${id}'
      `);
  },
};
