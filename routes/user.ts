
import Router from 'express';
import userController from '../controllers/userController';
import { verifyRoles, ROLES_LIST } from '../middleware/verifyRoles';
const router = Router();

router.route('').get();
router.route('').post(userController.createUser);
router.route('/get').post(userController.getUsers);
router.route('/').put();
router.route('/').delete();

export default router;