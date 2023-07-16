import React,{useEffect, useState} from "react";
import axios from 'axios';

export const IamPort = () => {
  const [paymentList, setPaymentList] = useState([]);

    useEffect(() => {

      GetPayment();

      const jquery = document.createElement("script");
      jquery.src = "https://code.jquery.com/jquery-1.12.4.min.js";
      const iamport = document.createElement("script");
      iamport.src = "https://cdn.iamport.kr/js/iamport.payment-1.1.5.js";
      document.head.appendChild(jquery);
      document.head.appendChild(iamport);
      return () => {
        document.head.removeChild(jquery);
        document.head.removeChild(iamport);
      }

    },[])

    const GetPayment = async() => {
      try {
        await axios.get('http://localhost:8081/api/v1/payment/getpayment', {
          params: {
            user_id: "hjhj",
        },
        }).then(res => {
          if (res.data.error) {
              console.log(res.data.error);
              return
          }
          if (res.data) {
            setPaymentList(res.data)
          }
        })
      } catch (error) {
        console.log(error)
      }
    }

    const onClickPayment = () => {
      /* 1. 가맹점 식별하기 */
      const imp_init = process.env.REACT_APP_IMP_INIT;
      const { IMP } = window;
      IMP.init(`${imp_init}`);

      /* 2. 결제 데이터 정의하기 */
      const data = {
        pg: 'html5_inicis',                           // PG사
        pay_method: 'card',                           // 결제수단
        merchant_uid: `mid_${new Date().getTime()}`,   // 주문번호
        amount: 100,                                 // 결제금액
        name: '아임포트 결제 데이터 분석',                  // 주문명
        buyer_name: '홍길동',                           // 구매자 이름
        buyer_tel: '01012341234',                     // 구매자 전화번호
        buyer_email: 'example@example.com',               // 구매자 이메일
        buyer_addr: '신사동 661-16',                    // 구매자 주소
        buyer_postcode: '06018'
      };

      /* 4. 결제 창 호출하기 */
      IMP.request_pay(data, result);
    }
    const onKaKaoPayment = () => {
      /* 1. 가맹점 식별하기 */
      const imp_init = process.env.REACT_APP_IMP_INIT;
      const { IMP } = window;
      IMP.init(`${imp_init}`);

      /* 2. 결제 데이터 정의하기 */
      const data = {
        pg: 'kakaopay',                           // PG사
        pay_method: 'card',                           // 결제수단
        merchant_uid: `mid_${new Date().getTime()}`,   // 주문번호
        amount: 100,                                 // 결제금액
        name: '카카오페이 결제 데이터 분석',                  // 주문명
        buyer_name: '홍길동',                           // 구매자 이름
        buyer_tel: '01012341234',                     // 구매자 전화번호
        buyer_email: 'example@example.com',               // 구매자 이메일
        buyer_addr: '신사동 661-16',                    // 구매자 주소
        buyer_postcode: '06018'
      };
      // 결제 대기 상태로 요청
      await axios.post('http://localhost:8081/api/v1/payment/waitaccept', {
        payment : response,
        user_id : "hjhj"
      })  .then(res => {
        if (res.data.error) {
            console.log(res.data.error);
            return
        }
        if (res.data) {
          alert('결제 성공');
          GetPayment();
        }
      })
      .catch(err => {
          console.log(err);
      });

      /* 4. 결제 창 호출하기 */
      IMP.request_pay(data, result);
    }

    const result = async (response) => {
      const {
        success,
        error_msg
      } = response;
      if (success) {
        // 결재 완료 요청
        await axios.post('http://localhost:8081/api/v1/payment/accept', {
          payment : response,
          user_id : "hjhj"
        })  .then(res => {
          if (res.data.error) {
              console.log(res.data.error);
              return
          }
          if (res.data) {
            alert('결제 성공');
            GetPayment();
          }
      })
      .catch(err => {
          console.log(err);
      });
      } else {
        alert(`결제 실패: ${error_msg}`);
      }
    }

  const cancelPay = async (k) => {
    try {
      await axios.post('http://localhost:8081/api/v1/payment/cancel', {
        merchant_uid: k, // 주문번호
        // cancel_request_amount: 100, // 환불금액
        reason: "테스트 결제 환불", // 환불사유
        // refund_holder: "홍길동", // [가상계좌 환불시 필수입력] 환불 수령계좌 예금주
        // refund_bank: "88", // [가상계좌 환불시 필수입력] 환불 수령계좌 은행코드(예: KG이니시스의 경우 신한은행은 88번)
        // refund_account: "56211105948400" // [가상계좌 환불시 필수입력] 환불 수령계좌 번호
      }).then(res => {
        if (res.data.error) {
            console.log(res.data.error);
            return
        }
        if (res.data.result == true) {
          alert("환불완료")
          GetPayment();
        }else{
          alert("환불실패")
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

    return(
      <>
      <button onClick={onClickPayment}>KG이니시스 결제하기</button><br /><br />
      <button onClick={onKaKaoPayment}>카카오페이 결제하기</button><br /><br />
      <button>네이버페이 결제하기 : 네이버페이 가맹점 가입 및 사업자 아이디 있어야 함</button><br /><br />
      <button>무통장입금 + 가상계좌 결제하기 : 웹훅이 있어야해서 배포 후 가능</button><br /><br />
      {paymentList ? paymentList.map((k) => {
          return (
            <>
             <div>
              주문번호 :{k.merchant_uid.split("mid_")[1]}  <br />
              주문일자 : {k.createdAt} <br />
              진행 : {!k.is_cancel ? <>결제완료<button onClick={() => cancelPay(k.merchant_uid)}>환불하기</button></> : <>환불완료</>}
             </div>
             <br /><br />
             </>
          )
      }) : "데이터로드 실패"
      }
      </>
    )
  }