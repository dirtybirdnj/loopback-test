'use strict';

var Excel = require("exceljs");
var unstream = require('unstream');
var fs = require('fs');

//Figuring out how to convert buffer to a strem was a huge pain
//This article was the only helpful thing I found
//http://derpturkey.com/buffer-to-stream-in-node/
let Duplex = require('stream').Duplex;  
function bufferToStream(buffer) {  
  let stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

module.exports = function(Machine) {

    Machine.ingest = function(req, res, ctx, cb){

        const uploadFile = req.files[0];
        const dataBuff = uploadFile.buffer;
        const dataStream = bufferToStream(dataBuff);
        
        var workbook = new Excel.Workbook();
        
        workbook.xlsx.read( dataStream ).then((book) => {

            var worksheet = book.getWorksheet(1);
            worksheet.columns = [
                { header: 'ID', key: 'id' },
                { header: 'Active', key: 'active' },
                { header: 'Position', key: 'position' },
                { header: 'Closing Time', key: 'closingTime' }
            ];

            let data = {};

            worksheet.eachRow(function(row, rowNumber) {
                
                if(rowNumber != 1){

                    var [ id, attribute, value ] = [ row.values[1], row.values[2], row.values[3]]

                    //Handle inconsistent data model / sheet label
                    if(attribute === 'Closing time') attribute = 'closingTime';
                    
                    if(!data[id]) data[id] = { id: id };
                    data[id][attribute] = value;

                }
            });

            for (var key in data) {
                
                const eachData = data[key];
                const newData = { ...eachData }

                    Machine.upsert(newData, (err, instance) => {

                        if(err){ console.log('err upserting data', newData); }

                    })

            }

            //Finish up
            res.send({status: `Finished parsing ${worksheet.rowCount} rows of data`});
            res.end();

        });

    }

    //For importing CSV files
    Machine.remoteMethod('ingest', {

        accepts: [
            {arg: 'req', type: 'object', http: { source: 'req' } },
            {arg: 'res', type: 'object', http: {source: 'res'}},
            {arg: 'ctx', type: 'object', http: { source: 'context' } },
          ],
        http: {
            verb: 'post',
            status: 200,
        },
        description: "Accepts an .xlxs file, creates or updates machine data",
        returns: { arg: 'response', type: 'string' }
    

    });


    Machine.export = function(res,cb){

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
            
            //3. Use exceljs to respond with .xlsx file
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
