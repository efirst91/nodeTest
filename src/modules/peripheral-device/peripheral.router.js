const {Router} = require("express");
const PeripheralController = require('./infraestructure/peripheral.controller')
/**
 * All Routes
 * @type Router
 */
const router = Router()

router
    .get('/', PeripheralController.getAllPeripheral)

module.exports.PeripheralRouter = router;
