const express = require("express");
const moment = require("moment");
const bcrypt = require("bcrypt");
const nhanvienModel = require("../models/nhanvienModel");
const sachModel = require("../models/sachModel");
const theloaisachModel = require("../models/theloaisachModel");
const tacgiaModel = require("../models/tacgiaModel");
const nhaxuatbanModel = require("../models/nhaxuatbanModel");
const saltRounds = 12;
const restrict = require("../middlewares/auth.mdw");
const _ = require("lodash");
//const config = require('../config/config.json');
const router = express.Router();
function restrict_login(req, res) {
  if (req.session.isAuthenticated) {
    return res.redirect(`/index`);
  }
  return true;
}
router.get("/index", (req, res) => {
  res.render("home", { title: true });
});
// phần tìm kiếm sách
router.get("/search_book", (req, res) => {
  res.render("searchBook");
});
// trả dữ liệu tìm kiếm sách
router.get("/index/search_book/post", async (req, res) => {
  if (req.query.key == undefined) {
    return res.json("1001");
  }
  key = req.query.key;
  // tìm tên thể loại chuyển thành mã
  let result = await theloaisachModel.searchTypeBook(req.query.key);
  if (result.length > 0) {
    for (const value of result) {
      key = key + " " + value.MaTheLoai;
    }
  }
  // tìm tên tác giả chuyển thành mã tác giả
  result = await tacgiaModel.searchAuthors(req.query.key);
  if (result.length > 0) {
    for (const value of result) {
      key = key + " " + value.MaTacGia;
    }
  }
  // tìm tên nhà xuất bản chuyển thành mã nhà xuất bản
  result = await nhaxuatbanModel.searchPublishingCompany(req.query.key);
  if (result.length > 0) {
    for (const value of result) {
      key = key + " " + value.MaNXB;
    }
  }
  // result = await nhaxuatbanModel.searchLike(req.query.key);
  // if (result.length > 0) {
  //   for (const value of result) {
  //     key = key + " " + value.MaNXB;
  //   }
  // }
  let arrBook = [];
  console.log(key);
  const Atblbook = await sachModel.searchBook(key);
  if (Atblbook.length < 1) {
    return res.json("1001");
  }
  for (const book of Atblbook) {
    book.NgayXuatBan = moment(book.NgayXuatBan, "YYYY/MM/DD").format(
      "DD-MM-YYYY",
    );
  }
  return res.json(Atblbook);
});
//KHÚC NÀY CỦA PHẦN LOGIN
router.get("/login", (req, res) => {
  if (restrict_login(req, res)) {
    if (typeof req.cookies["Sdt"] !== "undefined") {
      res.render("login", {
        Sdt: req.cookies["Sdt"],
        MatKhau: req.cookies["MatKhau"],
      });
    } else {
      res.render("login");
    }
  }
});

router.post("/login", async function (req, res) {
  if (req.body.rememberpass) {
    res.cookie("Sdt", req.body.Sdt);
    res.cookie("MatKhau", req.body.MatKhau);
  }
  const nhanvien = await nhanvienModel.getInfoByPhone(req.body.Sdt);
  if (nhanvien.length > 0) {
    req.session.isAuthenticated = true;
    nhanvien[0].sendOTP = false;
    req.session.authUser = nhanvien[0];
  }
  const url = req.query.retUrl || "/index";
  if (url == "http://localhost:3000/login?retUrl=/account/logout") {
    url = "/index";
  }
  if (req.session.authUser.r_ID == 4) {
    const urladmin = req.query.retUrl || "/admin";
    return res.redirect(urladmin);
  } else {
    return res.redirect(url);
  }
});

router.get("/login/is-available", async function (req, res) {
  const nhanvien = await nhanvienModel.getInfoByPhone(req.query.Sdt);
  if (!nhanvien || nhanvien.length < 1) {
    res.json(false);
  } else {
    const MatKhau = req.query.MatKhau;
    if (MatKhau.length > 7) {
      if (!bcrypt.compareSync(MatKhau, nhanvien[0].MatKhau)) {
        return res.json(false);
      }
    }
    res.json(true);
  }
});
//KHÚC NÀY QUÊN MẬT KHẨU
router.get("/login/forgotpassword", async (req, res) => {
  res.render("forgotPassWord");
});

router.get("/login/forgotpassword/isExistsPhone", async (req, res) => {
  const staffInfo = await nhanvienModel.getInfoByPhone(req.query.Sdt);
  if (staffInfo.length > 0) {
    res.cookie("MaNhanVien", staffInfo[0].MaNhanVien);
    res.cookie("sendOTP", true);
    return res.json(true);
  } else {
    return res.json(false);
  }
});

router.get("/login/forgotpassword/turnoffOtp", async (req, res) => {
  res.cookie("sendOTP", false);
  res.json(true);
});
router.get("/login/forgotpassword/changePassWord", async (req, res) => {
  const MatKhau = await bcrypt.hash(req.query.MatKhau, saltRounds);
  const updatePassWord = await nhanvienModel.updateStaffPassWord(
    { MatKhau: MatKhau },
    { MaNhanVien: res.locals.MaNhanVien },
  );
  if (updatePassWord.affectedRows == 1) {
    res.cookie("MaNhanVien", "");
    return res.json(true);
  } else {
    return res.json(false);
  }
});

//KHÚC NÀY CỦA PROFILE
router.get("/profile", restrict, async (req, res) => {
  const staffInfo = await nhanvienModel.getFullInfoByMaNV(
    req.session.authUser.MaNhanVien,
  );
  let isSuccess = false;
  if (staffInfo.length > 0) {
    isSuccess = true;
    let tempdate = moment(staffInfo[0].NgaySinh, "YYYY/MM/DD").format(
      "DD-MM-YYYY",
    );
    const arr = tempdate.split("-");
    tempdate = "";
    for (i = 0; i < 2; i++) {
      tempdate = tempdate + arr[i] + "/";
    }
    tempdate += arr[2];

    return res.render("profile", {
      isSuccess: isSuccess,
      HoTenNV: staffInfo[0].HoTenNV.trim(),
      GioiTinh: staffInfo[0].GioiTinh.trim(),
      DiaChi: staffInfo[0].DiaChi.trim(),
      Sdt: staffInfo[0].Sdt.trim(),
      NgaySinh: tempdate.trim(),
      TenBangCap: staffInfo[0].LoaiBangCap,
      TenBoPhan: staffInfo[0].TenBoPhan,
      TenChucVu: staffInfo[0].TenChucVu,
    });
  }
  return res.render("profile", { isSuccess });
});

router.get("/profile/isValidPhone", restrict, async (req, res) => {
  const staffInfo = await nhanvienModel.getInfoByPhoneAndExceptId(
    req.query.Sdt,
    req.session.authUser.MaNhanVien,
  );
  if (staffInfo.length > 0) {
    return res.json(true);
  } else {
    return res.json(false);
  }
});

router.get("/profile/updateStaff", restrict, async (req, res) => {
  const objwhere = {};
  if (req.query.HoTenNV != "undefined") {
    objwhere.HoTenNV = req.query.HoTenNV;
  }
  if (req.query.GioiTinh != "undefined") {
    objwhere.GioiTinh = req.query.GioiTinh;
  }
  if (req.query.Sdt != "undefined") {
    objwhere.Sdt = req.query.Sdt;
  }
  if (req.query.NgaySinh != "undefined") {
    objwhere.NgaySinh = moment(req.query.NgaySinh, "DD-MM-YYYY").format(
      "YYYY/MM/DD",
    );
  }
  if (req.query.DiaChi != "undefined") {
    objwhere.DiaChi = req.query.DiaChi;
  }

  const updateStaff = await nhanvienModel.updateStaff(objwhere, {
    ManhanVien: req.session.authUser.MaNhanVien,
  });

  if (updateStaff.affectedRows == 1) {
    req.session.authUser.HoTenNV = objwhere.HoTenNV;
    return res.json(true);
  } else {
    return res.json(false);
  }
});

router.get("/profile/changePassWord", restrict, async (req, res) => {
  const MatKhau = await bcrypt.hash(req.query.MatKhau, saltRounds);
  const updatePassWord = await nhanvienModel.updateStaffPassWord(
    { MatKhau: MatKhau },
    { MaNhanVien: req.session.authUser.MaNhanVien },
  );
  if (updatePassWord.affectedRows == 1) {
    req.session.authUser.MatKhau = MatKhau;
    return res.json(true);
  } else {
    return res.json(false);
  }
});

router.get(
  "/profile/changePassWord/isValidPassWord",
  restrict,
  async (req, res) => {
    if (
      bcrypt.compareSync(
        req.query.MatKhau,
        req.session.authUser.MatKhau.toString().trim(),
      )
    ) {
      return res.json(true);
    } else {
      return res.json(false);
    }
  },
);

//LOGOUT
router.post("/logout", restrict, async function (req, res) {
  req.session.isAuthenticated = false;
  req.session.authUser = null;
  res.redirect(req.headers.referer);
});

module.exports = router;
