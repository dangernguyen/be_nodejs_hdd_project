import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema({
    maSo: {type: String, require: true},
    tenNhom: {type: String, require: true},
    moTaNhom: {type: String, require: true},
    soThanhVien: {type: Number, require: true},
    linkZalo: {type: String, require: true},
    userCreate: {type: String, require: true},
    members: [{type: String}]
},
{
    timestamps: true
});

export const GroupModel = mongoose.model('Group', GroupSchema);
export const getGroups = () => GroupModel.find();
export const getGroupById = (id:string) => GroupModel.findById(id);
export const createGroup = (values: Record<string,any>) => new GroupModel(values)
.save().then((group)=>group.toObject());
export const updateGroupById = (id:string, values: Record<string,any>) => GroupModel.findByIdAndUpdate(id,values);
export const deleteGroupById = (id:string) => GroupModel.findOneAndDelete({_id: id});