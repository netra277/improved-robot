const model = require('../dbconnections/connection_initializer');
const mongoose = require('mongoose');
const rolesList = require('../auth/roles');

module.exports = {
    getCategories: async (req, res, next) => {
        const role = req.user.role.role;
        let clientId = '';
        if (role === rolesList.SuperUser || role === rolesList.PowerUser) {
            clientId = req.value.body.clientId;
        }
        else if (role === rolesList.Admin || role === rolesList.Supervisor || role === rolesList.Manager) {
            clientId = req.user.clientId.clientId;
        }
        else {
            return res.status(401).json({
                message: 'unauthorized'
            });
        }
        const Category = model.getCategoryModel(clientId);
        const categories = await Category.find();
        if (categories.length > 0) {
            return res.status(200).json(categories);
        } else {
            return res.status(204).json({
                message: 'no categories found'
            });
        }
    },
    getCategory: async (req, res, next) => {
        const role = req.user.role.role;
        let clientId = '';
        if (role === rolesList.SuperUser || role === rolesList.PowerUser) {
            clientId = req.value.body.clientId;
        }
        else if (role === rolesList.Admin || role === rolesList.Supervisor || role === rolesList.Manager) {
            clientId = req.user.clientId.clientId;
        }
        else {
            return res.status(401).json({
                message: 'unauthorized'
            });
        }
        const Category = model.getCategoryModel(clientId);
        const category = await Category.findById(req.value.params.id);
        if (category) {
            return res.status(200).json(category);
        } else {
            return res.status(204).json({
                message: 'no category found'
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
        const Category = model.getCategoryModel(clientId);
        const dupCategory = await Category.findOne({ categoryId: req.value.body.categoryId });
        console.log('duplicate category: ',dupCategory);
        if (dupCategory) {
            return res.status(404).json({
                message: 'category id already exist'
            });
        }
        const category = new Category({
            _id: new mongoose.Types.ObjectId(),
            categoryId: req.value.body.categoryId,
            name: req.value.body.name,
            description: req.value.body.description
        });
        const b = await category.save();
        if (b) {
            return res.status(200).json({
                message: 'category created successfully'
            });
        }
        else {
            return res.status(500).json({
                message: 'error in creating category'
            });
        }
    },
    update: async (req, res, next) => {
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
        const Category = model.getCategoryModel(clientId);
        const category = await Category.findById(req.value.params.id);
        if (!category) {
            return res.status(404).json({
                message: 'category id doesnot exist'
            });
        } else {
            if (req.value.body.name && req.value.body.name !== '') {
                category.name = req.value.body.name;
            }
            if (req.value.body.description && req.value.body.description !== '') {
                category.description = req.value.body.description;
            }
            const categoryUpdated = await Category.updateOne({ _id: req.value.params.id }, category);
            if (categoryUpdated.nModified > 0) {
                return res.status(200).json({
                    message: 'Category updated successfully'
                });
            }
            return res.status(500).json({
                message: 'error updating category'
            });
        }
    },
    delete: async (req,res,next)=>{
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
        const Category = model.getCategoryModel(clientId);
        const category = await Category.findById(req.value.params.id);
        if (!category) {
            return res.status(404).json({
                message: 'category id doesnot exist'
            });
        } else {
            const resp = await Category.remove({ _id: req.value.params.id });
            if (resp.deletedCount > 0) {
                return res.status(200).json({
                    message: 'category deleted successfully'
                });
            }
            return res.status(500).json({
                message: 'error deleting category'
            });
        }
    }
}