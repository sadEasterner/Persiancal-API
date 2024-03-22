
import Router from 'express';
import productController from '../controllers/productController';
productController
import { verifyRoles, ROLES_LIST } from '../middleware/verifyRoles';
const router = Router();

router.route('/:id').get(productController.getProductById);
router.route('').post(verifyRoles(ROLES_LIST.Admin), productController.createProduct);
router.route('/getList').post(productController.getProducts);
router.route('').put(verifyRoles(ROLES_LIST.Admin), productController.editProduct);
router.route('/changeStatus').put(verifyRoles(ROLES_LIST.Admin), productController.changeProductStatus);
router.route('').delete(verifyRoles(ROLES_LIST.Admin), productController.changeProductStatus);

export default router;