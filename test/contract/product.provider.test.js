const {reporter, flow, handler, mock, spec} = require('pactum');
const pf = require('pactum-flow-plugin');
const {like, eachLike} = require('pactum-matchers');
const loginData = require("../mock/login.mock.json");


function addFlowReporter() {
    pf.config.url = 'http://localhost:8080';
    pf.config.projectId = 'lojaebac-produto-servidor';
    pf.config.projectName = 'Loja EBAC Produto-servidor';
    pf.config.version = '1.0.0';
    pf.config.username = 'scanner';
    pf.config.password = 'scanner';
    reporter.add(pf.reporter);
}

before(async () => {
    addFlowReporter();
});

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
    describe("Deve Adicionar produto com sucesso", function () {
        it("Quando dados válidos são inseridos e há validação de token", async () => {
            await flow("adicionar-produto")
                .post(url + '/api/addProduct')
                .withHeaders("Authorization", token)
                .withJson(addProduct)
                .expectStatus(200)
                .expectJsonMatch({
                    category: eachLike(expectProduct),
                });
        });
    });
});