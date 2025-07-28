require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 创建 PaymentIntent
app.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount, currency, orderId, paymentMethodTypes } = req.body;

        // 验证请求参数
        if (!amount || !currency || !orderId || !paymentMethodTypes) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        // 创建 PaymentIntent，支持多种支付方式
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Stripe 以分为单位
            currency,
            payment_method_types: paymentMethodTypes, // 动态指定支付方式
            metadata: { orderId }, // 存储订单 ID
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Webhook 处理支付成功事件
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        console.log(`Payment succeeded for order: ${paymentIntent.metadata.orderId}`);
        // 在此更新数据库订单状态
    }

    res.json({ received: true });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));