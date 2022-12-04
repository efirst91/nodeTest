const GatewayModel = require('../domain/gateway.model')

/**
 * Get all gateway
 * @param req received request from client
 * @param res response that will be sent to client
 * @return {Promise<void>}
 */
const getAllGateway = async (req, res) => {
    try {
        const gatewaysAll = await GatewayModel.find();
        res.status(200).json({data: gatewaysAll, total: gatewaysAll.length});

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
const saveGateway = async (req, res) => {
    try {

        if (req.body.peripheralsDevices.length > 10) {
            res.status(403).json({
                data: {
                    message: 'Each gateway can not have more than 10 peripheral devices'
                }, success: false
            });
        }

        const validIpv4 = validateIpv4(req.body.ipv4);
        if (!validIpv4) {
            res.status(403).json({
                data: {
                    message: 'Ipv4 not valid, please try to new one'
                }, success: false
            });
            return;
        }

        const newGateway = new GatewayModel({
            serialNumber: req.body.serialNumber,
            ipv4: req.body.ipv4,
            peripheralsDevices: req.body.peripheralsDevices ?? []
        });

        await newGateway.save();
        res.status(200).json({data: {id: newGateway._id, success: true}});

    } catch (e) {
        res.status(500).json({error: e, success: false})
    }
}

/**
 * Get gateway by id
 * @param req received request from client
 * @param res response that will be sent to client
 * @return {Promise<void>}
 */
const getGatewayById = async (req, res) => {
    try {
        const gatewayId = req.params.id;
        const gateway = await GatewayModel.findOne({_id: gatewayId})

        if (!gateway) {
            res.status(403).json({
                data: {
                    message: 'This gateway does not exist'
                }, success: false
            })
        }

        res.status(200).json({
            data: {
                gateway
            }
        });

    } catch (e) {
        res.status(500).json({error: e, success: false})
    }
}

/**
 * Delete gateway by id
 * @param req received request from client
 * @param res response that will be sent to client
 * @return {Promise<void>}
 */
const deleteGatewayById = async (req, res) => {
    try {
        const gatewayId = req.params.id;
        const gateway = await GatewayModel.findOne({_id: gatewayId})
        if (!gateway) {
            res.status(403).json({
                data: {
                    message: 'This gateway does not exist'
                }, success: false
            })
        }

        await GatewayModel.deleteOne({_id: gatewayId});

        res.status(200).json({
            data: {
                gatewayId
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
const updateGateway = async (req, res) => {

    try {
        const {serialNumber, ipv4, peripheralsDevices} = req.body;
        const gatewayId = req.params.id;
        const gateway = await GatewayModel.findOne({_id: gatewayId})
        if (!gateway) {
            res.status(403).json({
                data: {
                    message: 'This gateway does not exist'
                }, success: false
            })
        }

        const validIpv4 = validateIpv4(req.body.ipv4);
        if (!validIpv4) {
            res.status(403).json({
                data: {
                    message: 'Ipv4 not valid, please try to new one'
                }, success: false
            });
            return;
        }

        const allPeripheralDevices = gateway?.peripheralsDevices.length + peripheralsDevices.length
        if (allPeripheralDevices > 10) {
            res.status(403).json({
                data: {
                    message: 'Each gateway can not have more than 10 peripheral devices',
                }, success: false
            });
        }

        await GatewayModel.updateOne(gateway, {
            serialNumber, ipv4, peripheralsDevices
        }).then(() => {
            res.status(200).json({
                data: {
                    gatewayId
                }, success: true
            });
        })

    } catch (e) {
        res.status(500).json({error: e, success: false})
    }
}

/**
 * Validate ipv4 address
 * @param ipv4toCheck value to test
 * @return {boolean}
 */
function validateIpv4(ipv4toCheck) {
    let test = false;
    try {
        const regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
        test = regex.test(ipv4toCheck);

    } catch (e) {
        console.log('Error has occurred ', e.error)
    }

    return test;
}

module.exports = {
    getAllGateway, saveGateway, getGatewayById, deleteGatewayById, updateGateway
}
