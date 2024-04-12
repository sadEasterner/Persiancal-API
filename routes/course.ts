import Router from 'express';
import { verifyRoles, ROLES_LIST } from '../middleware/verifyRoles';
import courseController from '../controllers/courseController';
const router = Router();

router.route('/getList').get(courseController.getCourses);
router.route('/getById/:id').get(courseController.getCourseById);

router.route('').post(verifyRoles(ROLES_LIST.Admin), courseController.createCourse);

router.route('').put(verifyRoles(ROLES_LIST.Admin), courseController.editCourse);

router.route('/:id').delete(verifyRoles(ROLES_LIST.Admin), courseController.deleteCourse);

export default router;