const express = require('express');
const bodyParser = require('body-parser');
var authenticate = require('../authenticate');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json())
promoRouter.route('/')

.get((req,res,next)=> {
    res.end('Will send all the promotions to you!')
})
.post(authenticate.verifyUser,(req,res,next)=> {
    
    res.end('Will add the promotion: ' + req.body.name + ' with details: ' + req.body.description);
})
.put(authenticate.verifyUser,(req,res,next)=> {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete(authenticate.verifyUser,(req,res,next)=> {
        res.end('Deleting promotion: ' + req.params.promoId)
})

promoRouter.route('/:promoId')
.get((req,res,next)=> {
    res.end('Will send the promotion ' + req.params.promoId +  ' to you!')

})
.post(authenticate.verifyUser,(req,res,next)=> {
    res.end('POST operation not supported on /promotions' + req.params.promoId)
})
.put(authenticate.verifyUser,(req,res,next)=> {
    res.write('Updating the promotion ' + req.params.promoId +  ' to you!')
    res.end('Will update the promotion: ', + req.body.name + ' with details: ' + req.body.description)
})
.delete(authenticate.verifyUser,(req,res,next)=> { 
    res.end('Deleting promotion: ' + req.params.promoId)
})


module.exports  = promoRouter;