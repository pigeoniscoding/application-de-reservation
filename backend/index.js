const express = require("express");
const cors = require("cors");
const pool = require("./database");
const bcrypt = require('bcrypt');
const saltRounds = 4;



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
    const { id_user,details,date,id,idTime,equipement } = req.body
    
    const parsedDate = new Date(date);
    const formattedDate = parsedDate.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
    
    console.log(formattedDate);
    console.log(idTime);
    console.log(id);
    
    await pool.query ("INSERT INTO `reservation`(`Id_Personnes_`,`Details`, `Date`, `Time`, `Id_Salles`, `Materiel`, `Date_de_reservation`) VALUES (?,?,?,?,?,?,NOW())", [id_user,details,formattedDate,idTime,id,equipement])

            console.log("dispo ok!");
            
            res.status(200).json({ message: "Success" });

})


//route pour les salles 
app.get("/salles",async (req,res)=>{
    let [result] = await pool.query("SELECT Numero_de_la_salle FROM salles")

        res.status(200).json({ message: "Success", data: result });  
    
})


//route pour recupérer les utilisateurs 
// app.get("/utilisateur",async (req,res)=>{
//     const {nom, prenom} = req.body

//     let [result] = await pool.query("SELECT Id_Personnes, Adress_mail FROM `utilisateurs` WHERE Nom =? AND Prenom =?",
//     [nom, prenom])

//         res.status(200).json({ message: "Success", data: result });  
    
// })

// app.get("/login",async (req,res)=>{
//     const {email,} = req.body

//     let [result] = await pool.query("SELECT * FROM `utilisateurs` WHERE Adress_mail = ?",
//     [email]);
//     res.status(200).json({ message: "Success", data: result });  
    
// })
//route pour le signin
app.post("/signin",async (req, res) => {
    const {nom, prenom, email, mdp} = req.body;
    const [result] = await pool.query("SELECT * FROM utilisateurs WHERE Adress_mail= ?",[email]);
    console.log(result);
    if (result.length > 0){
        return res.status(400).json({error : "cet utilisateur existe déja"})
    }
    //hacher le mot de pass
    const hashedPassword = await bcrypt.hash(mdp, 4);
    await pool.query("INSERT INTO `utilisateurs`(`Nom`, `Prenom`, `Adress_mail`, `mot_de_pass`) VALUES (?,?,?,?)",[nom, prenom, email, hashedPassword]);
    res.status(201).json('ajout réussi')
});

//route pour le login
app.post("/login",async(req, res)=> {
    const {email,mdp} = req.body;
    const [result] = await pool.query ("SELECT * FROM `utilisateurs` WHERE Adress_mail =?;",[email]);
    if (result.length === 0){
        return res.status(401).json({error : "Utilisateur non trouvé"});
    }
    console.log([result][0][0])
    const user = [result][0][0];
    const passwordMatch = await bcrypt.compare(mdp, user.mot_de_pass);
    console.log(passwordMatch);
    if (passwordMatch === false){
        return res.status(401).json({error: "mot de passe incorrect!"});
    }
    else{
        res.status(201).json({message:"sucess",pass: passwordMatch ,id: user.Id_Personnes});
    }
})

//route pour login des admins
app.post("/loginAdmin",async(req, res)=> {
    const {email,mdp} = req.body;
    const [result] = await pool.query ("SELECT * FROM `gestionnaires` WHERE email =?;",[email]);
    if (result.length === 0){
        return res.status(401).json({error : "Utilisateur non trouvé"});
    }
    console.log([result][0][0])
    const user = [result][0][0];
    const passwordMatch = await bcrypt.compare(mdp, user.mdp);
    console.log(passwordMatch);
    if (passwordMatch === false){
        return res.status(401).json({error: "mot de passe incorrect!"});
    }
    else{
        res.status(201).json({message:"sucess",pass: passwordMatch ,id: user.Id_Personnes});
    }
})


//route pour afficher les utilisateurs
app.get("/utilisateurs", async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM utilisateurs WHERE Est_Admin = 0");
      res.json(rows);

    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
      res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs." });
    }
  });
  
  //route pour chercher les utilisateurs selon leur mail
  app.get("/recherche", async (req, res) => {
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ error: "Veuillez fournir une adresse e-mail pour la recherche." });
    }
  
    try {
      const [rows] = await pool.query("SELECT * FROM utilisateurs WHERE Adress_mail = ? AND Est_Admin = 0", [email]);
      if (rows.length === 0) {
        return res.status(404).json({ error: "Aucun utilisateur trouvé avec cette adresse e-mail." });
      }
      res.json(rows);
    } catch (error) {
      console.error("Erreur lors de la recherche des utilisateurs :", error);
      res.status(500).json({ error: "Erreur lors de la recherche des utilisateurs." });
    }
  });

  app.post("/delete",async (req,res)=>{
    const { email } = req.body
    
  
    
    await pool.query ("DELETE FROM `utilisateurs` WHERE Adress_mail = ?", [email])
            console.log (email);
            res.status(200).json({ message: "Success" });

})

app.post("/modifier",async (req,res)=>{
    const { Email, Prenom, Nom, Numero_de_telephone, Date_de_naissance } = req.body
    
  
    
    await pool.query ("UPDATE `utilisateurs` SET `Nom`=?,`Prenom`=?,`Numero_de_telephone`=?,`Date_de_naissance`=? WHERE Adress_mail = ?", [Nom,Prenom,Numero_de_telephone,Date_de_naissance,Email])
            console.log (Email);
            res.status(200).json({ message: "Success" });

})

app.get("/recupsalles", async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM salles");
      res.json(rows);

    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
      res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs." });
    }
  });

  app.post("/cherchsalles", async (req, res) => {
    const {Id_Salles} = req.body;
    if (!Id_Salles) {
      return res.status(400).json({ error: "Veuillez fournir un ID pour la recherche." });
    }
  
    try {
      const [rows] = await pool.query("SELECT * FROM salles WHERE Id_Salles  = ?", [Id_Salles]);
      if (rows.length === 0) {
        return res.status(404).json({ error: "Aucune salle trouvé avec cet ID." });
      }
      res.json(rows);
    } catch (error) {
      console.error("Erreur lors de la recherche des utilisateurs :", error);
      res.status(500).json({ error: "Erreur lors de la recherche des utilisateurs." });
    }
  });

  //route pour effacer les chambres 
  app.post("/deleteRoom",async (req,res)=>{
    const { Id_Salles } = req.body
    
  
    
    await pool.query ("DELETE FROM `salles` WHERE Id_Salles = ?", [Id_Salles])
            console.log (Id_Salles);
            res.status(200).json({ message: "Success" });

})

//ajouter une salle
app.post("/AddRoom",async (req,res)=>{
  const { Numero_de_la_salle, Capacite, Description, } = req.body
  

  
  await pool.query ("INSERT INTO `salles`( `Numero_de_la_salle`, `Capacite`, `Description`) VALUES (?,?,?)", [Numero_de_la_salle,Capacite,Description])
          
          res.status(200).json({ message: "Success" });

})

//afficher un admin
app.get("/afficherAdmin", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM `utilisateurs` WHERE Est_Admin = 1");
    res.json(rows);

  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des Admin." });
  }
});

//chercher un Admin avec un email
app.get("/chercherAdmin", async (req, res) => {
  const email = req.query.email;
  if (!email) {
    return res.status(400).json({ error: "Veuillez fournir une adresse e-mail pour la recherche." });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM utilisateurs WHERE Adress_mail = ? AND Est_Admin = 1", [email]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Aucun utilisateur trouvé avec cette adresse e-mail." });
    }
    res.json(rows);
  } catch (error) {
    console.error("Erreur lors de la recherche des utilisateurs :", error);
    res.status(500).json({ error: "Erreur lors de la recherche des utilisateurs." });
  }
});

//ajouter un Admin
app.post("/AddAdmin",async (req,res)=>{
  const { Email} = req.body
  

  
  await pool.query ("UPDATE `utilisateurs` SET Est_Admin = 1 WHERE Adress_mail = ?", [Email])
          console.log (Email);
          res.status(200).json({ message: "Success" });

})

//ajouter un client 
app.post("/AddClient",async (req, res) => {
  const {Nom, Prenom,  Adress_mail, Mot_de_pass, Numero_de_telephone, Date_de_naissance} = req.body;
  const [result] = await pool.query("SELECT * FROM utilisateurs WHERE Adress_mail= ?",[Adress_mail]);
  console.log(result);
  if (result.length > 0){
      return res.status(400).json({error : "cet utilisateur existe déja"})
  }
  //hacher le mot de pass
  const hashedPassword = await bcrypt.hash(Mot_de_pass, 4);
  await pool.query("INSERT INTO `utilisateurs`(`Nom`, `Prenom`, `Adress_mail`, `mot_de_pass`, `Numero_de_telephone`, `Date_de_naissance`,`Est_Admin`) VALUES (?,?,?,?,?,?,0)",[Nom, Prenom, Adress_mail, hashedPassword, Numero_de_telephone, Date_de_naissance]);
  res.status(201).json('ajout réussi')
});

//afficher une reservation
app.get("/afficherReservation", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM `reservation`");
    res.json(rows);

  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des Admin." });
  }
});

//chercher une reservation

app.post("/chercherRservation", async (req, res) => {
  const Id_Salles = req.body.Id_Salles; // Récupérer Id_Salles depuis le corps de la requête
  const Date = req.body.Date; // Récupérer Date depuis le corps de la requête
  const Time = req.body.Time; // Récupérer Time depuis le corps de la requête
  if (!Id_Salles || !Date || !Time) {
    return res.status(400).json({ error: "Veuillez fournir les données pour la recherche." });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM reservation WHERE Id_Salles = ? AND Date = ? AND Time = ?", [Id_Salles, Date, Time]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Aucune reservation avec ces données." });
    }
    res.json(rows);
  } catch (error) {
    console.error("Erreur lors de la recherche des utilisateurs :", error);
    res.status(500).json({ error: "Erreur lors de la recherche des utilisateurs." });
  }
});

//supprimer une reservation
app.post("/deleteReservation", async (req, res) => {
  const Id_Salles = req.body.Id_Salles; // Récupérer Id_Salles depuis le corps de la requête
  const Date = req.body.Date; // Récupérer Date depuis le corps de la requête
  const Time = req.body.Time; // Récupérer Time depuis le corps de la requête
  if (!Id_Salles || !Date || !Time) {
    return res.status(400).json({ error: "Veuillez fournir les données pour la recherche." });
  }

  try {
    const [rows] = await pool.query("DELETE FROM reservation WHERE Id_Salles = ? AND Date = ? AND Time = ?", [Id_Salles, Date, Time]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Aucune reservation avec ces données." });
    }
    res.json(rows);
  } catch (error) {
    console.error("Erreur lors de la recherche des utilisateurs :", error);
    res.status(500).json({ error: "Erreur lors de la recherche des utilisateurs." });
  }
});

//ajouter une reservation
app.post("/addReservation", async (req, res) => {
  const Details = req.body.Details;
  const Date = req.body.Date; // Récupérer Date depuis le corps de la requête
  const Time = req.body.Time; // Récupérer Time depuis le corps de la requête
  const Id_Salles = req.body.Id_Salles; // Récupérer Id_Salles depuis le corps de la requête
  const Materiel = req.body.Materiel;
  
  if (!Id_Salles || !Date || !Time) {
    return res.status(400).json({ error: "Veuillez fournir les données pour la recherche." });
  }

  try {
    const [rows] = await pool.query("INSERT INTO `reservation`( `Details`, `Date`, `Time`, `Id_Salles`, `Materiel`, `Date_de_reservation`) VALUES (?,?,?,?,?, NOW())", [Details, Date, Time, Id_Salles, Materiel]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Aucune reservation avec ces données." });
    }
    res.json(rows);
  } catch (error) {
    console.error("Erreur lors de la recherche des utilisateurs :", error);
    res.status(500).json({ error: "Erreur lors de la recherche des utilisateurs." });
  }
});

//afficher le nombre de client 
app.get("/afficherNbClient", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT COUNT(*) FROM `utilisateurs` WHERE Est_Admin = 0 ");
    res.json(rows);

  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des Admin." });
  }
});

//afficher le nombre d'admins
app.get("/afficherNbAdmins", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT COUNT(*) FROM `utilisateurs` WHERE Est_Admin = 1 ");
    res.json(rows);

  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des Admin." });
  }
});

//afficher le nombre de salle
app.get("/afficherNbRooms", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT COUNT(*) FROM `salles`");
    res.json(rows);

  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des Admin." });
  }
});

//afficher le nombre de reservation
app.get("/afficherNbReservation", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT COUNT(*) FROM `reservation`");
    res.json(rows);

  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des Admin." });
  }
});

app.listen(3000 , ()=>{
    console.log("le serveur tourne!")
}) //verifier que le serveur marche

