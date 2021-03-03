const express = require("express");
const moment = require("moment");
const bcrypt = require("bcrypt");
const restrict = require("../../middlewares/auth.mdw");
const phieumuonsachModel = require("../../models/phieumuonsachModel");
const phieutrasachModel = require("../../models/phieutrasachModel");
const chitietphieumuonsachModel = require("../../models/chitietphieumuonsachModel");
const lichsuModel = require("../../models/lichsuModel");
const docgiaModel = require("../../models/docgiaModel");
const sachModel = require("../../models/sachModel");
const _ = require("lodash");
const saltRounds = 12;
//const config = require('../config/config.json');
const router = express.Router();
// show list card borrow book
router.get("/borrow_book", restrict, async (req, res) => {
  staffInfo = req.session.authUser;
  if (staffInfo.MaBoPhan != "BP01" && staffInfo.MaBoPhan != "BP02") {
    return res.redirect("/index");
  }
  let lists = await phieumuonsachModel.getList();
  lists = lists.filter(
    (v, i, a) => a.findIndex((t) => t.MaPM === v.MaPM) === i,
  );
  for (const value of lists) {
    value.NgayMuon = moment(value.NgayMuon, "YYYY/MM/DD").format("DD-MM-YYYY");
    value.NgayHetHan = moment(value.NgayHetHan, "YYYY/MM/DD").format(
      "DD-MM-YYYY",
    );
    // chưa có phiếu trả
    if (value.MaPT == null || value.MaPT == "NULL" || value.MaPT == "") {
      value.isEdit = true;
      if (value.DaXoa) {
        value.isEdit = false;
        value.DaXoa = "Đã xóa";
        value.IsDeleted = true;
      } else {
        value.DaXoa = "Hoạt động";
        value.IsDeleted = false;
      }
    } else if (value.ptsDaXoa == 0) {
      // đã có phiếu trả
      value.isEdit = false;
      value.DaXoa = "Đã có phiếu trả";
      value.IsDeleted = true;
    } else {
      //phiếu trả đã xóa
      value.isEdit = true;
      value.DaXoa = "Hoạt động";
      value.IsDeleted = false;
    }
  }
  res.render("librarian/listBorrowBook", { lists });
});

router.get("/borrow_book/add", restrict, async (req, res) => {
  staffInfo = req.session.authUser;
  if (staffInfo.MaBoPhan != "BP01" && staffInfo.MaBoPhan != "BP02") {
    return res.redirect("/index");
  }
  const ListReaders = await docgiaModel.getListNotIsDeleted();
  for (const reader of ListReaders) {
    reader.NgaySinh = moment(reader.NgaySinh, "YYYY/MM/DD")
      .format("DD-MM-YYYY")
      .toString();
    reader.NgaySinh = reader.NgaySinh.trim().replace(/-/g, "/");
  }
  const ListBook = await sachModel.getLists();
  if (ListBook.length < 1) {
    return res.render("500");
  }
  if (ListReaders.length < 1) {
    return res.render("500");
  }
  //tạo dictionaries book
  // let dicBooks = {};
  // for(const book of ListBook) {
  //   dicBooks[book.MaSach] = book;
  // }
  // console.log(dicBooks);
  res.render("librarian/addBorrowBook", { ListReaders, ListBook });
});

router.get("/borrow_book/getInfoBookByID", restrict, async (req, res) => {
  staffInfo = req.session.authUser;
  if (staffInfo.MaBoPhan != "BP01" && staffInfo.MaBoPhan != "BP02") {
    return res.json(false);
  }
  if (req.query.MaSach == undefined) {
    return res.json(false);
  }
  const infoBook = await sachModel.getInfoBookByID(req.query.MaSach.trim());
  if (infoBook.length < 1) {
    return res.json(false);
  }
  if (
    parseInt(infoBook[0].SoLuongDaMuon) ==
    parseInt(infoBook[0].SoLuong) - 1
  ) {
    infoBook[0].TenTinhTrang = "Không thể mượn";
  }
  return res.json(infoBook[0]);
});

// validate info readers
router.get("/borrow_book/validateReader", restrict, async (req, res) => {
  if (req.query.MaDocGia == undefined) {
    return res.redirect("/index");
  }
  // Kiểm tra thẻ độc giả còn Hạn
  const infoReader = await docgiaModel.getInfoReadersByID(
    req.query.MaDocGia.trim(),
  );
  if (infoReader.length < 1) {
    return res.json("1001");
  }
  // Kiểm tra thẻ độc giả còn Hạn
  var daynow = new Date();
  var start = moment(daynow, "YYYY-MM-DD");
  var end = moment(infoReader[0].NgayLapThe, "YYYY-MM-DD");
  //Difference in number of weeks
  const numWeeks = Math.round(moment.duration(start.diff(end)).asWeeks());
  if (numWeeks > 25) {
    return res.json("404");
  }
  // Kiểm tra xem có phiếu mượn nào quá hạn MÀ CHƯA TRẢ SÁCH
  const aBorrowBookExpired = await phieumuonsachModel.getListExpiredByID(
    req.query.MaDocGia.trim(),
  );
  for (const value of aBorrowBookExpired) {
    if (value.MaPT == null || value.MaPT == "null") {
      return res.json("1002");
    }
  }
  // trong vòng 4 ngày chỉ mượn tối đa 4 quyển
  const BorrowBookFourDay = await phieumuonsachModel.getDetailBorrowBookByIDSinceFourDay(
    req.query.MaDocGia.trim(),
  );
  if (BorrowBookFourDay.length > 5) {
    return res.json("1003");
  }
  return res.json(BorrowBookFourDay.length);
});

// THÊM PHIẾU MƯỢN MỚI
router.get("/borrow_book/add/post", restrict, async (req, res) => {
  staffInfo = req.session.authUser;
  if (staffInfo.MaBoPhan != "BP01" && staffInfo.MaBoPhan != "BP02") {
    return res.redirect("/index");
  }
  let objPhieuMuonSach = {};
  // lấy dữ liệu
  if (req.query.MaDocGia == undefined) {
    return res.json("false");
  } else {
    objPhieuMuonSach.MaDG = req.query.MaDocGia.trim();
  }
  if (req.query.NgayMuon == undefined) {
    return res.json("false");
  } else {
    objPhieuMuonSach.NgayMuon = moment(
      req.query.NgayMuon.trim(),
      "DD/MM/YYYY",
    ).format("YYYY-MM-DD");
  }
  if (req.query.NgayHetHan == undefined) {
    return res.json("false");
  } else {
    objPhieuMuonSach.NgayHetHan = moment(
      req.query.NgayHetHan.trim(),
      "DD/MM/YYYY",
    ).format("YYYY-MM-DD");
  }
  if (req.query.GhiChu == undefined) {
    return res.json("false");
  } else {
    objPhieuMuonSach.GhiChu = req.query.GhiChu.trim();
  }

  // mặc định
  objPhieuMuonSach.DaXoa = false;
  objPhieuMuonSach.MaNVTN = staffInfo.MaNhanVien;

  //lấy ra dòng cuối
  const getRowLast = await phieumuonsachModel.getLastRow();
  // tạo ra mã phiếu mượn mới
  let MaPM = "";
  if (getRowLast.length > 0) {
    MaPM = getRowLast[0].MaPM;
    let numID = parseInt(MaPM.slice(MaPM.length - 6)) + 1;
    let strnumId = numID.toString();
    for (i = strnumId.length; i < 6; i++) {
      strnumId = "0" + strnumId;
    }
    MaPM = "PM" + strnumId;
    objPhieuMuonSach.MaPM = MaPM;
  } else {
    objPhieuMuonSach.MaPM = "PM000001";
  }
  MaPM = objPhieuMuonSach.MaPM;
  // THÊM PHIẾU MƯỢN
  const newBook = await phieumuonsachModel.addNewcardBorrowBook(
    objPhieuMuonSach,
  );
  if (newBook.affectedRows != 1) {
    return res.json(false);
  }
  //chi tiết phiếu mượn
  let aBooks = [];
  if (req.query.aBooks == undefined) {
    return res.json(false);
  } else {
    aBooks = req.query.aBooks.split(",");
  }

  // tạo dữ liệu thêm chi tiết phiếu mượn
  let dlPMS = [];
  for (i = 0; i < aBooks.length; i++) {
    dlPMS.push([MaPM, aBooks[i], false]);
  }
  //THÊM CHI TIẾT PHIẾU MƯỢN
  const rs = await chitietphieumuonsachModel.addMaNyRows(dlPMS);
  if (parseInt(rs.affectedRows) != dlPMS.length) {
    // Xóa phiếu mượn
    const delCardBorrowBook = await phieumuonsachModel.deletedCardBorrowBook({
      MaPM: MaPM,
    });
    if (delCardBorrowBook.affectedRows < 1) {
      console.log(
        `MaPM = ${MaPM} Đã phát sinh lỗi ở bảng phieumuonsach, admin kiểm tra`,
      );
    }
    //Xóa chi tiết phiếu mượn
    const delDetailCardBorrowBook = await chitietphieumuonsachModel.deletedDetailCardBorrowBook(
      {
        MaPM: MaPM,
      },
    );
    if (delDetailCardBorrowBook.affectedRows < 1) {
      console.log(
        `MaPM = ${MaPM} Đã phát sinh lỗi ở bảng chi tiết phiếu mượn sách, admin kiểm tra`,
      );
    }
    return res.json(false);
  }
  // tạo điểu kiện
  let dieukien = "(";
  i = 0;
  for (const sach of aBooks) {
    if (i < aBooks.length - 1) {
      dieukien = dieukien + `'${sach}'` + ",";
    } else {
      dieukien = dieukien + `'${sach}'`;
    }
    i += 1;
  }
  dieukien += ")";
  //lấy ra số lượng sách
  const infoBorrowBooks = await sachModel.getManyRowByConditonID(dieukien);
  if (infoBorrowBooks.length != aBooks.length) {
    console.log(`MaPM = ${MaPM} có sách mượn không hợp lệ`);
    return res.json(false);
  }
  //Tạo dữ liệu  update
  let query = "";
  for (const val of infoBorrowBooks) {
    var result = await sachModel.updateBook(
      { SoLuongDaMuon: parseInt(val.SoLuongDaMuon) + 1 },
      { MaSach: val.MaSach },
    );
    if (result.affectedRows == 0) {
      console.log(
        `Mã sách = ${val.MaSach} cập nhật số lượng đã mượn không thành công.`,
      );
    }
  }
  return res.json(true);
});

// lấy thông tin phiếu mượn
router.get("/borrow_book/detail", restrict, async (req, res) => {
  staffInfo = req.session.authUser;
  if (staffInfo.MaBoPhan != "BP01" && staffInfo.MaBoPhan != "BP02") {
    return res.redirect("/index");
  }
  if (req.query.MaPM == undefined) {
    return res.render("404");
  }

  const cardDetailBorrrowBook = await phieumuonsachModel.getInfoByID(
    req.query.MaPM.trim(),
  );
  if (cardDetailBorrrowBook.length < 1) {
    return res.render("404");
  } else {
    cardDetailBorrrowBook[0].NgayMuon = moment(
      cardDetailBorrrowBook[0].NgayMuon,
      "YYYY/MM/DD",
    ).format("DD/MM/YYYY");
    cardDetailBorrrowBook[0].NgayHetHan = moment(
      cardDetailBorrrowBook[0].NgayHetHan,
      "YYYY/MM/DD",
    ).format("DD/MM/YYYY");
    return res.json(cardDetailBorrrowBook[0]);
  }
});

// lấy thông tin chi tiết phiếu mượn
router.get("/borrow_book/detailBorrowBook", restrict, async (req, res) => {
  staffInfo = req.session.authUser;
  if (staffInfo.MaBoPhan != "BP01" && staffInfo.MaBoPhan != "BP02") {
    return res.redirect("/index");
  }
  if (req.query.MaPM == undefined) {
    return res.render("404");
  }

  const cardDetailBorrrowBook = await chitietphieumuonsachModel.getFullInfoByID(
    req.query.MaPM.trim(),
  );
  if (cardDetailBorrrowBook.length < 1) {
    return res.render("404");
  } else {
    let i = 1;
    for (const val of cardDetailBorrrowBook) {
      val.STT = i;
      val.SoLuong = 1;
      i += 1;
    }
    return res.json(cardDetailBorrrowBook);
  }
});

// chỉnh sửa phiếu mượn
router.get("/borrow_book/edit", restrict, async (req, res) => {
  staffInfo = req.session.authUser;
  if (staffInfo.MaBoPhan != "BP01" && staffInfo.MaBoPhan != "BP02") {
    return res.redirect("/index");
  }
  if (req.query.MaPM == undefined) {
    return res.render("404");
  }
  // Lấy thông tin phiếu mượn sách
  const cardBorrrowBook = await phieumuonsachModel.getInfoByID(
    req.query.MaPM.trim(),
  );
  if (cardBorrrowBook.length < 1) {
    return res.render("404");
  } else {
    cardBorrrowBook[0].NgayMuon = moment(
      cardBorrrowBook[0].NgayMuon,
      "YYYY/MM/DD",
    ).format("DD/MM/YYYY");
    cardBorrrowBook[0].NgayHetHan = moment(
      cardBorrrowBook[0].NgayHetHan,
      "YYYY/MM/DD",
    ).format("DD/MM/YYYY");
  }
  // lấy chi tiết phiếu mượn sách
  const cardDetailBorrrowBook = await chitietphieumuonsachModel.getFullInfoByID(
    req.query.MaPM.trim(),
  );
  if (cardDetailBorrrowBook.length < 1) {
    return res.render("404");
  } else {
    let i = 1;
    for (const val of cardDetailBorrrowBook) {
      val.STT = i;
      val.SoLuong = 1;
      i += 1;
    }
  }
  const ListBook = await sachModel.getLists();
  if (ListBook.length < 1) {
    return res.render("500");
  }
  const countBooks = await phieumuonsachModel.countCardBorrowBooksOfReader(
    req.query.MaPM.trim(),
    cardBorrrowBook[0].MaDG,
  );
  res.render("librarian/EditBorrowBook", {
    cardBorrrowBook: cardBorrrowBook[0],
    cardDetailBorrrowBook: cardDetailBorrrowBook,
    ListBook: ListBook,
    countBooks: countBooks,
  });
});

// chỉnh sửa phiếu mượn
router.get("/borrow_book/edit/post", restrict, async (req, res) => {
  let obj = {};
  let MaPM = "";
  let aBooks = [];
  let oldaBooks = [];
  if (req.query.MaPM == undefined) {
    return res.json(false);
  } else {
    MaPM = req.query.MaPM.trim();
  }
  if (req.query.GhiChu == undefined) {
    return res.json(false);
  } else {
    obj.GhiChu = req.query.GhiChu.trim();
  }
  if (req.query.NgayHetHan == undefined) {
    return res.json(false);
  } else {
    obj.NgayHetHan = moment(req.query.NgayHetHan.trim(), "DD/MM/YYYY").format(
      "YYYY-MM-DD",
    );
  }
  if (req.query.aBooks == undefined) {
    return res.json(false);
  } else {
    req.query.aBooks = req.query.aBooks.trim().split(",");
    aBooks = [...req.query.aBooks];
  }
  // lấy ra chi tiết phiếu mượn
  let sldmPhieuCu = [];
  const detailCardBorrowBooks = await chitietphieumuonsachModel.getFullInfoByID(
    MaPM,
  );
  if (detailCardBorrowBooks.length < 1) {
    return res.json(false);
  }
  for (const val of detailCardBorrowBooks) {
    oldaBooks.push(`${val.MaSach}`);
    sldmPhieuCu.push(val.SoLuongDaMuon);
  }
  // cập nhật phiếu mượn Sách
  const upateCardBorrow = await phieumuonsachModel.updateCardBorrowBook(obj, {
    MaPM: MaPM,
  });
  if (upateCardBorrow.affectedRows != 1) {
    return res.json(false);
  } else {
    if (_.isEqual(oldaBooks.sort(), aBooks.sort()) == false) {
      // xóa dữ liệu cũ
      await chitietphieumuonsachModel.deletedCardBorrowBooks({ MaPM: MaPM });
      let i = 0;
      // cập nhật lại số lượng
      for (const val of oldaBooks) {
        await sachModel.updateBook(
          { SoLuongDaMuon: sldmPhieuCu[i] - 1 },
          { MaSach: val },
        );
        i += 1;
      }
      // thêm dữ liệu mới
      for (const val of aBooks) {
        await chitietphieumuonsachModel.addNewDetailcardBorrowBook({
          MaPM: MaPM,
          MaSach: val,
          DaXoa: 0,
        });
        // lấy số lượng đã mượn của sách mới
        const informationBook = await sachModel.getInfoBookByBookID(val);
        if (informationBook.length > 0) {
          await sachModel.updateBook(
            { SoLuongDaMuon: informationBook[0].SoLuongDaMuon + 1 },
            { MaSach: val },
          );
        }
      }
    }
  }
  res.json(true);
});

// Xóa phiếu mượn
router.get("/borrow_book/deleted", restrict, async (req, res) => {
  staffInfo = req.session.authUser;
  if (staffInfo.MaBoPhan != "BP01" && staffInfo.MaBoPhan != "BP02") {
    return res.redirect("/index");
  }
  // phiếu trả
  if (req.query.MaPM == undefined) {
    return res.json(false);
  }
  const rs = await phieutrasachModel.getDataById(req.query.MaPM.trim());
  if (rs.length > 0) {
    return res.json("1001");
  }
  // xóa phiếu mượn
  const delCard = await phieumuonsachModel.deletedCardBorrowBook(
    { DaXoa: true },
    { MaPM: req.query.MaPM.trim() },
  );
  if (delCard.affectedRows == 0) {
    return res.json(false);
  } else {
    // xóa chi tiết phiếu mượn
    const delDetailCard = await chitietphieumuonsachModel.deletedDetailCardBorrowBook(
      { DaXoa: true },
      { MaPM: req.query.MaPM.trim() },
    );
    if (delDetailCard.affectedRows == 0) {
      console.log(
        `MaPM = ${req.query.MaPM.trim()} chưa xóa được chi tiết phiếu mượn`,
      );
    }
    // cập nhật lại số lượng sách
    const informationBook = await chitietphieumuonsachModel.getDataJoinTblBook(
      req.query.MaPM.trim(),
    );
    if (informationBook.length > 0) {
      for (const val of informationBook) {
        var result = await sachModel.updateBook(
          { SoLuongDaMuon: parseInt(val.SoLuongDaMuon) - 1 },
          { MaSach: val.MaSach },
        );
        if (result.affectedRows == 0) {
          console.log(
            `MaPM = ${req.query.MaPM.trim()}. Mã sách = ${
              val.MaSach
            } cập nhật số lượng đã mượn không thành công.`,
          );
        }
      }
    } else {
      console.log(
        `MaPM = ${req.query.MaPM.trim()} chưa cập nhật được số lượng sách`,
      );
    }
  }
  return res.json(true);
});

module.exports = router;
