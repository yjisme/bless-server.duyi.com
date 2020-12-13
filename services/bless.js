const { Bless } = require("../models");
const ServiceError = require("./ServiceError");

function toResult(value) {
  if (!value) {
    return value;
  }
  return JSON.parse(JSON.stringify(value));
}

/**
 * 添加一个祝福
 */
exports.addBless = async function (blessInfo = {}) {
  if (!blessInfo.author || !blessInfo.author.trim()) {
    throw new ServiceError("请填写您的名字");
  }
  if (!blessInfo.content || !blessInfo.content.trim()) {
    throw new ServiceError("请填写祝福语");
  }
  const bgMusicIndex = +blessInfo.bgMusicIndex;
  if (isNaN(bgMusicIndex) || bgMusicIndex < 0) {
    throw new ServiceError("bgMusicIndex is invalid");
  }
  const r = await Bless.create({
    author: blessInfo.author.trim(),
    content: blessInfo.content,
    audioUrl: blessInfo.audioUrl ? blessInfo.audioUrl : null,
    bgMusicIndex,
  });
  return toResult(r);
};

exports.getBless = async function (id) {
  try {
    return toResult(await Bless.findById(id));
  } catch {
    return null;
  }
};
