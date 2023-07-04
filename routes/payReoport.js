const { payReportController: controller } = require("../controller");

    const payReportRouter = (fastify, opt, done) => {

    fastify.post('/iamport', controller.IamPort);
    fastify.post('/cancel', controller.Cancel);
    fastify.get('/getpayment', controller.GetPayment);
    done();
};


module.exports = payReportRouter;