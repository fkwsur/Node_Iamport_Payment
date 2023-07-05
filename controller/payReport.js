const {
    sequelize,
    QueryTypes,
    Op,
	db,
	pay_report
  } = require("../models");
const axios  = require('axios');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
	IamPort :  async (req, res) => {
		try {
			let {payment, user_id} = req.body;
			const rows = await pay_report.create({
				user_id : user_id,
				imp_uid : payment.imp_uid,
				pay_method : payment.pay_method,
				merchant_uid : payment.merchant_uid,
				name : payment.name,
				paid_amount : payment.paid_amount,
				currency : payment.currency,
				pg_provider : payment.pg_provider,
				pg_type : payment.pg_type,
				pg_tid : payment.pg_tid,
				apply_num : payment.apply_num,
				buyer_name : payment.buyer_name,
				buyer_email : payment.buyer_email,
				buyer_tel : payment.buyer_tel,
				buyer_addr : payment.buyer_addr,
				buyer_postcode : payment.buyer_postcode,
				custom_data : payment.custom_data,
				status : payment.status,
				paid_at : payment.paid_at,
				receipt_url : payment.receipt_url,
				noTid : payment.noTid,
				card_name : payment.card_name,
				bank_name : payment.bank_name,
				card_quota : payment.card_quota,
				card_number : payment.card_number,
				is_cancel : false
			})
  			if(rows) return res.code(200).send({result : true});
			else throw "에러";
		} catch (error) {
			return res.code(200).send({error : error});
		}
	},

	Cancel :  async (req, res) => {
		try {
			let {merchant_uid, reason} = req.body;
			const rows = await pay_report.findOne({
				where : {merchant_uid : merchant_uid}
			})
			if (!rows) throw  "에러";
			const getToken = await axios.post('https://api.iamport.kr/users/getToken', {
				imp_key : process.env.imp_key,
				imp_secret : process.env.imp_secret
			})
			const getCancelData = await axios.post('https://api.iamport.kr/payments/cancel', {
				reason : reason, // 가맹점 클라이언트로부터 받은 환불사유
				imp_uid : rows.imp_uid, // imp_uid를 환불 `unique key`로 입력
				amount: rows.paid_amount, // 가맹점 클라이언트로부터 받은 환불금액
				checksum: rows.paid_amount // [권장] 환불 가능 금액 입력
            },
			{
				headers: {
					Authorization: getToken.data.response.access_token,
				},
			})
			if(getCancelData.data.code == 0){
				// 업데이트 실패 시, 기록 따로 저장하는 로직 필요
				await pay_report.update({
					is_cancel: true,
					cancel_reason : reason
				}, {
					where : { merchant_uid : merchant_uid}
				})
				return res.code(200).send({result : true});
			}else{
				return res.code(200).send({result : false});
			}
		} catch (error) {
			return res.code(200).send({error : error});
		}
	},

	GetPayment :  async (req, res) => {
		try {
			let {user_id} = req.query;
			const rows = await pay_report.findAll({
				where : {user_id : user_id},
				order: [["createdAt", "desc"]]
			})
			if (!rows) throw "에러";
			return  res.code(200).send(rows);
		} catch (error) {
			return res.code(200).send({error : error});
		}
	},

	Webhook :  async (req, res) => {
		try {
			let {imp_uid,merchant_uid,status} = req.query;
			console.log(imp_uid);
			console.log(merchant_uid);
			console.log(status);
			if (!rows) throw "에러";
			return  res.code(200).send(imp_uid,merchant_uid,status);
		} catch (error) {
			return res.code(200).send({error : error});
		}
	},

}