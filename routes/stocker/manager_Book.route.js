const express = require("express");
const moment = require("moment");
const restrict = require("../../middlewares/auth.mdw");
const nhanvienModel = require("../../models/nhanvienModel");
const lichsuModel = require("../../models/lichsuModel");
const sachModel = require("../../models/sachModel");
const theloaisachModel = require("../../models/theloaisachModel");
const tacgiaModel = require("../../models/tacgiaModel");
const nhaxuatbanModel = require("../../models/nhaxuatbanModel");
const tinhtrangsachModel = require("../../models/tinhtrangsachModel");
const saltRounds = 12;
const bcrypt = require("bcrypt");
const router = express.Router();
router.get("/stocker/manager_book", restrict, async (req, res) => {
  let staffInfo = req.session.authUser;
  if (staffInfo.MaBoPhan == "BP01" && staffInfo.MaBoPhan == "BP03") {
    return res.redirect("/index");
  }
  const books = await sachModel.getLists();

  for (const book of books) {
    book.NgayXuatBan = moment(book.NgayXuatBan, "YYYY/MM/DD").format(
      "DD-MM-YYYY",
    );
    if (book.TTS == "TTS01") {
      book.IsLock = false;
    } else {
      book.IsLock = true;
    }
  }
  res.render("stocker/listBooks", { books: books });
});
// thêm sách mới
router.get("/stocker/manager_book/add", restrict, async (req, res) => {
  let staffInfo = req.session.authUser;
  if (staffInfo.MaBoPhan == "BP01" && staffInfo.MaBoPhan == "BP03") {
    return res.redirect("/index");
  }
  // Lấy ra tác giả
  const listAuthors = await tacgiaModel.getList();
  if (listAuthors.length < 1) {
    return res.redirect("/");
  }
  // Lấy ra thể loại
  const listTypeBook = await theloaisachModel.getList();
  if (listTypeBook.length < 1) {
    return res.redirect("/");
  }
  // Lấy ra nhà xuất bản
  const listPublisher = await nhaxuatbanModel.getList();
  if (listPublisher.length < 1) {
    return res.redirect("/");
  }
  // Lấy ra tình trạng sách
  const StatusBooks = await tinhtrangsachModel.getList();
  if (StatusBooks.length < 1) {
    return res.redirect("/");
  }
  res.render("stocker/addBook", {
    Authors: listAuthors,
    Types: listTypeBook,
    Publishers: listPublisher,
    StatusBooks: StatusBooks,
  });
});

router.get("/stocker/manager_book/add/post", restrict, async (req, res) => {
  let staffInfo = req.session.authUser;
  if (staffInfo.MaBoPhan == "BP01" && staffInfo.MaBoPhan == "BP03") {
    return res.redirect("/index");
  }
  let entity = {};
  entity.MaNVTiepNhan = staffInfo.MaNhanVien;
  entity.Ke = Math.floor(Math.random() * 10) + 1;
  const lastId = await sachModel.getLastRow();
  if (lastId.length < 1) {
    res.json(false);
  }
  MaSach = lastId[0].MaSach;
  let numID = parseInt(MaSach.slice(MaSach.length - 3)) + 1;
  let strnumId = numID.toString();
  for (i = strnumId.length; i < 3; i++) {
    strnumId = "0" + strnumId;
  }
  entity.MaSach = "S" + strnumId;

  if (req.query.TenSach != undefined) {
    entity.TenSach = req.query.TenSach.trim();
  } else {
    return res.json(false);
  }
  if (req.query.NgayNhap != undefined) {
    entity.NgayNhap = moment(
      req.query.NgayNhap.trim(),
      "DD-MM-YYYY HH:mm:ss",
    ).format("YYYY/MM/DD HH:mm:ss");
  } else {
    return res.json(false);
  }
  if (req.query.NgayXuatBan != undefined) {
    entity.NgayXuatBan = moment(
      req.query.NgayXuatBan.trim(),
      "DD-MM-YYYY",
    ).format("YYYY/MM/DD");
  } else {
    return res.json(false);
  }
  if (req.query.MaNXB != undefined) {
    entity.MaNXB = req.query.MaNXB;
  } else {
    return res.json(false);
  }
  if (req.query.SoLuong != undefined) {
    let SoLuong = req.query.SoLuong.trim();
    let numberBooks = 0;
    for (i = 0; i < SoLuong.length; i++) {
      if (SoLuong[i] != ",") {
        numberBooks = numberBooks * 10 + parseInt(SoLuong[i]);
      }
    }
    entity.SoLuong = numberBooks;
  } else {
    return res.json(false);
  }
  if (req.query.GiaTien != undefined) {
    var GiaTien = req.query.GiaTien.trim();
    if (GiaTien.length < 8) {
      GiaTien = GiaTien.split(" ");
      entity.GiaTien = parseInt(GiaTien);
    } else {
      let money = 0;
      for (i = 0; i < GiaTien.length - 4; i++) {
        if (GiaTien[i] != ",") {
          money = money * 10 + parseInt(GiaTien[i]);
        }
      }
      entity.GiaTien = parseInt(money);
    }
  } else {
    return res.json(false);
  }
  if (req.query.MaTheLoai != undefined) {
    entity.MaTheLoai = req.query.MaTheLoai.trim();
  } else {
    return res.json(false);
  }
  if (req.query.TTS != undefined) {
    entity.TTS = req.query.TTS.trim();
  } else {
    return res.json(false);
  }
  if (req.query.MaTacGia != undefined) {
    entity.MaTacGia = req.query.MaTacGia.trim();
  } else {
    return res.json(false);
  }
  entity.SoLuongDaMuon = 0;
  const rs = await sachModel.addNewBook(entity);
  if (rs.affectedRows != 1) {
    return res.json(false);
  }
  return res.json(true);
});

// Chỉnh sửa thông tin sách
router.get("/stocker/manager_book/edit", restrict, async (req, res) => {
  const staffInfo = req.session.authUser;
  if ((staffInfo.MaBoPhan == "BP01" && staffInfo.MaBoPhan == "BP03") || req.query.MaSach == undefined) {
    return res.redirect("/index");
  }
  const infoBook = await sachModel.getInfoBookByBookID(req.query.MaSach);
  if(infoBook.length < 1){
    return res.render("500");
  }
  infoBook[0].NgayNhap = moment(
    infoBook[0].NgayNhap,
    "YYYY/MM/DD HH:mm:ss",
  ).format("DD-MM-YYYY HH:mm:ss");
  infoBook[0].NgayXuatBan = moment(
    infoBook[0].NgayXuatBan,
    "YYYY/MM/DD",
  ).format("DD-MM-YYYY");
  // Lấy ra tác giả
  const listAuthors = await tacgiaModel.getList();
  if (listAuthors.length < 1) {
    return res.redirect("/");
  }
  // Lấy ra thể loại
  const listTypeBook = await theloaisachModel.getList();
  if (listTypeBook.length < 1) {
    return res.redirect("/");
  }
  // Lấy ra nhà xuất bản
  const listPublisher = await nhaxuatbanModel.getList();
  if (listPublisher.length < 1) {
    return res.redirect("/");
  }
  // Lấy ra tình trạng sách
  const StatusBooks = await tinhtrangsachModel.getList();
  if (StatusBooks.length < 1) {
    return res.redirect("/");
  }
  res.render("stocker/editBook", {
    Authors: listAuthors,
    Types: listTypeBook,
    Publishers: listPublisher,
    StatusBooks: StatusBooks,
    infoBook: infoBook[0]
  });
});

router.get("/stocker/manager_book/edit/post", restrict, async (req, res) => {
  let staffInfo = req.session.authUser;
  if (staffInfo.MaBoPhan == "BP01" && staffInfo.MaBoPhan == "BP03") {
    return res.redirect("/index");
  }
  let entity = {};
  if (req.query.MaSach == undefined) {
    return res.json(false);
  }
  if (req.query.TenSach != undefined) {
    entity.TenSach = req.query.TenSach.trim();
  } else {
    return res.json(false);
  }
  if (req.query.NgayXuatBan != undefined) {
    entity.NgayXuatBan = moment(
      req.query.NgayXuatBan.trim(),
      "DD-MM-YYYY",
    ).format("YYYY/MM/DD");
  } else {
    return res.json(false);
  }
  if (req.query.MaNXB != undefined) {
    entity.MaNXB = req.query.MaNXB;
  } else {
    return res.json(false);
  }
  if (req.query.SoLuong != undefined) {
    let SoLuong = req.query.SoLuong.trim();
    let numberBooks = 0;
    for (i = 0; i < SoLuong.length; i++) {
      if (SoLuong[i] != ",") {
        numberBooks = numberBooks * 10 + parseInt(SoLuong[i]);
      }
    }
    entity.SoLuong = numberBooks;
  } else {
    return res.json(false);
  }
  if (req.query.GiaTien != undefined) {
    var GiaTien = req.query.GiaTien.trim();
    if (GiaTien.length < 8) {
      GiaTien = GiaTien.split(" ");
      entity.GiaTien = parseInt(GiaTien);
    } else {
      let money = 0;
      for (i = 0; i < GiaTien.length - 4; i++) {
        if (GiaTien[i] != ",") {
          money = money * 10 + parseInt(GiaTien[i]);
        }
      }
      entity.GiaTien = parseInt(money);
    }
  } else {
    return res.json(false);
  }
  if (req.query.MaTheLoai != undefined) {
    entity.MaTheLoai = req.query.MaTheLoai.trim();
  } else {
    return res.json(false);
  }
  if (req.query.TTS != undefined) {
    entity.TTS = req.query.TTS.trim();
  } else {
    return res.json(false);
  }
  if (req.query.MaTacGia != undefined) {
    entity.MaTacGia = req.query.MaTacGia.trim();
  } else {
    return res.json(false);
  }
  const rs = await sachModel.updateBook(entity, {MaSach: req.query.MaSach.trim()});
  if (rs.affectedRows == 1) {
    return res.json(true);
  }
  return res.json(false);
});

//chi tiết sách
router.get("/stocker/manager_book/detail", restrict, async (req, res) => {
  let staffInfo = req.session.authUser;
  if (staffInfo.MaBoPhan == "BP01" && staffInfo.MaBoPhan == "BP03") {
    return res.json(false);
  }
  if (req.query.MaSach == undefined) {
    return res.json(false);
  }
  const infoBook = await sachModel.getInfoBookByID(req.query.MaSach.trim());
  for (const book of infoBook) {
    book.GiaTien = book.GiaTien + "VNĐ";
    book.NgayNhap = moment(book.NgayNhap, "YYYY/MM/DD HH:mm:ss").format(
      "DD-MM-YYYY HH:mm:ss",
    );
    book.NgayXuatBan = moment(book.NgayXuatBan, "YYYY/MM/DD").format(
      "DD-MM-YYYY",
    );
  }
  return res.json(infoBook);
});

// khóa sách
router.get("/stocker/manager_book/lock", restrict, async (req, res) => {
  let staffInfo = req.session.authUser;
  if (staffInfo.MaBoPhan == "BP01" && staffInfo.MaBoPhan == "BP03") {
    return res.json(false);
  }
  if (req.query.MaSach == undefined) {
    return res.json(false);
  }
  const rs = await sachModel.blockBook(
    { TTS: "TTS02" },
    { MaSach: req.query.MaSach.trim() },
  );
  if (rs.affectedRows > 0 && rs.changedRows > 0) {
    return res.json(true);
  }
  return res.json(false);
});

module.exports = router;
