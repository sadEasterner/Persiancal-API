import Router from "express";
import { verifyRoles, ROLES_LIST } from "../middleware/verifyRoles";
import articleController from "../controllers/articleController";
import { verifyJWT } from "../middleware/verifyJWT";
import fileUpload from "express-fileupload";
const router = Router();

router.route("/getList").get(articleController.getArticles);
// router.route("/getById/:id").get(articleController.getArticleById);

router
  .route("")
  .post(
    verifyJWT,
    verifyRoles(ROLES_LIST.Admin),
    fileUpload({ createParentPath: true, defParamCharset: "utf8" }),
    articleController.createArticle
  );

// router
//   .route("")
//   .put(verifyJWT, verifyRoles(ROLES_LIST.Admin), articleController.editArticle);

router
  .route("/:id")
  .delete(
    verifyJWT,
    verifyRoles(ROLES_LIST.Admin),
    articleController.deleteArticle
  );

export default router;
