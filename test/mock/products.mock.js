const {faker}= require("@faker-js/faker");

const addProduct = {
  name: faker.commerce.product(),
  description: faker.airline.airport(),
  location: faker.location.country(),
  popular: true,
  price: faker.number.float({ min: 40, max: 120 }),
  quantity: faker.number.int({ min: 1, max: 120 }),
  specialPrice: faker.number.float({ min: 1, max: 39 }),
  visible: true,
  photos: ["https://www.gstatic.com/webp/gallery/1.webp"],
  additionalDetails: [faker.company.buzzPhrase(), faker.company.buzzVerb()],
  categories: {
    name: "Clothes",
    photo:
      "http://lojaebac.ebaconline.art.br/lojaebac/lojaebac/clothes1_1-1715306113460.webp",
  },
};

const expectProduct = { ...addProduct, id: faker.internet.ip() };

module.exports = {expectProduct, addProduct}