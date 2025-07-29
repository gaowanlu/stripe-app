import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CreatePaymentIntentForm = ({ amount, currency, orderId, paymentMethodTypes }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [succeeded, setSucceeded] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setProcessing(true);

        if (!stripe || !elements) {
            setProcessing(false);
            return;
        }

        // 创建 PaymentIntent
        const response = await fetch('http://mfavant.xyz:3001/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, currency, orderId, paymentMethodTypes }),
        });

        const { clientSecret, error: backendError } = await response.json();

        if (backendError) {
            setError(backendError);
            setProcessing(false);
            return;
        }

        // 确认支付
        let result;
        if (paymentMethodTypes.includes('card')) {
            const cardElement = elements.getElement(CardElement);
            result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: { name: 'Customer Name' },
                },
            });
        } else if (paymentMethodTypes.includes('alipay')) {
            result = await stripe.confirmAlipayPayment(clientSecret, {
                return_url: window.location.href, // 支付完成后的重定向 URL
            });
        } else if (paymentMethodTypes.includes('wechat_pay')) {
            result = await stripe.confirmWechatPayPayment(clientSecret, {
                payment_method_options: {
                    wechat_pay: {
                        // Specify 'web' for desktop browsers or 'mobile_web' for mobile browsers
                        client: 'web',
                    },
                },
                return_url: window.location.href,
            });
        }

        setProcessing(false);

        if (result?.error) {
            setError(result.error.message);
        } else if (result?.paymentIntent?.status === 'succeeded') {
            setSucceeded(true);
            setError(null);
        }
        else {
            setError('支付失败，请稍后再试。');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {paymentMethodTypes.includes('card') && (
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': { color: '#aab7c4' },
                            },
                            invalid: { color: '#9e2146' },
                        },
                    }}
                />
            )}
            <button
                type="submit"
                disabled={!stripe || processing || succeeded}
                style={{
                    marginTop: '10px',
                    padding: '10px 20px',
                    backgroundColor: succeeded ? '#28a745' : '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: succeeded ? 'default' : 'pointer',
                }}
            >
                {processing ? '处理中...' : succeeded ? '支付成功' : '立即支付'}
            </button>
            {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
        </form>
    );
};

export default CreatePaymentIntentForm;