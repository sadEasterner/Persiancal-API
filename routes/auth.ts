import Router from 'express';
import authController from '../controllers/authController';

const router = Router();


router.route('/login').post(authController.login);
router.route('/signup').post(authController.signup);
router.route('/forget').post(authController.forgetPassword);
router.route('/logout').get(authController.logout);

export default router;