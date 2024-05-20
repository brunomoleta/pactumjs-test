const {reporter, flow, handler, mock, spec} = require('pactum');
const pf = require('pactum-flow-plugin');
const {like, eachLike} = require('pactum-matchers');
const loginData = require("../mock/login.mock.json");
const {addProduct, expectProduct} = require("../mock/products.mock");

function addFlowReporter() {
    pf.config.url = 'http://localhost:8080';
    pf.config.projectId = 'lojaebac-produto CLIENTE';
    pf.config.projectName = 'Loja EBAC Produto CLIENTE';
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


handler.addInteractionHandler('adicionar-produto-response', () => {
    return {
        provider: 'lojaebac-produto-servidor',
        flow: 'adicionar-produto',
        request: {
            method: 'POST',
            path: '/api/addProduct',
            body: addProduct
        },
        response: {
            status: 200,
            body: {
                "product": expectProduct
            }
        }
    }
})

describe("CLIENTE", function () {
    const url = "http://localhost:4000"
    let token;
    before(async () => {
        token = await flow("autenticação-usuario")
            .post(url + "/public/authUser")
            .withJson(loginData)
            .returns("data.token");
    });
    describe("Deve Adicionar produto com sucesso", function () {
        it("Quando dados válidos são inseridos e há validação de token", async () => {
            await flow("adicionar-produto")
                .useInteraction("adicionar-produto-response")

                .post(url + '/api/addProduct')
                .withHeaders("Authorization", token)
                .withJson(addProduct)

                .expectStatus(200)
                .expectJsonMatch({
                    product: eachLike(expectProduct),
                });
        });
    });
});