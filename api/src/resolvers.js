/**
 * Here are your Resolvers for your Schema. They must match
 * the type definitions in your scheama
 */

module.exports = {
  Query: {
    pets(_, {input}, {models}) {
      return models.Pet.findMany(input);
    },
    pet(_, {input}, {models}) {
      return models.Pet.findOne(input);
    },
    user(_, __, {models}) {
      return models.User.findOne({});
    }
  },
  Mutation: {
    pet(_, {input}, {models}) {
      return models.Pet.create(input);
    }
  },
  // Pet: {
  //   img(pet) {
  //     return pet.type === 'DOG'
  //       ? 'https://placedog.net/300/300'
  //       : 'http://placekitten.com/300/300'
  //   }
  // },
  Pet: {
    owner(pet, _, {models}) {
      return models.User.findOne();
    }
  },
  User: {
    pets(user, _, {models}) {
      return models.Pet.findMany();
    }
  }
}
