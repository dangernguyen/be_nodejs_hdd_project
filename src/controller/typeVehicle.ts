import express from "express";
import { MessagesConstants } from "../constants/Message";
import { Response } from "../constants/Response";
import { createTypeVehicle, deleteTypeVehicleById, getTypeVehicleById, getTypeVehicles } from "../model/typeVehicle";

export const getAllTypeVehicleAction = async(req: express.Request, res: express.Response) =>{
    const response = new Response(res);
    try {
        const results = await getTypeVehicles();
        return response.STATUS_200(results);
    } catch (error) {
        console.log(error);
        return response.STATUS_500();
    }
}

export const getTypeVehicleByIdAction = async(req: express.Request, res: express.Response) =>{
    const response = new Response(res);
    try {
        const {id} = req.params;
        if(id){
            const results = await getTypeVehicleById(id)
            return response.STATUS_200(results);
        } else return response.STATUS_400(MessagesConstants.INVALID_ID);
    } catch (error) {
        console.log(error);
        return response.STATUS_500();
    }
}

export const createTypeVehicleAction = async(req: express.Request, res: express.Response) =>{
    const response = new Response(res);
    try {
        if (!req.body){
           return response.STATUS_400(MessagesConstants.EMPTY_DATA)
        };
        const {tenXe, soCho } = req.body;
        if(!tenXe) return response.STATUS_400("Tên xe không được để trống!");
        if(!soCho) return response.STATUS_400("Số chỗ xe không được để trống!");
        const loaiXes = await getTypeVehicles();
        const checkTen = loaiXes.filter(item => item.tenXe.toLocaleLowerCase() == tenXe.toLocaleLowerCase());
        if(checkTen.length > 0){
            return response.STATUS_400("Tên xe đã tồn tại!");
        }
        const results = await createTypeVehicle(req.body);
        return response.STATUS_200(results, MessagesConstants.CREATE_SUCCESS);
    } catch (error) {
        console.log(error);
        return response.STATUS_500();
    }
}

export const updateTypeVehicleByIdAction = async(req: express.Request, res: express.Response) =>{
    const response = new Response(res);
    try {
        const {id} = req.params;
        const {tenXe, soCho, moTa } = req.body;
        if(!id) return response.STATUS_400(MessagesConstants.INVALID_ID);
        if(!tenXe) return response.STATUS_400("Tên xe không được để trống!");
        if(!soCho) return response.STATUS_400("Số chỗ xe không được để trống!");
        const loaiXe = await getTypeVehicleById(id);
        if(!loaiXe) return response.STATUS_400(MessagesConstants.INVALID_ID);
        let loaiXes = await getTypeVehicles();
        loaiXes = loaiXes.filter(item => item._id.toString() != id);
        const checkTen = loaiXes.filter(item => item.tenXe.toLocaleLowerCase() == tenXe.toLocaleLowerCase());
        if(checkTen.length > 0){
            return response.STATUS_400("Tên xe đã tồn tại!");
        }
        
        let update = await loaiXe.updateOne({$set: req.body});
        return response.STATUS_200(update, MessagesConstants.UPDATE_SUCCESS);
    } catch (error) {
        console.log(error);
        return response.STATUS_500();
    }
}

export const deleteTypeVehicleAction = async(req: express.Request, res: express.Response) =>{
    const response = new Response(res);
    try {
        const {id} = req.params;
        if(!id) return response.STATUS_400(MessagesConstants.INVALID_ID);
            const existing = await getTypeVehicleById(id);
            if(!existing){
                return response.STATUS_400(MessagesConstants.INVALID_ID);
            }
            const deleted = await deleteTypeVehicleById(id);
            return response.STATUS_200(deleted, MessagesConstants.DELETE_SUCCESS);
    } catch (error) {
        console.log(error);
        return response.STATUS_500();
    }
}
