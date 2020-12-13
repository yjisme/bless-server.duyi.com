const mongoose = require("mongoose");
const { db } = require("../config");
const { config, dbLogger } = require("../utils");

mongoose.connect(`mongodb://${config.db.server}/${config.db.database}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("open", () => {
  dbLogger.debug("mongodb connected");
});

mongoose.connection.on("error", (err) => {
  dbLogger.error(err);
});
