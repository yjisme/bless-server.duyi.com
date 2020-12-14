const Koa = require("koa");
const { config, httpLogger } = require("../utils");
const app = new Koa();

app.use(require("@koa/cors")());
app.use(
  require("koa-body")({
    multipart: true, // 支持文件上传
    formidable: {
      uploadDir: require("path").resolve(__dirname, "../public"),
      hash: "md5",
      multiples: false,
    },
  })
);
app.use(require("./uniqueHandler"));
app.use(require("./bless").routes());
app.use(require("./upload").routes());

app.listen(config.server.port, () => {
  httpLogger.debug(`server started, listen on ${config.server.port}`);
});
