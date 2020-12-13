module.exports = class extends (
  Error
) {
  constructor(errmsg, code = 406) {
    super(errmsg);
    this.code = code;
  }
};
