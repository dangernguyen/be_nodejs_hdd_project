import express from "express";
import { isAuthenticatedAdmin } from "../../middlewares";
import { addUsersToGroupAction, createGroupAction, deleteGroupAction, getAllGroupAction, getGroupByIdAction, getMembersGroupAction, removeMemberGroupAction, updateGroupByIdAction } from "../../controller/group";

export default (router:express.Router)=>{
    router.get('/groups',isAuthenticatedAdmin, getAllGroupAction);
    router.post('/groups',isAuthenticatedAdmin, createGroupAction);
    router.put('/groups/:id',isAuthenticatedAdmin, updateGroupByIdAction);
    router.delete('/groups/:id',isAuthenticatedAdmin, deleteGroupAction);
    router.get('/groups/:id',isAuthenticatedAdmin, getGroupByIdAction);
    router.post('/groups/add-members/:id',isAuthenticatedAdmin, addUsersToGroupAction);
    router.post('/groups/members/:id',isAuthenticatedAdmin, getMembersGroupAction);
    router.post('/groups/members/remove/:id',isAuthenticatedAdmin, removeMemberGroupAction);
};