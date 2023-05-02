class postgresql_gateway {
    connectDb() {
        const { Client } = require('pg');
        const client = new Client({
            user: 'vultradmin',
            database: 'telega_py__db',
            password: 'AVNS_MGFdd5I4dKgYKdItZRI',
            port: 16751,
            host: 'vultr-prod-15677b28-3396-40dc-a808-166d996fe86e-vultr-prod-2b1d.vultrdb.com',
            ssl: { rejectUnauthorized: false },
        });

        client.connect();
        return client;
    }

    execute_query(callBack, queryString, paramValues) {
        var db_client = this.connectDb();

        db_client.query(queryString, paramValues, (err, res) => {
            if (err) {
                callBack(err, null);
            } else {
                callBack(null, res.rows);
            }
            db_client.end();
        });
    }

    save_data(jsonData, callBack) {
        var paramValues = [];
        paramValues.push(jsonData.first_name);
        paramValues.push(jsonData.last_name);
        var queryString = 'insert into customers (first_name, last_name) values ($1, $2) RETURNING customer_id, first_name, last_name';
        this.execute_query(callBack, queryString, paramValues);
    }

    update_data(jsonData, callBack) {
        var paramValues = [];
        paramValues.push(jsonData.first_name);
        paramValues.push(jsonData.last_name);
        paramValues.push(jsonData.customer_id);
        var queryString = 'update customers set first_name = $1, last_name = $2 where customer_id = $3 RETURNING customer_id, first_name, last_name';
        this.execute_query(callBack, queryString, paramValues);
    }

    delete_data(jsonData, callBack) {
        var paramValues = [];
        paramValues.push(jsonData.customer_id);
        var queryString = 'delete from customers where customer_id = $1 RETURNING customer_id, first_name, last_name';
        this.execute_query(callBack, queryString, paramValues);
    }

    query_data(customerId, callBack) {
        var queryString = 'select * from customers';
        var paramValues = [];

        if (customerId != '') {
            queryString += ' where customer_id = $1';
            paramValues.push(customerId);
        }

        this.execute_query(callBack, queryString, paramValues);
    }
}

module.exports = postgresql_gateway;
