var mongo = require('mongodb');

var Server = mongo.Server,
    BSON = mongo.BSONPure;

var mongoUri = process.env.MONGOLAB_URI || "mongodb://localhost/initiativedb?auto_reconnnect"

var db = null;

mongo.connect(mongoUri, {}, function(err, database) {
    if(!err) {
        db = database;
        console.log("Connected to 'initiativedb' database");
        db.collection('initiatives', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The 'initiatives' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
    else {
        console.log("COULD NOT CONNECT TO MONGO: " + mongoUri);
    }
});
 
exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving initiative: ' + id);
    db.collection('initiatives', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};
 
exports.findAll = function(req, res) {
    db.collection('initiatives', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};
 
exports.addinitiative = function(req, res) {
    var initiative = req.body;
    console.log('Adding initiative: ' + JSON.stringify(initiative));
    db.collection('initiatives', function(err, collection) {
        collection.insert(initiative, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}
 
exports.updateinitiative = function(req, res) {
    var id = req.params.id;
    var initiative = req.body;
    console.log('Updating initiative: ' + id);
    console.log(JSON.stringify(initiative));
    db.collection('initiatives', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, initiative, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating initiative: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(initiative);
            }
        });
    });
}
 
exports.deleteinitiative = function(req, res) {
    var id = req.params.id;
    console.log('Deleting initiative: ' + id);
    db.collection('initiatives', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}
 
/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {
 
    var initiatives = [
    {
        name: "CHATEAU DE SAINT COSME",
        year: "2009",
        grapes: "Grenache / Syrah",
        country: "France",
        region: "Southern Rhone",
        description: "The aromas of fruit and spice...",
        picture: "saint_cosme.jpg"
    },
    {
        name: "LAN RIOJA CRIANZA",
        year: "2006",
        grapes: "Tempranillo",
        country: "Spain",
        region: "Rioja",
        description: "A resurgence of interest in boutique vineyards...",
        picture: "lan_rioja.jpg"
    }];
 
    db.collection('initiatives', function(err, collection) {
        collection.insert(initiatives, {safe:true}, function(err, result) {});
    });
 
};