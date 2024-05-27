const dotenv = require("dotenv");

const app = require("./app");
dotenv.config({ path: "./config/config.env" });

const dbConnect = require("./config/dataBaseConnect");
dbConnect();

const PORT = 3000;

const server = app.listen(process.env.PORT || PORT, () => {
  console.log(`the server is listening on port ${process.env.PORT}`);
});
