const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: "http://192.168.219.100:518" ,
            changeOrigin: true
        })
    );
};