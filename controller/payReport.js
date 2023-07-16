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
const util = require('util');

const _iamport_payment_lookup_endpoint = "https://api.iamport.kr/payments";

module.exports = {
	// 결제가 됐는데 그동안 서버가 꺼져서 반영이 안된 경우에는 개발자가 서버 다운을 일일히 확인해서
	// 배치파일을 돌려서 승인으로 바꿔주거나 발견을 못할 것 같으면,
	// 프론트에 버튼을 달아서 새로고침을 해서 확인을 수동하게끔 달아줘야 함

	// 결재 대기 로직
	WaitAccept :  async (req, res) => {
		try {
			let {payment, user_id} = req.body;
			const rows = await pay_report.create({
				user_id : user_id,
				pay_method : payment.pay_method,
				merchant_uid : payment.merchant_uid,
				paid_amount : payment.paid_amount,
				buyer_name : payment.buyer_name,
				buyer_email : payment.buyer_email,
				buyer_tel : payment.buyer_tel,
				buyer_addr : payment.buyer_addr,
				buyer_postcode : payment.buyer_postcode,
				card_name : payment.card_name,
				bank_name : payment.bank_name,
				card_quota : payment.card_quota,
				card_number : payment.card_number,
				is_complete : 1
			})
  			if(rows) return res.code(200).send({result : true});
			else throw "에러";
		} catch (error) {
			return res.code(200).send({error : error});
		}
	},

	// 결재 로직
	Accept :  async (req, res) => {
		try {
			let {payment, user_id} = req.body;
			const getToken = await axios.post('https://api.iamport.kr/users/getToken', {
				imp_key : process.env.imp_key,
				imp_secret : process.env.imp_secret
			})
			// 실제로 결제내역이 있는지 아이엠포트 서버에서 확인
			const retval = await axios.post(util.format('https://api.iamport.kr/payments/%s',payment.imp_uid),{
			}, {
				headers: {
					Authorization: getToken.data.response.access_token,
				}
			});
			// 아이엠포트 서버에 결제내역이 없을 경우
			if (retval.data.response.status != "paid") {
				throw "에러";
            }
			// 아이엠포트 서버상의 가격과 유저의 요청 가격 맞는지 비교
			if(retval.data.response.amount != payment.paid_amount){
				throw "에러";
            }
			// 이전 결재대기 로직 불러와서 업데이트
			const rows = await pay_report.update({
				is_complete :  0,
				imp_uid : payment.imp_uid
			  },{
				where :{user_id : user_id, merchant_uid : payment.merchant_uid}
			  })
			  console.log(rows)
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
					is_complete: 2,
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
				where : {user_id : user_id,is_complete : 0},
				order: [["createdAt", "desc"]]
			})
			if (!rows) throw "에러";
			return  res.code(200).send(rows);
		} catch (error) {
			return res.code(200).send({error : error});
		}
	},

	// 통장입금 + 가상계좌 결제하기 : 웹훅이 있어야해서 배포 후 가능
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