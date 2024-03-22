
import Router from 'express';
import productController from '../controllers/productController';
productController
//import { verifyRoles, ROLES_LIST } from '../middleware/verifyRoles';
const router = Router();

router.route('').get();
router.route('').post(productController.createProduct);
router.route('/getList').post(productController.getProducts);
router.route('').put();
router.route('').delete();

export default router;