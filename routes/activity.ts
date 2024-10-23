import Router from "express";
import { verifyRoles, ROLES_LIST } from "../middleware/verifyRoles";
import activityController from "../controllers/activityController";
import { verifyJWT } from "../middleware/verifyJWT";
import fileUpload from "express-fileupload";
const router = Router();

router.route("/getList").get(activityController.getActivities);

router
  .route("")
  .post(
    verifyJWT,
    verifyRoles(ROLES_LIST.Admin),
    fileUpload({ createParentPath: true, defParamCharset: "utf8" }),
    activityController.createActivity
  );

router
  .route("/:id")
  .delete(
    verifyJWT,
    verifyRoles(ROLES_LIST.Admin),
    activityController.deleteActivity
  );

export default router;
