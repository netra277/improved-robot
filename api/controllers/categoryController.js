const model = require('../dbconnections/connection_initializer');
const mongoose = require('mongoose');

module.exports = {
    getCategories: async (req, res, next) => {
        const usr = req.user;
        const Category = model.getCategoryModel(usr.ClientNumber);
        const categories = await Category.find();
        return res.status(200).json(categories);
    },
    getCategory: async (req, res, next) => {
        const usr = req.user;
        const Category = model.getCategoryModel(usr.ClientNumber);
        const category = await Category.findById(req.params.id);
        if (category) {
            return res.status(200).json(category);
        } else {
            return res.status(204).json({
                message:{
                    detail: 'no category found'
                } 
            });
        }
    },
    create: async (req, res, next) => {
        const usr = req.user;
        const reqData = req.body;
        console.log('In create category...',usr.ClientNumber);
        const Category = model.getCategoryModel(usr.ClientNumber);
        const dupCate = await Category.findOne({ CategoryId: reqData.category_id });
        if (dupCate) {
            return res.status(404).json({
                message: {
                    detail: 'category id already exist'
                }
            });
        }
        if(!reqData.parent_category_id){
            reqData.parent_category_id = '';
        } 
        const category = new Category({
            CategoryId: reqData.category_id,
            Name: reqData.name,
            Description: reqData.description,
            ParentCategoryId: reqData.parent_category_id
        });
        console.log('beforesave: ');
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
        const usr = req.user;
        const reqData = req.body;
        if(req.params.id !== reqData.id){
            return res.status(500).json({
                message: {
                    detail: 'Invalid id'
                }
            });
        }
        const Category = model.getCategoryModel(usr.ClientNumber);
        console.log('categoryId:', reqData.id);
        const category = await Category.findById(reqData.id);
        if (!category || category.CategoryId !==  reqData.category_id.toUpperCase()) {
            return res.status(404).json({
                message: 'category id doesnot exist'
            });
        } else {
            if(!reqData.parent_category_id){
                reqData.parent_category_id = '';
            } 
            if (reqData.name && reqData.name !== '') {
                category.Name = reqData.name;
            }
            if (reqData.description && reqData.description !== '') {
                category.Description = reqData.description;
            }
            if (reqData.parent_category_id && reqData.parent_category_id !== '') {
                category.ParentCategoryId = reqData.parent_category_id;
            }
            const categoryUpdated = await Category.updateOne({ _id: category._id }, category);
            if (categoryUpdated.nModified > 0) {
                return res.status(200).json({
                    message: 'category updated successfully'
                });
            }
            return res.status(500).json({
                message: 'error updating category'
            });
        }
    },
    delete: async (req,res,next)=>{
        const usr = req.user;
        const Category = model.getCategoryModel(usr.ClientNumber);
        const category = await Category.findById({ _id: req.params.id });
        if (!category) {
            return res.status(404).json({
                message: 'category id doesnot exist'
            });
        } else {
            const resp = await Category.remove({ _id: req.params.id });
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