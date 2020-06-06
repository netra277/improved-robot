const model = require('../dbconnections/connection_initializer');
const mongoose = require('mongoose');
const constants = require('../constants/enums');
const randomString = require('randomstring');
const encryptor = require('../utilities/encryptor');
const Role = model.getRoleModel();
const Client = model.getClientModel();
const ClientDevice = model.getClientDevicesModel();


module.exports = {
    create: async (req, res) => {
        const client = await Client.findById(req.user.ClientId);
        console.log('got client ', client);
        if(!client){
            return res.status(500).json({
                message: 'Invalid details'
            })
        }
        const Device = model.getDevicesModel(client.ClientId);
        const devicesCount = await Device.find().countDocuments();
        if (client.DevicesRegistered === devicesCount) {
            return res.status(500).json({
                message: 'reached max devices limit. Please contact support'
            });
        }
        const isexisteddevice = await Device.findOne({ DeviceId: req.body.device_id });
        if (isexisteddevice) {
            return res.status(500).json({
                message: 'device id already exists'
            });
        }
        const device = new Device({
            DeviceId: req.body.device_id,
            DeviceName: req.body.device_name,
            Status: constants.DeviceStatus.Created
        });
        const dev = await device.save();
        const clientdevice = new ClientDevice({
            DeviceId: dev._id,
            ClientId : req.user.ClientId,
            ClientNumber : client.ClientId,
            Status : constants.DeviceStatus.Created
        });
        const cldev = await clientdevice.save();
        if (dev && cldev) {
            return res.status(200).json({
                message: 'device created successfully!'
            });
        }
        return res.status(400).json({
            message: 'error in creating device'
        });
    },
    update: async (req, res) => {
        if(req.params.id !== req.body.device_id){
            return res.status(400).json({
                message: 'device id doesnot match'
            });
        }
        const client = await Client.findById(req.user.ClientId);
        const Device = model.getDevicesModel(client.ClientId);
        const dev = await Device.updateOne({ _id: req.params.id }, {
            DeviceName : req.body.device_name
        });
        if (dev.nModified > 0) {
            return res.status(200).json({
                message: 'device updated successfully'
            });
        } else {
            res.status(500).json({
                message: 'error in updating device'
            });
        }
    },
    getAll: async(req,res)=>{
        const client = await Client.findById(req.user.ClientId);
        const Device = model.getDevicesModel(client.ClientId);
        const devices = await Device.find();
        return res.status(200).json(devices);
    },
    get: async (req, res) => {
        console.log(req.params.id);
        const client = await Client.findById(req.user.ClientId);
        const Device = model.getDevicesModel(client.ClientId);
        const device = await Device.findById(req.params.id);
        return res.status(200).json(device);
    },
    delete: async (req,res)=>{
        const client = await Client.findById(req.user.ClientId);
        const Device = model.getDevicesModel(client.ClientId);
        const device =  await Device.findById(req.params.id);
        if (!device) {
            return res.status(404).json({
                message: 'device doesnot exist'
            });
        } else {

            await ClientDevice.remove({DeviceId: req.params.id});
            const resp = await Device.remove({ _id: req.params.id });
            if (resp.deletedCount > 0) {
                return res.status(200).json({
                    message: 'device deleted successfully'
                });
            }
            return res.status(500).json({
                message: 'error deleting device'
            });
        }
    },
    deactivate: async(req,res)=>{
        const client = await Client.findById(req.user.ClientId);
        const Device = model.getDevicesModel(client.ClientNumber);
        const dev = await Device.updateOne({ _id: req.params.id }, {
            Status : constants.DeviceStatus.InActive,
            IsDeactivated: true,
            DeactivatedDate: Date.now()
        });
        const clidev = ClientDevice.updateOne({DeviceId: req.params.id},{
            Status : constants.DeviceStatus.InActive
        });
        if (dev.nModified > 0) {
            return res.status(200).json({
                message: 'device deactivated successfully'
            });
        } else {
            res.status(500).json({
                message: 'error in deactivating device'
            });
        }
        
    },
    generateNewKey: async(req,res)=>{
        const client = await Client.findById(req.user.ClientId);
        const Device = model.getDevicesModel(client.ClientId);
        const device = await Device.findById(req.params.id);
        const DeviceKey = model.getDeviceKeysModel();
        const dkey = await DeviceKey.findOne({DeviceId: req.params.id});
        console.log('got key:',dkey);
        const currentdatetime = Date.now();
        if(dkey){
            if(currentdatetime < dkey.ExpireTime){
                return res.status(500).json({
                    generatedDeviceKey: dkey.GeneratedDeviceKey
                });
            }
            dkey.Status = constants.DeviceKeyStatus.InActive;
            const upddkey = await DeviceKey.updateOne({_id: dkey._id},dkey);
        }

        console.log('got device:',device);
        if(!device){
            return res.status(400).json({
                message: 'device not found'
            });
        }
        sampleId = randomString.generate({
            length: 4,
            charset: 'alphanumeric',
            capitalization: 'uppercase'
        });
        const deviceKey = encryptor.encrypt(sampleId + device.DeviceId);
        
        var dt = new Date();
         dt.setMinutes( dt.getMinutes() + 30 );
        const deviceke = new DeviceKey({
            ClientId : req.user.ClientId,
            DeviceId : device._id,
            GeneratedDeviceKey : deviceKey,
            ExpireTime : dt,
            Status: constants.DeviceKeyStatus.Created
        });
        const de = await deviceke.save();
        if (de) {
            return res.status(200).json({
                generatedDeviceKey: deviceKey
            });
        }
        return res.status(400).json({
            message: 'error in creating device'
        });
    },
    register: async(req,res,next)=>{
        const DeviceKey = model.getDeviceKeysModel();
        const devkey = await DeviceKey.findOne({GeneratedDeviceKey: req.body.device_key, Status: constants.DeviceKeyStatus.Created});
        const currentdatetime = Date.now();
        if(devkey){
            if(currentdatetime > devkey.ExpireTime){
                devkey.Status = constants.DeviceKeyStatus.InActive;
                const kd = await DeviceKey.updateOne({_id:devkey._id},devkey);
                return res.status(500).json({
                    message: {
                        detail:'key expired or already activated, please contact administrator for new key'
                    }
                });
            }
        }
        else{
            return res.status(500).json({
                message: {
                    detail:'Invalid key, please contact administrator for new key'
                }
            });
        }
        console.log('gen',devkey.GeneratedDeviceKey);
        const devId = encryptor.decrypt(devkey.GeneratedDeviceKey);
        console.log('devId',devId);
        const dId = devId.substring(4,devId.length);

        const client = await Client.findById(devkey.ClientId);
        const Device = model.getDevicesModel(client.ClientId);
        console.log('c:',client.ClientId,'d:',dId);
        const device = await Device.findOne({DeviceId: dId, Status: constants.DeviceStatus.Created});
        if(!device){
            return res.status(500).json({
                message: {
                    detail: 'Invalid key'
                }
            });
        }
        const cliedev = await ClientDevice.findOne({ DeviceId: device._id, ClientId: client._id, Status: constants.DeviceStatus.Created});
        if(!cliedev){
            return res.status(500).json({
                message: {
                    detail: 'error registering device invalid details'
                }
            });
        }
        cliedev.Status = constants.DeviceStatus.Active;
        console.log('in',cliedev);
        const upclidev = await ClientDevice.updateOne({_id:cliedev._id},cliedev);
        const updatedDevice = await Device.updateOne({_id:device._id},{
            DeviceActivatedOnIP : req.body.ip_address,
            ActivatedWithKey : req.body.device_key,
            ActivatedDate : Date.now(),
            Status: constants.DeviceStatus.Active,
            ActivatedByUserId : ''
        });
        devkey.Status = constants.DeviceKeyStatus.Active;
        const dk = await DeviceKey.updateOne({_id:devkey._id},devkey);
        console.log('upclidev: ',upclidev);
        if (updatedDevice.nModified > 0) {
            return res.status(200).json({
                message: {
                    deviceId: cliedev._id,
                    detail: 'device registered successfully'
                }
            });
        } else {
            res.status(500).json({
                message: {
                    detail: 'error in registering device'
                }
            });
        }
    }
}