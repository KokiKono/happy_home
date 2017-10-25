/**
 * Created by kokikono on 2017/10/24.
 * https://github.com/mysqljs/mysql
 * 注意：非同期処理はPromise関数として書く、残りは継承先で対応。
 */
import mysql from 'mysql';
import configFile from '../../config.json';

const config = configFile[process.env.NODE_ENV];

export default class Dao {
    constructor() {
        console.log(process.env.NODE_ENV);
        this.connection = mysql.createConnection({
            host: config.mysql.host || 'localhost',
            user: config.mysql.user || 'root',
            password: config.mysql.password || '',
            database: config.mysql.database || 'wp',
        });
    }

    query(sql) {
        return new Promise((resolve, reject) => {
            this.connection.connect();
            this.connection.query(sql, (error, results, fields) => {
                this.connection.end();
                return error ? reject(error) : resolve({ results, fields });
            });
        });
    }
}
