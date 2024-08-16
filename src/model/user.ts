import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    fullName: {type: String, require: true},
    email: {type: String, require: true},
    phone: {type: String, require: true},
    birth: {type: Date, require: false},
    tinhThanhPho: {type: String, require: true},
    quanHuyen: {type: String, require: true},
    xaPhuong: {type: String, require: true},
    address: {type: String, require: false},
    avt: {type: String, require: false},
    // groups: [{type: String}],
    isAdmin: {type: Boolean, default: false},
    isUser: {type: Boolean, default: true},
    isDriver: {type: Boolean, default: false},
    isDisable: {type: Boolean, default: false},
    authentication:{
        password: {type: String, require: true, select: false},
        salt: {type: String, select: false},
    },
    sessionToken: {
        token: {type: String, select: false},
        expiresAt: {type: Date, select: false}
    }
},
{
    timestamps: true
});

export const UserModel = mongoose.model('User', UserSchema);
export const getUsers = () => UserModel.find();
export const getUserByEmail = (email:string) => UserModel.findOne({email});
export const getUserByPhone = (phone:string) => UserModel.findOne({phone});
export const getUserBySessionToken = (token:string) => UserModel.findOne({
    'sessionToken.token': token
});
export const getUserById = (id:string) => UserModel.findById(id);
export const createUser = (values: Record<string,any>) => new UserModel(values)
.save().then((user)=>user.toObject());
export const updateUserById = (id:string, values: Record<string,any>) => UserModel.findByIdAndUpdate(id,values);
export const deleteUserById = (id:string) => UserModel.findOneAndDelete({_id: id});