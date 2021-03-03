const express = require("express");
const moment = require("moment");
const restrict = require("../../middlewares/auth.mdw");
const sachModel = require("../../models/sachModel");
const matsachModel = require("../../models/matsachModel");
const thanhlysachModel = require("../../models/thanhlysachModel");
const lydothanhlyModel = require("../../models/lydothanhlyModel");
const chitietphieuthanhlyModel = require("../../models/chitietphieuthanhlyModel");
const saltRounds = 12;
const router = express.Router();
router.get("/stocker/book_liquidation", restrict, async (req, res) => {
  let staffInfo = req.session.authUser;
  if (staffInfo.MaBoPhan == "BP01" && staffInfo.MaBoPhan == "BP03") {
    return res.redirect("/index");
  }
  const lists = await thanhlysachModel.getList();
  const listBook = await chitietphieuthanhlyModel.getBookNotLiquidation();
  for (const val of lists) {
    val.NgayThanhLy = moment(val.NgayThanhLy, "YYYY/MM/DD HH:mm:ss").format(
      "DD/MM/YYYY",
    );
  }
  res.render("stocker/listLiquidationBook", { lists, listBook });
});

router.get("/stocker/book_liquidation/add", restrict, async (req, res) => {
  let staffInfo = req.session.authUser;
  if (staffInfo.MaBoPhan == "BP01" && staffInfo.MaBoPhan == "BP03") {
    return res.redirect("/index");
  }
  const infoReason = await lydothanhlyModel.getList();
  const listBook = await sachModel.getFullLists();
  for (const val of listBook) {
    val.SoLuong = val.SoLuong - val.SoLuongDaMuon;
  }
  res.render("stocker/addLiquidationBook", { infoReason, listBook });
});

router.get("/stocker/book_liquidation/add/post", restrict, async (req, res) => {
  let staffInfo = req.session.authUser;
  if (staffInfo.MaBoPhan == "BP01" && staffInfo.MaBoPhan == "BP03") {
    return res.redirect("/index");
  }
  let entity = {};
  let aBook = [];
  entity.MaNV = staffInfo.MaNhanVien;
  if (req.query.LyDoThanhLy == undefined) {
    return res.json(false);
  } else {
    entity.LyDoThanhLy = req.query.LyDoThanhLy.trim();
  }
  if (req.query.NgayThanhLy == undefined) {
    return res.json(false);
  } else {
    entity.NgayThanhLy = moment(
      req.query.NgayThanhLy.trim(),
      "DD/MM/YYYY",
    ).format("YYYY-MM-DD");
  }
  if (req.query.aBook == undefined) {
    return res.json(false);
  } else {
    let temp = req.query.aBook.trim().split(",");
    for (const val of temp) {
      const aInfo = val.split("-");
      aBook.push({
        MaSach: aInfo[0].trim(),
        SoLuong: parseInt(aInfo[1].trim()),
      });
    }
  }
  if (aBook.lenght < 1) {
    return res.json(false);
  }
  // thêm phiêu thanh lý
  let lastId = await thanhlysachModel.getLastRow();
  if (lastId.length < 1) {
    entity.MaPhieuThanhLy = "PTT000001";
  } else {
    MaPhieuThanhLy = lastId[0].MaPhieuThanhLy;
    let numID = parseInt(MaPhieuThanhLy.slice(MaPhieuThanhLy.length - 6)) + 1;
    let strnumId = numID.toString();
    for (i = strnumId.length; i < 6; i++) {
      strnumId = "0" + strnumId;
    }
    entity.MaPhieuThanhLy = "PTT" + strnumId;
  }
  const NewLiquidation = await thanhlysachModel.addLiquidation(entity);
  // thêm chi tiêt phiếu thanh lý
  if (NewLiquidation.affectedRows > 0) {
    for (const value of aBook) {
      const infoBook = await sachModel.getInfoBookByBookID(value.MaSach);
      if (infoBook.length > 0) {
        const rs = await chitietphieuthanhlyModel.addDetailLiquidation({
          MaPhieuThanhLy: entity.MaPhieuThanhLy,
          MaSach: value.MaSach,
          SoLuong: value.SoLuong,
        });
        if (rs.affectedRows > 0) {
          await sachModel.updateBook(
            { SoLuong: infoBook[0].SoLuong - value.SoLuong },
            { MaSach: value.MaSach },
          );
        }
      }
    }
    return res.json(true);
  } else {
    return res.json(false);
  }
});

router.get("/stocker/book_liquidation/detail", restrict, async (req, res) => {
  let staffInfo = req.session.authUser;
  if (staffInfo.MaBoPhan == "BP01" && staffInfo.MaBoPhan == "BP03") {
    return res.redirect("/index");
  }
  const data = await chitietphieuthanhlyModel.getDetailByID(
    req.query.MaPhieuThanhLy.trim(),
  );
  res.json(data);
});

router.get(
  "/stocker/book_liquidation/add/direct",
  restrict,
  async (req, res) => {
    let staffInfo = req.session.authUser;
    let entity = {};
    entity.MaNV = staffInfo.MaNhanVien;
    if (staffInfo.MaBoPhan == "BP01" && staffInfo.MaBoPhan == "BP03") {
      return res.redirect("/index");
    }
    if (req.query.MaSach == undefined) {
      return res.json(false);
    }
    if (req.query.MaPT == undefined) {
      return res.json(false);
    }
    //thêm phiếu thanh lý
    let lastId = await thanhlysachModel.getLastRow();
    if (lastId.length < 1) {
      entity.MaPhieuThanhLy = "PTT000001";
    } else {
      MaPhieuThanhLy = lastId[0].MaPhieuThanhLy;
      let numID = parseInt(MaPhieuThanhLy.slice(MaPhieuThanhLy.length - 6)) + 1;
      let strnumId = numID.toString();
      for (i = strnumId.length; i < 6; i++) {
        strnumId = "0" + strnumId;
      }
      entity.MaPhieuThanhLy = "PTT" + strnumId;
    }
    entity.NgayThanhLy = moment(new Date()).format("YYYY-MM-DD");
    entity.LyDoThanhLy = "LDTL002";
    const NewLiquidation = await thanhlysachModel.addLiquidation(entity);
    // thêm chi tiết phiếu thanh lý
    if (NewLiquidation.affectedRows > 0) {
      const rs = await chitietphieuthanhlyModel.addDetailLiquidation({
        MaPhieuThanhLy: entity.MaPhieuThanhLy,
        MaSach: req.query.MaSach.trim(),
        SoLuong: 1,
      });
      if (rs.affectedRows == 0) {
        await thanhlysachModel.deletedLiquidation({
          MaPhieuThanhLy: entity.MaPhieuThanhLy,
        });
        return res.json(false);
      } else {
        await matsachModel.updateLostBook(
          req.query.MaPT.trim(),
          req.query.MaSach.trim(),
        );
        return res.json(true);
      }
    } else {
      return res.json(false);
    }
  },
);
module.exports = router;
