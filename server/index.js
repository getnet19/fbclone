const DB = require("./config/db");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const conversationRoute = require("./routes/conversation");
const messageRoute = require("./routes/message");

const dotenv = require("dotenv");
const helmet = require("helmet");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const app = express();
dotenv.config();

// database connection
DB();

app.use("/images", express.static(path.join(__dirname, "public/images")));

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },  
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploaded successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal server error");
  }
});

//routing
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/post", postRoute);
app.use("/api/conversations",conversationRoute)
app.use("/api/messages",messageRoute)

app.listen(8000, () => {
  console.log("server is runnig on 8000 port");
});
   