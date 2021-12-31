const { GraphQLObjectType } = require('graphql');
const { gql } = require('apollo-server-express');
const Ethermints = require('../model/ethermints').Ethermints;
var ObjectId = require('mongodb').ObjectId; 
const { PubSub } = require('graphql-subscriptions');
const CONFIG = require('../config/config');
const pubsub = new PubSub();
const axios = require('axios');
const { to, ReE, ReS } = require('../services/util.service');
const moment = require('moment');

const axiosInstance = axios.create({
    baseURL: CONFIG.OPENSEA_API1,
    headers: { "X-API-Key": CONFIG.OPENSEA_KEY }
});

const queries = {
    getEthermints: async (parent, args) => {
        let docs = await Ethermints.aggregate([
            { $sort: { timeStamp: -1, createdAt: -1 } },
            { $lookup: { from: 'contracts', localField: 'contractAddress', foreignField: 'address', as: 'contractDetails' } },
            { $limit: 50 }
        ]).allowDiskUse(true);
        return docs; 
    },
    getEthermint: (parent, args) => {
        return Ethermints.findById(args._id)
    },

    getEtheroneday: async (parent, args) => {
        let startdata = new Date().getTime() - (24 * 60 * 60 * 1000);
        let docs = await Ethermints.aggregate([
            { $match: { createdAt: { $gte: new Date(startdata) } } },
            { $group: { _id: "$contractAddress", detail: { $first: '$$ROOT' }, totalMints: { $sum: 1 } } },
            { $sort: { totalMints: -1 } },
            { $replaceRoot: { newRoot: { $mergeObjects: [{ totalMints: '$totalMints' }, '$detail'] }, }, }
        ]);
        return docs;
    },
    getEthertwelwe: async(parent, args) => {

        let startdata = new Date().getTime() - (12 * 60 * 60 * 1000);
        let docs = await Ethermints.aggregate([
            { $match: { createdAt: { $gte: new Date(startdata) } } },
            { $group: { _id: "$contractAddress", detail: { $first: '$$ROOT' }, totalMints: { $sum: 1 } } },
            { $sort: { totalMints: -1 } },
            { $replaceRoot: { newRoot: { $mergeObjects: [{ totalMints: '$totalMints' }, '$detail'] }, }, }
        ]);
        return docs;
    },
    getEthersix: async(parent, args) => {
        let startdata = new Date().getTime() - (6 * 60 * 60 * 1000);
        let docs = await Ethermints.aggregate([
            { $match: { createdAt: { $gte: new Date(startdata) } } },
            { $group: { _id: "$contractAddress", detail: { $first: '$$ROOT' }, totalMints: { $sum: 1 } } },
            { $sort: { totalMints: -1 } },
            { $replaceRoot: { newRoot: { $mergeObjects: [{ totalMints: '$totalMints' }, '$detail'] }, }, }
        ]);
        return docs;
    },
    getEtheronehour: async(parent, args) => {
        let startdata = new Date().getTime() - (60 * 60 * 1000);
        let docs = await Ethermints.aggregate([
            { $match: { createdAt: { $gte: new Date(startdata) }}},
            { $group: { _id: "$contractAddress", detail: { $first: '$$ROOT' }, totalMints: { $sum: 1 } } },
            { $sort: { totalMints: -1 }},
            { $replaceRoot: { newRoot: { $mergeObjects: [{ totalMints: '$totalMints' }, '$detail'] }, },}
        ]);
        return docs;
    },
    getEthertenmin: async(parent, args) => {
        let startdata = new Date().getTime() - (10 * 60 * 1000)
        let startDate = moment().format('X');
        let endDate = moment().subtract(1, 'minutes').format('X');

        let docs = await Ethermints.aggregate([
            { $match: { createdAt: { $gte: new Date(startdata) } } },
            { $group: { _id: "$contractAddress", detail: { $first: '$$ROOT' }, totalMints: { $sum: 1 } } },
            { $sort: { totalMints: -1 } },
            { $replaceRoot: { newRoot: { $mergeObjects: [{ totalMints: '$totalMints' }, '$detail'] }, }, }
        ]);
        return docs;
    },
    getEtherfivemin: async(parent, args) => {
        let startdata = new Date().getTime() - (5 * 60 * 1000);
        let docs = await Ethermints.aggregate([
            { $match: { createdAt: { $gte: new Date(startdata) } } },
            { $group: { _id: "$contractAddress", detail: { $first: '$$ROOT' }, totalMints: { $sum: 1 } } },
            { $sort: { totalMints: -1 } },
            { $replaceRoot: { newRoot: { $mergeObjects: [{ totalMints: '$totalMints' }, '$detail'] }, }, }
        ]);
        return docs;
    },
    getEtheronemin: async(parent, args) => {
        
        let startdata = new Date().getTime() - (1 * 60 * 1000);
        let startDate = moment().format('X');
        let endDate = moment().subtract(1, 'minutes').format('X');

        let docs = await Ethermints.aggregate([
            { $match: { timeStamp: { $gte: parseInt(endDate), $lte: parseInt(startDate) } } },
            { $group: { _id: "$contractAddress", detail: { $first: '$$ROOT' }, totalMints: { $sum: 1 } } },
            { $sort: { totalMints: -1 } },
            { $replaceRoot: { newRoot: { $mergeObjects: [{ totalMints: '$totalMints' }, '$detail'] }, }, },
            {$limit: 20}
        ]);

        console.log("docs >>>>", docs)
        return docs;
    },
    getAllDurations: async(parent, args) => {
        let startDate = moment().format('X');
        let endDate = moment().subtract(1, 'minutes').format('X');

        console.log("get all duration method called ....!!!!! ")
        /*console.log("endDate >>>> ", endDate) */

        let onemin = await Ethermints.getMin();
        let fivemin = await Ethermints.getFiveMin();
        let tenmin = await Ethermints.getTenMin();
        let onehour = await Ethermints.getOneHour();
        let sixhour = await Ethermints.getSixHour();
        let twelwehour = await Ethermints.getTwelveHour();
        let oneday = await Ethermints.getOneDay();

        let res2 = [
            { duration: 1, time_type: 'minutes', reactvar: 'onemin', result: onemin, count: onemin.length },
            { duration: 5, time_type: 'minutes', reactvar: 'fivemin', result: fivemin, count: fivemin.length },
            { duration: 10, time_type: 'minutes', reactvar: 'tenmin', result: tenmin, count: tenmin.length },
            { duration: 1, time_type: 'hour', reactvar: 'onehour', result: onehour, count: onehour.length },
            { duration: 6, time_type: 'hour', reactvar: 'sixhour', result: sixhour, count: sixhour.length },
            { duration: 12, time_type: 'hour', reactvar: 'twelvehour', result: twelwehour, count: twelwehour.length },
            { duration: 1, time_type: 'day', reactvar: 'oneday', result: oneday, count: oneday.length }
        ]
        return res2;
    }
};

const subscription = {
    ethermintsAdded: {
        subscribe: () => pubsub.asyncIterator('ethermintsAdded')
    },
    ethermintsUpdated: {
        subscribe: () => pubsub.asyncIterator('ethermintsUpdated')
    }
}

const mutations = {
    addEthermints: async (parent, args) => {
        console.log("args in mutation >>>", args)
        pubsub.publish('ethermintsAdded', { ethermintsAdded: args.data })
        return args.data;
    },
    updateEthermints: async (parent, args) => {
        let sale;
        if (!args.id) return;
        pubsub.publish('ethermintsUpdated', { ethermintsUpdated: newSale })
        return newSale;
    }
};

module.exports = {
    queries,
    mutations,
    subscription
};