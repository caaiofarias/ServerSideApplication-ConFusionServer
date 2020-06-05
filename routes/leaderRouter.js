const express = require('express');
const bodyParser = require('body-parser');
var authenticate = require('../authenticate');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json())
leaderRouter.route('/')
.get((req,res,next)=> {
    res.end('Will send all the leaders to you!')
})
.post(authenticate.verifyUser,(req,res,next)=> {
    
    res.end('Will add the leader: ' + req.body.name + ' with details: ' + req.body.description);
})
.put(authenticate.verifyUser,(req,res,next)=> {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
})
.delete(authenticate.verifyUser,(req,res,next)=> {
        res.end('Deleting leader: ' + req.params.leaderId)
})

leaderRouter.route('/:leaderId')

.get((req,res,next)=> {
    res.end('Will send the leader ' + req.params.leaderId +  ' to you!')

})
.post(authenticate.verifyUser,(req,res,next)=> {
    res.end('POST operation not supported on /leaders' + req.params.leaderId)
})
.put(authenticate.verifyUser,(req,res,next)=> {
    res.write('Updating the leader ' + req.params.leaderId +  ' to you!')
    res.end('Will update the leader: ', + req.body.name + ' with details: ' + req.body.description)
})
.delete(authenticate.verifyUser,(req,res,next)=> { 
    res.end('Deleting leader: ' + req.params.leaderId)
})


module.exports  = leaderRouter;