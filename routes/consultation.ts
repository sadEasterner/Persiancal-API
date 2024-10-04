import Router from "express";
import { verifyRoles, ROLES_LIST } from "../middleware/verifyRoles";
import consultationController from "../controllers/consultationController";
import { verifyJWT } from "../middleware/verifyJWT";
import fileUpload from "express-fileupload";
const router = Router();

router.route("/getList").get(consultationController.getConsultations);
// router.route("/getById/:id").get(consultationController.getConsultationById);

router
  .route("")
  .post(
    verifyJWT,
    verifyRoles(ROLES_LIST.Admin),
    fileUpload({ createParentPath: true }),
    consultationController.createConsultation
  );

router
  .route("")
  .put(
    verifyJWT,
    verifyRoles(ROLES_LIST.Admin),
    consultationController.editConsultation
  );

router
  .route("/:id")
  .delete(
    verifyJWT,
    verifyRoles(ROLES_LIST.Admin),
    consultationController.deleteConsultation
  );

export default router;
