
import Router from 'express';
import userController from '../controllers/userController';
import { verifyRoles, ROLES_LIST } from '../middleware/verifyRoles';
import fileUpload from 'express-fileupload';
const router = Router();

router.route('/getList').get(verifyRoles(ROLES_LIST.Admin), userController.getUsers);
router.route('/getByUsername/:username').get(userController.getUserByUsername);

router.route('').post(verifyRoles(ROLES_LIST.Admin),
fileUpload({ createParentPath: true }),
userController.createUser);

router.route('').put(verifyRoles(ROLES_LIST.Admin), userController.editUser);
router.route('/changeStatus').put( verifyRoles(ROLES_LIST.Admin), userController.changeUserStatus);

router.route('/:username').delete(verifyRoles(ROLES_LIST.Admin), userController.deleteUser);

export default router;