const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const history = require("connect-history-api-fallback");
const path = require("path");

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true }));

app.use("/", require("./routes/auth.routes"));
app.use("/professor", require("./routes/professor.routes"));
app.use("/student", require("./routes/students.routes"));

app.use(history());
app.use(express.static(path.join(__dirname, "public")));

app.set("port", process.env.PORT || 4000);

app.listen(app.get("port"), () => {
  console.log("server on port " + app.get("port"));
});
