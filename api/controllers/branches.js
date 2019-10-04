const model = require('../dbconnections/connection_initializer');
const mongoose = require('mongoose');
const rolesList = require('../auth/roles');

module.exports = {
    getBranches: async (req, res, next) => {
        const role = req.user.role.role;
        let clientId = '';
        if (role === rolesList.SuperUser || role === rolesList.PowerUser) {
            clientId = req.value.body.clientId.toLowerCase();
        }
        else if (role === rolesList.Admin || role === rolesList.Supervisor) {
            clientId = req.user.clientId.clientId.toLowerCase();
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
            clientId = req.user.clientId.clientId.toLowerCase();
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
            clientId = req.user.clientId.clientId.toLowerCase();
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
        const singleParentBranch = Branch.findOne({ parentId: '' });
        if (singleParentBranch) {
            return res.status(404).json({
                message: 'There is already a parent branch exist'
            });
        }
        const branch = new Branch({
            _id: new mongoose.Types.ObjectId(),
            branchId: req.value.body.branchId,
            name: req.value.body.name,
            parentId: '',
            Address: req.value.body.address,
            GSTNumber: req.value.body.gstNumber,
            isHeadBranch: req.value.body.isHeadBranch
        });
        if (req.value.body.parentId && req.value.body.parentId !== '') {
            branch.parentId = req.value.body.parentId;
        }
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
        const branch = Branch.findOne({ branchId: req.value.body.branchId });
        if (!branch) {
            return res.status(404).json({
                message: 'branch id doesnot exist'
            });
        } else {
            if (req.value.body.name && req.value.body.name !== '') {
                branch.name = req.value.body.name;
            }
            if (req.value.body.parentId && req.value.body.parentId !== '') {
                branch.parentId = req.value.body.parentId;
            }
            if (req.value.body.Address && req.value.body.Address !== '') {
                branch.Address = req.value.body.Address;
            }
            if (req.value.body.GSTNumber && req.value.body.GSTNumber !== '') {
                branch.GSTNumber = req.value.body.GSTNumber;
            }
            if (req.value.body.isHeadBranch !== '') {
                branch.isHeadBranch = req.value.body.isHeadBranch;
            }
            const branchUpdated = await Branch.updateOne({ branchId: req.value.body.branchId }, branch);
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
        const branch = Branch.findOne({ branchId: req.value.body.branchId });
        if (!branch) {
            return res.status(404).json({
                message: 'branch id doesnot exist'
            });
        } else {
            const resp = await Branch.remove({ branchId: req.value.body.branchId });
            if (resp.deletedCount > 0) {
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