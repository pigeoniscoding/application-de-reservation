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

app.get("/test",(req,res)=>{ //tester la connection
    res.send("pigeon") ; 
})

//syntaxe d'une route : 
//app.get("/nomdelaroute",(req,res)=>{pool.query})
app.post("/disponibilite",async (req,res)=>{  //va recevoir date et Id_salle (id)
    const { date, id } = req.body
    
    const parsedDate = new Date(date);   //met la date recu a une forme laisible par phpmyadmin
    const formattedDate = parsedDate.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
    
    
   let [result] =  await pool.query ("SELECT Time FROM `reservation` WHERE Id_Salles=? AND Date=?;", [id,formattedDate])

            console.log("dispo ok!");
            res.status(200).json({ message: "Success", data: result });  //le resultat est stocké dans data
         

})

app.post("/reservation",async (req,res)=>{
    const { date,id,idTime } = req.body
    
    const parsedDate = new Date(date);
    const formattedDate = parsedDate.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
    
    console.log(formattedDate);
    console.log(idTime);
    console.log(id);
    
    await pool.query ("INSERT INTO reservation (Date,Time,Id_Salles) VALUES (? ,? ,?);", [formattedDate,idTime,id])

            console.log("dispo ok!");
            
            res.status(200).json({ message: "Success" });

})


//route pour les salles 
app.get("/salles",async (req,res)=>{
    let [result] = await pool.query("SELECT Numero_de_la_salle FROM salles")

        res.status(200).json({ message: "Success", data: result });  
    
})



app.listen(3000 , ()=>{
    console.log("le serveur tourne!")
}) //verifier que le serveur marche

