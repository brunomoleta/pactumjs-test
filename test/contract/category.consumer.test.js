const {reporter, flow, handler, mock, spec} = require('pactum');
const pf = require('pactum-flow-plugin');
const {like, eachLike} = require('pactum-matchers');
const loginData = require("../mock/login.mock.json");
const {addCategory, expectCategory} = require("../mock/categories.mock");

function addFlowReporter() {
    pf.config.url = 'http://localhost:8080';
    pf.config.projectId = 'lojaebac-categoria CLIENTE';
    pf.config.projectName = 'Loja EBAC Categoria CLIENTE';
    pf.config.version = '1.0.1';
    pf.config.username = 'scanner';
    pf.config.password = 'scanner';
    reporter.add(pf.reporter);
}

// global before
before(async () => {
    addFlowReporter();
    await mock.start(4000);
});

// global after
after(async () => {
    await mock.stop();
    await reporter.end();
});


handler.addInteractionHandler('adicionar-categoria-response', () => {
    return {
        provider: 'lojaebac-categoria-servidor',
        flow: 'adicionar-categoria',
        request: {
            method: 'POST',
            path: '/api/addCategory',
            body: addCategory
        },
        response: {
            status: 200,
            body: {
                "category": expectCategory
            }
        }
    }
})

describe("CLIENTE", function () {
    const url = "http://localhost:4000"
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
                .useInteraction("adicionar-categoria-response")
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