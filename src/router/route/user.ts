import express from "express";
import { deleteUserAction, getAllUserAction, getAllUserByIdAction, getAllUserTypeAction, updateUserByIdAction } from "../../controller/user";
import { isAuthenticatedAdmin } from "../../middlewares";

export default (router:express.Router)=>{
    router.get('/users',isAuthenticatedAdmin, getAllUserAction);
    router.post('/users/type',isAuthenticatedAdmin, getAllUserTypeAction);
    router.get('/users/:id',isAuthenticatedAdmin, getAllUserByIdAction);
    router.put('/users/:id',isAuthenticatedAdmin, updateUserByIdAction);
    // router.put('/users/client/:id',isAuthenticatedAdmin, updateUserByIdAction);
    router.delete('/users/:id',isAuthenticatedAdmin, deleteUserAction);
};