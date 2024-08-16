import crypto from 'crypto';
const Fuse = require('fuse.js');

const secretKey = process.env.SECRET_KEY;

export const randomToken = () => crypto.randomBytes(128).toString('base64');
export const enCrypt = (salt: string, password: string) => {
    return crypto.createHmac('sha256', [salt,password].join('/')).update(secretKey).digest('hex');
}

export const searchData = (key:any[], searchPattern:any, listData:any[] ) =>{
    const fuse = new Fuse(listData, {
        keys: key,
        threshold: 0.2,
    });
    let result = fuse.search(searchPattern);
    result = result.map((item:any) => item.item)
    return result;
}
