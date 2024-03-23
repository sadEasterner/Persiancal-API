
import Router from 'express';
import userController from '../controllers/userController';
import { verifyRoles, ROLES_LIST } from '../middleware/verifyRoles';
import { verifyJWT } from '../middleware/verifyJWT';
const router = Router();

router.route('/:username').get(userController.getUserByUsername);

router.route('').post(verifyJWT, verifyRoles(ROLES_LIST.Admin), userController.createUser);
router.route('/getList').post(userController.getUsers);

router.route('').put(verifyJWT, verifyRoles(ROLES_LIST.Admin), userController.editUser);
router.route('/changeStatus').put(verifyJWT, verifyRoles(ROLES_LIST.Admin), userController.changeUserStatus);

router.route('').delete(verifyJWT, verifyRoles(ROLES_LIST.Admin), userController.changeUserStatus);

export default router;