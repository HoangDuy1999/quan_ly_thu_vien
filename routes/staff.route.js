const express = require("express");
const moment = require("moment");
const restrict = require("../middlewares/auth.mdw");
const nhanvienModel = require("../models/nhanvienModel");
const lichsuModel = require("../models/lichsuModel");
const bophanModel = require("../models/bophanModel");
const chucvuModel = require("../models/chucvuModel");
const bangcapModel = require("../models/bangcapModel");
const saltRounds = 12;
const bcrypt = require("bcrypt");
const e = require("express");
const router = express.Router();
// xử lý CRUD bộ phận thủ thư
// danh sách
router.get("/staff", restrict, async (req, res) => {
  staffInfo = req.session.authUser;
  if (staffInfo.MaChucVu == "CV05") {
    return res.redirect("/index");
  }
  // Nếu là bộ phân thuộc giám đốc
  let listSTaffs = [];
  if (staffInfo.MaBoPhan == "BP01") {
    if (staffInfo.MaChucVu == "CV01") {
      listSTaffs = await nhanvienModel.getListStaffDirector();
    } else {
      listSTaffs = await nhanvienModel.getListStaffDirectorRemoveDirector();
    }
  } else {
    // phó phòng cấp bộ phận thủ thư, thủ quý, thủ kho
    let where = "undefined";
    if (staffInfo.MaChucVu == "CV04") {
      where = "CV03";
    }
    // trưởng phòng từng bộ phận
    listSTaffs = await nhanvienModel.getListStaff(
      staffInfo.MaChucVu,
      where,
      staffInfo.MaBoPhan,
    );
  }
  for (let value of listSTaffs) {
    value.NgaySinh = moment(value.NgaySinh, "YYYY/MM/DD").format("DD-MM-YYYY");
  }
  res.render("listStaff", { list: listSTaffs });
});

//khúc này nhân viên
router.get("/staff/add", restrict, async (req, res) => {
  staffInfo = req.session.authUser;
  if (staffInfo.MaChucVu == "CV05") {
    return res.redirect("/index");
  }
  //Lấy ra chức vụ
  // Tổng giám đốc thêm được phó giám đốc, trưởng phòng, phó phòng, nhân viên các bộ phận
  let conditions = "('CV01'";
  // Phó giám đốc thêm được trưởng phòng, phó phòng, nhân viên các bộ phận
  if (staffInfo.MaChucVu == "CV02") {
    conditions = conditions + "," + "'CV02'";
  }
  // trường phòng thêm được phó phòng, nhân viên thuộc bộ phận của mình
  if (staffInfo.MaChucVu == "CV03") {
    conditions = conditions + "," + "'CV02'" + "," + "'CV03'";
  }
  if (staffInfo.MaChucVu == "CV04") {
    conditions = conditions + "," + "'CV02'" + "," + "'CV03'" + "," + "'CV04'";
  }
  conditions = conditions + ")";
  const positionsInfo = await chucvuModel.getPosition(conditions);
  //Lấy ra bộ phận
  let partInfos = [];
  if (staffInfo.MaBoPhan == "BP01") {
    if (staffInfo.MaChucVu == "CV02") {
      partInfos = await bophanModel.GetFullInFoParts("BP01");
    } else {
      partInfos = await bophanModel.GetFullInFoParts();
    }
  } else {
    partInfos = await bophanModel.getInfoPartbyMaBP(staffInfo.MaBoPhan);
  }
  //Lấy ra bằng cấp
  const degreesInfo = await bangcapModel.getFullDegrees();
  // Phó phòng thêm được nhân viên thuộc bộ phận của mình
  res.render("addStaff", { positionsInfo, partInfos, degreesInfo });
});

//thêm nhân viên
router.get("/staff/addNewStaff", restrict, async (req, res) => {
  const entity = {};
  if (req.query.HoTenNV != "undefined") {
    entity.HoTenNV = req.query.HoTenNV.trim();
  } else {
    return res.json(false);
  }
  if (req.query.GioiTinh != "undefined") {
    entity.GioiTinh = req.query.GioiTinh.trim();
  } else {
    return res.json(false);
  }
  if (req.query.DiaChi != "undefined") {
    entity.DiaChi = req.query.DiaChi.trim();
  } else {
    return res.json(false);
  }
  if (req.query.Sdt != "undefined") {
    entity.Sdt = req.query.Sdt.trim();
  } else {
    return res.json(false);
  }
  if (req.query.NgaySinh != "undefined") {
    entity.NgaySinh = moment(req.query.NgaySinh.trim(), "DD-MM-YYYY").format(
      "YYYY/MM/DD",
    );
  } else {
    return res.json(false);
  }
  if (req.query.MaBangCap != "undefined") {
    entity.MaBangCap = req.query.MaBangCap.trim();
  } else {
    return res.json(false);
  }
  if (req.query.MaBoPhan != "undefined") {
    entity.MaBoPhan = req.query.MaBoPhan.trim();
  } else {
    return res.json(false);
  }
  if (req.query.MaChucVu != "undefined") {
    entity.MaChucVu = req.query.MaChucVu.trim();
  } else {
    return res.json(false);
  }
  entity.isDeleted = false;
  entity.MatKhau = await bcrypt.hash("tranhoangduy", saltRounds);

  // phát sinh mã nhân viên
  const staffInfo = await nhanvienModel.getLastRow();
  if (staffInfo.length < 1) {
    return res.json(false);
  }
  const getNumStaff =
    parseInt(
      staffInfo[0].MaNhanVien.slice(staffInfo[0].MaNhanVien.length - 4),
    ) + 1;
  let strNum = getNumStaff.toString();
  for (var i = strNum.length; i < 4; i++) {
    strNum = "0" + strNum;
  }
  const newIdStaff = "NV" + strNum;
  entity.MaNhanVien = newIdStaff;
  const newStaff = await nhanvienModel.addNewStaff(entity);
  if (newStaff.affectedRows != 1) {
    return res.json(false);
  }
  return res.json(true);
});

// chỉnh sửa nhân viên
router.get("/staff/edit", restrict, async (req, res) => {
  const staffInfo = req.session.authUser;
  const idEditStaff = req.query.MaNhanVien;
  const editStaffInfo = await nhanvienModel.getInfoByMaNhanVien(idEditStaff);
  if (editStaffInfo.length < 1) {
    return res.redirect("/index/staff");
  }
  //Lấy ra chức vụ
  // Tổng giám đốc thêm được phó giám đốc, trưởng phòng, phó phòng, nhân viên các bộ phận
  let conditions = "('CV01'";
  // Phó giám đốc thêm được trưởng phòng, phó phòng, nhân viên các bộ phận
  if (staffInfo.MaChucVu == "CV02") {
    conditions = conditions + "," + "'CV02'";
  }
  // trường phòng thêm được phó phòng, nhân viên thuộc bộ phận của mình
  if (staffInfo.MaChucVu == "CV03") {
    conditions = conditions + "," + "'CV02'" + "," + "'CV03'";
  }
  if (staffInfo.MaChucVu == "CV04") {
    conditions = conditions + "," + "'CV02'" + "," + "'CV03'" + "," + "'CV04'";
  }
  conditions = conditions + ")";
  const positionsInfo = await chucvuModel.getPosition(conditions);
  //Lấy ra bộ phận
  let partInfos = [];
  if (staffInfo.MaBoPhan == "BP01") {
    if (staffInfo.MaChucVu == "CV02") {
      partInfos = await bophanModel.GetFullInFoParts("BP01");
    } else {
      partInfos = await bophanModel.GetFullInFoParts();
    }
  } else {
    partInfos = await bophanModel.getInfoPartbyMaBP(staffInfo.MaBoPhan);
  }
  //Lấy ra bằng cấp
  const degreesInfo = await bangcapModel.getFullDegrees();
  if (staffInfo.MaChucVu == "CV05") {
    return res.redirect("/index");
  }

  let tempdate = moment(editStaffInfo[0].NgaySinh, "YYYY/MM/DD").format(
    "DD-MM-YYYY",
  );
  const arr = tempdate.split("-");
  tempdate = "";
  for (i = 0; i < 2; i++) {
    tempdate = tempdate + arr[i] + "/";
  }
  tempdate += arr[2];
  res.render("editStaff", {
    MaNhanVien: editStaffInfo[0].MaNhanVien,
    HoTenNV: editStaffInfo[0].HoTenNV,
    GioiTinh: editStaffInfo[0].GioiTinh,
    Sdt: editStaffInfo[0].Sdt,
    DiaChi: editStaffInfo[0].DiaChi,
    NgaySinh: tempdate,
    partInfos,
    selectedpartInfo: editStaffInfo[0].MaBoPhan,
    positionsInfo,
    selectedPosition: editStaffInfo[0].MaChucVu,
    degreesInfo,
    selectedDegree: editStaffInfo[0].MaBangCap,
    selectedIsDeleted: editStaffInfo[0].isDeleted,
  });
});

//cập nhật thông tin nhân viên
router.get("/staff/UpdateStaff", restrict, async (req, res) => {
  const entity = {};
  let MaNhanVien = "";
  if (req.query.MaNhanVien != "undefined") {
    MaNhanVien = req.query.MaNhanVien.trim();
  } else {
    return res.json(false);
  }
  if (req.query.HoTenNV != "undefined") {
    entity.HoTenNV = req.query.HoTenNV.trim();
  } else {
    return res.json(false);
  }
  if (req.query.GioiTinh != "undefined") {
    entity.GioiTinh = req.query.GioiTinh.trim();
  } else {
    return res.json(false);
  }
  if (req.query.DiaChi != "undefined") {
    entity.DiaChi = req.query.DiaChi.trim();
  } else {
    return res.json(false);
  }
  if (req.query.Sdt != "undefined") {
    entity.Sdt = req.query.Sdt.trim();
  } else {
    return res.json(false);
  }
  if (req.query.NgaySinh != "undefined") {
    entity.NgaySinh = moment(req.query.NgaySinh.trim(), "DD-MM-YYYY").format(
      "YYYY/MM/DD",
    );
  } else {
    return res.json(false);
  }
  if (req.query.MaBangCap != "undefined") {
    entity.MaBangCap = req.query.MaBangCap.trim();
  } else {
    return res.json(false);
  }
  if (req.query.MaBoPhan != "undefined") {
    entity.MaBoPhan = req.query.MaBoPhan.trim();
  } else {
    return res.json(false);
  }
  if (req.query.MaChucVu != "undefined") {
    entity.MaChucVu = req.query.MaChucVu.trim();
  } else {
    return res.json(false);
  }
  if (req.query.isDeleted != "undefined") {
    entity.isDeleted = req.query.isDeleted.trim();
  } else {
    return res.json(false);
  }
  const updateStaff = await nhanvienModel.updateStaff(entity, {
    MaNhanVien: MaNhanVien,
  });
  if (updateStaff.affectedRows == 1) {
    return res.json(true);
  }
  return res.json(false);
});

// kiểm tra số điện thoại đã tồn tại
router.get("/staff/add/isValidPhone", restrict, async (req, res) => {
  const isExistPhone = await nhanvienModel.getInfoByPhone(req.query.Sdt);
  if (isExistPhone.length > 0) {
    res.json(true);
  } else {
    res.json(false);
  }
});

// kiểm tra số điện thoại đã tồn tại, chỉnh sửa
router.get("/staff/edit/isValidPhone", restrict, async (req, res) => {
  const staffInfo = await nhanvienModel.getInfoByPhoneAndExceptId(
    req.query.Sdt.trim(),
    req.query.MaNhanVien.trim(),
  );
  if (staffInfo.length > 0) {
    return res.json(true);
  } else {
    return res.json(false);
  }
});

// chi tiết nhân viên
router.get("/staff/detail", restrict, async function (req, res) {
  let staffInfo = req.session.authUser;
  if (staffInfo.MaChucVu == "CV05") {
    return res.redirect("/index");
  }
  const fullInfoStaff = await nhanvienModel.getFullInfoByMaNV(req.query.MaNV);
  if (fullInfoStaff) {
    fullInfoStaff[0].NgaySinh = moment(
      fullInfoStaff[0].NgaySinh,
      "YYYY/MM/DD",
    ).format("DD-MM-YYYY");
    res.json(fullInfoStaff);
  } else {
    res.json(fullInfoStaff);
  }
});

// xóa nhân viên
router.get("/staff/deleted", restrict, async function (req, res) {
  let staffInfo = req.session.authUser;
  if (staffInfo.MaChucVu == "CV05") {
    return res.redirect("/index");
  }
  const MaNV = req.query.MaNV;
  if (req.session.authUser.MaNhanVien == MaNV) {
    return res.json("Không thể xóa tài khoản đang sử dụng");
  }

  const DelStaff = await nhanvienModel.deletedStaff(
    { isDeleted: 1 },
    { MaNhanVien: MaNV },
  );

  if (DelStaff.affectedRows > 0 && DelStaff.changedRows > 0) {
    lichsuModel.addNewHistory({
      MaNhanVien: req.session.authUser.MaNhanVien,
      HanhDong: "Xóa nhân viên thuộc bộ bận thủ thư có MaNV là " + MaNV,
      NgayThucHien: new Date(),
    });
    return res.json("1000");
  }
  return res.json("1001");
});

module.exports = router;
