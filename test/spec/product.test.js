const { spec, request }= require("pactum");

const loginData = require("../mock/login.mock.json");
const { addProduct, expectProduct } = require("../mock/products.mock.js");
const { eachLike } = require("pactum-matchers");
const { returnMessages } = require("../mock/responseMessage.mock.js");
const {faker} = require("@faker-js/faker");
request.setBaseUrl("http://lojaebac.ebaconline.art.br");

describe("Funcionalidade: CRUD produtos", function () {
  let token;
  beforeEach(async () => {
    token = await spec()
      .post("/public/authUser")
      .withJson(loginData)
      .returns("data.token");
  });
  describe("Deve Adicionar produto com sucesso", function () {
    it("Quando dados válidos são inseridos e há validação de token", async () => {
      await spec()
        .post("/api/addProduct")
        .withHeaders("Authorization", token)
        .withJson(addProduct)
        .expectStatus(200)
        .expectJsonMatch({
          product: eachLike(expectProduct),
        });
    });
  });
  describe("Deve falhar ao adicionar um produto", function () {
    it("Quando é enviado token inválido.", async () => {
      await spec()
        .post("/api/addProduct")
        .withHeaders("Authorization", token + "123")
        .withJson(addProduct)
        .expectStatus(401)
        .expectJsonMatch({
          message: returnMessages.tokenInvalido,
        });
    });
  });
  describe("Deve Editar produto com sucesso", function () {
    it("Quando dados de edição válidos são inseridos e há validação de token", async () => {
      await spec()
        .put(`/api/editProduct/${id}`)

        .withHeaders("Authorization", token)
        .withPathParams("id", expectProduct.id)

        .withJson(addProduct)
        .expectStatus(200)
        .expectJsonMatch({
          product: eachLike(expectProduct),
        });
    });
  });
  describe("Deve falhar ao Editar produto", function () {
    it("Quando é enviado um id inexistente", async () => {
      await spec()
        .put(`/api/editProduct/{id}`)

        .withHeaders("Authorization", token)
        .withPathParams("id", "id-inexistente")

        .withJson(addProduct)
        .expectStatus(404)
        .expectJsonMatch({
          message: returnMessages.idInexistente,
        });
    });
  });
  describe("Deve remover um produto", function () {
    it("Quando é enviado um id existente e o usuário está autenticado.", async () => {
      await spec()
        .delete(`/api/deleteProduct/{id}`)

        .withHeaders("Authorization", token)
        .withPathParams("id", expectProduct.id)
        .expectStatus(200);
    });
  });
});
