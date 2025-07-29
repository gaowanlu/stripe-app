require('dotenv').config();
const expressapp = require('./mgr/expressmgr');

// 路由注册
require('./router/webhook');
require('./router/checkout');
require('./router/create-payment-intent');

const PORT = process.env.PORT || 3001;
expressapp.listen(PORT, () => console.log(`Server running on port ${PORT}`));
