const model = require('../dbconnections/connection_initializer');
const mongoose = require('mongoose');

module.exports = {
    getBranches: async (req, res, next) => {
        const usr = req.user;
        const Branch = model.getBranchModel(usr.ClientNumber);
        const branches = await Branch.find();
        return res.status(200).json(branches);
    },
    getBranch: async (req, res, next) => {
        const usr = req.user;
        const Branch = model.getBranchModel(usr.ClientNumber);
        const branch = await Branch.findById(req.params.id);
        if (branch) {
            return res.status(200).json(branch);
        } else {
            return res.status(204).json({
                message: 'no branch found'
            });
        }
    },
    create: async (req, res, next) => {
        const usr = req.user;
        const reqData = req.body;
        console.log('In create branch...',usr.ClientNumber);
        const Branch = model.getBranchModel(usr.ClientNumber);
        const dupBranch = await Branch.findOne({ branchId: reqData.branch_id });
        if (dupBranch) {
            return res.status(404).json({
                message: 'branch id already exist'
            });
        }
        
        const singleParentBranch = await Branch.findOne({ IsHeadBranch: true });
        if (reqData.is_headbranch) {
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
        
        const branch = new Branch({
            BranchId: reqData.branch_id,
            Name: reqData.name,
            Address: reqData.address,
            Phone: reqData.phone,
            Email: reqData.email,
            IsHeadBranch: reqData.is_headbranch,
            PrintInvoice: reqData.print_invoice,
            TaxesToPrint: reqData.taxes_to_print
        });
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
        const usr = req.user;
        const reqData = req.body;
        if(req.params.id !== reqData.id){
            return res.status(500).json({
                message: {
                    detail: 'Invalid id'
                }
            });
        }
        const Branch = model.getBranchModel(usr.ClientNumber);
        console.log('branchId:', reqData.branch_id);
        const branch = await Branch.findById(reqData.id);
        if (!branch || branch.BranchId !==  reqData.branch_id.toUpperCase()) {
            console.log('branch:',branch);
            return res.status(404).json({
                message: 'branch id doesnot exist'
            });
        } else {
            if (reqData.name && reqData.name !== '') {
                branch.Name = reqData.name;
            }
            if (reqData.address && reqData.address !== '') {
                branch.Address = reqData.address;
            }
            if (reqData.phone && reqData.phone !== '') {
                branch.Phone = reqData.phone;
            }
            if (reqData.email && reqData.email !== '') {
                branch.Email = reqData.email;
            }
            if (reqData.isHeadBranch !== '') {
                branch.IsHeadBranch = reqData.is_headbranch;
            }
            if (reqData.printInvoice !== '') {
                branch.PrintInvoice = reqData.print_invoice;
            }
            if(reqData.taxes_to_print && reqData.taxes_to_print.length > 0){
                branch.TaxesToPrint = reqData.taxes_to_print;
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
        const usr = req.user;
        const Branch = model.getBranchModel(usr.ClientNumber);
        const branch = await Branch.findById({ _id: req.params.id });
        if (!branch) {
            return res.status(404).json({
                message: 'branch id doesnot exist'
            });
        } else {
            const resp = await Branch.remove({ _id: req.params.id });
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