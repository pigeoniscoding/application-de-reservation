//connection de la base de donnee
const{ createPool} = require('mysql');
const pool = createPool({

    host: "localhost",
    user: "root",
    password: "",
    database: "application de reservation",
    connectionlimit:10, //nombre limite de connections en paralleles 
})

pool.getConnection((err, connection)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("db est connecté");
    }
})

    // pool.query(`SELECT Date_de_debut FROM 'reservation' WHERE Id_Reservation=1;`, (err , result , fields ) => {
    //     if(err){
    //         return console.log(err);
    //     }
    //     return console.log(result);
        
    // })

    

// let date = result;
// connection de la base de donnee

module.exports = pool ;
