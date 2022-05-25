import mysql from 'mysql2'
import 'dotenv/config'


const dbConn=mysql.createConnection({
    host:process.env.host,
    port:process.env.dbport,
    user:process.env.user,
    password:process.env.password,
    database:process.env.database,
   
})
dbConn.connect((err)=>{
    if(err){
        console.log(err)
        throw err;
    }
})
export default dbConn;