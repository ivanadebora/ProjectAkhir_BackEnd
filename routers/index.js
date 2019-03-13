const authRouter = require('./authRouter');
const flightRouter = require('./flightRouter');
const productFlightRouter  = require('./productFlightRouter');
const paymentFlightRouter = require('./paymentFlightRouter')

module.exports = {
    authRouter,
    flightRouter,
    productFlightRouter,
    paymentFlightRouter
}