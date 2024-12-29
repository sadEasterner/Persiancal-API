import Router from "express";
import providerController from "../controllers/providerController";
import { verifyRoles, ROLES_LIST } from "../middleware/verifyRoles";
import { verifyJWT } from "../middleware/verifyJWT";
const router = Router();

router.route("/getList").get(providerController.getProviders);
router
  .route("/getByTitle/:providerTitle")
  .get(providerController.getProviderByTitle);

// router
//   .route("")
//   .post(
//     verifyJWT,
//     verifyRoles(ROLES_LIST.Admin),
//     providerController.createProvider
//   );

router
  .route("")
  .put(
    verifyJWT,
    verifyRoles(ROLES_LIST.Admin),
    providerController.editProviderInfo
  );

export default router;
