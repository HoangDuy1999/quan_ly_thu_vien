const e = require("express");

module.exports = function (app) {
  var bophanModels = require("../models/bophanModel");
  app.use(async function (req, res, next) {
    // khúc này tuy chon session
    if (req.session.isAuthenticated === null) {
      req.session.isAuthenticated = false;
    }
    res.locals.lcIsAuthenticated = req.session.isAuthenticated;
    res.locals.lcAuthUser = req.session.authUser;

    // xử lý cho bộ phận thủ thư
    res.locals.librarian = false;
    res.locals.Stocker = false;
    res.locals.manager = false;
    res.locals.sendOTP = req.cookies["sendOTP"];
    res.locals.MaNhanVien = req.cookies["MaNhanVien"];
    // đã đang nhập
    if (res.locals.lcIsAuthenticated) {
      if (res.locals.lcAuthUser.MaBoPhan == "BP01") {
        res.locals.admin = true;
      }
      if (
        res.locals.lcAuthUser.MaBoPhan == "BP02" ||
        res.locals.lcAuthUser.MaBoPhan == "BP01"
      ) {
        res.locals.librarian = true;
      }
      // xử lý bộ phận thủ kho
      if (
        res.locals.lcAuthUser.MaBoPhan == "BP03" ||
        res.locals.lcAuthUser.MaBoPhan == "BP01"
      ) {
        res.locals.Stocker = true;
      }
      // xử lý ban giám đốc
      if (res.locals.lcAuthUser.MaBoPhan == "BP01") {
        res.locals.BoardOfManager = true;
      } else {
        res.locals.BoardOfManager = false;
      }
      // XỬ LÝ THỦ QUỸ
      if (
        res.locals.lcAuthUser.MaBoPhan == "BP01" ||
        res.locals.lcAuthUser.MaBoPhan == "BP04"
      ) {
        res.locals.treasurer = true;
      } else {
        res.locals.treasurer = false;
      }

      // xử lý hiện tên chức vụ
      if (res.locals.lcAuthUser.MaChucVu != "CV05") {
        res.locals.manager = true;
        const tenbophan = await bophanModels.getNameById(
          res.locals.lcAuthUser.MaBoPhan,
        );
        res.locals.BoPhan = "";
        if (tenbophan && tenbophan[0].MaBoPhan != "BP01") {
          res.locals.BoPhan = "Bộ Phận: " + tenbophan[0].TenBoPhan;
        }
      }
    }
    if (req.session.isAuthenticated === true) {
      res.locals.permission = true;
    }
    next();
  });
};
