import Router from "express";
import { verifyRoles, ROLES_LIST } from "../middleware/verifyRoles";
import labController from "../controllers/labController";
import { verifyJWT } from "../middleware/verifyJWT";
import fileUpload from "express-fileupload";
const router = Router();

router.route("/getList").get(labController.getLabs);
router.route("/getById/:id").get(labController.getLabById);

router
  .route("")
  .post(
    verifyJWT,
    verifyRoles(ROLES_LIST.Admin),
    fileUpload({ createParentPath: true }),
    labController.createLab
  );

router
  .route("")
  .put(
    verifyJWT,
    verifyRoles(ROLES_LIST.Admin),
    fileUpload({ createParentPath: true }),
    labController.editLab
  );

router
  .route("/:id")
  .delete(verifyJWT, verifyRoles(ROLES_LIST.Admin), labController.deleteLab);

export default router;
