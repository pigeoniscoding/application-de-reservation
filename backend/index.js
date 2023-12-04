const express = require("express");
const cors = require("cors");
const pool = require("./database")

const corsOption = {
    origin : "*",
    methods: ["GET", "POST" , "PUT" , "DELETE"],
}




const app = express(); //creation de app express
app.use(cors(corsOption));



app.use(express.json()); //pour decoder du json

app.get("/test",(req,res)=>{
    res.send("pigeon") ; 
})

app.get("/disponibilite",(req,res)=>{
    // res.json({"dispo": "ok"});
    pool.query ("SELECT statut_de_salle FROM `concerne`;", (error,result)=>{
        if(error){
            console.log(error);
            res.status(500).json({message : "echec lors de la requette"});
        }
        else{
            console.log("dispo ok!");
            res.status(200).json({message: result});
        }
    })  

})

app.listen(3000 , ()=>{
    console.log("le serveur tourne!")
}) //verifier que le serveur marche

