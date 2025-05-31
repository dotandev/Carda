import { authController } from '../controllers';
import { Router } from 'express';

export const userRouter = Router() 

userRouter.post('/signup/user', authController.createUser);
userRouter.post('/login/user', authController.loginUser);

userRouter.post('/signup/doctor', authController.createDoctor);
userRouter.post('/login/doctor', authController.loginDoctor);

userRouter.post('/signup/org', authController.createOrg);
userRouter.post('/login/org', authController.loginOrg);

userRouter.post('/signup/pharmacist', authController.createPharmacist);
userRouter.post('/login/pharmacist', authController.loginPharmacist);

