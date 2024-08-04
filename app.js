const express = require("express");
const app = express();
const Prometheus = require('prom-client');
const register = new Prometheus.Registry();

register.setDefaultLabels({
    app: 'demo-node-js-app'
})
Prometheus.collectDefaultMetrics({register})

app.get('/metrics', function(req, res)
{
    res.setHeader('Content-Type',register.contentType)

    register.metrics().then(data => res.status(200).send(data))
});

const http_request_counter = new Prometheus.Counter({
    name: 'myapp_http_request_count',
    help: 'Count of HTTP requests made to my app',
    labelNames: ['method', 'route', 'statusCode'],
  });
register.registerMetric(http_request_counter);

app.use(function(req, res, next)
{
    // Increment the HTTP request counter
    http_request_counter.labels({method: req.method, route: req.originalUrl, statusCode: res.statusCode}).inc();

    next();
});

app.get('/',function(req,res){
res.status(200).json({
    message: "Hello from index.html"
})
})

app.get('/products',function(req,res){
    res.status(200).json({
        message: "Hello from product.html"
    })
})

app.listen(3000, () => {
    console.log(`Server is running at 3000`);
});