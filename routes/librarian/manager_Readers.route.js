const express = require("express");
const moment = require("moment");
const bcrypt = require("bcrypt");
const restrict = require("../../middlewares/auth.mdw");
const nhanvienModel = require("../../models/nhanvienModel");
const lichsuModel = require("../../models/lichsuModel");
const docgiaModel = require("../../models/docgiaModel");
const saltRounds = 12;
const _ = require("lodash");
//const config = require('../config/config.json');
const router = express.Router();
// show list readers
router.get("/manager_readers", restrict, async (req, res) => {
  staffInfo = req.session.authUser;
  if (staffInfo.MaBoPhan != "BP01" && staffInfo.MaBoPhan != "BP02") {
    return res.redirect("/index");
  }
  const dsdg = await docgiaModel.getList();
  for (let value of dsdg) {
    value.NgaySinh = moment(value.NgaySinh, "YYYY/MM/DD").format("DD/MM/YYYY");
    value.NgayLapThe = moment(value.NgayLapThe, "YYYY/MM/DD").format(
      "DD-MM-YYYY hh:mm:ss",
    );
    value.NgaySinh = moment(value.NgaySinh, "YYYY/MM/DD").format("DD/MM/YYYY");
    if(value.TTDG == "TTDG02"){
      value.isDeleted = true;
    }else{
      value.isDeleted = false;
    }
  }
  res.render("librarian/listReaders", { list: dsdg });
});

//Detail
router.get("/manager_readers/detail", restrict, async (req, res) => {
  staffInfo = req.session.authUser;
  if (staffInfo.MaBoPhan != "BP01" && staffInfo.MaBoPhan != "BP02") {
    return res.redirect("/index");
  }
  if(req.query.MaDocGia == undefined){
    return res.json(false);
  }
  const info = await docgiaModel.getInfoReadersByID(req.query.MaDocGia.trim());
  // tính tổng nợ
  const total = await docgiaModel.totalLiabilities(req.query.MaDocGia.trim());
  if(total.length > 0){
    info[0].TongNo = total[0].TongNo;
  }
  info[0].NgaySinh = moment(info[0].NgaySinh).format("DD/MM/YYYY");
  info[0].NgayLapThe = moment(info[0].NgayLapThe).format("DD/MM/YYYY");
  info[0].NgayHetHan = moment(info[0].NgayHetHan).format("DD/MM/YYYY");
  return res.json(info);
});

// add readers
router.get("/manager_readers/add", restrict, async (req, res) => {
  staffInfo = req.session.authUser;
  if (staffInfo.MaBoPhan != "BP01" && staffInfo.MaBoPhan != "BP02") {
    return res.redirect("/index");
  }
  const dsdg = await docgiaModel.getList();
  for (let value of dsdg) {
    value.NgaySinh = moment(value.NgaySinh, "YYYY/MM/DD").format("DD-MM-YYYY");
    value.NgayLapThe = moment(value.NgayLapThe, "YYYY/MM/DD").format(
      "DD-MM-YYYY hh:mm:ss",
    );
    value.NgaySinh = moment(value.NgaySinh, "YYYY/MM/DD").format("DD-MM-YYYY");
  }
  res.render("librarian/addReaders", { list: dsdg });
});

router.get("/manager_readers/add/post", restrict, async (req, res) => {
  const where = {};

  if (staffInfo.MaBoPhan != "BP01" && staffInfo.MaBoPhan != "BP02") {
    return res.redirect("/index");
  }
  const lastId = await docgiaModel.getLastRow();
  if (lastId.length < 1) {
    res.json(false);
  }
  MaDocGia = lastId[0].MaDocGia;
  let numID = parseInt(MaDocGia.slice(MaDocGia.length - 4)) + 1;
  let strnumId = numID.toString();
  for (i = strnumId.length; i < 4; i++) {
    strnumId = "0" + strnumId;
  }

  where.MaDocGia = "DG" + strnumId;
  if (req.query.HoTenDG != undefined) {
    where.HoTenDG = req.query.HoTenDG.trim();
  } else {
    return res.json(false);
  }
  if (req.query.DiaChi != undefined) {
    where.DiaChi = req.query.DiaChi.trim();
  } else {
    return res.json(false);
  }

  if (req.query.CMND_CCCD != undefined) {
    where.CMND_CCCD = req.query.CMND_CCCD.trim();
  } else {
    return res.json(false);
  }

  if (req.query.Email != undefined) {
    where.Email = req.query.Email.trim();
  } else {
    return res.json(false);
  }

  if (req.query.NgaySinh != undefined) {
    where.NgaySinh = req.query.NgaySinh.trim();
  } else {
    return res.json(false);
  }

  if (req.query.MaLoaiDG != undefined) {
    where.MaLoaiDG = req.query.MaLoaiDG.trim();
  } else {
    return res.json(false);
  }

  if (req.query.NgayLapThe != undefined) {
    where.NgayLapThe = req.query.NgayLapThe.trim();
  } else {
    return res.json(false);
  }

  if (req.query.NgayHetHan != undefined) {
    where.NgayHetHan = req.query.NgayHetHan.trim();
  } else {
    return res.json(false);
  }
  where.NVLapThe = staffInfo.MaNhanVien;
  where.NgaySinh = moment(req.query.NgaySinh.trim(), "DD-MM-YYYY").format(
    "YYYY/MM/DD",
  );
  where.NgayHetHan = moment(
    req.query.NgayHetHan.trim(),
    "DD-MM-YYYY HH:mm:ss",
  ).format("YYYY/MM/DD HH:mm:ss");
  where.NgayLapThe = moment(
    req.query.NgayLapThe.trim(),
    "DD-MM-YYYY HH:mm:ss",
  ).format("YYYY/MM/DD HH:mm:ss");
  where.TongNo = 0;
  where.TTDG = "TTDG01";
  const rs = await docgiaModel.addNewReader(where);
  if (rs.affectedRows != 1) {
    return res.json(false);
  }
  res.json(true);
});

// edit
router.get("/manager_readers/edit", restrict, async (req, res) => {
  if (staffInfo.MaBoPhan != "BP01" && staffInfo.MaBoPhan != "BP02") {
    return res.redirect("/index");
  }
  const MaDocGia = req.query.MaDocGia.trim();
  delete req.query.MaDocGia;
  req.query.NgaySinh = moment(req.query.NgaySinh, "DD/MM/YYYY").format("YYYY-MM-DD");
  const rs = await docgiaModel.updateReader(req.query, {MaDocGia: MaDocGia});
  if(rs.affectedRows > 0)
    return res.json(true);
  else{
    return res.json(false);
  }
});

// check passport
router.get(
  "/manager_readers/add/isValidPassPort",
  restrict,
  async (req, res) => {
    if (staffInfo.MaBoPhan != "BP01" && staffInfo.MaBoPhan != "BP02") {
      return res.redirect("/index");
    }
    if (req.query.CMND_CCCD != undefined) {
      const readersInfo = await docgiaModel.getInfoReadersByPassPort(
        req.query.CMND_CCCD.trim(),
      );
      if (readersInfo.length > 0) {
        return res.json(true);
      }
    }
    res.json(false);
  },
);
// check passport
router.get(
  "/manager_readers/add/isValidPassPort/condition",
  restrict,
  async (req, res) => {
    if (staffInfo.MaBoPhan != "BP01" && staffInfo.MaBoPhan != "BP02") {
      return res.redirect("/index");
    }
    if (req.query.CMND_CCCD != undefined && req.query.MaDocGia != undefined) {
      const readersInfo = await docgiaModel.getInfoReadersByPassPortWithManyCondition(
        req.query.CMND_CCCD.trim(),
        req.query.MaDocGia.trim(),
      );
      if (readersInfo.length > 0) {
        return res.json(true);
      }
    }
    res.json(false);
  },
);

// xóa độc giả
router.get("/manager_readers/deleted", restrict, async (req, res) => {
  if (req.query.MaDocGia != undefined) {
    const MaDocGia = req.query.MaDocGia;
    const DelReader = await docgiaModel.deletedReader(
      { TTDG: "TTDG02" },
      { MaDocGia: MaDocGia },
    );
    if (DelReader.affectedRows > 0 && DelReader.changedRows > 0) {
      lichsuModel.addNewHistory({
        MaNhanVien: req.session.authUser.MaNhanVien,
        HanhDong: "Xóa độc giả có MaDocGia là " + MaDocGia,
        NgayThucHien: new Date(),
      });
      return res.json(true);
    }
  } else {
    return res.json(false);
  }
  return res.json(true);
});

module.exports = router;
