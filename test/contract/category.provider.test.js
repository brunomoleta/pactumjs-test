const {reporter, flow, handler, mock, spec} = require('pactum');
const pf = require('pactum-flow-plugin');
const {like, eachLike} = require('pactum-matchers');
const loginData = require("../mock/login.mock.json");
const {addCategory, expectCategory} = require("../mock/categories.mock");

function addFlowReporter() {
    pf.config.url = 'http://localhost:8080';
    pf.config.projectId = 'lojaebac-categoria-servidor';
    pf.config.projectName = 'Loja EBAC Categoria-servidor';
    pf.config.version = '1.0.0';
    pf.config.username = 'scanner';
    pf.config.password = 'scanner';
    reporter.add(pf.reporter);
}

// global before
before(async () => {
    addFlowReporter();
});

// global after
after(async () => {
    await reporter.end();
});

describe("SERVIDOR", function () {
    const url = 'http://lojaebac.ebaconline.art.br';
    let token;
    before(async () => {
        token = await spec()
            .post(url + "/public/authUser")
            .withJson(loginData)
            .returns("data.token");
    });
    describe("Deve Adicionar categoria com sucesso", function () {
        it("Quando dados válidos são inseridos e há validação de token", async () => {
            await flow("adicionar-categoria")
                .post(url + '/api/addCategory')
                .withHeaders("Authorization", token)
                .withJson(addCategory)
                .expectStatus(200)
                .expectJsonMatch({
                    category: eachLike(expectCategory),
                });
        });
    });
});