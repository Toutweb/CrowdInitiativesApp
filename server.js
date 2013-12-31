var express = require('express'),
    initiative = require('./routes/initiatives');
 
var app = express();
 
app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});
 
app.get('/initiatives', initiative.findAll);
app.get('/initiatives/:id', initiative.findById);
app.post('/initiatives', initiative.addinitiative);
app.put('/initiatives/:id', initiative.updateinitiative);
app.delete('/initiatives/:id', initiative.deleteinitiative);
 
app.listen(3000);
console.log('Listening on port 3000...');