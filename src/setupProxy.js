const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function(app) {
    app.use(
        createProxyMiddleware('/api1', {
            target: 'http://124.222.167.196:5000',
            changeOrigin: true,
            pathRewrite: {'^/api1': ''}
        })
    )
}