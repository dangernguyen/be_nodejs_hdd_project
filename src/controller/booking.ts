import express from "express";
import { MessagesConstants } from "../constants/Message";
import { Response } from "../constants/Response";
import { createBooking, deleteBookingById, getBookingById, getBookings } from "../model/booking";
import { createLogBookingHistory, getLogBookingHistoryById, getLogBookingHistorys } from "../model/logBookingHistory";

export const getAllBookingAction = async(req: express.Request, res: express.Response) =>{
    const response = new Response(res);
    try {
        const results = await getBookings();
        return response.STATUS_200(results);
    } catch (error) {
        console.log(error);
        return response.STATUS_500();
    }
}

export const getBookingByIdAction = async(req: express.Request, res: express.Response) =>{
    const response = new Response(res);
    try {
        const {id} = req.params;
        if(id){
            const results = await getBookingById(id)
            return response.STATUS_200(results);
        } else return response.STATUS_400(MessagesConstants.INVALID_ID);
    } catch (error) {
        console.log(error);
        return response.STATUS_500();
    }
}

export const createBookingAction = async(req: express.Request, res: express.Response) =>{
    const response = new Response(res);
    try {
        if (!req.body){
           return response.STATUS_400(MessagesConstants.EMPTY_DATA)
        };
        const {userFullName,
            userPhone,
            loaiXe,
            gioDon,
            ngayDon,
            tinhDon,
            huyenDon,
            xaDon,
            chiTietNoiDon,
            tinhDen,
            huyenDen,
            xaDen,
            chiTietNoiDen } = req.body;
        if(!userFullName 
            || !userPhone 
            || !loaiXe 
            || !gioDon 
            || !ngayDon 
            || !tinhDon
            || !huyenDon
            || !xaDon
            || !chiTietNoiDon
            || !tinhDen
            || !huyenDen
            || !xaDen
            || !chiTietNoiDen
        ) 
        return response.STATUS_400(MessagesConstants.EMPTY_DATA);
        const results = await createBooking(req.body);
        return response.STATUS_200(results, MessagesConstants.CREATE_SUCCESS);
    } catch (error) {
        console.log(error);
        return response.STATUS_500();
    }
}

export const updateBookingByIdAction = async(req: express.Request, res: express.Response) =>{
    const response = new Response(res);
    try {
        const {id} = req.params;
        if(!id)return response.STATUS_400(MessagesConstants.INVALID_ID);
        const Booking = await getBookingById(id);
        if(Booking) return response.STATUS_400(MessagesConstants.INVALID_ID);
        const {userFullName,
            userPhone,
            userID,
            loaiXe,
            gioDon,
            ngayDon,
            tinhDon,
            huyenDon,
            xaDon,
            chiTietNoiDon,
            tinhDen,
            huyenDen,
            xaDen,
            chiTietNoiDen} = req.body;
            if(!userFullName 
                || !userPhone 
                || !loaiXe 
                || !gioDon 
                || !ngayDon 
                || !tinhDon
                || !huyenDon
                || !xaDon
                || !chiTietNoiDon
                || !tinhDen
                || !huyenDen
                || !xaDen
                || !chiTietNoiDen
            ) 
            return response.STATUS_400(MessagesConstants.EMPTY_DATA);
        let update = await Booking.updateOne({$set: req.body});
        return response.STATUS_200(update, MessagesConstants.UPDATE_SUCCESS);
    } catch (error) {
        console.log(error);
        return response.STATUS_500();
    }
}

export const deleteBookingAction = async(req: express.Request, res: express.Response) =>{
    const response = new Response(res);
    try {
        const {id} = req.params;
        if(!id) return response.STATUS_400(MessagesConstants.INVALID_ID);
            const existing = await getBookingById(id);
            if(!existing){
                return response.STATUS_400(MessagesConstants.INVALID_ID);
            }
            const deleted = await deleteBookingById(id);
            return response.STATUS_200(deleted, MessagesConstants.DELETE_SUCCESS);
    } catch (error) {
        console.log(error);
        return response.STATUS_500();
    }
}


export const createLogBookingAction = async(req: express.Request, res: express.Response) =>{
    const response = new Response(res);
    try {
        if (!req.body){
           return response.STATUS_400(MessagesConstants.EMPTY_DATA)
        };
        const {bookingID,
            trangThaiID,
            userChange,
            ghiChu} = req.body;
        if(!bookingID 
            || !trangThaiID
            || !userChange
        ) 
        return response.STATUS_400(MessagesConstants.EMPTY_DATA);
        const results = await createLogBookingHistory(req.body);
        return response.STATUS_200(results, MessagesConstants.CREATE_SUCCESS);
    } catch (error) {
        console.log(error);
        return response.STATUS_500();
    }
}

export const getAllLogBookingAction = async(req: express.Request, res: express.Response) =>{
    const response = new Response(res);
    try {
        const results = await getLogBookingHistorys();
        return response.STATUS_200(results);
    } catch (error) {
        console.log(error);
        return response.STATUS_500();
    }
}

export const getLogBookingByIdAction = async(req: express.Request, res: express.Response) =>{
    const response = new Response(res);
    try {
        const {id} = req.params;
        if(id){
            const results = await getLogBookingHistoryById(id)
            return response.STATUS_200(results);
        } else return response.STATUS_400(MessagesConstants.INVALID_ID);
    } catch (error) {
        console.log(error);
        return response.STATUS_500();
    }
}