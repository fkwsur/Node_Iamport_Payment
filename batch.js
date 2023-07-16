const {
    sequelize,
    QueryTypes,
    Op,
	db,
	pay_report
  } = require("./models");

  const axios  = require('axios');
  const dotenv = require('dotenv');
  const util = require('util');

const getInfo = async () => {

    const getToken = await axios.post('https://api.iamport.kr/users/getToken', {
				imp_key : process.env.imp_key,
				imp_secret : process.env.imp_secret
			})

    const rows = await pay_report.findAll({
        where : {is_complete : 1},
    })

    for(const element of rows){
        const retval = await axios.post(util.format('https://api.iamport.kr/payments/find/%s/paid',element.merchant_uid),{
        }, {
            headers: {
                Authorization: getToken.data.response.access_token,
            }
        });
        // console.log(retval.data.response);
        // 아이엠포트 서버에 결제내역이 없을 경우
        if (retval.data.response.status == "paid" && retval.data.response.amount == element.paid_amount) {
            await pay_report.update({
                is_complete :  0,
                imp_uid : retval.data.response.imp_uid
              },{
                where :{user_id : user_id, merchant_uid : payment.merchant_uid}
            })
        }else{
            console.log("해당 없음")
        }

    };
}


getInfo();
