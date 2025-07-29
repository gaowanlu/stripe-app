const stripe = require('../mgr/stripemgr');
const expressapp = require('../mgr/expressmgr');
const bodyParser = require('body-parser');

// Webhook 处理支付成功事件
expressapp.post('/webhook', bodyParser.raw({ type: 'application/json' }), (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error(err);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log(event.type);
    if (event.type === 'payment_intent.succeeded') {
        console.log("订单支付成功:", event.data.object.metadata);
    }

    res.json({ received: true });
});
