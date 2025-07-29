const stripe = require('../mgr/stripemgr');
const expressapp = require('../mgr/expressmgr');

// 在Stripe设置好产品，然后就会有一个PriceID
expressapp.post('/checkout', async (req, res) => {
    try {
        const { success_url, cancel_url } = req.body;
        if (!success_url || !cancel_url) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        // 此处是直接在Stripe Dashboard上创建的产品,产品有一个唯一的价格ID
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
            success_url,
            // 客户取消支付后跳转地URL
            cancel_url,
            // stripe调用我们的webhook时会带回来
            payment_intent_data: {
                metadata: {
                    orderId: "订单ID",
                    userId: "用户ID",
                }
            }
        });
        return res.status(200).json(session);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
