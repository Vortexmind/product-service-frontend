var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config');
var apiConfig = config.get("Api");


/* GET products listing. */
router.get('/', function(req, res, next) {
  console.log('Calling '+apiConfig.baseUrl+'/products/all');
  request(apiConfig.baseUrl+'/products/all?session='+req.session.id, function(error, response, body) {
  if (!error && response.statusCode == 200) {
    var data = body;

    console.log("Session id is " + req.session.id);
    res.render('products', {
      items: JSON.parse(data),
      user: req.session.id,
      title: 'All Products'
    });
  } else {
    var statusCode = response.statusCode || 500;
    res.status(statusCode);
    res.end('Error: ' + error);
  }
  });
});

router.get("/view/:productId/", function(req, res,next){
  var prodId = req.params.productId;
  console.log('Calling '+apiConfig.baseUrl+'/products/product/?id='+prodId);
  request(apiConfig.baseUrl+'/products/product/?id='+prodId+'&session='+req.session.id, function(error, response,body){
    if (!error && response.statusCode == 200) {
      var data = body;

      res.render('product_detail', {
        item: JSON.parse(data),
        user: req.session.id
      });
    } else {
      var statusCode = response.statusCode || 500;
      res.status(statusCode);
      res.end('Error: ' + error);
    }
  });
});

router.get("/buy/:productId/", function (req, res, next) {
  var prodId = req.params.productId;
  var price = req.query.price;
  console.log('Calling '+apiConfig.baseUrl+'/products/buy?id='+prodId+'&quantity=1&price='+price);
  request.put(apiConfig.baseUrl+'/products/buy?id='+prodId+'&quantity=1&price'+price+'&session='+req.session.id, function(error, response, body){
    if (!error && response.statusCode == 200) {
      res.render('product_purchase');
    } else {
      var statusCode = response.statusCode || 500;
      res.status(statusCode);
      res.end('Error: ' + error);
    }
  });
});

module.exports = router;
