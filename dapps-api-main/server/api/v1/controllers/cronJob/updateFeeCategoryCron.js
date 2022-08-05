import { userServices } from "../../services/user";
import { feeServices } from "../../services/fee";
import status from "../../../../enums/status";
import userType from "../../../../enums/userType";
const { updateUser, allUser } = userServices;
const { sortFee } = feeServices;
// const blockchainUrl = config.get('blockchainMainnetBaseUrl');

const cronJob = require("cron").CronJob;

new cronJob("*/5 * * * *", async function () {
  var userResult = await allUser({
    status: status.ACTIVE,
    userType: { $in: [userType.USER, userType.CREATOR] },
  });
  if (userResult.length == 0) {
    console.log("No records found for of users.");
  } else {
    var commissionResult;
    for (let index of userResult) {
      commissionResult = await sortFee({
        massHeld: { $lte: index.massBalance },
        status: status.ACTIVE,
      });
      await updateUser(
        { _id: index._id },
        { planType: commissionResult.planType }
      );
      console.log(`Updated plan type....userId===>>${index._id}`);
    }
  }
}).start();
