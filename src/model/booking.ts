import { StatusBooking } from "../constants/Status";
import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
    userFullName: {type: String, require: true},
    userPhone: {type: String, require: true},
    userID: {type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        require: false},
    loaiXe: {type: mongoose.Schema.Types.ObjectId,
            ref:"TypeVehicle",
            require: true},
    gioDon: {type: Date, require: true},
    ngayDon: {type: Date, require: true},
    tinhDon: {type: String, require: true},
    huyenDon: {type: String, require: true},
    xaDon: {type: String, require: true},
    chiTietNoiDon: {type: String, require: true},
    tinhDen: {type: String, require: true},
    huyenDen: {type: String, require: true},
    xaDen: {type: String, require: true},
    chiTietNoiDen: {type: String, require: true},
    ghiChu: {type: String, require: false},
    haveAccount: {type: Boolean, default: false},
    trangThai: {type: String, default: StatusBooking[0]._id},
    taiXe: {type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        require: false
    },
},
{
    timestamps: true
});

export const BookingModel = mongoose.model('Booking', BookingSchema);
export const getBookings = () => BookingModel.find();
export const getBookingById = (id:string) => BookingModel.findById(id);
export const createBooking = (values: Record<string,any>) => new BookingModel(values)
.save().then((booking)=>booking.toObject());
export const updateBookingById = (id:string, values: Record<string,any>) => BookingModel.findByIdAndUpdate(id,values);
export const deleteBookingById = (id:string) => BookingModel.findOneAndDelete({_id: id});