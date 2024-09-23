const app = require("./src/app");

const port = 3000;

const server = app.listen(port, () => {
  console.log(`Ecommerce app listening on port ${port}`);
});

process.on("SIGINT", () => {
  server.close(() => console.log("Exit Server Express!"));
  //   notify.send(ping...)
});
