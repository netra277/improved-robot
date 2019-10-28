 const userStatus = require('../commons/enums');

module.exports = {
    getUserStatus: async(req,res,next)=>{
        let statuses = [];
        Object.keys(userStatus.UserStatus).forEach((key,index)=>{
            statuses.push({ status: userStatus.UserStatus[key]});
        });
        res.status(200).json(statuses);
    },
    getClientStatus: async(req,res,next)=>{
        let statuses = [];
        Object.keys(userStatus.ClientStatus).forEach((key,index)=>{
            statuses.push({ status: userStatus.ClientStatus[key]});
        });
        res.status(200).json(statuses);
    }
}