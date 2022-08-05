//v7 imports
import user from "./api/v1/controllers/users/routes";
import admin from "./api/v1/controllers/admin/routes";
import staticContent from "./api/v1/controllers/static/routes";
import nft from "./api/v1/controllers/nft/routes";
import order from "./api/v1/controllers/order/routes";
import bid from "./api/v1/controllers/bid/routes";
import notification from "./api/v1/controllers/notification/routes";
import socket from "./api/v1/controllers/socket/routes";
import plan from "./api/v1/controllers/plan/routes";
import blockchain from "./api/v1/controllers/blockchain/routes";
import content from "./api/v1/controllers/content/routes";

/**
 *
 *
 * @export
 * @param {any} app
 */

export default function routes(app) {
  app.use("/api/v1/user", user);
  app.use("/api/v1/admin", admin);
  app.use("/api/v1/static", staticContent);
  app.use("/api/v1/nft", nft);
  app.use("/api/v1/order", order);
  app.use("/api/v1/bid", bid);
  app.use("/api/v1/notification", notification);
  app.use("/api/v1/socket", socket);
  app.use("/api/v1/plan", plan);
  app.use("/api/v1/blockchain", blockchain);
  app.use("/api/v1/content", content);

  return app;
}
