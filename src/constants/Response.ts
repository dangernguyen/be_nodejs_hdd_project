import express from 'express';
import { MessagesConstants } from './Message';

export class Response{
    response: express.Response;
    constructor(response: express.Response) {
        this.response = response;
    }
    public STATUS_200_LIST = (data:any,pageNum:any, pageSize:any, message?: string) => 
    this.response.status(200).json({
        results: data,
        pageNum: pageNum ?? 0,
        pageSize: pageSize ?? 0, 
        message: message ?? MessagesConstants.IS_SUCCESS, 
        code: 200
    });
    public STATUS_200 = (data:any, message?: string) => this.response.status(200).json({results: data, message: message ?? MessagesConstants.IS_SUCCESS, code: 200});
    public STATUS_400 = (message?: string) => this.response.status(400).json({message: message ?? MessagesConstants.IS_FAILED, code: 400});
    public STATUS_401 = () => this.response.status(401).json({message: MessagesConstants.UNAUTHORIZED, code: 401});
    public STATUS_403 = () => this.response.status(403).json({message: MessagesConstants.FORBIDDEN, code: 403});
    public STATUS_500 = () => this.response.status(500).json({message: MessagesConstants.SERVER_ERROR, code: 500});
}