const Router = require("@koa/router");
const { ServiceError } = require("../services");
const fs = require("fs");
const path = require("path");
const OSS = require("ali-oss");
const { httpLogger } = require("../utils");

const router = new Router({
  prefix: "/api/upload",
});

// 创建public目录
async function createPublicDir() {
  const publicPath = path.resolve(__dirname, "../public");
  try {
    await fs.promises.stat(publicPath);
  } catch {
    fs.promises.mkdir(publicPath);
  }
}

createPublicDir();

function OSSValidate(ossOption = {}) {
  if (
    ossOption.region &&
    ossOption.accessKeyId &&
    ossOption.accessKeySecret &&
    ossOption.bucket
  ) {
    return;
  }
  throw new ServiceError("OSS配置不完整");
}

router.post("/", async (ctx) => {
  const recordFile = ctx.request.files.record;
  if (!recordFile) {
    throw new ServiceError("无法从record字段中获取上传的音频数据");
  }
  // 获取到了文件 recordFile.path
  OSSValidate(ctx.request.body);
  const client = new OSS({
    ...ctx.request.body,
    secure: true,
  });
  const resp = await client.put(`${recordFile.hash}.mp3`, recordFile.path, {
    headers: {
      "Cache-Control": `max-age=${3600 * 24 * 100}`,
    },
  });
  // 删除本地文件
  try {
    fs.promises.unlink(recordFile.path);
  } catch (err) {
    httpLogger.error(err);
  }
  ctx.body = resp;
});

module.exports = router;
