'use strict';

var Excel = require("exceljs");

module.exports = function(Machine) {

    Machine.ingest = function(req, res, cb){

        console.log(req.files);
        cb(null, 'file uploaded');
        //1. Read entire CSV file
        //2. Insert one record per row

    }

    Machine.export = function(payload, callback){

        callback(null, payload);
        //1. Query for all rows of Machine table
        //2. iterate over all items and create array
        //3. Use exceljs to respond with .xlxs file

    }    

    //For importing CSV files
    Machine.remoteMethod('ingest', {

        accepts: [
            {arg: 'req', type: 'object', 'http': {source: 'req'}},
            {arg: 'res', type: 'object', 'http': {source: 'res'}},
          ],
        http: {
            verb: 'post',
            status: 200,
        },
        returns: { arg: 'response', type: 'string' }
    

    });

    Machine.remoteMethod('export', {

        accepts: { arg: 'msg', type: 'string' }, 
        returns: { arg: 'response', type: 'string' }
    

    });    

};
