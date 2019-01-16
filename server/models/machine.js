'use strict';

var Excel = require("exceljs");
var unstream = require('unstream');

module.exports = function(Machine) {

    Machine.ingest = function(req, res, cb){

        console.log(req.files);

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

        });

        cb(null, 'file uploaded');        

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


    Machine.export = function(res,cb){

        
        //2. iterate over all items and create array
        //3. Use exceljs to respond with .xlxs file

        //1. Query for all rows of Machine table
        Machine.find(null, (err, machines) => {



            var workbook = new Excel.Workbook();
            
            var worksheet = workbook.addWorksheet('Machine Data');
            
            worksheet.columns = [
                { header: 'ID', key: 'id' },
                { header: 'Active', key: 'active' },
                { header: 'Position', key: 'position' },
                { header: 'Closing Time', key: 'closingTime' }
            ];

            worksheet.addRows(machines);

            var datetime = new Date();
            res.set('Expires', 'Tue, 03 Jul 2001 06:00:00 GMT');
            res.set('Cache-Control', 'max-age=0, no-cache, must-revalidate, proxy-revalidate');
            res.set('Last-Modified', datetime +'GMT');
            res.set('Content-Type','application/force-download');
            res.set('Content-Type','application/octet-stream');
            res.set('Content-Type','application/download');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.set('Content-Disposition','attachment;filename=machines.xlsx');
            res.set('Content-Transfer-Encoding','binary');
            
            workbook.xlsx.write(unstream({}, function(data) {

                res.send(data);
                res.end();

            }));
            
        });

    }    

    Machine.remoteMethod('export', {

        http: {
            verb: 'get',
            status: 200
        },
        accepts: [
            {arg: 'res', type: 'object', 'http': { source: 'res'}}
        ],
        returns: { arg: 'response', type: 'string' },
        description: "Outputs an .xlxs file of all current machine data",
    

    });    

};
