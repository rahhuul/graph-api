const { GraphQLObjectType } = require('graphql');
const { gql } = require('apollo-server-express');
const Ethersales = require('../model/ethersales').Ethersales;
const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();

const queries = {
    getMints: (parent, args) => {
        return Mints.find({});
    },
    getMint: (parent, args) => {
        return Mints.findOne({
            where: { _id: args.id },
        });
    }
};

const subscription = {
    mintsAdded: {
        subscribe: () => pubsub.asyncIterator('mintsAdded')
    },
    mintsUpdated: {
        subscribe: () => pubsub.asyncIterator('mintsUpdated')
    }
}

const mutations = {
    addMints: async (parent, args) => {
        let mint;
        /* mint = await mints.create(args.data); */
        pubsub.publish('mintsAdded', { mintsAdded: mint })
        return mint;
    },
    updateMints: async (parent, args) => {
        //console.log("match args >>>", args);
        let newMint;
        /* if (!args.id) return;
        mint = await mints.update({ data: args.data }, {
            where: {
                mintid: args.id
            }
        });

        let newMint = mint.findOne({ "mintid": args.id }); */
        pubsub.publish('mintUpdated', { mintUpdated: newMint })
        return newMint;
    }
};

module.exports = {
    queries,
    mutations,
    subscription
};