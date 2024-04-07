import Router from 'express';
import { verifyRoles, ROLES_LIST } from '../middleware/verifyRoles';
import labController from '../controllers/labController';
const router = Router();

router.route('/getList').get(labController.getLabs);
router.route('/getById/:id').get(labController.getLabById);

router.route('').post(verifyRoles(ROLES_LIST.Admin), labController.createLab);

router.route('').put(verifyRoles(ROLES_LIST.Admin), labController.editLab);
// router.route('/changeStatus').put(verifyRoles(ROLES_LIST.Admin), labController.changeLabStatus);

router.route('/:id').delete(verifyRoles(ROLES_LIST.Admin), labController.deleteLab);

export default router;