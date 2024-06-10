
// const express = require('express');
const bcrypt = require('bcrypt');

const request = require('supertest');
const pool = require('./database'); 
const app = require('./index.js'); 

jest.mock('./database'); // Mocker le module db

// describe('POST /AddClient', () => {
//   beforeEach(() => {
//     jest.clearAllMocks(); //reinitialise tous les mocks 
//   });

//   it('retourne un 400 si le mail n est pas envoyé', async () => {
//     pool.query.mockResolvedValueOnce([[]]); // ce que on attend dans la base de données
//     const response = await request(app)
//       .post('/AddClient')
//       .send({ Mot_de_pass: 'password', Nom: 'Nom', Prenom: 'Prenom', Date_de_naissance: '2000-01-01' });
      
//     expect(response.status).toBe(400);
//     expect(response.body.error).toBe("L'adresse e-mail est requise");
//   });

//   it("retourne 400 si pas de mot de passe", async () => {
//     pool.query.mockResolvedValueOnce([[]]); //API verifie que l'utilisateur n'existe pas
//     const response = await request(app)
//       .post('/AddClient')
//       .send({ Adress_mail: 'test@example.com', Nom: 'Nom', Prenom: 'Prenom', Date_de_naissance: '2000-01-01' });
      
//     expect(response.status).toBe(400);
//     expect(response.body.error).toBe("Le mot de passe est requis");
//   });
//   it("retourne 400 si le nom n a pas le bon format", async () => {
//     pool.query.mockResolvedValueOnce([[]]); 
//     const response = await request(app)
//       .post('/AddClient')
//       .send({ Adress_mail: 'test@example.com', Mot_de_pass: 'password', Nom: 123, Prenom: 'Prenom', Date_de_naissance: '2000-01-01' });
      
//     expect(response.status).toBe(400);
//     expect(response.body.error).toBe("Le nom est requis et doit être une chaîne de caractères");
//   });

//   it("retourne 400 si pas de date de naissance", async () => {
//     pool.query.mockResolvedValueOnce([[]]); //API verifie que l'utilisateur n'existe pas
//     const response = await request(app)
//       .post('/AddClient')
//       .send({ Adress_mail: 'test@example.com',Mot_de_pass: 'password', Nom: 'Nom', Prenom: 'Prenom'});
      
//     expect(response.status).toBe(400);
//     expect(response.body.error).toBe("La date de naissance est requise et doit être au format 'yyyy-mm-dd'");
//   });

//   it("retourne 400 si la date de naissance est de mauvais format", async () => {
//     pool.query.mockResolvedValueOnce([[]]); //API verifie que l'utilisateur n'existe pas
//     const response = await request(app)
//       .post('/AddClient')
//       .send({ Adress_mail: 'test@example.com',Mot_de_pass: 'password', Nom: 'Nom', Prenom: 'Prenom', Date_de_naissance: '12345'});
      
//     expect(response.status).toBe(400);
//     expect(response.body.error).toBe("La date de naissance est requise et doit être au format 'yyyy-mm-dd'");
//   });
//   it('retourne 400 si l utilisateur exist deja', async () => {
//     pool.query.mockResolvedValueOnce([[{ id: 1, Adress_mail: 'test@example.com' }]]); //dire que l'utilisateur exist

//     const response = await request(app)
//       .post('/AddClient')
//       .send({ Adress_mail: 'test@example.com', Mot_de_pass: 'password', Nom: 'Nom', Prenom: 'Prenom', Date_de_naissance: '2000-01-01' });
      
//     expect(response.status).toBe(400);
//     expect(response.body.error).toBe("cet utilisateur existe déja");
//   });

//   it('should return 201 if the user is successfully created', async () => {
//     pool.query.mockResolvedValueOnce([[]]); 
//     pool.query.mockResolvedValueOnce(); //mocker l'insertion

//     const response = await request(app)
//       .post('/AddClient')
//       .send({
//         Adress_mail: 'test@example.com',
//         Mot_de_pass: 'password',
//         Nom: 'Nom',
//         Prenom: 'Prenom',
//         Numero_de_telephone: '1234567890',
//         Date_de_naissance: '2000-01-01'
//       });

//     expect(response.status).toBe(201);
//     expect(response.body).toBe('ajout réussi');
//   });
// });



describe('POST /login',()=>{
  beforeEach(()=>{
    jest.clearAllMocks();
  });

  //tests a faire : l'utilisateur n'existe pas 
  //mauvais mot de passe
  //test du bon fonctionnement 
  it('retourne un statut 401 et message "Utilisateur non trouvé" si le mail ne se trouve pas dans la bdd',
    async()=>{
      pool.query.mockResolvedValueOnce([[]]);
      const response = await request(app)
      .post('/login')
      .send({ Adress_mail: 'test@example.com', Mot_de_pass: 'password'});
      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Utilisateur non trouvé");

    }
  )

  it('retourne un statut 401 et message "mot de passe incorrect!" si le mot de passe est incorrect', async () => {
    const user = {
      Id_Personnes: 1,
      Adress_mail: 'test@example.com',
      mot_de_pass: await bcrypt.hash('mdpcorrect', 4), // hash d'un mot de passe correct
    };

    pool.query.mockResolvedValueOnce([[user]]);
    bcrypt.compare = jest.fn().mockResolvedValueOnce(false); // mot de passe incorrect

    const response = await request(app)
      .post('/login')
      .send({ email: 'test@example.com', mdp: 'mdpincorrect' });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("mot de passe incorrect!");
  });

  it('retourne un statut 201 et message "sucess" si le mot de passe et le mail est correct', async () => {
    const user = {
      Id_Personnes: 1,
      Adress_mail: 'test@example.com',
      mot_de_pass: await bcrypt.hash('mdpcorrect', 4), // hash d'un mot de passe correct
    };

    pool.query.mockResolvedValueOnce([[user]]);
    bcrypt.compare = jest.fn().mockResolvedValueOnce(true); // mot de passe incorrect

    const response = await request(app)
      .post('/login')
      .send({ email: 'test@example.com', mdp: 'mdpcorrect' });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("sucess");
    expect(response.body.pass).toBe(true);
    expect(response.body.id).toBe(user.Id_Personnes);
    
  });
});

