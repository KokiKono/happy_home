/**
 * Created by I.Asakawa on 2017/11/14.
 */
import mysql from 'mysql';
import Async from 'async';

export default class Animation {

    constructor() {
        this.connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'happy_home',
        });
    }

    getScene(){
        return new Promise((resolve, reject) => {
            this.connection.connect((connectErr) => {
                if (connectErr) reject(connectErr);
                this.connection.query(
                    'select scene from t_scene where timestamp = (select max(timestamp) from t_scene)',
                    (queryErr, results) =>{
                            if (queryErr) reject(queryErr);
                            //this.connection.end();
                            const response = [];
                            Async.each(results, (result) => {
                                response.push(result.scene);
                            });
                            resolve(response);
                    },
                );
            });
        });
    }

    insertAnimationFirstData(animation_name) {
        return new Promise((resolve, reject) => {
            this.connection.beginTransaction((beginTransactionErr) => {
                if (beginTransactionErr) reject(beginTransactionErr);
                this.connection.query(
                    'INSERT INTO animation_management(name, type) VALUES(?, "begin")',
                    [animation_name],
                    (queryErr, results) => {
                        if (queryErr) {
                            this.connection.rollback(() => (reject(queryErr)));
                        }
                        this.connection.commit((commitErr) => {
                            if (commitErr) {
                                this.connection.rollback(() => (reject(commitErr)));
                            }
                            //this.connection.end();
                            resolve(results.insertId);
                        });
                    },
                );
            });
        });
    }

    selectMonitoringAnimetionType(id){
        return new Promise((resolve, reject) => {
            this.connection.query(
                'select type from animation_management where id = ?',
                [id],
                (queryErr, results) =>{
                    if (queryErr) reject(queryErr);
                        //this.connection.end();
                        const response = [];
                        Async.each(results, (result) => {
                        response.push(result.type);
                    });
                    resolve(response);
                },
            );
        });
    }
}