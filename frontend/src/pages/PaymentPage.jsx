import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CreatePaymentIntentForm from '../components/CreatePaymentIntentForm';
import STRIPE_PUBLISHABLE_KEY from '../constants/stripe';

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

function PaymentPage() {
  // 示例金额（单位：分）Stripe以分为单位属于定点数了
  const [amount, setAmount] = useState(1000); // 10CNY

  const [currency, setCurrency] = useState('cny');
  const [orderId, setOrderId] = useState('order_123');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const paymentMethodTypes = {
    card: ['card'],
    alipay: ['alipay'],
    wechat_pay: ['wechat_pay'],
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">订单支付</h1>
        <p className="text-gray-600 mb-6">
          订单金额: ${(amount / 100).toFixed(2)} {currency.toUpperCase()}
        </p>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full p-2 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="card">信用卡 (Visa/Mastercard/UnionPay)</option>
          <option value="alipay">支付宝</option>
          <option value="wechat_pay">微信支付</option>
        </select>
        <Elements stripe={stripePromise}>
          <CreatePaymentIntentForm
            amount={amount}
            currency={currency}
            orderId={orderId}
            paymentMethodTypes={paymentMethodTypes[paymentMethod]}
          />
        </Elements>
      </div>
    </div>
  );
}

export default PaymentPage;