'use strict';

var Excel = require("exceljs");

module.exports = function(Machine) {

    Machine.ingest = function(req, res, cb){

        console.log(req.files);
        cb(null, 'file uploaded');
        //1. Read entire CSV file
        //2. Insert one record per row

        let testRec = {
            id: 34,
            active: 1,
            position: 52,
            closingTime: 23.31
        }

        Machine.create(testRec, (err, record) => {

            console.log('error',err);
            console.log('record', record);

        })

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
        description: "Accepts an .xlxs file, creates or updates machine data",
        returns: { arg: 'response', type: 'string' }
    

    });

    Machine.remoteMethod('export', {

        accepts: { arg: 'msg', type: 'string' }, 
        returns: { arg: 'response', type: 'string' },
        description: "Outputs an .xlxs file of all current machine data",
    

    });    

};
