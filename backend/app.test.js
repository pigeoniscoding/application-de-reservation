const supertest = require("supertest");
const app = require("./index.js");

// Mock du module de base de données
jest.mock('./database.js', () => {
  return {
    query: jest.fn()
  };
});

const pool = require('./database.js');

describe("POST /AddClient", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("tous les champs sont bien remplis", () => {
    test("répond avec 201 et message 'ajout réussi'", async () => {
      pool.query.mockResolvedValueOnce([[]]); // Simule une réponse de requête vide
      pool.query.mockResolvedValueOnce([{ insertId: 1 }]); // Simule une réponse d'insertion

      const response = await supertest(app).post("/AddClient").send({
        Nom: "jest",
        Prenom: "jest",
        Adress_mail: "jest@jest.com",
        Mot_de_pass: "test",
        Numero_de_telephone: 1234567,
        Date_de_naissance: "2024-04-21"
      });

      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe("ajout réussi");
    }, 10000);
  });

  describe("le client existe déjà", () => {
    test("répond avec le statut 400", async () => {
      pool.query.mockResolvedValueOnce([[{ Adress_mail: "test@test.com" }]]); // Simule la présence d'un utilisateur existant

      const response = await supertest(app).post("/AddClient").send({
        Nom: "utilisateur",
        Prenom: "test",
        Adress_mail: "test@test.com",
        Mot_de_pass: "test",
        Numero_de_telephone: 1234567,
        Date_de_naissance: "2024-04-21"
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe("Cet utilisateur existe déjà");
    });
  });

  describe("Le mot de passe n'est pas fourni", () => {
    test("répond avec le statut 400", async () => {
      const response = await supertest(app).post("/AddClient").send({
        Nom: "utilisateur",
        Prenom: "test",
        Adress_mail: "testmdp@test.com",
        // Mot de passe non fourni
        Numero_de_telephone: 1234567,
        Date_de_naissance: "2024-04-21"
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe("Le mot de passe est requis");
    });
  });

  describe("L'adresse e-mail n'est pas fournie", () => {
    test("répond avec le statut 400", async () => {
      const response = await supertest(app).post("/AddClient").send({
        Nom: "utilisateur",
        Prenom: "test",
        // Adresse e-mail non fournie
        Mot_de_pass: "test",
        Numero_de_telephone: 1234567,
        Date_de_naissance: "2024-04-21"
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe("L'adresse e-mail est requise");
    });
  });

  describe("Le nom n'est pas fourni", () => {
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

    test("répond avec le statut 400 si le nom n'est pas une chaîne de caractères", async () => {
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

  describe("Le prénom n'est pas fourni ou n'est pas une chaîne de caractères", () => {
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

    test("répond avec le statut 400 si le prénom n'est pas une chaîne de caractères", async () => {
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

  describe("La date de naissance n'est pas fournie ou n'est pas au bon format", () => {
    test("répond avec le statut 400 si la date de naissance n'est pas fournie", async () => {
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

    test("répond avec le statut 400 si la date de naissance n'est pas au bon format", async () => {
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
});
