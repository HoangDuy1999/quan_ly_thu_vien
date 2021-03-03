const express = require("express");
const moment = require("moment");
const bcrypt = require("bcrypt");
const restrict = require("../../middlewares/auth.mdw");
const phieuthutienphatModel = require("../../models/phieuthutienphatModel");
const phieutrasachModel = require("../../models/phieutrasachModel");
const saltRounds = 12;
const _ = require("lodash");
//const config = require('../config/config.json');
const router = express.Router();

router.get("/forfeit", restrict, async (req, res) => {
  let staffInfo = req.session.authUser;
  if (staffInfo.MaBoPhan == "BP02" && staffInfo.MaBoPhan == "BP03") {
    return res.redirect("/index");
  }
  // lấy danh sách phiếu thu
  const lists = await phieuthutienphatModel.getList();
  for (const val of lists) {
    val.NgayThu = moment(val.NgayThu, "YYYY-MM-DD").format("DD-MM-YYYY");
    val.SoTienThu = parseInt(val.SoTienThu).toLocaleString("it-IT", {
      style: "currency",
      currency: "VND",
    });
  }
  res.render("treasurer/listForfeit", { lists });
});

router.get("/forfeit/add", restrict, async (req, res) => {
  let staffInfo = req.session.authUser;
  if (staffInfo.MaBoPhan == "BP02" && staffInfo.MaBoPhan == "BP03") {
    return res.redirect("/index");
  }
  // lấy thông tin các phiếu trả
  const lists = await phieutrasachModel.getDetailIntoTreasurer();
  _.remove(lists, function (e) {
    return e.TienNo == 0;
  });
  res.render("treasurer/addForfeit", { lists });
});
router.get("/forfeit/add/post", restrict, async (req, res) => {
  let staffInfo = req.session.authUser;
  if (staffInfo.MaBoPhan == "BP02" && staffInfo.MaBoPhan == "BP03") {
    return res.redirect("/index");
  }
  const entity = {};
  if (req.query.MaPT == undefined) {
    return res.json(false);
  } else {
    entity.MaPT = req.query.MaPT.trim();
  }
  if (req.query.TienThu == undefined) {
    return res.json(false);
  } else {
    entity.SoTienThu = parseInt(req.query.TienThu.trim());
  }
  if (req.query.NgayThu == undefined) {
    return res.json(false);
  } else {
    entity.NgayThu = moment(req.query.NgayThu.trim(), "DD/MM/YYYY").format(
      "YYYY-MM-DD",
    );
  }
  entity.MaNV = staffInfo.MaNhanVien;
  const rs = await phieuthutienphatModel.addCard(entity);
  if (rs.affectedRows > 0) {
    const result = await phieutrasachModel.updateMoney(
      { TienNo: 0 },
      { MaPT: req.query.MaPT.trim() },
    );
    if (result.affectedRows > 0) {
      return res.json(true);
    } else {
      await phieuthutienphatModel.deletedCard({ MaPT: req.query.MaPT.trim() });
      return res.json(false);
    }
  } else {
    return res.json(false);
  }
});
module.exports = router;
