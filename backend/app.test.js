const supertest = require("supertest");
const app = require("./index.js");


describe ("POST /AddClient", ()=>{
    describe ("tous les champs son biens remplis",()=>{
        //enregistre `Nom`, `Prenom`, `Adress_mail`, `mot_de_pass`, `Numero_de_telephone`, `Date_de_naissance`,`Est_Admin`
        // EstAdmin = 0
        test ("reponde avec 201 + message 'ajout' réussit",async ()=>{

            const response = await supertest(app).post("/AddClient").send({

                Nom : "jest",
                Prenom : "jest",
                Adress_mail:"jest@jest.com",
                Mot_de_pass:"test",
                Numero_de_telephone:1234567,
                Date_de_naissance: "2024-04-21"

            })
            expect(response.statusCode).toBe(201);
            expect(response.text).toBe("\"ajout réussi\"");
        })

    })
    describe ("le client existe déja ", () =>{
        test("répond avec le statut 400 ", async () => {
            const response = await supertest(app).post("/AddClient").send({
                Nom: "utilisateur",
                Prenom: "test",
                Adress_mail: "test@test.com",
                Mot_de_pass: "test",
                Numero_de_telephone: 1234567,
                Date_de_naissance: "2024-04-21"
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe("cet utilisateur existe déja");
        });
    })

    describe("Le mot de passe n'est pas fourni", () => {
        test("répond avec le statut 400", async () => {
            const response = await supertest(app).post("/AddClient").send({
                Nom: "utilisateur",
                Prenom: "test",
                Adress_mail: "testmdp@test.com",
                //mot de passe pas fournis
                Numero_de_telephone: 1234567,
                Date_de_naissance: "2024-04-21"
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe("Le mot de passe est requis");
           
        });
    });
    

    describe("l'adresse e-mail n'est pas fournie", () => {
        test("répond avec le statut 400", async () => {
            const response = await supertest(app).post("/AddClient").send({
                Nom: "utilisateur",
                Prenom: "test",
                // Adress_mail non fourni
                Mot_de_pass: "test",
                Numero_de_telephone: 1234567,
                Date_de_naissance: "2024-04-21"
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe("L'adresse e-mail est requise");
           
        });
    });

    describe("le nom n'est pas fourni ", () => {
        test("répond avec le statut 400 et un message d'erreur approprié", async () => {
            const response = await supertest(app).post("/AddClient").send({
                // Nom non fourni
                Prenom: "test",
                Adress_mail: "test@test.com",
                Mot_de_pass: "test",
                Numero_de_telephone: 1234567,
                Date_de_naissance: "2024-04-21"
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe("Le nom est requis et doit être une chaîne de caractères");
        });

        test("le nom n'est pas une chaîne de caractères", async () => {
            const response = await supertest(app).post("/AddClient").send({
                Nom: 123, // Nom n'est pas une chaîne de caractères
                Prenom: "test",
                Adress_mail: "test@test.com",
                Mot_de_pass: "test",
                Numero_de_telephone: 1234567,
                Date_de_naissance: "2024-04-21"
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe("Le nom est requis et doit être une chaîne de caractères");
        });
    });

    describe("le prénom n'est pas fourni ou n'est pas une chaîne de caractères", () => {
        test("répond avec le statut 400 et un message d'erreur approprié", async () => {
            const response = await supertest(app).post("/AddClient").send({
                Nom: "utilisateur",
                // Prénom non fourni
                Adress_mail: "test@test.com",
                Mot_de_pass: "test",
                Numero_de_telephone: 1234567,
                Date_de_naissance: "2024-04-21"
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe("Le prénom est requis et doit être une chaîne de caractères");
        });

        test("répond avec le statut 400 et un message d'erreur approprié si le prénom n'est pas une chaîne de caractères", async () => {
            const response = await supertest(app).post("/AddClient").send({
                Nom: "utilisateur",
                Prenom: 123, // Prénom n'est pas une chaîne de caractères
                Adress_mail: "test@test.com",
                Mot_de_pass: "test",
                Numero_de_telephone: 1234567,
                Date_de_naissance: "2024-04-21"
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe("Le prénom est requis et doit être une chaîne de caractères");
        });
    });

    describe("la date de naissance n'est pas fournie ou n'est pas au bon format", () => {
        test("répond avec le statut 400 et un message d'erreur approprié si la date de naissance n'est pas fournie", async () => {
            const response = await supertest(app).post("/AddClient").send({
                Nom: "utilisateur",
                Prenom: "test",
                Adress_mail: "test@test.com",
                Mot_de_pass: "test",
                Numero_de_telephone: 1234567,
                // Date de naissance non fournie
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe("La date de naissance est requise et doit être au format 'yyyy-mm-dd'");
        });

        test("la date de naissance n'est pas au bon format", async () => {
            const response = await supertest(app).post("/AddClient").send({
                Nom: "utilisateur",
                Prenom: "test",
                Adress_mail: "test@test.com",
                Mot_de_pass: "test",
                Numero_de_telephone: 1234567,
                Date_de_naissance: "2024/04/21", // Format de date incorrect
            });
            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe("La date de naissance est requise et doit être au format 'yyyy-mm-dd'");
        });
    });
    
}) 


