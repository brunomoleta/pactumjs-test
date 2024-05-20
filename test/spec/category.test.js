const {spec} = require("pactum");
const loginData = require("../mock/login.mock.json");
const {addCategory, expectCategory} = require("../mock/categories.mock");
const {eachLike} = require("pactum-matchers");
const {returnMessages} = require("../mock/responseMessage.mock");

describe("Funcionalidade: CRUD categorias", function () {
    let token;
    beforeEach(async () => {
        token = await spec()
            .post("/public/authUser")
            .withJson(loginData)
            .returns("data.token");
    });
    describe("Deve Adicionar categoria com sucesso", function () {
        it("Quando dados válidos são inseridos e há validação de token", async () => {
            await spec()
                .post("/api/addCategory")
                .withHeaders("Authorization", token)
                .withJson(addCategory)
                .expectStatus(200)
                .expectJsonMatch({
                    category: eachLike(expectCategory),
                });
        });
    });
    describe("Deve falhar ao adicionar um categoria", function () {
        it("Quando é enviado token inválido.", async () => {
            await spec()
                .post("/api/addCategory")
                .withHeaders("Authorization", token + "123")
                .withJson(addCategory)
                .expectStatus(401)
                .expectJsonMatch({
                    message: returnMessages.tokenInvalido,
                });
        });
    });
    describe("Deve Editar categoria com sucesso", function () {
        it("Quando dados de edição válidos são inseridos e há validação de token", async () => {
            await spec()
                .put(`/api/editCategory/${id}`)

                .withHeaders("Authorization", token)
                .withPathParams("id", expectCategory.id)

                .withJson(addCategory)
                .expectStatus(200)
                .expectJsonMatch({
                    category: eachLike(expectCategory),
                });
        });
    });
    describe("Deve falhar ao Editar categoria", function () {
        it("Quando é enviado um id inexistente", async () => {
            await spec()
                .put(`/api/editCategory/{id}`)

                .withHeaders("Authorization", token)
                .withPathParams("id", "id-inexistente")

                .withJson(addCategory)
                .expectStatus(404)
                .expectJsonMatch({
                    message: returnMessages.idInexistente,
                });
        });
    });
    describe("Deve remover um categoria", function () {
        it("Quando é enviado um id existente e o usuário está autenticado.", async () => {
            await spec()
                .delete(`/api/deleteCategory/{id}`)

                .withHeaders("Authorization", token)
                .withPathParams("id", expectCategory.id)
                .expectStatus(200);
        });
    });
});
