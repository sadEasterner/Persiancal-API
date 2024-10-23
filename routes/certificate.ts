import Router from "express";
import { verifyRoles, ROLES_LIST } from "../middleware/verifyRoles";
import certificateController from "../controllers/certificateController";
import { verifyJWT } from "../middleware/verifyJWT";
import fileUpload from "express-fileupload";
const router = Router();

router.route("/getList").get(certificateController.getCertificates);
// router.route("/getById/:id").get(articleController.getArticleById);

router
  .route("")
  .post(
    verifyJWT,
    verifyRoles(ROLES_LIST.Admin),
    fileUpload({ createParentPath: true, defParamCharset: "utf8" }),
    certificateController.createCertificate
  );

// router
//   .route("")
//   .put(verifyJWT, verifyRoles(ROLES_LIST.Admin), articleController.editArticle);

router
  .route("/:id")
  .delete(
    verifyJWT,
    verifyRoles(ROLES_LIST.Admin),
    certificateController.deleteCertificate
  );

export default router;
