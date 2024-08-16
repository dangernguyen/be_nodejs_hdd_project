import moment from 'moment';
import { createUser, getUserByEmail, getUserByPhone, getUserBySessionToken } from "../model/user";
import express from "express";
import { enCrypt, randomToken } from "../helpers";
import { MessagesConstants } from "../constants/Message";
import { Response } from "../constants/Response";


export const registerAction = async (req: express.Request, res: express.Response) => {
    const response = new Response(res);
    try {
        const { fullName, email, phone, password } = req.body;
        if (!email || !password || !fullName || !phone) {
            return response.STATUS_400(MessagesConstants.EMPTY_DATA);
        }
        const existingUserEmail = await getUserByEmail(email);
        if (existingUserEmail) {
            return response.STATUS_400(MessagesConstants.INVALID_EMAIL);
        }
        const existingUserPhone = await getUserByPhone(phone);
        if (existingUserPhone) {
            return response.STATUS_400(MessagesConstants.INVALID_PHONE);
        }
        const salt = randomToken();
        const user = await createUser({
            ...req.body,
            isAdmin: false,
            authentication:{
                salt,
                password: enCrypt(salt, password)
            }
        });
        user.authentication = {};
        return response.STATUS_200(user, MessagesConstants.CREATE_SUCCESS);

    } catch (error) {
        console.log(error);
        return response.STATUS_500();
    }
};


export const loginAction = async (req: express.Request, res: express.Response) => {
    const response = new Response(res);
    try {
        const { email, phone, password } = req.body;
        if (!email && !phone && !password) {
            return response.STATUS_400(MessagesConstants.EMPTY_DATA);
        }
        if (!password) {
            return response.STATUS_400(MessagesConstants.EMPTY_PASSWORD);
        }
        
        let user;
        // Login with email
        if (email && !phone) {
            user = await getUserByEmail(email).select('+authentication.salt + +authentication.password');
        } 
        // Login with phone
        else if (phone && !email) {
            user = await getUserByPhone(phone).select('+authentication.salt + +authentication.password');
        } 
        else {
            return response.STATUS_400(MessagesConstants.EMPTY_USERNAME);
        }
        if (!user) {
            return response.STATUS_400(MessagesConstants.LOGIN_FAILED);
        }

        if (user.isDisable == true) {
            return response.STATUS_400(MessagesConstants.USER_DISABLED);
        }

        const expectedHash = enCrypt(user?.authentication.salt,password);
        if(user.authentication.password !== expectedHash){
            return response.STATUS_400(MessagesConstants.LOGIN_FAILED);
        }
        const salt = randomToken();
        user.sessionToken.token = enCrypt(salt, user._id.toString());
        user.sessionToken.expiresAt = moment().add(4, 'hours').toDate();
        await user.save();
        user.authentication = {}
        return response.STATUS_200(user, MessagesConstants.LOGIN_SUCCESS);
    } catch (error) {
        console.log(error);
        return response.STATUS_500();
    }
}

export const getRoleByToken = async(req: express.Request, res: express.Response) =>{
    let response = new Response(res);
    const token = req.headers?.authorization.split(" ")[1];
    const existingUser = await getUserBySessionToken(token);
    let results = {
        isAdmin: existingUser.isAdmin,
        isUser: existingUser.isUser,
        isDriver: existingUser.isDriver
    }
    response.STATUS_200(results,MessagesConstants.IS_SUCCESS);
}
