const fs = require("fs").promises;
const { format } = require("date-fns");
const path = require("path");

const fileName = path.join(__dirname, "../logs", "logs.log");

const logEvents = async (message) => {
  const dateTime = `${format(new Date(), "dd-MM-yyyy\tss:mm:HH")}`;
  const contentLog = `${dateTime}===${message}\n`;
  try {
    fs.appendFile(fileName, contentLog);
  } catch (error) {
    console.error(error);
  }
};

module.exports = logEvents;
