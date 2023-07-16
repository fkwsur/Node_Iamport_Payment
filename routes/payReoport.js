const { payReportController: controller } = require("../controller");

    const payReportRouter = (fastify, opt, done) => {

    fastify.post('/waitaccept', controller.WaitAccept);
    fastify.post('/accept', controller.Accept);
    fastify.post('/cancel', controller.Cancel);
    fastify.get('/getpayment', controller.GetPayment);
    done();
    fastify.post('/webhook', controller.Webhook);
    done();
};


module.exports = payReportRouter;