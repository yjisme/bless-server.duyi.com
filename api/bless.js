const Router = require("@koa/router");
const { blessService: blessServ } = require("../services");

const router = new Router({
  prefix: "/api/bless",
});
router.post("/", async (ctx) => {
  const result = await blessServ.addBless(ctx.request.body);
  ctx.body = result;
});
router.get("/", async (ctx) => {
  const id = ctx.query.id;
  if (!id) {
    ctx.body = null;
    return;
  }
  ctx.body = await blessServ.getBless(id);
});

module.exports = router;
