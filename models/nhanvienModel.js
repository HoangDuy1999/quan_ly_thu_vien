const db = require("../utils/db");

const tblNhanVien = "nhanvien";
module.exports = {
  getLastRow: function () {
    return db.load(
      `SELECT * FROM ${tblNhanVien} ORDER BY MaNhanVien DESC LIMIT 1`,
    );
  },
  updateStaffPassWord: function (entity, condition) {
    return db.update(tblNhanVien, entity, condition);
  },
  updateStaff: function (entity, condition) {
    return db.update(tblNhanVien, entity, condition);
  },
  getInfoByPhone: function (phone) {
    return db.load(
      `select * from ${tblNhanVien} where Sdt= '${phone}' and isDeleted = 0`,
    );
  },
  getInfoByMaNhanVien: function (MaNhanVien) {
    return db.load(
      `select * from ${tblNhanVien} where MaNhanVien= '${MaNhanVien}'`,
    );
  },
  getInfoByPhoneAndExceptId: function (phone, MaNhanVien) {
    return db.load(
      `select * from ${tblNhanVien} where Sdt= '${phone}' and MaNhanVien != '${MaNhanVien}' and isDeleted = 0`,
    );
  },

  addNewStaff: function (entity) {
    return db.insert(tblNhanVien, entity);
  },

  getFullInfoByMaNV: function (MaNV) {
    return db.load(
      `select nv.*, cv.TenChucVu, bp.TenBoPhan, bc.LoaiBangCap
      from ${tblNhanVien} nv, chucvu cv, bophan bp, bangcap bc
      where nv.MachucVu = cv.MachucVu and nv.MaBoPhan = bp.MaBoPhan 
            and nv.MaBangCap = bc.MaBangCap and nv.MaNhanVien= '${MaNV}'`,
    );
  },

  getListStaffDirector: function (condition) {
    return db.load(
      `select nv.MaNhanVien, nv.HoTenNV, cv.TenChucVu, bp.TenBoPhan, bc.LoaiBangCap, nv.NgaySinh, nv.Sdt, nv.isDeleted
      from ${tblNhanVien} nv, bophan bp, chucvu cv, bangcap bc
      where nv.MachucVu = cv.MachucVu and nv.MaBoPhan = bp.MaBoPhan
            and nv.MaBangCap = bc.MaBangCap and nv.MaChucVu != 'CV01'`,
    );
  },
  getListStaffDirectorRemoveDirector: function (condition) {
    return db.load(
      `select nv.MaNhanVien, nv.HoTenNV, cv.TenChucVu, bp.TenBoPhan, bc.LoaiBangCap, nv.NgaySinh, nv.Sdt, nv.isDeleted
      from ${tblNhanVien} nv, bophan bp, chucvu cv, bangcap bc
      where nv.MachucVu = cv.MachucVu and nv.MaBoPhan = bp.MaBoPhan
      and nv.MaBangCap = bc.MaBangCap and nv.MaChucVu != 'CV01' and nv.MaChucVu != 'CV02'`,
    );
  },

  getListStaff: function (vitricuaminh, vitriphophong, bophan) {
    return db.load(
      `select nv.MaNhanVien, nv.HoTenNV, cv.TenChucVu, bp.TenBoPhan, bc.LoaiBangCap, nv.NgaySinh, nv.Sdt, nv.isDeleted
      from ${tblNhanVien} nv, bophan bp, chucvu cv, bangcap bc
      where nv.MachucVu = cv.MachucVu and nv.MaBoPhan = bp.MaBoPhan
            and nv.MaBangCap = bc.MaBangCap and nv.MaChucVu != '${vitricuaminh}'
            and nv.MaChucVu != '${vitriphophong}' and nv.MaBoPhan = '${bophan}'`,
    );
  },

  deletedStaff: function (entity, condition) {
    return db.update(tblNhanVien, entity, condition);
  },
};
