-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1:3306
-- Thời gian đã tạo: Th3 02, 2021 lúc 02:45 PM
-- Phiên bản máy phục vụ: 5.7.26
-- Phiên bản PHP: 7.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `qltv`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bangcap`
--

DROP TABLE IF EXISTS `bangcap`;
CREATE TABLE IF NOT EXISTS `bangcap` (
  `MaBangCap` varchar(4) COLLATE utf8mb4_unicode_ci NOT NULL,
  `LoaiBangCap` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`MaBangCap`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `bangcap`
--

INSERT INTO `bangcap` (`MaBangCap`, `LoaiBangCap`) VALUES
('BC01', 'Tú tài'),
('BC02', 'Trung cấp'),
('BC03', 'Cao đẳng'),
('BC04', 'Đại học'),
('BC05', 'Thạc sĩ'),
('BC06', 'Tiến sĩ');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bophan`
--

DROP TABLE IF EXISTS `bophan`;
CREATE TABLE IF NOT EXISTS `bophan` (
  `MaBoPhan` varchar(4) COLLATE utf8mb4_unicode_ci NOT NULL,
  `TenBoPhan` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`MaBoPhan`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `bophan`
--

INSERT INTO `bophan` (`MaBoPhan`, `TenBoPhan`) VALUES
('BP01', 'Ban giám đốc'),
('BP02', 'Thủ thư'),
('BP03', 'Thủ kho'),
('BP04', 'Thủ quỹ');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chucvu`
--

DROP TABLE IF EXISTS `chucvu`;
CREATE TABLE IF NOT EXISTS `chucvu` (
  `MaChucVu` varchar(4) COLLATE utf8mb4_unicode_ci NOT NULL,
  `TenChucVu` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`MaChucVu`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `chucvu`
--

INSERT INTO `chucvu` (`MaChucVu`, `TenChucVu`) VALUES
('CV01', 'Giám đốc'),
('CV02', 'Phó giám đốc'),
('CV03', 'Trưởng phòng'),
('CV04', 'Phó phòng'),
('CV05', 'Nhân viên');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ct_phieumuon`
--

DROP TABLE IF EXISTS `ct_phieumuon`;
CREATE TABLE IF NOT EXISTS `ct_phieumuon` (
  `MaPM` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MaSach` varchar(8) COLLATE utf8mb4_unicode_ci NOT NULL,
  `DaXoa` tinyint(1) NOT NULL,
  PRIMARY KEY (`MaPM`,`MaSach`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `ct_phieumuon`
--

INSERT INTO `ct_phieumuon` (`MaPM`, `MaSach`, `DaXoa`) VALUES
('PM000001', 'S002', 0),
('PM000001', 'S001', 0),
('PM000002', 'S003', 0),
('PM000002', 'S001', 0),
('PM000002', 'S004', 0),
('PM000003', 'S001', 1),
('PM000003', 'S002', 1),
('PM000003', 'S003', 1),
('PM000003', 'S004', 1),
('PM000003', 'S005', 1),
('PM000004', 'S007', 0),
('PM000004', 'S008', 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ct_phieuthanhly`
--

DROP TABLE IF EXISTS `ct_phieuthanhly`;
CREATE TABLE IF NOT EXISTS `ct_phieuthanhly` (
  `MaPhieuThanhLy` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MaSach` varchar(8) COLLATE utf8mb4_unicode_ci NOT NULL,
  `SoLuong` int(11) NOT NULL,
  PRIMARY KEY (`MaPhieuThanhLy`,`MaSach`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `ct_phieuthanhly`
--

INSERT INTO `ct_phieuthanhly` (`MaPhieuThanhLy`, `MaSach`, `SoLuong`) VALUES
('PTT000001', 'S003', 1),
('PTT000002', 'S001', 1),
('PTT000003', 'S017', 10),
('PTT000003', 'S004', 20);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ct_phieutra`
--

DROP TABLE IF EXISTS `ct_phieutra`;
CREATE TABLE IF NOT EXISTS `ct_phieutra` (
  `MaPT` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MaSach` varchar(8) COLLATE utf8mb4_unicode_ci NOT NULL,
  `NgayMuon` date NOT NULL,
  `SoNgayMuon` int(11) NOT NULL,
  `TienPhat` double NOT NULL,
  `DaXoa` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`MaPT`,`MaSach`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `ct_phieutra`
--

INSERT INTO `ct_phieutra` (`MaPT`, `MaSach`, `NgayMuon`, `SoNgayMuon`, `TienPhat`, `DaXoa`) VALUES
('PT000003', 'S001', '2021-03-01', 0, 12000, 0),
('PT000002', 'S002', '2021-03-01', 0, 0, 0),
('PT000002', 'S001', '2021-03-01', 0, 0, 0),
('PT000001', 'S002', '2021-03-01', 0, 0, 1),
('PT000001', 'S001', '2021-03-01', 0, 0, 1),
('PT000003', 'S003', '2021-03-01', 0, 850000, 0),
('PT000003', 'S004', '2021-03-01', 0, 0, 0),
('PT000004', 'S007', '2021-02-25', 4, 0, 0),
('PT000004', 'S008', '2021-02-25', 4, 0, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `docgia`
--

DROP TABLE IF EXISTS `docgia`;
CREATE TABLE IF NOT EXISTS `docgia` (
  `MaDocGia` varchar(6) COLLATE utf8mb4_unicode_ci NOT NULL,
  `CMND_CCCD` tinytext COLLATE utf8mb4_unicode_ci NOT NULL,
  `HoTenDG` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `NgaySinh` date DEFAULT NULL,
  `DiaChi` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Email` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TongNo` double DEFAULT NULL,
  `NgayLapThe` datetime DEFAULT NULL,
  `NgayHetHan` datetime DEFAULT NULL,
  `NVLapThe` varchar(6) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `MaLoaiDG` varchar(6) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TTDG` varchar(6) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`MaDocGia`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `docgia`
--

INSERT INTO `docgia` (`MaDocGia`, `CMND_CCCD`, `HoTenDG`, `NgaySinh`, `DiaChi`, `Email`, `TongNo`, `NgayLapThe`, `NgayHetHan`, `NVLapThe`, `MaLoaiDG`, `TTDG`) VALUES
('DG0001', '371862721', 'Đinh Thành An', '1997-05-22', '11 Nguyễn Văn Cừ', 'tranhoangduy@gmail.com', 0, '2022-01-04 00:00:00', '2021-11-22 00:00:00', 'NV0015', 'LDG1', 'TTDG01'),
('DG0002', '371989898', 'Lê Văn Thành Đạt', '2021-06-19', '55 Tô Hiến Thành, Q10 HCM', 'hadesduy00001@gmail.com', 0, '2022-01-04 00:00:00', '2022-01-10 00:00:00', 'NV0011', 'LDG1', 'TTDG01'),
('DG0003', '371862723', 'Nguyễn Thuỳ Anh', '1992-06-04', '11 Nguyễn Cư Trinh', 'emgioi@gmail.com', 0, '2022-01-04 00:00:00', '2018-09-06 00:00:00', 'NV0011', 'LDG1', 'TTDG01'),
('DG0004', '371862724', 'Nguyễn Kim Cúc', '1997-05-22', '46 Nguyễn Oanh', 'anhnhoemnhieu@gmail.com', 0, '2022-01-04 00:00:00', '2015-12-12 00:00:00', 'NV0015', 'LDG2', 'TTDG01'),
('DG0005', '371862725', 'Hồ Văn Hùng', '1999-07-12', '146 Huỳnh Tấn Phát', 'ngaytroigiongbao@gmail.com', 0, '2022-01-04 00:00:00', '2019-07-01 00:00:00', 'NV0015', 'LDG1', 'TTDG01'),
('DG0006', '371862726', 'Lê Văn Chúng', '1997-06-01', '78 Ngô Gia Tự', 'lehuongmo@gmail.com', 0, '2015-06-04 00:00:00', '2015-12-04 00:00:00', 'NV0011', 'LDG1', 'TTDG01'),
('DG0007', '371862727', 'Phùng Hạ Anh', '1992-12-06', '88 Xuân Hưng', 'vinamilk@gmail.com', 0, '2018-01-12 00:00:00', '2019-11-05 00:00:00', 'NV0015', 'LDG2', 'TTDG01'),
('DG0008', '371862728', 'Nguyễn Công Hoàng', '1998-06-12', '190 CMT8', 'canhsatleeminho@gmail.com', 0, '2017-01-22 00:00:00', '2017-07-22 00:00:00', 'NV0011', 'LDG1', 'TTDG01'),
('DG0009', '371862729', 'Vũ Thị Kim Anh', '1997-09-06', '228 Lã Thanh Nhàn', 'yeuthatday@gmail.com', 0, '2019-05-08 00:00:00', '2019-11-08 00:00:00', 'NV0011', 'LDG2', 'TTDG01'),
('DG0010', '371862730', 'Lê Thị Kim Huệ', '1999-05-09', '326 Mai Chí Thọ', 'thegioicuaanh@gmail.com', 0, '2015-05-22 00:00:00', '2015-11-22 00:00:00', 'NV0011', 'LDG1', 'TTDG01'),
('DG0011', '371862731', 'Hà Gia Thành', '1997-05-22', '18 Lữ Gia', 'songgio@gmail.com', 0, '2015-05-22 00:00:00', '2015-11-22 00:00:00', 'NV0015', 'LDG1', 'TTDG01'),
('DG0012', '371862732', 'Lương Thành Danh', '1999-04-04', '98 Điện Biên Phủ', 'sontung@gmail.com', 0, '2018-03-04 00:00:00', '2018-09-04 00:00:00', 'NV0015', 'LDG2', 'TTDG01'),
('DG0013', '371862733', 'Nguyễn Hoàng Anh Tuấn', '1991-06-25', '101 Trường Chinh', 'tinhsauthienthu@gmail.com', 0, '2019-05-22 00:00:00', '2019-11-22 00:00:00', 'NV0015', 'LDG1', 'TTDG01'),
('DG0014', '371862734', 'Phạm Kim Yến', '1992-07-04', '77 Hoàng Văn Thụ', 'nguyenngoclananh@gmail.com', 0, '2019-11-08 00:00:00', '2019-04-08 00:00:00', 'NV0015', 'LDG1', 'TTDG01'),
('DG0015', '371862735', 'Lê Thanh Bình', '1994-01-12', '15 Cộng Hoà', 'hothiquynhuong@gmail.com', 0, '2019-05-06 00:00:00', '2019-11-06 00:00:00', 'NV0015', 'LDG1', 'TTDG01'),
('DG0016', '371862736', 'Ngô Tiến Thiện', '2020-01-10', 'Bình Thạnh', 'emtentrinh@gmail.com', 0, '2020-01-10 00:00:00', '2020-07-10 00:00:00', 'NV0011', 'LDG1', 'TTDG02');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `lichsu`
--

DROP TABLE IF EXISTS `lichsu`;
CREATE TABLE IF NOT EXISTS `lichsu` (
  `MaNhanVien` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `HanhDong` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `NgayThucHien` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `lichsu`
--

INSERT INTO `lichsu` (`MaNhanVien`, `HanhDong`, `NgayThucHien`) VALUES
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0011', '2021-01-31 00:00:00'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0011', '2021-02-01 21:46:23'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0013', '2021-02-02 20:37:43'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0024', '2021-02-05 21:57:58'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0002', '2021-02-05 22:10:45'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0012', '2021-02-05 22:16:24'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0017', '2021-02-05 22:16:37'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0017', '2021-02-05 22:17:50'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0017', '2021-02-05 22:19:08'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0019', '2021-02-05 22:20:05'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0002', '2021-02-05 22:20:56'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0013', '2021-02-05 22:21:04'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0018', '2021-02-05 22:22:16'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0018', '2021-02-05 22:23:07'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0002', '2021-02-05 22:23:55'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0017', '2021-02-05 22:24:01'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0016', '2021-02-05 22:26:11'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0015', '2021-02-05 22:27:16'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0014', '2021-02-05 22:29:14'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0002', '2021-02-05 22:35:14'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0013', '2021-02-05 22:35:21'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0022', '2021-02-05 22:35:27'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0020', '2021-02-05 22:35:58'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0023', '2021-02-05 22:36:03'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0022', '2021-02-05 22:37:18'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0013', '2021-02-05 22:38:56'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0023', '2021-02-05 22:39:10'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0014', '2021-02-05 22:39:42'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0022', '2021-02-05 22:40:16'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0012', '2021-02-05 22:41:28'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0023', '2021-02-05 22:41:47'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0022', '2021-02-05 22:42:24'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0007', '2021-02-05 22:43:26'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0017', '2021-02-05 22:43:41'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0020', '2021-02-05 22:44:11'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0022', '2021-02-05 22:44:20'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0019', '2021-02-05 22:44:58'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0018', '2021-02-05 22:45:04'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0023', '2021-02-05 22:45:17'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0016', '2021-02-05 22:45:40'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0015', '2021-02-05 22:45:43'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0014', '2021-02-05 22:45:46'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0013', '2021-02-05 22:45:51'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0022', '2021-02-05 22:46:10'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0022', '2021-02-05 22:47:00'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0024', '2021-02-05 22:47:29'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0025', '2021-02-05 22:47:33'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0023', '2021-02-05 22:47:59'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0022', '2021-02-05 22:48:44'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0020', '2021-02-05 22:49:56'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0023', '2021-02-05 22:50:15'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0023', '2021-02-05 22:50:42'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0024', '2021-02-05 22:50:57'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0002', '2021-02-05 22:52:46'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0002', '2021-02-05 22:56:32'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0002', '2021-02-05 22:57:23'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0002', '2021-02-05 22:58:07'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0002', '2021-02-05 22:58:51'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0002', '2021-02-05 22:59:16'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0002', '2021-02-05 23:00:00'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0002', '2021-02-05 23:00:39'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0003', '2021-02-05 23:02:10'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0002', '2021-02-05 23:03:01'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0002', '2021-02-05 23:04:03'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0004', '2021-02-05 23:04:23'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0002', '2021-02-05 23:05:28'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0010', '2021-02-05 23:05:58'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0023', '2021-02-05 23:06:45'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0023', '2021-02-05 23:07:36'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0025', '2021-02-05 23:08:33'),
('NV0001', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0018', '2021-02-05 23:09:21'),
('NV0001', 'Xóa độc giả có MaDocGia là DG0001', '2021-02-14 10:04:55'),
('NV0001', 'Xóa độc giả có MaDocGia là DG0016', '2021-02-14 10:05:06'),
('NV0001', 'Xóa độc giả có MaDocGia là DG0017', '2021-02-14 10:05:13'),
('NV0001', 'Xóa độc giả có MaDocGia là DG0002', '2021-03-01 09:01:24'),
('NV0001', 'Xóa độc giả có MaDocGia là DG0003', '2021-03-01 09:59:42'),
('NV0001', 'Xóa độc giả có MaDocGia là DG0004', '2021-03-01 10:00:13'),
('NV0001', 'Xóa độc giả có MaDocGia là DG0005', '2021-03-01 10:01:27'),
('NV0001', 'Xóa độc giả có MaDocGia là DG0006', '2021-03-01 10:02:22'),
('NV0001', 'Xóa độc giả có MaDocGia là DG0001', '2021-03-01 10:06:20'),
('NV0001', 'Xóa độc giả có MaDocGia là DG0002', '2021-03-01 11:20:21'),
('NV0001', 'Xóa độc giả có MaDocGia là DG0001', '2021-03-01 12:01:10'),
('NV0001', 'Xóa độc giả có MaDocGia là DG0001', '2021-03-01 12:02:24'),
('NV0006', 'Xóa nhân viên thuộc bộ bận thủ thư có MaNV là NV0026', '2021-03-02 21:08:35');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `loaidocgia`
--

DROP TABLE IF EXISTS `loaidocgia`;
CREATE TABLE IF NOT EXISTS `loaidocgia` (
  `MaLoaiDG` varchar(6) COLLATE utf8mb4_unicode_ci NOT NULL,
  `TenLoaiDG` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`MaLoaiDG`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `loaidocgia`
--

INSERT INTO `loaidocgia` (`MaLoaiDG`, `TenLoaiDG`) VALUES
('LDG1', 'X'),
('LDG2', 'Y');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `lydothanhly`
--

DROP TABLE IF EXISTS `lydothanhly`;
CREATE TABLE IF NOT EXISTS `lydothanhly` (
  `MaLyDoThanhLy` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MoTa` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`MaLyDoThanhLy`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `lydothanhly`
--

INSERT INTO `lydothanhly` (`MaLyDoThanhLy`, `MoTa`) VALUES
('LDTL003', 'Hư hỏng'),
('LDTL002', 'Người dùng làm mất'),
('LDTL001', 'Mất');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `matsach`
--

DROP TABLE IF EXISTS `matsach`;
CREATE TABLE IF NOT EXISTS `matsach` (
  `MaMatSach` int(11) NOT NULL AUTO_INCREMENT,
  `MaSach` varchar(8) COLLATE utf8mb4_unicode_ci NOT NULL,
  `NgayGhiNhan` date NOT NULL,
  `MaDG` varchar(6) COLLATE utf8mb4_unicode_ci NOT NULL,
  `TienPhat` double NOT NULL,
  `MaNVTN` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MaPT` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `DaXoa` tinyint(1) NOT NULL DEFAULT '0',
  `DaThanhLy` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`MaMatSach`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `matsach`
--

INSERT INTO `matsach` (`MaMatSach`, `MaSach`, `NgayGhiNhan`, `MaDG`, `TienPhat`, `MaNVTN`, `MaPT`, `DaXoa`, `DaThanhLy`) VALUES
(9, 'S003', '2021-03-01', 'DG0001', 850000, 'NV0001', 'PT000003', 0, 1),
(8, 'S001', '2021-03-01', 'DG0001', 12000, 'NV0001', 'PT000003', 0, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nhanvien`
--

DROP TABLE IF EXISTS `nhanvien`;
CREATE TABLE IF NOT EXISTS `nhanvien` (
  `MaNhanVien` varchar(6) COLLATE utf8mb4_unicode_ci NOT NULL,
  `HoTenNV` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `GioiTinh` tinytext COLLATE utf8mb4_unicode_ci NOT NULL,
  `Sdt` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `MatKhau` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `DiaChi` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `NgaySinh` date NOT NULL,
  `MaBangCap` varchar(4) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MaChucVu` varchar(4) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MaBoPhan` varchar(4) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isDeleted` tinyint(1) NOT NULL,
  PRIMARY KEY (`MaNhanVien`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `nhanvien`
--

INSERT INTO `nhanvien` (`MaNhanVien`, `HoTenNV`, `GioiTinh`, `Sdt`, `MatKhau`, `DiaChi`, `NgaySinh`, `MaBangCap`, `MaChucVu`, `MaBoPhan`, `isDeleted`) VALUES
('NV0001', 'Nguyễn Xuân Phúc', 'Khác', '0938505050', '$2b$12$s5akh20WdEHXZ53IIdARhus26nr4jLUNA9SaehTD55S7NHcahF.gm', '132 Lê Đại Hành               ', '1965-05-25', 'BC05', 'CV04', 'BP02', 0),
('NV0002', 'Nguyễn Phú Trọng', 'Nữ', '0938505051', '$2b$12$mnoBs.MZs55Htj67sQGYQu3oHN.vwMZCNOiinVewFRjvqHrZ9by3q', '123 Lê Lợi', '1961-06-08', 'BC05', 'CV04', 'BP03', 0),
('NV0003', 'Nguyễn Thị Kim Ngân', 'Nam', '0938505052', '$2b$12$mnoBs.MZs55Htj67sQGYQu3oHN.vwMZCNOiinVewFRjvqHrZ9by3q', '245 Trần Bình Trọng               ', '1969-05-24', 'BC05', 'CV04', 'BP04', 0),
('NV0004', 'Ngô Xuân Lịch', 'Nữ', '0938505053', '$2b$12$mnoBs.MZs55Htj67sQGYQu3oHN.vwMZCNOiinVewFRjvqHrZ9by3q', '7 Nguyễn Tri Phương', '1966-11-14', 'BC04', 'CV01', 'BP01', 0),
('NV0005', 'Tô Lâm', 'Nam', '0938505054', '$2b$12$mnoBs.MZs55Htj67sQGYQu3oHN.vwMZCNOiinVewFRjvqHrZ9by3q', '47 Phạm Văn Đồng', '1960-12-25', 'BC03', 'CV05', 'BP04', 0),
('NV0006', 'Phùng Xuân Nhạ', 'Nữ', '0938505055', '$2b$12$mnoBs.MZs55Htj67sQGYQu3oHN.vwMZCNOiinVewFRjvqHrZ9by3q', '227 Nguyễn Văn cừ', '1963-06-03', 'BC03', 'CV02', 'BP01', 0),
('NV0007', 'Bùi Văn Ga', 'Nam', '0938505056', '$2b$12$mnoBs.MZs55Htj67sQGYQu3oHN.vwMZCNOiinVewFRjvqHrZ9by3q', '487 Lê Hồng Phong', '1965-10-21', 'BC03', 'CV02', 'BP01', 0),
('NV0008', 'Phạm Mạnh Hùng', 'Nữ', '0938505057', '$2b$12$mnoBs.MZs55Htj67sQGYQu3oHN.vwMZCNOiinVewFRjvqHrZ9by3q', '345 Trần Đại Nghĩa', '1964-06-12', 'BC03', 'CV05', 'BP02', 0),
('NV0009', 'Nguyễn Tấn Dũng', 'Nam', '0938505058', '$2b$12$mnoBs.MZs55Htj67sQGYQu3oHN.vwMZCNOiinVewFRjvqHrZ9by3q', '123 Đào Duy Từ', '1960-10-30', 'BC05', 'CV01', 'BP01', 0),
('NV0010', 'Trần Tuấn Anh', 'Nữ', '0938505059', '$2b$12$mnoBs.MZs55Htj67sQGYQu3oHN.vwMZCNOiinVewFRjvqHrZ9by3q', '74 Sư Vạn Hạnh', '1959-05-25', 'BC01', 'CV04', 'BP03', 0),
('NV0011', 'Trịnh Xuân Thanh', 'Nam', '0938505060', '$2b$12$mnoBs.MZs55Htj67sQGYQu3oHN.vwMZCNOiinVewFRjvqHrZ9by3q', '23 Nguyễn Thương Hiền', '1970-05-25', 'BC01', 'CV05', 'BP02', 0),
('NV0012', 'Đinh La Thăng', 'Nữ', '0938505061', '$2b$12$mnoBs.MZs55Htj67sQGYQu3oHN.vwMZCNOiinVewFRjvqHrZ9by3q', '125 Nguyễn Chí Thah', '1971-05-24', 'BC02', 'CV04', 'BP03', 0),
('NV0013', 'Phùng Đình Thực', 'Nam', '0938505062', '$2b$12$mnoBs.MZs55Htj67sQGYQu3oHN.vwMZCNOiinVewFRjvqHrZ9by3q', '132 Hùng Vương', '1963-07-25', 'BC03', 'CV04', 'BP04', 0),
('NV0014', 'Nguyễn Xuân Sơn', 'Nữ', '0938505063', '$2b$12$mnoBs.MZs55Htj67sQGYQu3oHN.vwMZCNOiinVewFRjvqHrZ9by3q', '132 Hùng Vương', '1962-05-25', 'BC02', 'CV04', 'BP04', 0),
('NV0015', 'Vũ Đức Thuận', 'Nam', '0938505064', '$2b$12$mnoBs.MZs55Htj67sQGYQu3oHN.vwMZCNOiinVewFRjvqHrZ9by3q', '132 Hùng Vương', '1962-05-25', 'BC02', 'CV03', 'BP02', 0),
('NV0016', 'Vũ Hồng Chương', 'Nữ', '0938505065', '$2b$12$mnoBs.MZs55Htj67sQGYQu3oHN.vwMZCNOiinVewFRjvqHrZ9by3q', '132 Hùng Vương', '1965-07-25', 'BC01', 'CV04', 'BP03', 0),
('NV0017', 'Ninh Văn Quỳnh', 'Nam', '0938505066', '$2b$12$mnoBs.MZs55Htj67sQGYQu3oHN.vwMZCNOiinVewFRjvqHrZ9by3q', '132 Hùng Vương', '1965-05-25', 'BC01', 'CV04', 'BP04', 0),
('NV0018', 'Tần Văn Nguyên', 'Nữ', '0938505067', '$2b$12$mnoBs.MZs55Htj67sQGYQu3oHN.vwMZCNOiinVewFRjvqHrZ9by3q', '132 Hùng Vương', '1965-05-25', 'BC01', 'CV04', 'BP04', 0),
('NV0019', 'Nguyễn Ngọc Quý', 'Nam', '0938505068', '$2b$12$mnoBs.MZs55Htj67sQGYQu3oHN.vwMZCNOiinVewFRjvqHrZ9by3q', '132 Hùng Vương', '1965-05-25', 'BC01', 'CV04', 'BP04', 0),
('NV0020', 'Phạm Tiến Đạt', 'Nữ', '0938505069', '$2b$12$mnoBs.MZs55Htj67sQGYQu3oHN.vwMZCNOiinVewFRjvqHrZ9by3q', '132 Hùng Vương', '1965-05-25', 'BC01', 'CV04', 'BP04', 0),
('NV0021', 'Văn Sơn', 'Nam', '0938505070', '$2b$12$mnoBs.MZs55Htj67sQGYQu3oHN.vwMZCNOiinVewFRjvqHrZ9by3q', '135 Trần Hưng Đạo', '2020-01-15', 'BC01', 'CV01', 'BP01', 0),
('NV0024', 'Anh nhớ em', 'Nam', '0909336336', '$2b$12$6C5Nfr5OyDrOA/b30.gR9exEiisU5/kgNIs75k2Vk9mQCBzlaKlC6', 'unkhomw', '2021-02-11', 'BC06', 'CV02', 'BP01', 0),
('NV0022', 'Trần Hoàng Duy', 'Nữ', '0336383090', '$2b$12$.blVAp/uF3MOcIWb2WNE2.YSUiK9dN0sXrfKfsBEZbAenNTAFO.nm', '125/2C Hòa Hưng', '2021-02-04', 'BC01', 'CV03', 'BP02', 0),
('NV0023', 'Trần văn b', 'Nam', '0909505050', '$2b$12$MYvURVzIdLCMxflhMDwmbe.Cbb0DeEo6Cv1.UXp/jiqpogF6nMvWe', '125 bfgfgg', '2021-02-03', 'BC06', 'CV04', 'BP02', 0),
('NV0025', 'Buồn làm chi', 'Nam', '0909336346', '$2b$12$/gzJLBVpAeacw8LBWQjWdOGz9coKt.iZ5L6NreY7QoQrWtmLGUvjy', '123', '2021-02-03', 'BC01', 'CV04', 'BP02', 0),
('NV0026', '1', 'Nam', '0989595959', '$2b$12$QoRTE824bwceGdbBLR50SeZieJ0//21UiS.8VcfFhBb6DX52haDHW', '1', '2021-02-13', 'BC01', 'CV05', 'BP03', 1),
('NV0027', 'Mã Đáo Thành Công', 'Nam', '0909306306', '$2b$12$sShe9m8oNuNInur6PnHDJulHF27z7C21R1lcILHvIxJ0v9eu89diW', '350 3/2 Q.10', '1999-03-02', 'BC01', 'CV05', 'BP02', 0),
('NV0028', 'NGUYỄN VĂN A', 'Nam', '0909888888', '$2b$12$eU8zBM2bKmAYboT2ThnyJulv713JowPsTI5pAqiZXAnpTj5J0j1r2', '123 ABC', '2021-03-03', 'BC01', 'CV05', 'BP02', 0),
('NV0029', 'Nguyễn Văn Bá Đạo', 'Nam', '0339339339', '$2b$12$9Df9rAhnom9yKba.JAsp0eH/JyEfxneq353Qri.TP4QeZGf3UknqO', '123 abc', '2021-02-28', 'BC01', 'CV04', 'BP03', 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nhaxuatban`
--

DROP TABLE IF EXISTS `nhaxuatban`;
CREATE TABLE IF NOT EXISTS `nhaxuatban` (
  `MaNXB` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `TenNXB` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`MaNXB`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `nhaxuatban`
--

INSERT INTO `nhaxuatban` (`MaNXB`, `TenNXB`) VALUES
('NXB001', 'Kim Đồng'),
('NXB002', 'Tuổi trẻ'),
('NXB003', 'NXB giáo dục-đào tạo'),
('NXB004', 'NXB khoa học'),
('NXB005', 'NXB tổng hợp'),
('NXB006', 'NXB chính trị quốc gia'),
('NXB007', 'NXB Hội nhà văn'),
('NXB008', 'NXB thông tin truyền thông'),
('NXB009', 'NXB lao động');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phieumuonsach`
--

DROP TABLE IF EXISTS `phieumuonsach`;
CREATE TABLE IF NOT EXISTS `phieumuonsach` (
  `MaPM` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MaNVTN` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `NgayMuon` date NOT NULL,
  `MaDG` varchar(6) COLLATE utf8mb4_unicode_ci NOT NULL,
  `NgayHetHan` date NOT NULL,
  `GhiChu` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `DaXoa` tinyint(1) NOT NULL,
  PRIMARY KEY (`MaPM`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `phieumuonsach`
--

INSERT INTO `phieumuonsach` (`MaPM`, `MaNVTN`, `NgayMuon`, `MaDG`, `NgayHetHan`, `GhiChu`, `DaXoa`) VALUES
('PM000001', 'NV0001', '2021-03-01', 'DG0001', '2021-03-02', '123', 0),
('PM000002', 'NV0001', '2021-03-01', 'DG0001', '2021-03-02', 'AVC', 0),
('PM000003', 'NV0001', '2021-03-01', 'DG0002', '2021-03-02', 'ABC', 1),
('PM000004', 'NV0001', '2021-02-25', 'DG0002', '2021-02-27', '', 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phieuthutienphat`
--

DROP TABLE IF EXISTS `phieuthutienphat`;
CREATE TABLE IF NOT EXISTS `phieuthutienphat` (
  `MaPhieuThu` int(11) NOT NULL AUTO_INCREMENT,
  `MaNV` varchar(6) COLLATE utf8mb4_unicode_ci NOT NULL,
  `SoTienThu` double NOT NULL,
  `NgayThu` date NOT NULL,
  `MaPT` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`MaPhieuThu`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `phieuthutienphat`
--

INSERT INTO `phieuthutienphat` (`MaPhieuThu`, `MaNV`, `SoTienThu`, `NgayThu`, `MaPT`) VALUES
(4, 'NV0006', 862000, '2021-03-02', 'PT000003'),
(5, 'NV0006', 2000, '2021-03-02', 'PT000004');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phieutrasach`
--

DROP TABLE IF EXISTS `phieutrasach`;
CREATE TABLE IF NOT EXISTS `phieutrasach` (
  `MaPT` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MaNVTN` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `NgayTra` date NOT NULL,
  `MaPM` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `TienPhatKyNay` double NOT NULL,
  `TienNo` double NOT NULL,
  `SoNgayTraTre` int(11) NOT NULL,
  `MaDocGia` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `DaXoa` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`MaPT`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `phieutrasach`
--

INSERT INTO `phieutrasach` (`MaPT`, `MaNVTN`, `NgayTra`, `MaPM`, `TienPhatKyNay`, `TienNo`, `SoNgayTraTre`, `MaDocGia`, `DaXoa`) VALUES
('PT000002', 'NV0001', '2021-03-01', 'PM000001', 0, 0, 0, 'DG0001', 0),
('PT000001', 'NV0001', '2021-03-01', 'PM000001', 0, 0, 0, 'DG0001', 1),
('PT000003', 'NV0001', '2021-03-01', 'PM000002', 862000, 0, 0, 'DG0001', 0),
('PT000004', 'NV0001', '2021-03-01', 'PM000004', 2000, 0, 2, 'DG0002', 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `quydinh`
--

DROP TABLE IF EXISTS `quydinh`;
CREATE TABLE IF NOT EXISTS `quydinh` (
  `TuoiToiThieu` int(11) NOT NULL,
  `TuoiToiDa` int(11) NOT NULL,
  `GiaTriThe` int(11) NOT NULL,
  `SoNamXB` int(11) NOT NULL,
  `SoSachMuonToiDa` int(11) NOT NULL,
  `SoNgayMuonToiDa` int(11) NOT NULL,
  `TienPhatTraTre` int(11) NOT NULL,
  PRIMARY KEY (`TuoiToiThieu`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `quydinh`
--

INSERT INTO `quydinh` (`TuoiToiThieu`, `TuoiToiDa`, `GiaTriThe`, `SoNamXB`, `SoSachMuonToiDa`, `SoNgayMuonToiDa`, `TienPhatTraTre`) VALUES
(18, 55, 6, 8, 5, 4, 1000);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sach`
--

DROP TABLE IF EXISTS `sach`;
CREATE TABLE IF NOT EXISTS `sach` (
  `MaSach` varchar(8) COLLATE utf8mb4_unicode_ci NOT NULL,
  `TenSach` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `NgayXuatBan` date NOT NULL,
  `MaTacGia` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MaTheLoai` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MaNXB` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `NgayNhap` date NOT NULL,
  `MaNVTiepNhan` varchar(6) COLLATE utf8mb4_unicode_ci NOT NULL,
  `SoLuong` int(11) NOT NULL,
  `SoLuongDaMuon` int(11) NOT NULL,
  `GiaTien` double NOT NULL,
  `Ke` int(11) NOT NULL,
  `TTS` varchar(8) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`MaSach`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `sach`
--

INSERT INTO `sach` (`MaSach`, `TenSach`, `NgayXuatBan`, `MaTacGia`, `MaTheLoai`, `MaNXB`, `NgayNhap`, `MaNVTiepNhan`, `SoLuong`, `SoLuongDaMuon`, `GiaTien`, `Ke`, `TTS`) VALUES
('S001', 'Vũ trụ lớn thế nào?', '2019-05-05', 'TG001', 'TLS004', 'NXB004', '2019-05-04', 'NV0016', 19, 0, 12000, 1, 'TTS01'),
('S017', 'Bí kiếp làm giàu?', '2019-05-05', 'TG003', 'TLS001', 'NXB001', '2019-12-04', 'NV0003', 40, 0, 190000, 2, 'TTS01'),
('S002', 'Mắt biếc', '2019-05-05', 'TG001', 'TLS006', 'NXB001', '2019-05-04', 'NV0016', 10, 0, 90000, 2, 'TTS01'),
('S003', 'Cây chuối non đi giày xanh', '2019-05-05', 'TG001', 'TLS005', 'NXB005', '2019-05-04', 'NV0016', 99, 0, 850000, 1, 'TTS01'),
('S004', 'Hạ đỏ', '2019-05-05', 'TG001', 'TLS002', 'NXB001', '2019-05-04', 'NV0003', 70, 0, 650000, 1, 'TTS01'),
('S005', 'Nhà giả kim', '2019-05-05', 'TG003', 'TLS004', 'NXB001', '2019-12-04', 'NV0016', 150, 0, 90000, 2, 'TTS01'),
('S006', 'Nghệ thuật tinh tế của giao tiếp', '2019-05-05', 'TG006', 'TLS002', 'NXB002', '2018-07-12', 'NV0016', 110, 0, 850000, 1, 'TTS01'),
('S007', 'Doremon', '2019-05-05', 'TG002', 'TLS004', 'NXB004', '2019-05-04', 'NV0016', 220, 0, 150000, 2, 'TTS01'),
('S008', 'Conan', '2019-05-05', 'TG001', 'TLS006', 'NXB001', '2019-05-04', 'NV0016', 300, 0, 90000, 2, 'TTS01'),
('S009', 'Hoàng tử bé', '2019-05-05', 'TG001', 'TLS005', 'NXB005', '2019-05-04', 'NV0016', 400, 0, 850000, 1, 'TTS01'),
('S010', 'Bí kiếp luyện rồng', '2019-05-05', 'TG001', 'TLS002', 'NXB001', '2019-05-04', 'NV0016', 180, 0, 650000, 1, 'TTS01'),
('S011', 'Sinh tồn', '2019-05-05', 'TG003', 'TLS006', 'NXB001', '2019-12-04', 'NV0016', 500, 0, 123000, 2, 'TTS01'),
('S012', 'Nhà kinh tế mới', '2019-05-05', 'TG002', 'TLS002', 'NXB003', '2018-07-12', 'NV0016', 1000, 0, 850000, 1, 'TTS02'),
('S013', 'Đắc nhân tâm', '2019-05-05', 'TG002', 'TLS004', 'NXB003', '2019-05-04', 'NV0016', 2000, 0, 150000, 1, 'TTS02'),
('S014', 'Âm nhạc và cuộc sống', '2019-05-05', 'TG001', 'TLS004', 'NXB001', '2019-05-04', 'NV0016', 3000, 0, 99000, 2, 'TTS01'),
('S015', 'Tôi là ai?', '2019-05-05', 'TG001', 'TLS005', 'NXB002', '2019-05-04', 'NV0016', 10, 0, 850000, 2, 'TTS02'),
('S016', 'Tuổi trẻ đáng giá bao nhiêu?', '2019-05-05', 'TG006', 'TLS002', 'NXB001', '2019-05-04', 'NV0016', 60, 0, 650000, 1, 'TTS01'),
('S018', 'Tam quốc chí', '2019-05-05', 'TG006', 'TLS002', 'NXB004', '2018-07-12', 'NV0016', 500, 0, 850000, 5, 'TTS02'),
('S019', 'Chính trị quốc gia', '2019-05-05', 'TG002', 'TLS004', 'NXB004', '2019-05-04', 'NV0016', 40, 0, 150000, 3, 'TTS01'),
('S020', 'Nghệ thuật quân sự', '2019-05-05', 'TG001', 'TLS006', 'NXB001', '2019-05-04', 'NV0016', 20, 0, 90000, 2, 'TTS01'),
('S021', 'Doremon', '2019-05-05', 'TG001', 'TLS001', 'NXB001', '2020-01-10', 'NV0016', 90, 0, 20000, 1, 'TTS01'),
('S022', 'Thế giới kết thúc diệu dàng đến thế', '2019-05-05', 'TG007', 'TLS001', 'NXB001', '2020-01-10', 'NV0010', 110, 0, 12333333, 4, 'TTS02'),
('S023', 'Trên đường băng', '2019-05-05', 'TG005', 'TLS003', 'NXB002', '2020-01-10', 'NV0010', 150, 0, 12345, 3, 'TTS02'),
('S024', 'tôi là ai', '2021-02-10', 'TG001', 'TLS001', 'NXB001', '2021-02-16', 'NV0003', 50, 0, 12345678, 10, 'TTS01'),
('S025', 'Bí Kiếp lập trình', '2021-02-16', 'TG004', 'TLS003', 'NXB001', '2021-03-01', 'NV0002', 40, 0, 20000, 6, 'TTS01'),
('S026', 'Lập Trinh C Căn Bản', '2021-02-01', 'TG003', 'TLS004', 'NXB004', '2021-03-01', 'NV0002', 10, 0, 500000, 10, 'TTS02'),
('S027', 'Con đường tơ lua', '2021-03-08', 'TG001', 'TLS001', 'NXB001', '2021-03-02', 'NV0006', 175, 0, 50000, 2, 'TTS01');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tacgia`
--

DROP TABLE IF EXISTS `tacgia`;
CREATE TABLE IF NOT EXISTS `tacgia` (
  `MaTacGia` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `TenTacGia` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`MaTacGia`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `tacgia`
--

INSERT INTO `tacgia` (`MaTacGia`, `TenTacGia`) VALUES
('TG001', 'Nguyễn Nhật Ánh'),
('TG002', 'Stephen hawking'),
('TG003', 'Dale Canie'),
('TG004', 'Trọng Tấn'),
('TG005', 'Nguyễn Ngọc Tư'),
('TG006', 'Phillip John'),
('TG007', 'Dakasagi'),
('TG009', 'Xuân Diệu'),
('TG010', 'Nguyễn Đình Thi');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `thanhlysach`
--

DROP TABLE IF EXISTS `thanhlysach`;
CREATE TABLE IF NOT EXISTS `thanhlysach` (
  `MaPhieuThanhLy` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `MaNV` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `NgayThanhLy` date NOT NULL,
  `LyDoThanhLy` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`MaPhieuThanhLy`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `thanhlysach`
--

INSERT INTO `thanhlysach` (`MaPhieuThanhLy`, `MaNV`, `NgayThanhLy`, `LyDoThanhLy`) VALUES
('PTT000001', 'NV0002', '2021-03-01', 'LDTL002'),
('PTT000002', 'NV0002', '2021-03-01', 'LDTL002'),
('PTT000003', 'NV0002', '2021-03-01', 'LDTL001');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `theloaisach`
--

DROP TABLE IF EXISTS `theloaisach`;
CREATE TABLE IF NOT EXISTS `theloaisach` (
  `MaTheLoai` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `TenTheLoai` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`MaTheLoai`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `theloaisach`
--

INSERT INTO `theloaisach` (`MaTheLoai`, `TenTheLoai`) VALUES
('TLS001', 'Thiếu nhi'),
('TLS002', 'Tiểu thuyết'),
('TLS003', 'Giáo dục'),
('TLS004', 'Khoa học - kỹ thuật'),
('TLS005', 'Lịch sử'),
('TLS006', 'Truyện ngắn'),
('TLS007', 'Chính trị');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tinhtrangdocgia`
--

DROP TABLE IF EXISTS `tinhtrangdocgia`;
CREATE TABLE IF NOT EXISTS `tinhtrangdocgia` (
  `MaTinhTrangDG` varchar(6) COLLATE utf8mb4_unicode_ci NOT NULL,
  `LoaiTinhTrangDG` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`MaTinhTrangDG`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `tinhtrangdocgia`
--

INSERT INTO `tinhtrangdocgia` (`MaTinhTrangDG`, `LoaiTinhTrangDG`) VALUES
('TTDG01', 'Hoạt Động'),
('TTDG02', 'Đã Xoá');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tinhtrangnhanvien`
--

DROP TABLE IF EXISTS `tinhtrangnhanvien`;
CREATE TABLE IF NOT EXISTS `tinhtrangnhanvien` (
  `MaTinhTrangNV` varchar(6) COLLATE utf8mb4_unicode_ci NOT NULL,
  `LoaiTinhTrang` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`MaTinhTrangNV`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `tinhtrangnhanvien`
--

INSERT INTO `tinhtrangnhanvien` (`MaTinhTrangNV`, `LoaiTinhTrang`) VALUES
('TTNV01', 'Đang làm việc'),
('TTNV02', 'Đang nghỉ phép'),
('TTNV03', 'Đã nghĩ việc');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tinhtrangsach`
--

DROP TABLE IF EXISTS `tinhtrangsach`;
CREATE TABLE IF NOT EXISTS `tinhtrangsach` (
  `MaTTSach` varchar(8) COLLATE utf8mb4_unicode_ci NOT NULL,
  `TenTinhTrang` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`MaTTSach`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `tinhtrangsach`
--

INSERT INTO `tinhtrangsach` (`MaTTSach`, `TenTinhTrang`) VALUES
('TTS01', 'Có thể mượn'),
('TTS02', 'Không thể mượn');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `nhaxuatban`
--
ALTER TABLE `nhaxuatban` ADD FULLTEXT KEY `TenNXB` (`TenNXB`);

--
-- Chỉ mục cho bảng `sach`
--
ALTER TABLE `sach` ADD FULLTEXT KEY `TenSach` (`TenSach`,`MaTacGia`,`MaTheLoai`,`MaNXB`);

--
-- Chỉ mục cho bảng `tacgia`
--
ALTER TABLE `tacgia` ADD FULLTEXT KEY `TenTacGia` (`TenTacGia`);

--
-- Chỉ mục cho bảng `theloaisach`
--
ALTER TABLE `theloaisach` ADD FULLTEXT KEY `TenTheLoai` (`TenTheLoai`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
