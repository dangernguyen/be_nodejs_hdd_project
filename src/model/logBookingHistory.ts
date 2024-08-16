import mongoose from "mongoose";

const LogBookingHistorySchema = new mongoose.Schema({
    bookingID: {type: mongoose.Schema.Types.ObjectId,
        ref:"Booking",
        require: true},
    trangThaiID: {type: String, require: true},
    userChange: {type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        require: true},
    ghiChu: {type: String},
},
{
    timestamps: true
});

export const LogBookingHistory = mongoose.model('LogBookingHistory', LogBookingHistorySchema);
export const getLogBookingHistorys = () => LogBookingHistory.find();
export const getLogBookingHistoryById = (id:string) => LogBookingHistory.findById(id);
export const createLogBookingHistory = (values: Record<string,any>) => new LogBookingHistory(values)
.save().then((logHistory)=>logHistory.toObject());
export const updateLogBookingHistoryById = (id:string, values: Record<string,any>) => LogBookingHistory.findByIdAndUpdate(id,values);
export const deleteLogBookingHistoryById = (id:string) => LogBookingHistory.findOneAndDelete({_id: id});