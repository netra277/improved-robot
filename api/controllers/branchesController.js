const model = require('../dbconnections/connection_initializer');
const mongoose = require('mongoose');
const Client = model.getClientModel();

module.exports = {
    getBranches: async (req, res, next) => {
        const role = req.user.role.role;
        const reqUserClient = req.user.clientId;
        let clientId = '';
        if (role === rolesList.Admin || role === rolesList.Supervisor) {
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
        if (role === rolesList.Admin || role === rolesList.Supervisor) {
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
        console.log('In create branch...');
        const Branch = model.getBranchModel(req.user.ClientNumber);
        const dupBranch = await Branch.findOne({ branchId: req.body.branchId });
        if (dupBranch) {
            return res.status(404).json({
                message: 'branch id already exist'
            });
        }
        
        const singleParentBranch = await Branch.findOne({ isHeadBranch: true });
        if (req.body.isHeadBranch) {
            if (singleParentBranch) {
                return res.status(404).json({
                    message: 'There is already a head branch exist'
                });
            }
        }
        else {
            if (!singleParentBranch) {
                return res.status(404).json({
                    message: 'There should be atleast one head branch'
                });
            }
        }
        
        const branch = new Branch(req.value.body);
        console.log('beforesave: ',branch);
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
    update: async (req, res, next) => {
        const role = req.user.role.role;
        let clientId = '';
        if (role === rolesList.Admin) {
            clientId = req.user.clientId.clientId;
        }
        else {
            return res.status(401).json({
                message: 'unauthorized'
            });
        }
        const Branch = model.getBranchModel(clientId);
        console.log('branchId:', req.value.body.branchId);
        const branch = await Branch.findOne({ branchId: req.value.body.branchId });
        if (!branch) {
            console.log('branch:',branch);
            return res.status(404).json({
                message: 'branch id doesnot exist'
            });
        } else {
            if (req.value.body.name && req.value.body.name !== '') {
                branch.name = req.value.body.name;
            }
            if (req.value.body.address && req.value.body.address !== '') {
                branch.Address = req.value.body.Address;
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
            if (req.value.body.printInvoice !== '') {
                branch.printInvoice = req.value.body.printInvoice;
            }
            if(req.value.body.tax && req.value.body.tax.length > 0){
                branch.tax = req.value.body.tax;
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
    delete: async (req, res, next) => {
        const role = req.user.role.role;
        let clientId = '';
        if (role === rolesList.Admin) {
            clientId = req.user.clientId.clientId;
        }
        else {
            return res.status(401).json({
                message: 'unauthorized'
            });
        }
        const Branch = model.getBranchModel(clientId);
        const branch = await Branch.findById({ _id: req.value.params.id });
        if (!branch) {
            return res.status(404).json({
                message: 'branch id doesnot exist'
            });
        } else {
            const resp = await Branch.remove({ _id: req.value.params.id });
            if (resp.deletedCount > 0) {
                const BranchUser = model.getBranchUserModel(clientId);
                const branchUser = await BranchUser.remove({ branchId: req.value.params.id });
                if(branchUser.deletedCount > 0){
                    return res.status(200).json({
                        message: 'branch deleted successfully'
                    });
                }
            }
            return res.status(500).json({
                message: 'error deleting branch'
            });
        }
    }
}