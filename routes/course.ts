import Router from "express";
import { verifyRoles, ROLES_LIST } from "../middleware/verifyRoles";
import courseController from "../controllers/courseController";
import { verifyJWT } from "../middleware/verifyJWT";
const router = Router();

router.route("/getList").get(courseController.getCourses);
router.route("/getById/:id").get(courseController.getCourseById);

router
  .route("")
  .post(
    verifyJWT,
    verifyRoles(ROLES_LIST.Admin),
    courseController.createCourse
  );

router
  .route("")
  .put(verifyJWT, verifyRoles(ROLES_LIST.Admin), courseController.editCourse);

router
  .route("/:id")
  .delete(
    verifyJWT,
    verifyRoles(ROLES_LIST.Admin),
    courseController.deleteCourse
  );

export default router;
