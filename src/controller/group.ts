import express from "express";
import { MessagesConstants } from "../constants/Message";
import { Response } from "../constants/Response";
import { createGroup, deleteGroupById, getGroupById, getGroups } from "../model/group";
import { getUserById, getUsers } from "../model/user";

export const getAllGroupAction = async(req: express.Request, res: express.Response) =>{
    const response = new Response(res);
    try {
        const groups = await getGroups();
        return response.STATUS_200(groups);
    } catch (error) {
        console.log(error);
        return response.STATUS_500();
    }
}

export const getGroupByIdAction = async(req: express.Request, res: express.Response) =>{
    const response = new Response(res);
    try {
        const {id} = req.params;
        if (id && id !== 'undefined') {
        const users = await getUsers();
        const group = await getGroupById(id);
        if(!group){
            return response.STATUS_400(MessagesConstants.INVALID_ID);
        }
        const userCreated = await getUserById(group?.userCreate);
        const userGr = group.members.map(idUserGr => {
          users.map(itemUser => {
            if(itemUser._id.toString() == idUserGr.toString()){
                return itemUser;
            }
          })  
        });
        return response.STATUS_200({...group.toJSON(), userCreate: userCreated});
    }else return response.STATUS_400(MessagesConstants.INVALID_ID);
    } catch (error) {
        console.log(error);
        return response.STATUS_500();
    }
}

export const getMembersGroupAction = async(req: express.Request, res: express.Response) =>{
    const response = new Response(res);
    try {
        const {id} = req.params;
        const {pageNum, pageSize} = req.body;
        const usersGroup:any[] = []; 
        if (id && id !== 'undefined') {
        const users = await getUsers();
        const group = await getGroupById(id);
        if(!group){
            return response.STATUS_400(MessagesConstants.INVALID_ID);
        }
        group.members.map(idUserGr => {
          users.map(itemUser => {
            if(itemUser._id.toString() == idUserGr.toString()){
                usersGroup.push(itemUser);
            }
          })  
        });
        return response.STATUS_200_LIST(usersGroup, pageNum, pageSize);
    }else return response.STATUS_400(MessagesConstants.INVALID_ID);
    } catch (error) {
        return response.STATUS_500();
    }
}

export const removeMemberGroupAction = async (req: express.Request, res: express.Response) => {
    const response = new Response(res);
    try {
        const { id } = req.params;
        const { userIds } = req.body;

        if (!id) {
            return response.STATUS_400(MessagesConstants.INVALID_ID);
        }

        const group = await getGroupById(id);
        if (!group) {
            return response.STATUS_400(MessagesConstants.INVALID_ID);
        }

        const filteredMembers = group.members.filter(memberId => !userIds.includes(memberId.toString()));

        group.members = filteredMembers;
        group.soThanhVien = filteredMembers.length;

        await group.save();

        return response.STATUS_200(MessagesConstants.DELETE_SUCCESS);
    } catch (error) {
        console.log(error);
        return response.STATUS_500();
    }
}

export const createGroupAction = async(req: express.Request, res: express.Response) =>{
    const response = new Response(res);
    try {
        if (!req.body){
           return response.STATUS_400(MessagesConstants.EMPTY_DATA)
        };
        const {maSo, tenNhom } = req.body;
        const groups = await getGroups();
        const checkMaSo = groups.filter(item => item.maSo == maSo);
        const checkTenNhom = groups.filter(item => item.tenNhom == tenNhom);
        if(checkMaSo.length > 0){
            return response.STATUS_400("Mã số nhóm đã tồn tại!");
        }
        else if (checkTenNhom.length > 0) {
            return response.STATUS_400("Tên nhóm đã tồn tại!");
        }
        const group = await createGroup({...req.body, soThanhVien: req.body?.members ? req.body?.members.length : 0});
        return response.STATUS_200(group, MessagesConstants.CREATE_SUCCESS);
    } catch (error) {
        console.log(error);
        return response.STATUS_500();
    }
}

export const updateGroupByIdAction = async(req: express.Request, res: express.Response) =>{
    const response = new Response(res);
    try {
        const {id} = req.params;
        const {maSo, tenNhom, linkZalo, moTaNhom, members} = req.body;
        if(!maSo || !tenNhom || !linkZalo){
            return response.STATUS_400(MessagesConstants.EMPTY_DATA);
        }
        const group = await getGroupById(id);
        if(!group){
            return response.STATUS_400(MessagesConstants.INVALID_ID);
        }
        let groups = await getGroups();
        groups = groups.filter(item => item._id.toString() != id);
        const checkMaSo = groups.filter(item => item.maSo == maSo);
        const checkTenNhom = groups.filter(item => item.tenNhom == tenNhom);
        if(checkMaSo.length > 0){
            return response.STATUS_400("Mã số nhóm đã tồn tại!");
        }
        else if (checkTenNhom.length > 0) {
            return response.STATUS_400("Tên nhóm đã tồn tại!");
        }
        group.maSo = maSo;
        group.tenNhom = tenNhom;
        group.soThanhVien = members ? members?.length : 0;
        group.linkZalo = linkZalo;
        group.moTaNhom = moTaNhom;
        group.members = members;
        await group.save();
        return response.STATUS_200(group, MessagesConstants.UPDATE_SUCCESS);
    } catch (error) {
        console.log(error);
        return response.STATUS_500();
    }
}

export const addUsersToGroupAction = async(req: express.Request, res: express.Response) =>{
    const response = new Response(res);
    try {
        const {id} = req.params;
        const {userIds} = req.body;
        if(!userIds || !id || userIds?.length == 0){
            return response.STATUS_400(MessagesConstants.EMPTY_DATA);
        }
        const group = await getGroupById(id);
        if(!group){
            return response.STATUS_400(MessagesConstants.INVALID_ID);
        }
        group.soThanhVien = userIds.length ?? 0;
        group.members = [...group.members, ...userIds];
        await group.save();
        return response.STATUS_200(group, MessagesConstants.UPDATE_SUCCESS);
    } catch (error) {
        console.log(error);
        return response.STATUS_500();
    }
}


export const deleteGroupAction = async(req: express.Request, res: express.Response) =>{
    const response = new Response(res);
    try {
        const {id} = req.params;
        if (id && id !== 'undefined') {
            const existing = await getGroupById(id);
            if(!existing){
                return response.STATUS_400(MessagesConstants.INVALID_ID);
            }
            const deleted = await deleteGroupById(id);
            return response.STATUS_200(deleted, MessagesConstants.DELETE_SUCCESS);   
        }else return response.STATUS_400(MessagesConstants.INVALID_ID);
    } catch (error) {
        console.log(error);
        return response.STATUS_500();
    }
}
