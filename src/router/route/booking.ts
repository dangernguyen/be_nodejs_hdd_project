import express from "express";
import { isAuthenticatedAdmin } from "../../middlewares";
import { createBookingAction, createLogBookingAction, deleteBookingAction, getAllBookingAction, getAllLogBookingAction, getBookingByIdAction, getLogBookingByIdAction, updateBookingByIdAction } from "../../controller/booking";

export default (router:express.Router)=>{
    router.get('/bookings',isAuthenticatedAdmin, getAllBookingAction);
    router.post('/bookings',isAuthenticatedAdmin, createBookingAction);
    router.put('/bookings/:id',isAuthenticatedAdmin, updateBookingByIdAction);
    router.delete('/bookings/:id',isAuthenticatedAdmin, deleteBookingAction);
    router.get('/bookings/:id',isAuthenticatedAdmin, getBookingByIdAction);
    //Log
    router.get('/bookings-log',isAuthenticatedAdmin, getAllLogBookingAction);
    router.get('/bookings-log/:id',isAuthenticatedAdmin, getLogBookingByIdAction);
    router.get('/bookings-log',isAuthenticatedAdmin, createLogBookingAction);
};