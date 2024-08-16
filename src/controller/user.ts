import express from "express";
import { deleteUserById, getUserById, getUsers } from "../model/user";
import { MessagesConstants } from "../constants/Message";
import { Response } from "../constants/Response";
import { getGroupById } from "../model/group";
import { searchData } from "../helpers";

const typeUserConstant = {
    Admin: 'admin',
    Driver: 'driver',
    User: 'user',
}

export const getAllUserAction = async(req: express.Request, res: express.Response) =>{
    const response = new Response(res);
    try {
        const users = await getUsers();
        return response.STATUS_200(users.map);
    } catch (error) {
        console.log(error);
        return response.STATUS_500();
    }
}

export const getAllUserTypeAction = async (req: express.Request, res: express.Response) => {
    const response = new Response(res);
    try {
        const {identity}:any = req;
        const { typeUser, groupId, pageNum, pageSize, typeSearch, searchPattern } = req.body;
        let users = await getUsers();
        users = users.filter(item => item._id.toString() != identity?._id.toString());
        if (typeUser) {
            if (groupId) {
                const group = await getGroupById(groupId);
                const memberIds = group.members.map(member => member.toString());
                users = users.filter(user => !memberIds.includes(user._id.toString()));
            }

            switch (typeUser) {
                case typeUserConstant.Admin:
                    users = users.filter(user => user.isAdmin);
                    break;
                case typeUserConstant.Driver:
                    users = users.filter(user => user.isDriver);
                    break;
                case typeUserConstant.User:
                    users = users.filter(user => user.isUser);
                    break;
                default:
                    break;
            }
        }

        if(searchPattern){
            users = searchData((typeSearch && typeSearch?.length > 0) ? typeSearch : ["fullName", "email", "phone"], searchPattern, users)
        }

        return response.STATUS_200(users);
    } catch (error) {
        console.log(error);
        return response.STATUS_500();
    }
}

export const getAllUserByIdAction = async(req: express.Request, res: express.Response) =>{
    const response = new Response(res);
    try {
        const {id} = req.params;
        const user = await getUserById(id);
        if(!user){
            return response.STATUS_400(MessagesConstants.INVALID_ID);
        }
        return response.STATUS_200(user);
    } catch (error) {
        console.log(error);
        return response.STATUS_500();
    }
}

export const updateUserByIdAction = async(req: express.Request, res: express.Response) =>{
    const response = new Response(res);
    try {
        const {id} = req.params;
        const {fullName, birth, address, avt} = req.body;
        if(!fullName || !birth || !address || !avt){
            return response.STATUS_400(MessagesConstants.EMPTY_DATA);
        }
        const user = await getUserById(id);
        if(!user){
            return response.STATUS_400(MessagesConstants.INVALID_ID);
        }
        user.fullName = fullName;
        user.birth = birth;
        user.address = address;
        user.avt = avt;
        await user.save();
        return response.STATUS_200(user, MessagesConstants.UPDATE_SUCCESS);
    } catch (error) {
        console.log(error);
        return response.STATUS_500();
    }
}


export const deleteUserAction = async(req: express.Request, res: express.Response) =>{
    const response = new Response(res);
    try {
        const {id} = req.params;
        const existingUser = await getUserById(id);
        if(!existingUser){
            return response.STATUS_400(MessagesConstants.INVALID_ID);
        }
        const deletedUser = await deleteUserById(id);
        return response.STATUS_200(deletedUser, MessagesConstants.DELETE_SUCCESS);
    } catch (error) {
        console.log(error);
        return response.STATUS_500();
    }
}