import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
// import sequelize from("./models");
import db from "./models/index.js";
import router from "./router/user-router.js";
// import { userRouter } from "./contoller/auth.js";

const app = express();
const PORT = process.env.PORT || 3000;

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.send('Server Response Success');
})

app.use("/api", router);

db.sequelize
  .sync()
  .then(()=> {
    console.log("데이터베이스 연결 성공!")
  })
  .catch((err)=> {
    console.log(err);
  });


app.listen(PORT, () => {
  console.log(`Server On : http://localhost:${PORT}/`);
});

export {app};