import mongoose from "mongoose";

const TypeVehicleSchema = new mongoose.Schema({
    tenXe: {type: String, require: true},
    soCho: {type: String, require: true},
    moTa: {type: String, require: false},
},
{
    timestamps: true
});

export const TypeVehicleModel = mongoose.model('TypeVehicle', TypeVehicleSchema);
export const getTypeVehicles = () => TypeVehicleModel.find();
export const getTypeVehicleById = (id:string) => TypeVehicleModel.findById(id);
export const createTypeVehicle = (values: Record<string,any>) => new TypeVehicleModel(values)
.save().then((TypeVehicle)=>TypeVehicle.toObject());
export const updateTypeVehicleById = (id:string, values: Record<string,any>) => TypeVehicleModel.findByIdAndUpdate(id,values);
export const deleteTypeVehicleById = (id:string) => TypeVehicleModel.findOneAndDelete({_id: id});