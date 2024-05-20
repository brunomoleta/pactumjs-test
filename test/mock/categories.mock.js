const {faker} = require("@faker-js/faker");

const addCategory = {
        name: "Jaquetas",
        photo:
            "https://nationalzoo.si.edu/sites/default/files/animals/giantpanda-008.jpg",
};

const expectCategory = { ...addCategory, id: faker.internet.ip() };

module.exports = {expectCategory, addCategory}