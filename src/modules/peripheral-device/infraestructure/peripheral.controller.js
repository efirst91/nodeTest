const PeripheralModel = require("../../peripheral-device/domain/peripheral.model");
const GatewayModel = require("../../gateway/domain/gateway.model");

/**
 * Get all peripheral devices
 * @param req received request from client
 * @param res response that will be sent to client
 * @return {Promise<void>}
 */
const getAllPeripheral = async (req, res) => {
    try {
        const peripheralAll = await PeripheralModel.find();
        res.status(200).json({data: peripheralAll, total: peripheralAll.length});

    } catch (e) {
        res.status(500).json({error: e})
    }
}

/**
 * Save a gateway
 * @param req received request from client
 * @param res response that will be sent to client
 * @return {Promise<void>}
 */
const savePeripheral = async (req, res) => {
    try {


        const newPeripheralD = new PeripheralModel({
            UID: req.body.uid,
            vendor: req.body.vendor,
            dateCreated: new Date(),
            status: req.body.status
        });

        await newPeripheralD.save();
        res.status(200).json({data: {id: newPeripheralD._id, success: true}});

    } catch (e) {
        res.status(500).json({error: e, success: false})
    }
}

/**
 * Get peripheral by id
 * @param req received request from client
 * @param res response that will be sent to client
 * @return {Promise<void>}
 */
const getPeripheralById = async (req, res) => {
    try {
        const peripheralById = req.params.id;
        const peripheral = await GatewayModel.findOne({_id: peripheralById})

        if (!peripheral) {
            res.status(403).json({
                data: {
                    message: 'This peripheral does not exist'
                }, success: false
            })
        }

        res.status(200).json({
            data: {
                peripheral
            }
        });

    } catch (e) {
        res.status(500).json({error: e, success: false})
    }
}

/**
 * Delete peripheral by id
 * @param req received request from client
 * @param res response that will be sent to client
 * @return {Promise<void>}
 */
const deletePeripheralById = async (req, res) => {
    try {
        const peripheralById = req.params.id;
        const peripheral = await GatewayModel.findOne({_id: peripheralById})
        if (!peripheral) {
            res.status(403).json({
                data: {
                    message: 'This peripheral does not exist'
                }, success: false
            })
        }

        await GatewayModel.deleteOne({_id: peripheralById});

        res.status(200).json({
            data: {
                peripheralById
            }, success: true
        });


    } catch (e) {
        res.status(500).json({error: e, success: false})
    }
}

/**
 * Update gateway by id
 * @param req received request from client
 * @param res response that will be sent to client
 * @return {Promise<void>}
 */
const updatePeripheral = async (req, res) => {

    try {
        const {vendor, status} = req.body;
        const peripheralId = req.params.id;
        const peripheral = await GatewayModel.findOne({_id: peripheralId})
        if (!peripheral) {
            res.status(403).json({
                data: {
                    message: 'This Peripheral does not exist'
                }, success: false
            })
        }

        await PeripheralModel.updateOne(peripheral, {
            vendor, status
        }).then(() => {
            res.status(200).json({
                data: {
                    peripheralId
                }, success: true
            });
        })

    } catch (e) {
        res.status(500).json({error: e, success: false})
    }
}

module.exports = {
    getAllPeripheral, savePeripheral, getPeripheralById, deletePeripheralById, updatePeripheral
}
