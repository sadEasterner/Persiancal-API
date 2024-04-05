import Router from 'express';
import productController from '../controllers/productController';
import { verifyRoles, ROLES_LIST } from '../middleware/verifyRoles';
import { verifyJWT } from '../middleware/verifyJWT';
const router = Router();

router.route('/getList').get(productController.getProducts);
router.route('/getById/:id').get(productController.getProductById);

router.route('').post(verifyJWT, verifyRoles(ROLES_LIST.Admin), productController.createProduct);

router.route('').put(verifyJWT, verifyRoles(ROLES_LIST.Admin), productController.editProduct);
router.route('/changeStatus').put(verifyJWT, verifyRoles(ROLES_LIST.Admin), productController.changeProductStatus);

router.route('/:id').delete(verifyJWT, verifyRoles(ROLES_LIST.Admin), productController.deleteProduct);

export default router;