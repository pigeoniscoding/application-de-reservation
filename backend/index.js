const express = require("express");
const cors = require("cors");
const pool = require("./database")

const corsOption = {
    origin : "*",
    methods: ["GET", "POST" , "PUT" , "DELETE"],
    allowedHeaders: ["Content-Type"]
}




const app = express(); //creation de app express
app.use(cors(corsOption));



app.use(express.json()); //pour decoder du json

app.get("/test",(req,res)=>{
    res.send("pigeon") ; 
})

app.post("/disponibilite",(req,res)=>{
    const { date, id } = req.body
    
    const parsedDate = new Date(date);
    const formattedDate = parsedDate.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
    
    
    pool.query ("SELECT Time FROM `reservation` WHERE Id_Salles=? AND Date=?;", [id,formattedDate], (error,result)=>{
        if(error){
            console.log(error);
            res.status(500).json({message : "echec lors de la requette"});
        }
        else{
            console.log("dispo ok!");
            const extractedData = result.map(row => row.Time);
            res.status(200).json({ message: "Success", data: extractedData });
        }
    }) 
     
    

})

app.post("/reservation",(req,res)=>{
    const { date,id,idTime } = req.body
    
    const parsedDate = new Date(date);
    const formattedDate = parsedDate.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
    
    
    
    pool.query ("INSERT INTO reservation (Date,Time,Id_Salles) VALUES (? ,? ,?);", [formattedDate,idTime,id], (error,result)=>{
        if(error){
            console.log(error);
            res.status(500).json({message : "echec lors de la requette"});
        }
        else{
            console.log("dispo ok!");
            
            res.status(200).json({ message: "Success" });
        }
    }) 
     
    

})

app.listen(3000 , ()=>{
    console.log("le serveur tourne!")
}) //verifier que le serveur marche

