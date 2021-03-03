const express = require("express");
const moment = require("moment");
const bcrypt = require("bcrypt");
const restrict = require("../../middlewares/auth.mdw");
const adminModel = require("../../models/adminModel");
const saltRounds = 12;
const _ = require("lodash");
//const config = require('../config/config.json');
const router = express.Router();

router.get("/type", restrict, async (req, res) => {
  let staffInfo = req.session.authUser;
  if (staffInfo.MaBoPhan != "BP01") {
    return res.redirect("/index");
  }
  Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };

  var date = new Date("2020/02/02");
  date.setDate(date.getDate() + 50);
  //console.log(moment("23/05/1999", "DD/MM/YYYY").format("YYYY/MM/DD"));
  console.log(date);
  if (req.query.NgayBatDau != undefined && req.query.NgayKetThuc != undefined) {
    const NgayBatDau = moment(req.query.NgayBatDau.trim(), "DD/MM/YYYY").format(
      "YYYY-MM-DD",
    );
    const NgayKetThuc = moment(
      req.query.NgayKetThuc.trim(),
      "DD/MM/YYYY",
    ).format("YYYY-MM-DD");
    const ListType = await adminModel.getListBookType();
    const countType = await adminModel.getCountTypeBorrow(
      NgayBatDau,
      NgayKetThuc,
    );
    let dict = {};
    let total = 0;
    for (const value of countType) {
      total += value.SoLuong;
      dict[value.MaTheLoai] = value.SoLuong;
    }

    let i = 0;
    for (const val of ListType) {
      val.STT = i++;
      if (dict[val.MaTheLoai] == undefined) {
        val.SoLuong = 0;
        val.TiLe = "0 %";
      } else {
        val.SoLuong = dict[val.MaTheLoai];
        val.TiLe = (parseInt(dict[val.MaTheLoai]) / total) * 100 + " %";
      }
    }
    return res.render("admin/statisticalTypeBook", { ListType, total });
  }
  return res.render("admin/statisticalTypeBook");
});

router.get("/late", restrict, async (req, res) => {
  let staffInfo = req.session.authUser;
  if (staffInfo.MaBoPhan != "BP01") {
    return res.redirect("/index");
  }
  if (req.query.NgayBatDau != undefined && req.query.NgayKetThuc != undefined) {
    const NgayBatDau = moment(req.query.NgayBatDau.trim(), "DD/MM/YYYY").format(
      "YYYY-MM-DD",
    );
    const NgayKetThuc = moment(
      req.query.NgayKetThuc.trim(),
      "DD/MM/YYYY",
    ).format("YYYY-MM-DD");
    const ListLateBook = await adminModel.getListLateBook(
      NgayBatDau,
      NgayKetThuc,
    );
    let i = 0;
    for (const val of ListLateBook) {
      val.NgayMuon = moment(val.NgayMuon).format("DD/MM/YYYY");
      val.STT = i++;
    }
    return res.render("admin/statisticalLateBook", { ListLateBook });
  }
  return res.render("admin/statisticalLateBook");
});

router.get("/forfeit", restrict, async (req, res) => {
  let staffInfo = req.session.authUser;
  if (staffInfo.MaBoPhan != "BP01") {
    return res.redirect("/index");
  }
  if (req.query.NgayBatDau != undefined && req.query.NgayKetThuc != undefined) {
    const NgayBatDau = moment(req.query.NgayBatDau.trim(), "DD/MM/YYYY").format(
      "YYYY-MM-DD",
    );
    const NgayKetThuc = moment(
      req.query.NgayKetThuc.trim(),
      "DD/MM/YYYY",
    ).format("YYYY-MM-DD");
    const ListReaderForeit = await adminModel.getListReaderForeit(
      NgayBatDau,
      NgayKetThuc,
    );
    let i = 0;
    let total = 0;
    for (const val of ListReaderForeit) {
      val.STT = i++;
      total += val.TienNo;
      val.TienNo = parseInt(val.TienNo).toLocaleString("it-IT", {
        style: "currency",
        currency: "VND",
      });
    }
    total = parseInt(total).toLocaleString("it-IT", {
      style: "currency",
      currency: "VND",
    });

    return res.render("admin/statisticalReaderForeit", {
      ListReaderForeit,
      total,
    });
  }
  return res.render("admin/statisticalReaderForeit");
});

module.exports = router;
