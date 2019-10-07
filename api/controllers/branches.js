const model = require('../dbconnections/connection_initializer');
const mongoose = require('mongoose');
const rolesList = require('../auth/roles');

module.exports = {
    getBranches: async (req, res, next) => {
        const role = req.user.role.role;
        const reqUserClient = req.user.clientId;
        let clientId = '';
        if (role === rolesList.SuperUser || role === rolesList.PowerUser) {
            clientId = req.value.body.clientId;
        }
        else if (role === rolesList.Admin || role === rolesList.Supervisor) {
            clientId = reqUserClient.clientId;
        }
        else {
            return res.status(401).json({
                message: 'unauthorized'
            });
        }
        const Branch = model.getBranchModel(clientId);
        const branches = await Branch.find();
        if (branches.length > 0) {
            return res.status(200).json(branches);
        } else {
            return res.status(204).json({
                message: 'no branches found'
            });
        }
    },
    getBranch: async (req, res, next) => {
        const role = req.user.role.role;
        let clientId = '';
        if (role === rolesList.SuperUser || role === rolesList.PowerUser) {
            clientId = req.value.body.clientId;
        }
        else if (role === rolesList.Admin || role === rolesList.Supervisor) {
            clientId = req.user.clientId.clientId;
        }
        else {
            return res.status(401).json({
                message: 'unauthorized'
            });
        }
        const Branch = model.getBranchModel(clientId);
        const branch = await Branch.findById(req.value.params.id);
        if (branch) {
            return res.status(200).json(branch);
        } else {
            return res.status(204).json({
                message: 'no branch found'
            });
        }
    },
    create: async (req, res, next) => {
        const role = req.user.role.role;
        let clientId = '';
        if (role === rolesList.SuperUser) {
            clientId = req.value.body.clientId;
        }
        else if (role === rolesList.Admin) {
            clientId = req.user.clientId.clientId;
        }
        else {
            return res.status(401).json({
                message: 'unauthorized'
            });
        }
        const Branch = model.getBranchModel(clientId);
        const dupBranch = Branch.findOne({ branchId: req.value.body.branchId });
        if (dupBranch) {
            return res.status(404).json({
                message: 'branch id already exist'
            });
        }
        if(req.value.body.isHeadBranch){
            const singleParentBranch = Branch.findOne({ isHeadBranch: true });
            if (singleParentBranch) {
                return res.status(404).json({
                    message: 'There is already a head branch exist'
                });
            }
        }
        else{
            const singleParentBranch = Branch.findOne({ isHeadBranch: true });
            if (!singleParentBranch) {
                return res.status(404).json({
                    message: 'There should be atleast one head branch'
                });
            }
        }
        
        const branch = new Branch({
            _id: new mongoose.Types.ObjectId(),
            branchId: req.value.body.branchId,
            name: req.value.body.name,
            Address: req.value.body.address,
            phone: req.value.body.phone,
            email: req.value.body.email,
            GSTNumber: req.value.body.gstNumber,
            isHeadBranch: req.value.body.isHeadBranch
        });
        const b = await branch.save();
        if (b) {
            return res.status(200).json({
                message: 'branch created successfully'
            });
        }
        else {
            return res.status(500).json({
                message: 'error in creating branch'
            });
        }
    },
    update: (req, res, next) => {
        const role = req.user.role.role;
        let clientId = '';
        if (role === rolesList.SuperUser) {
            clientId = req.value.body.clientId.toLowerCase();
        }
        else if (role === rolesList.Admin) {
            clientId = req.user.clientId.clientId.toLowerCase();
        }
        else {
            return res.status(401).json({
                message: 'unauthorized'
            });
        }
        const Branch = model.getBranchModel(clientId);
        const branch = Branch.findOne({ branchId: req.value.params.branchId });
        if (!branch) {
            return res.status(404).json({
                message: 'branch id doesnot exist'
            });
        } else {
            if (req.value.body.name && req.value.body.name !== '') {
                branch.name = req.value.body.name;
            }
            if (req.value.body.Address && req.value.body.Address !== '') {
                branch.Address = req.value.body.Address;
            }
            if (req.value.body.GSTNumber && req.value.body.GSTNumber !== '') {
                branch.GSTNumber = req.value.body.GSTNumber;
            }
            if (req.value.body.phone && req.value.body.phone !== '') {
                branch.phone = req.value.body.phone;
            }
            if (req.value.body.email && req.value.body.email !== '') {
                branch.email = req.value.body.email;
            }
            if (req.value.body.isHeadBranch !== '') {
                branch.isHeadBranch = req.value.body.isHeadBranch;
            }
            const branchUpdated = await Branch.updateOne({ _id: branch._id }, branch);
            if (branchUpdated.nModified > 0) {
                return res.status(200).json({
                    message: 'branch updated successfully'
                });
            }
            return res.status(500).json({
                message: 'error updating branch'
            });
        }
    },
    delete: (req,res,next)=>{
        const role = req.user.role.role;
        let clientId = '';
        if (role === rolesList.SuperUser) {
            clientId = req.value.body.clientId;
        }
        else if (role === rolesList.Admin) {
            clientId = req.user.clientId.clientId;
        }
        else {
            return res.status(401).json({
                message: 'unauthorized'
            });
        }
        const Branch = model.getBranchModel(clientId);
        const branch = Branch.findById({ _id: req.value.params.id });
        if (!branch) {
            return res.status(404).json({
                message: 'branch id doesnot exist'
            });
        } else {
            const resp = await Branch.removeOne({ _id: req.value.params.id });
            if (resp.deletedCount > 0) {
                const BranchUser = model.getBranchUserModel();
                const branchUser = BranchUser.remove({ branchId: req.value.params.id });
                return res.status(200).json({
                    message: 'branch deleted successfully'
                });
            }
            return res.status(500).json({
                message: 'error deleting branch'
            });
        }
    }
}