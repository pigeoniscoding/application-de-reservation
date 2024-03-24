// app.test.js

// const request = require('supertest');
// const bcrypt = require('bcrypt'); 
// const app = require('backend/index.js'); 
// const pool = require('backend\database.js'); 
// describe('Test des endpoints de l\'API', () => {
//   it('POST /AddAdmin devrait ajouter un nouvel administrateur', async () => {
  
//     const newAdmin = {
//       Nom: 'Doe',
//       Prenom: 'John',
//       Date_de_naissance: '1990-01-01',
//       Adress_mail: 'john@example.com',
//       mdp: 'password123' 
//     };

    
//     const hashedPassword = await bcrypt.hash(newAdmin.mdp, 4);

    
//     const response = await request(app)
//       .post('/AddAdmin')
//       .send({
//         Nom: newAdmin.Nom,
//         Prenom: newAdmin.Prenom,
//         Date_de_naissance: newAdmin.Date_de_naissance,
//         Adress_mail: newAdmin.Adress_mail,
//         mdp: newAdmin.mdp
//       });

//     // Vérification de la réponse
//     expect(response.status).toBe(200);
//     expect(response.body.message).toBe('Success');


//     const addedAdmin = await pool.query(
//       "SELECT * FROM `gestionnaires` WHERE `nom` = ? AND `prenom` = ? AND `email` = ?",
//       [newAdmin.Nom, newAdmin.Prenom, newAdmin.Adress_mail]
//     );

//     expect(addedAdmin.length).toBe(1); 
//     expect(addedAdmin[0].nom).toBe(newAdmin.Nom);
//     expect(addedAdmin[0].prenom).toBe(newAdmin.Prenom);
//     expect(addedAdmin[0].email).toBe(newAdmin.Adress_mail);
//     expect(await bcrypt.compare(newAdmin.mdp, addedAdmin[0].mdp)).toBe(true); 
//   });
// });

// describe('Test de l\'endpoint POST /AddRoom', () => {
//     it('devrait ajouter une nouvelle salle', async () => {
//       // Données de la nouvelle salle à ajouter
//       const newRoomData = {
//         Numero_de_la_salle: 'Salle 101',
//         Capacite: 50,
//         Description: 'Salle de réunion'
//       };
  
//       // Envoi de la requête POST pour ajouter une nouvelle salle
//       const response = await request(app)
//         .post('/AddRoom')
//         .send(newRoomData);
  
//       // Vérification de la réponse
//       expect(response.status).toBe(200);
//       expect(response.body.message).toBe('Success');
  
//       // Vérification que la nouvelle salle a été ajoutée à la base de données
//       const addedRoom = await pool.query(
//         "SELECT * FROM `salles` WHERE `Numero_de_la_salle` = ? AND `Capacite` = ? AND `Description` = ?",
//         [newRoomData.Numero_de_la_salle, newRoomData.Capacite, newRoomData.Description]
//       );
  
//       expect(addedRoom.length).toBe(1); // La salle doit être ajoutée une seule fois
//       expect(addedRoom[0].Numero_de_la_salle).toBe(newRoomData.Numero_de_la_salle);
//       expect(addedRoom[0].Capacite).toBe(newRoomData.Capacite);
//       expect(addedRoom[0].Description).toBe(newRoomData.Description);
//     });
//   });
