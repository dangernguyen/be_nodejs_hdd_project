import express from 'express';
import { merge } from 'lodash';
import { UserModel, getUserBySessionToken } from '../model/user';
import { Response } from '../constants/Response';
import moment from 'moment';

export const isOwer = async(req: express.Request, res: express.Response, next: express.NextFunction)=>{
    const response = new Response(res);
    try {
        const authorization = req.headers?.authorization;
        if (!authorization) {
            return response.STATUS_401();
        }
        const token = authorization.split(" ")[1];
        const existingUser = await getUserBySessionToken(token);
        if (!existingUser) {
            return response.STATUS_401();
        }
        merge(req, {identity: existingUser});
        return next();
    } catch (error) {
        console.log(error);
        return response.STATUS_500();
    }
}

export const isAuthenticated = async(req: express.Request, res: express.Response, next: express.NextFunction)=>{
    const response = new Response(res);
    try {
        const authorization = req.headers?.authorization;
        if (!authorization) {
            return response.STATUS_401();
        }
        const token = authorization.split(" ")[1];
        const existingUser = await getUserBySessionToken(token).select('+sessionToken.token + +sessionToken.expiresAt');
        if (!existingUser) {
            return response.STATUS_401();
        }
        let isValid = await isValidToken(existingUser);
        if(!isValid) return response.STATUS_401();
        merge(req, {identity: existingUser});
        return next();
    } catch (error) {
        console.log(error);
        return response.STATUS_500();
    }
}

export const isAuthenticatedAdmin = async(req: express.Request, res: express.Response, next: express.NextFunction)=>{
    const response = new Response(res);
    try {
        const authorization = req.headers?.authorization;
        if (!authorization) {
            return response.STATUS_401();
        }
        const token = authorization.split(" ")[1];
        const existingUser = await getUserBySessionToken(token).select('+sessionToken.token + +sessionToken.expiresAt');
        if (!existingUser) {
            return response.STATUS_401();
        }
        let isValid = await isValidToken(existingUser);
        if(isValid === false) return response.STATUS_401();
        if(!existingUser.isAdmin){
            return response.STATUS_403();
        }
        merge(req, {identity: existingUser});
        return next();
    } catch (error) {
        console.log(error);
        return response.STATUS_500();
    }
}

export const isAuthenticatedDriver = async(req: express.Request, res: express.Response, next: express.NextFunction)=>{
    const response = new Response(res);
    try {
        const authorization = req.headers?.Authorization?.toString();
        if (!authorization) {
            return response.STATUS_401();
        }
        const token = authorization.split(" ")[1];
        const existingUser = await getUserBySessionToken(token).select('+sessionToken.token + +sessionToken.expiresAt');
        if (!existingUser) {
            return response.STATUS_401();
        }
        let isValid = await isValidToken(existingUser);
        if(isValid === false) return response.STATUS_401();
        if(!existingUser.isAdmin && !existingUser.isDriver){
            return response.STATUS_403();
        }
        merge(req, {identity: existingUser});
        return next();
    } catch (error) {
        console.log(error);
        return response.STATUS_500();
    }
}


const isValidToken = async(user:any) =>{
    const currentDate = moment();
    const expiresAt = moment(user?.sessionToken?.expiresAt);
    if (expiresAt.isBefore(currentDate)) {
        user.sessionToken.token = '';
        user.sessionToken.expiresAt = null;
        await user.save();
        return false;
    }
    else return true
}