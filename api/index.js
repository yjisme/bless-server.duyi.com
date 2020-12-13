const Koa = require("koa");
const { config, httpLogger } = require("../utils");
const app = new Koa();

app.use(require("koa-bodyparser")());
app.use(require("./uniqueHandler"));
app.use(require("./bless").routes());

app.listen(config.server.port, () => {
  httpLogger.debug(`server started, listen on ${config.server.port}`);
});
