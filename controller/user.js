module.exports = {

    SignUp: async (req, res) => {
        try {
            let {userId} = req.body
            console.log(userId);
          return  res.send({ result: '회원가입 성공'  })
        } catch (error) {
            console.log(error);
        }
    },
    SignIn: async (req, res) => {
        try {
            let {id} = req.query
            let {xauth} = req.headers
            console.log(id);
            console.log(xauth);
          return  res.send({ result: '로그인 성공'  })
        } catch (error) {
            console.log(error);
        }
    }
}