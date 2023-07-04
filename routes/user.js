const { userController: controller } = require("../controller");

const userRouter = (fastify, opt, done) => {
    fastify.post('/signup', controller.SignUp);
    fastify.post('/signin', controller.SignIn);
    done();
}

module.exports = userRouter;