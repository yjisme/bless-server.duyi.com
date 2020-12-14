const { httpLogger } = require("../utils");
const Entities = require("html-entities").AllHtmlEntities;
const entities = new Entities();

function encode(value) {
  if (typeof value === "object" && value !== null) {
    for (const key in value) {
      value[key] = encode(value[key]);
    }
  } else if (typeof value === "string") {
    value = entities.encode(value);
  }
  return value;
}

function handleNoError(ctx) {
  // 404 和 其他正常响应
  const status = ctx.response.status;
  if (status === 404) {
    return; // 404不做任何处理
  }
  ctx.response.status = 200;

  ctx.body = {
    code: 0,
    msg: "",
    data: encode(ctx.body),
  };
}

function handleError(ctx, err) {
  let code = err.code;
  let msg = err.message;
  if (!code || typeof code !== "number") {
    code = 500;
    msg = "server internal error";
  }
  ctx.response.status = code;
  ctx.body = {
    code,
    msg,
    data: null,
  };
}

function log(ctx, err) {
  let log = `-----[request]------
[${ctx.method}][${ctx.url}]
[body]
${JSON.stringify(ctx.request.body)}
-----[response]------
[${ctx.response.status}][${ctx.type}]
[body]
${JSON.stringify(ctx.body)}`;
  if (err) {
    log = `${err}
${log}`;
    httpLogger.error(log);
    return;
  }

  httpLogger.debug(log);
}

module.exports = async function (ctx, next) {
  try {
    await next();
    handleNoError(ctx);
    log(ctx, null);
  } catch (err) {
    // 处理有错误
    handleError(ctx, err);
    log(ctx, err);
    console.error(err);
  }
};
