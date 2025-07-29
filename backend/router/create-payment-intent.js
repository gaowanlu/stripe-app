const stripe = require('../mgr/stripemgr');
const expressapp = require('../mgr/expressmgr');

// 创建 PaymentIntent
expressapp.post('/create-payment-intent', async (req, res) => {
    try {
        // 这里没有校验参数合法性 这只是个demo
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
            metadata: { orderId, userId: "用户ID" }, // 存储订单 ID
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
