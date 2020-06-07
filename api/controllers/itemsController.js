const model = require('../dbconnections/connection_initializer');
const mongoose = require('mongoose');

module.exports = {
    getItems: async (req, res, next) => {
        const usr = req.user;
        const Item = model.getItemsModel(usr.ClientNumber);
        const Category = model.getCategoryModel(usr.ClientNumber);
        const items = await Item.find().populate('CategoryId');
        return res.status(200).json(items);
    },
    getItem: async (req, res, next) => {
        const usr = req.user;
        const Item = model.getItemsModel(usr.ClientNumber);
        const Category = model.getCategoryModel(usr.ClientNumber);
        const item = await Item.findById(req.params.id).populate('CategoryId');
        if (item) {
            return res.status(200).json(item);
        } else {
            return res.status(204).json({
                message:{
                    detail: 'no item found'
                } 
            });
        }
    },
    create: async (req, res, next) => {
        const usr = req.user;
        const reqData = req.body;
        console.log('In create item...',usr.ClientNumber);
        const Item = model.getItemsModel(usr.ClientNumber);
        const dupItem = await Item.findOne({ ItemCode: reqData.item_code });
        if (dupItem) {
            return res.status(404).json({
                message: {
                    detail: 'item id already exist'
                }
            });
        }
        if(!reqData.category_id){
            reqData.category_id = '';
        } 
        const item = new Item({
            ItemCode: reqData.item_code,
            Name: reqData.name,
            CategoryId: reqData.category_id,
            Description: reqData.description,
            Price: reqData.price,
            ItemImage: ''
        });
        console.log('beforesave: ');
        const b = await item.save();
        if (b) {
            return res.status(200).json({
                message: {
                    detail: 'item created successfully'
                }
            });
        }
        else {
            return res.status(500).json({
                message: {
                    detail: 'error in creating item'
                }
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
        const Item = model.getItemsModel(usr.ClientNumber);
        console.log('ItemId:', reqData.id);
        const item = await Item.findById(reqData.id);
        if (!item || item.ItemCode !==  reqData.item_code.toUpperCase()) {
            return res.status(404).json({
                message: {
                    detail: 'Item code id doesnot exist'
                }
            });
        } else {
            if(!reqData.category_id){
                reqData.category_id = '';
            } 
            if (reqData.name && reqData.name !== '') {
                item.Name = reqData.name;
            }
            if (reqData.description && reqData.description !== '') {
                item.Description = reqData.description;
            }
            if (reqData.category_id && reqData.category_id !== '') {
                item.category_id = reqData.category_id;
            }
            if (reqData.price && reqData.price !== '') {
                item.category_id = reqData.price;
            }
            const itemUpdated = await Item.updateOne({ _id: item._id }, item);
            if (itemUpdated.nModified > 0) {
                return res.status(200).json({
                    message: 'item updated successfully'
                });
            }
            return res.status(500).json({
                message: 'error updating item'
            });
        }
    },
    delete: async (req,res,next)=>{
        const usr = req.user;
        const Item = model.getItemsModel(usr.ClientNumber);
        const item = await Item.findById({ _id: req.params.id });
        if (!item) {
            return res.status(404).json({
                message: 'item id doesnot exist'
            });
        } else {
            const resp = await Item.remove({ _id: req.params.id });
            if (resp.deletedCount > 0) {
                    return res.status(200).json({
                        message: 'item deleted successfully'
                    });
            }
            return res.status(500).json({
                message: 'error deleting item'
            });
        }
    }
}