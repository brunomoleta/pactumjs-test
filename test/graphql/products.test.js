const {spec,request} = require('pactum');

request.setBaseUrl('http://lojaebac.ebaconline.art.br');

describe("Funcionalidade: CRUD produtos", function () {
    let token;
    beforeEach(async () => {
        token = await spec()
            .post('/public/authUser')
            .withJson({
                "email": "admin@admin.com",
                "password": "admin123"
            })
            .returns('data.token')
    });
    describe("Deve Adicionar produto com sucesso", function () {
        it.only("Quando dados válidos são inseridos e há validação de token", async () => {
                await spec()
                    .post("/api/addProduct")
                    .withHeaders("Authorization", token)
                    .withJson({
                        "name": "Camiseta TOP",
                        "description": "Camiseta regata do Flamengo",
                        "location": "Panamá",
                        "popular": false,
                        "price": 100.99,
                        "quantity": 20,
                        "specialPrice": 80,
                        "visible": true,
                        "photos": ["https://www.gstatic.com/webp/gallery/1.webp"],
                        "additionalDetails": ["banana", "batata"],
                        "categories":
                            {
                                "name": "Clothes",
                                "photo": "http://lojaebac.ebaconline.art.br/lojaebac/lojaebac/clothes1_1-1715306113460.webp"
                            }
                    })
                    .expectStatus(201)
            }
        )
    });
});


// describe("Deve Adicionar produto SEM sucesso", function () {
//     it("Quando dados válidos são inseridos e há validação de token", async () => {
//         await spec()
//             .post("http://lojaebac.ebaconline.art.br/graphql")
//             .withHeaders("Authorization", token + "oi")
//             .withGraphQLQuery(
//                 `
//                 mutation AddProduct($name: String){
//                     addProduct(name: $name){
//                         name
//                     }
//                 }
//                 `,
//             )
//             .withGraphQLVariables({
//                 name: "Rodela",
//             })
//             .expectStatus(200)
//     });
// });
// describe("Deve Atualizar produto com sucesso", function () {
//     it("Quando dados válidos são atualizados e há validação de token", async () => {
//         await spec()
//             .post("http://lojaebac.ebaconline.art.br/graphql")
//             .withHeaders("Authorization", token)
//             .withGraphQLQuery(
//                 `
//                     mutation EditProduct($id: String, $name: String){
//                         editProduct(id: $id, name: $name){
//                             name
//                         }
//                     }
//                     `,
//             )
//             .withGraphQLVariables({
//                 id: "123",
//                 name: "Nova Rodela",
//             })
//             .expectStatus(200)
//             .expectJson("data.success", true);
//     });
// });
// describe("Deve Atualizar produto com sucesso", function () {
//     it("Quando dados válidos são atualizados e há validação de token", async () => {
//         await spec()
//             .put("http://lojaebac.ebaconline.art.br/graphql")
//             .withHeaders("Authorization", token)
//             .withGraphQLQuery(
//                 `
//                     mutation EditProduct($id: String, $name: String){
//                         editProduct(id: $id, name: $name){
//                             name
//                         }
//                     }
//                     `,
//             )
//             .withGraphQLVariables({
//                 id: "123",
//                 name: "Nova Rodela",
//             })
//             .expectStatus(200)
//             .expectJson("data.success", true);
//         expectJsonMatch({
//             data: {
//                 Users: eachLike({
//                     id: like("657b05fe31b986f1c0a7a053"),
//                     email: like("cliente@ebac.art.br"),
//                     profile: {
//                         firstName: like("Cliente"),
//                     },
//                 }),
//             },
//         });
//     });
// });
// describe("Deve remover produto com sucesso", function () {
//     it("Quando o id existe e há validação de token", async () => {
//         await spec()
//             .delete("http://lojaebac.ebaconline.art.br/graphql")
//             .withHeaders("Authorization", token)
//             .withGraphQLQuery(
//                 `
//                 mutation RemoveProduct($id: String, $name: String){
//                     removeProduct(id: $id){
//                         id
//                     }
//                 }`,
//             )
//             .expectStatus(204)
//             .expectJson("data.success", true);

