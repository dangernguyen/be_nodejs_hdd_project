import express from 'express';
import { getRoleByToken, loginAction, registerAction } from '../../controller/authentication';
import { isAuthenticated } from '../../middlewares';

export default (router: express.Router) =>{
    router.post('/auth/register', registerAction);
    router.post('/auth/login', loginAction),
    router.get('/auth/role', isAuthenticated, getRoleByToken)
}