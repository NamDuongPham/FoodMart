import axios from 'axios';
import CryptoJS from 'crypto-js';
const MOMO_PARTNER_CODE = 'MOMO'; // Thay thế bằng mã đối tác của bạn
const MOMO_ACCESS_KEY = 'F8BBA842ECF85'; // Thay thế bằng access key của bạn
const MOMO_SECRET_KEY = 'K951B6PE1waDMi640xX08PD3vg6EkVlz'; // Thay thế bằng secret key của bạn
const MOMO_API_URL = 'https://test-payment.momo.vn/gw_payment/transactionProcessor'; // URL môi trường test

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createMomoPayment = async (amount:number, orderInfo:any, returnUrl:any, notifyUrl:any) => {
  const requestId = MOMO_PARTNER_CODE + new Date().getTime();
  const orderId = requestId;

  const rawSignature = `accessKey=${MOMO_ACCESS_KEY}&amount=${amount}&extraData=&ipnUrl=${notifyUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${MOMO_PARTNER_CODE}&redirectUrl=${returnUrl}&requestId=${requestId}&requestType=captureWallet`;

  const signature = CryptoJS.HmacSHA256(rawSignature, MOMO_SECRET_KEY).toString(CryptoJS.enc.Hex);

  const requestBody = {
    partnerCode: MOMO_PARTNER_CODE,
    accessKey: MOMO_ACCESS_KEY,
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: returnUrl,
    ipnUrl: notifyUrl,
    extraData: '',
    requestType: 'captureWallet',
    signature: signature,
  };
  const config = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
    }
  };
  
  try {
    const response = await axios.post(MOMO_API_URL, requestBody,config);
    return response.data;
  } catch (error) {
    console.error('Error creating MoMo payment:', error);
    throw error;
  }
};

export default createMomoPayment;
