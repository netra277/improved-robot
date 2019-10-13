const model = require('../dbconnections/connection_initializer');
const mongoose = require('mongoose');
const rolesList = require('../auth/roles');

module.exports = {
    getItems: async (req, res, next) => {
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
        const Item = model.getItemsModel(clientId);
        const items = await Item.find();
        if (items.length > 0) {
            return res.status(200).json(items);
        } else {
            return res.status(204).json({
                message: 'no items found'
            });
        }
    },
    getItem: async (req, res, next) => {
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
        const Item = model.getItemsModel(clientId);
        const item = await Item.findById(req.value.params.id);
        if (item) {
            return res.status(200).json(item);
        } else {
            return res.status(204).json({
                message: 'no item found'
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
        const Item = model.getItemsModel(clientId);
        const dupIem = await Item.findOne({ itemCode: req.value.body.itemCode });
        if (dupIem) {
            return res.status(404).json({
                message: 'Item code already exist'
            });
        }
        const item = new Item({
            _id: new mongoose.Types.ObjectId(),
            itemCode: req.value.body.itemCode,
            name: req.value.body.name,
            description: req.value.body.description,
            price: req.value.body.price,
            itemImage:''
        });
        const Category = model.getCategoryModel(clientId);
        item.categoryId = await Category.findById(req.value.body.categoryId);
        const b = await item.save();
        if (b) {
            return res.status(200).json({
                message: 'Item created successfully'
            });
        }
        else {
            return res.status(500).json({
                message: 'error in creating item'
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
        const Item = model.getItemsModel(clientId);
        const item = await Item.findById(req.value.params.id);
        if (!item) {
            return res.status(404).json({
                message: 'item doesnot exist'
            });
        } else {
            if (req.value.body.name && req.value.body.name !== '') {
                item.name = req.value.body.name;
            }
            if (req.value.body.description && req.value.body.description !== '') {
                item.description = req.value.body.description;
            }
            if(req.value.body.categoryId && req.value.body.categoryId !== ''){
                const Category = model.getCategoryModel(clientId);
                item.categoryId = Category.findById(req.value.body.categoryId);
            }
            if(req.value.body.price && req.value.body.price !== ''){
                item.price = req.value.body.price;
            }
            const itemUpdated = await Item.updateOne({ _id: req.value.params.id }, item);
            if (itemUpdated.nModified > 0) {
                return res.status(200).json({
                    message: 'Item updated successfully'
                });
            }
            return res.status(500).json({
                message: 'error updating item'
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
        const Item = model.getItemsModel(clientId);
        const item =  await Item.findById(req.value.params.id);
        if (!item) {
            return res.status(404).json({
                message: 'item doesnot exist'
            });
        } else {
            const resp = await Item.remove({ _id: req.value.params.id });
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