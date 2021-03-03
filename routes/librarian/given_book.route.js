const express = require("express");
const moment = require("moment");
const bcrypt = require("bcrypt");
const restrict = require("../../middlewares/auth.mdw");
const phieumuonsachModel = require("../../models/phieumuonsachModel");
const phieutrasachModel = require("../../models/phieutrasachModel");
const chitietphieumuonsachModel = require("../../models/chitietphieumuonsachModel");
const chitietphieutrasachModel = require("../../models/chitietphieutrasachModel");
const lichsuModel = require("../../models/lichsuModel");
const matsachModel = require("../../models/matsachModel");
const docgiaModel = require("../../models/docgiaModel");
const sachModel = require("../../models/sachModel");
const _ = require("lodash");
const saltRounds = 12;
//const config = require('../config/config.json');
const router = express.Router();
// show list card borrow book
router.get("/give_book", restrict, async (req, res) => {
  const staffInfo = req.session.authUser;
  if (staffInfo.MaBoPhan != "BP01" && staffInfo.MaBoPhan != "BP02") {
    return res.redirect("/index");
  }
  const lists = await phieutrasachModel.getListJoinManyTable();
  for (const val of lists) {
    val.NgayMuon = moment(val.NgayMuon, "YYYY/MM/DD").format("DD-MM-YYYY");
    val.NgayHetHan = moment(val.NgayHetHan, "YYYY/MM/DD").format("DD-MM-YYYY");
    val.NgayTra = moment(val.NgayMuon, "YYYY/MM/DD").format("DD-MM-YYYY");
    val.TinhTrang = "Hoạt động";
    temp = parseInt(val.TienPhatKyNay);
    val.TienPhatKyNay = temp.toLocaleString("it-IT", {
      style: "currency",
      currency: "VND",
    });
    if (val.MaPhieuThu != null) {
      val.IsDeleted = true;
      val.TinhTrang = "Đã có phiếu thu tiền phạt";
    } else {
      val.IsDeleted = false;
      if (val.DaXoa) {
        val.IsDeleted = true;
        val.TinhTrang = "Đã xóa";
      } else {
        val.IsDeleted = false;
      }
    }
  }
  res.render("librarian/listGiveBook", { lists });
});

router.get("/give_book/detail", restrict, async (req, res) => {
  const staffInfo = req.session.authUser;
  if (staffInfo.MaBoPhan != "BP01" && staffInfo.MaBoPhan != "BP02") {
    return res.redirect("/index");
  }
  if (req.query.maPT == undefined) {
    return res.json(false);
  }
  const info = await phieutrasachModel.fullDetailByID(req.query.maPT.trim());
  if (info.length < 1) {
    res.json(false);
  }
  info[0].NgayTra = moment(info[0].NgayTra, "YYYY-MM-DD HH:mm:ss").format(
    "DD-MM-YYYY",
  );
  info[0].NgayMuon = moment(info[0].NgayMuon, "YYYY-MM-DD HH:mm:ss").format(
    "DD-MM-YYYY",
  );
  info[0].NgayHetHan = moment(info[0].NgayHetHan, "YYYY-MM-DD HH:mm:ss").format(
    "DD-MM-YYYY",
  );

  res.json(info[0]);
});

router.get("/give_book/detailCardGiveBook", restrict, async (req, res) => {
  const staffInfo = req.session.authUser;
  if (staffInfo.MaBoPhan != "BP01" && staffInfo.MaBoPhan != "BP02") {
    return res.redirect("/index");
  }
  if (req.query.maPT == undefined) {
    return res.json(false);
  }
  const info = await chitietphieutrasachModel.getDataByID(
    req.query.maPT.trim(),
  );
  if (info.length < 1) {
    return res.json(false);
  }
  for (const val of info) {
    if (parseInt(val.TienPhat) > 0) {
      val.LyDo = "Mất sách";
    } else {
      val.LyDo = "";
    }
  }
  return res.json(info);
});

router.get("/give_book/add", restrict, async (req, res) => {
  const staffInfo = req.session.authUser;
  if (staffInfo.MaBoPhan != "BP01" && staffInfo.MaBoPhan != "BP02") {
    return res.redirect("/index");
  }
  let listCardBorrowBook = await phieumuonsachModel.getListConditionIsDeleted();
  listCardBorrowBook = listCardBorrowBook.filter(
    (v, i, a) => a.findIndex((t) => t.MaPM === v.MaPM) === i,
  );
  _.remove(listCardBorrowBook, function (e) {
    return e.MaPT != null && e.ptsDaXoa == 0;
  });
  res.render("librarian/addGiveBook", { listCardBorrowBook });
});

router.get(
  "/give_book/getInfoDetailCardBorrowBook",
  restrict,
  async (req, res) => {
    const staffInfo = req.session.authUser;
    if (staffInfo.MaBoPhan != "BP01" && staffInfo.MaBoPhan != "BP02") {
      return res.json(false);
    }
    if (req.query.MaPM == undefined) {
      return res.json(false);
    }
    const data = await chitietphieumuonsachModel.getListForMat(
      req.query.MaPM.trim(),
    );
    if (data.length < 1) {
      return res.json(false);
    }
    let i = 1;
    for (const item of data) {
      item.STT = i;
      i++;
      item.LyDo = "Mất sách";
      item.NgayMuon = moment(item.NgayMuon, "YYYY/MM/DD").format("DD-MM-YYYY");
      if (item.TienPhat == null || item.TienPhat == 0) {
        item.TienPhat = "0 đ";
        item.LyDo = "";
        item.NutMatSach = true;
      } else {
        item.NutMatSach = false;
      }
    }
    return res.json(data);
  },
);

router.get("/give_book/calculation", restrict, async (req, res) => {
  const staffInfo = req.session.authUser;
  let str = "";
  if (staffInfo.MaBoPhan != "BP01" && staffInfo.MaBoPhan != "BP02") {
    return res.json(false);
  }

  if (req.query.MaPM == undefined) {
    return res.json(false);
  }

  // Tính số ngày trễ
  const lateDays = await phieumuonsachModel.calculationLateDate(
    req.query.MaPM.trim(),
  );
  let tienPhat = 0;
  if (lateDays.length < 1) {
    return res.json(false);
  }
  if (lateDays[0].days <= 0) {
    str += "0 ngày-";
  } else {
    tienPhat = lateDays[0].days * 1000;
    str += `${lateDays[0].days} ngày-`;
  }
  // tính tiền phạt của phiếu Này
  str += `${tienPhat}-${tienPhat}-`;
  //tính tổng tiền phạt
  const InfoMoney = await phieutrasachModel.TotalLiabilities(lateDays[0].MaDG);
  if (InfoMoney.length < 1) {
    return res.json(false);
  }

  const tongTienNo = InfoMoney[0].tongtienno + tienPhat;
  str += `${tongTienNo}-${lateDays[0].MaDG}`;
  return res.json(str);
});

router.get("/give_book/add/post", restrict, async (req, res) => {
  const staffInfo = req.session.authUser;
  if (staffInfo.MaBoPhan != "BP01" && staffInfo.MaBoPhan != "BP02") {
    return res.redirect("/index");
  }

  let obj = {}; // Thông tin phiếu trả
  let aBooks = [];
  obj.MaNVTN = staffInfo.MaNhanVien;
  if (req.query.MaPM == undefined) {
    return res.json(false);
  } else {
    obj.MaPM = req.query.MaPM.trim();
  }
  if (req.query.MaDocGia == undefined) {
    return res.json(false);
  } else {
    obj.MaDocGia = req.query.MaDocGia.trim();
  }
  if (req.query.SoNgayTraTre == undefined) {
    return res.json(false);
  } else {
    obj.SoNgayTraTre = parseInt(req.query.SoNgayTraTre.trim());
  }
  if (req.query.NgayTra == undefined) {
    return res.json(false);
  } else {
    obj.NgayTra = moment(req.query.NgayTra, "DD/MM/YYYY").format("YYYY-MM-DD");
  }
  if (req.query.TIENPHATKYNAY == undefined) {
    return res.json(false);
  } else {
    obj.TienPhatKyNay = parseInt(req.query.TIENPHATKYNAY);
  }
  if (req.query.TIENNO == undefined) {
    return res.json(false);
  } else {
    obj.TIENNO = parseInt(req.query.TIENNO);
  }
  if (req.query.aBooks == undefined) {
    return res.json(false);
  } else {
    aBooks = req.query.aBooks.split(",");
  }
  // THÊM PHIẾU TRẢ SÁCH
  // phát sinh mã phiêu trả
  obj.MaPT = "PT000001";
  const lastRowInfo = await phieutrasachModel.getLastRow();
  if (lastRowInfo.length > 0) {
    let MaPT = lastRowInfo[0].MaPT;
    let numID = parseInt(MaPT.slice(MaPT.length - 6)) + 1;
    let strnumId = numID.toString();
    for (i = strnumId.length; i < 6; i++) {
      strnumId = "0" + strnumId;
    }
    obj.MaPT = "PT" + strnumId;
  }
  const newCardGiveBook = await phieutrasachModel.addCardGivenBook(obj);
  if (newCardGiveBook.affectedRows < 1) {
    return res.json(false);
  }
  // THÊM CHI TIẾT PHIẾU TRẢ SÁCH
  for (const val of aBooks) {
    let temp = val.split("==");
    if (temp.length > 3) {
      temp[4] = parseInt(temp[4]);
      temp[2] = moment(temp[2], "DD-MM-YYYY").format("YYYY-MM-DD");
      temp[3] = parseInt(temp[3]);
      const newDetailCardgivenBook = await chitietphieutrasachModel.addDetailGivenBook(
        {
          MaPT: obj.MaPT,
          MaSach: temp[0].trim(),
          NgayMuon: temp[2].trim(),
          SoNgayMuon: temp[3],
          TienPhat: temp[4],
        },
      );
      if (newDetailCardgivenBook.affectedRows < 1) {
        // xóa phiếu trả
        await phieutrasachModel.deletedCardGiveBook(
          { DaXoa: 0 },
          { MaPT: obj.MaPT },
        );
        await chitietphieutrasachModel.deletedCardGiveBook({ MaPT: obj.MaPT });
        return res.json(false);
      }
      if (temp[4] > 0) {
        // mất sách
        const rs = matsachModel.addNewLostBook({
          MaPT: obj.MaPT,
          MaSach: temp[0].trim(),
          NgayGhiNhan: obj.NgayTra,
          MaDG: obj.MaDocGia,
          TienPhat: temp[4],
          MaNVTN: obj.MaNVTN,
        });
        if (rs.affectedRows < 1) {
          // xóa phiếu trả
          await phieutrasachModel.deletedCardGiveBook(
            { DaXoa: 0 },
            { MaPT: obj.MaPT },
          );
          await chitietphieutrasachModel.deletedCardGiveBook({
            MaPT: obj.MaPT,
          });
          await matsachModel.deletedLostBook({ DaXoa: 1 }, { MaPT: obj.MaPT });
          return res.json(false);
        }
      }
    }
  }
  // cập nhật lại số lượng sách
  for (const val of aBooks) {
    let temp = val.split("==");
    temp[4] = parseInt(temp[4]);
    temp[2] = moment(temp[2], "DD-MM-YYYY").format("YYYY-MM-DD");
    temp[3] = parseInt(temp[3]);
    // cập nhật lại số lượng đã mượn
    const infoBook = await sachModel.getInfoBookByID(temp[0].trim());
    if (temp[4] < 1) {
      if (infoBook.length > 0) {
        await sachModel.updateBook(
          { SoLuongDaMuon: parseInt(infoBook[0].SoLuongDaMuon) - 1 },
          { MaSach: temp[0].trim() },
        );
      }
    } else {
      // cập nhật lại số lượng đã mượn và số lượng thực tế
      if (infoBook.length > 0) {
        await sachModel.updateBook(
          {
            SoLuongDaMuon: parseInt(infoBook[0].SoLuongDaMuon) - 1,
            SoLuong: parseInt(infoBook[0].SoLuong) - 1,
          },
          { MaSach: temp[0].trim() },
        );
      }
    }
  }
  res.json(true);
});

router.get("/give_book/deleted", restrict, async (req, res) => {
  const staffInfo = req.session.authUser;
  if (staffInfo.MaBoPhan != "BP01" && staffInfo.MaBoPhan != "BP02") {
    return res.redirect("/index");
  }
  if (req.query.MaPT == undefined) {
    res.json(false);
  }
  // cập nhật phiếu trả thành đã xóa
  const updateCardGvie = await phieutrasachModel.deletedCardGiveBook(
    { DaXoa: 1 },
    { MaPT: req.query.MaPT.trim() },
  );
  // update thành công
  if (updateCardGvie.affectedRows > 0) {
    // lấy chi tiết phiếu trả
    const infoDetail = await chitietphieutrasachModel.getDataByID(
      req.query.MaPT.trim(),
    );
    if (infoDetail.lenght < 1) {
      // không lấy được ct phiếu trả
      await phieutrasachModel.deletedCardGiveBook(
        { DaXoa: 0 },
        { MaPT: req.query.MaPT.trim() },
      );
      res.json(false);
    } else {
      // update chi tiết phiếu trả
      const updateDetailCard = chitietphieutrasachModel.updateDetailGivenBook(
        { DaXoa: 1 },
        { MaPT: req.query.MaPT.trim() },
      );
      if (updateDetailCard.affectedRows < 1) {
        // update ct phiếu trả không thành công
        await phieutrasachModel.deletedCardGiveBook(
          { DaXoa: 0 },
          { MaPT: req.query.MaPT.trim() },
        );
        res.json(false);
      } else {
        // cập nhật lại số lượng
        for (const val of infoDetail) {
          if (parseInt(val.TienPhat) > 0) {
            await sachModel.updateBook(
              {
                SoLuong: parseInt(val.SoLuong + 1),
                SoLuongDaMuon: parseInt(val.SoLuongDaMuon + 1),
              },
              { MaSach: val.MaSach },
            );
          } else {
            await sachModel.updateBook(
              {
                SoLuongDaMuon: parseInt(val.SoLuongDaMuon + 1),
              },
              { MaSach: val.MaSach },
            );
          }
          // cập nhật mât sach
          await matsachModel.deletedLostBook(val.MaSach, req.query.MaPT.trim());
        }
        res.json(true);
      }
    }
  } else {
    return res.json(false);
  }
});

module.exports = router;
