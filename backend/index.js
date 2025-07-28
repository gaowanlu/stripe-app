require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Stripe = require('stripe')

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 在Stripe设置好产品，然后就会有一个PriceID
app.get('/checkout', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: 'price_1RprHDFR9hMdzEGvV5rvfjlJ',
                    quantity: 1
                },
            ],
            mode: 'payment',
            // 客户支付成功后跳转地URL
            success_url: 'http://localhost:3000/success',
            // 客户取消支付后跳转地URL
            cancel_url: 'http://localhost:3000/cancel',
        });
        return res.status(200).json(session);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

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
            amount: amount,
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