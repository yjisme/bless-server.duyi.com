const log4js = require("log4js");
const path = require("path");

log4js.configure({
  appenders: {
    default: {
      type: "dateFile",
      filename: path.resolve(__dirname, "../logs/", "logging.log"),
      maxLogSize: 50 * 1024,
      keepFileExt: true,
      daysToKeep: 10,
      layout: {
        type: "pattern",
        pattern: "[%c] [%d{yyyy-MM-dd hh:mm:ss}] [%p]: %n%m%n%n",
      },
    },
  },
  categories: {
    db: {
      appenders: ["default"],
      level: "all",
    },
    default: {
      appenders: ["default"],
      level: "all",
    },
    http: {
      appenders: ["default"],
      level: "all",
    },
  },
});

process.on("exit", () => {
  log4js.shutdown();
});

exports.dbLogger = log4js.getLogger("db");
exports.httpLogger = log4js.getLogger("http");
