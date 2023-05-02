const http = require('http');

const postgresql_gateway = require('./postgresql_gateway.js');

const hostname = 'localhost';

const port = 8080;

const server = http.createServer(httpHandler);

server.listen(port, hostname, () => {
   console.log(`Server running at http://${hostname}:${port}/`);
});

function httpHandler(req, res) {
   var dg = new postgresql_gateway();

   var json_payload = '';

   req.on('data', function(data) {
      json_payload += data;
   });

   req.on('end', function() {
      function callBack(err, result) {
         var response = {};

         if (err) {
            response.error = err.message;
         } else {
            response.data = result;
         }

         res.write(JSON.stringify(response, null, 4));

         res.end();
      }

      switch (req.method) {
         case 'POST':
            dg.save_data(JSON.parse(json_payload), callBack);

            break;

         case 'PUT':
            dg.update_data(JSON.parse(json_payload), callBack);

            break;

         case 'DELETE':
            dg.delete_data(JSON.parse(json_payload), callBack);

            break;

         case 'GET':
            const url = require('url');

            const queryparams = url.parse(req.url, true).query;

            var customerId = '';

            if (queryparams.customer_id) {
               customerId = queryparams.customer_id;
            }

            dg.query_data(customerId, callBack);

            break;
      }
   });
}
