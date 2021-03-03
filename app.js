const express = require("express");
const app = express();
//const port = 3000;
const cookieParser = require("cookie-parser");
app.use(cookieParser());
require("express-async-errors");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public/"));
require("./middlewares/view.mdw")(app);
require("./middlewares/session.mdw")(app);
require("./middlewares/locals.mdw")(app);

// xử lý chức năng trang chủ
app.use("/", require("./routes/home.route"));

//THỦ THƯ
// vai trò nhân viên
app.use("/index", require("./routes/staff.route"));
// Phần độc giả
app.use("/index", require("./routes/librarian/manager_Readers.route"));
//mượn sách
app.use("/index", require("./routes/librarian/borrow_book.route"));
// Trả sách
app.use("/index", require("./routes/librarian/given_book.route"));
// phần thủ kho
app.use("/index", require("./routes/stocker/manager_Book.route"));
app.use("/index", require("./routes/stocker/liquidation_Book.route"));
// ban giam đốc
app.use("/index/statistical", require("./routes/administrator/statistical"));
// THỦ QUỸ
app.use("/index", require("./routes/treasurer/forfeit.route"));
app.use(function (req, res) {
  res.render("404", { layout: false });
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).render("500", { layout: false });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server start port at http://localhost:3000`);
});
