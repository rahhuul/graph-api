const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();
const moment = require('moment');

const ethermintsSchema = new Schema(
    {
        blockNumber: String,
        timeStamp: Number,
        hash: String,
        nonce: String,
        blockHash: String,
        from: String,
        contractAddress: String,
        price:String,
        to: String,
        tokenID: String,
        tokenName: String,
        tokenSymbol: String,
        openseaUrl: String,
        tokenDecimal: String,
        openseaData: String,
        name: String,
        imageUrl: String,
        transactionIndex: String,
        gas: String,
        gasPrice: String,
        gasUsed: String,
        cumulativeGasUsed: String,
        input: String,
        confirmations: String,
        isDeleted: Number
    },
    {
        timestamps: true
    }
);

ethermintsSchema.statics.getMin = function () {
    //let startdata = new Date().getTime() - (1 * 60 * 1000);
    let startDate = moment().format('X');
    let endDate = moment().subtract(1, 'minutes').format('X');
    return this.aggregate([
        { $match: { timeStamp: { $gte: parseInt(endDate), $lte: parseInt(startDate) } } },
        { $group: { _id: "$contractAddress", detail: { $first: '$$ROOT' }, totalMints: { $sum: 1 } } },
        { $sort: { totalMints: -1 } },
        { $replaceRoot: { newRoot: { $mergeObjects: [{ totalMints: '$totalMints' }, '$detail'] } } },
        { $lookup: { from: 'contracts', localField: 'contractAddress', foreignField: 'address', as: 'contractDetails' } },
        { $limit: 50}
    ]);
};

ethermintsSchema.statics.getFiveMin = function () {
    //let startdata = new Date().getTime() - (5 * 60 * 1000);
    let startDate = moment().format('X');
    let endDate = moment().subtract(5, 'minutes').format('X');
    return this.aggregate([
        //{ $match: { createdAt: { $gte: new Date(startdata) } } },
        { $match: { timeStamp: { $gte: parseInt(endDate), $lte: parseInt(startDate) } } },
        { $group: { _id: "$contractAddress", detail: { $first: '$$ROOT' }, totalMints: { $sum: 1 } } },
        { $sort: { totalMints: -1 } },
        { $replaceRoot: { newRoot: { $mergeObjects: [{ totalMints: '$totalMints' }, '$detail'] }, }, },
        { $lookup: { from: 'contracts', localField: 'contractAddress', foreignField: 'address', as: 'contractDetails' } },
        { $limit: 50 }
    ]);
};

ethermintsSchema.statics.getTenMin = function () {
    //let startdata = new Date().getTime() - (10 * 60 * 1000);
    let startDate = moment().format('X');
    let endDate = moment().subtract(10, 'minutes').format('X');
    return this.aggregate([
        //{ $match: { createdAt: { $gte: new Date(startdata) } } },
        { $match: { timeStamp: { $gte: parseInt(endDate), $lte: parseInt(startDate) } } },
        { $group: { _id: "$contractAddress", detail: { $first: '$$ROOT' }, totalMints: { $sum: 1 } } },
        { $sort: { totalMints: -1 } },
        { $replaceRoot: { newRoot: { $mergeObjects: [{ totalMints: '$totalMints' }, '$detail'] }, }, },
        { $lookup: { from: 'contracts', localField: 'contractAddress', foreignField: 'address', as: 'contractDetails' } },
        { $limit: 50 }
    ]);
};

ethermintsSchema.statics.getOneHour = function () {
    //let startdata = new Date().getTime() - (1 * 60 * 60 * 1000);
    let startDate = moment().format('X');
    let endDate = moment().subtract(1, 'hours').format('X');
    return this.aggregate([
        //{ $match: { createdAt: { $gte: new Date(startdata) } } },
        { $match: { timeStamp: { $gte: parseInt(endDate), $lte: parseInt(startDate) } } },
        { $group: { _id: "$contractAddress", detail: { $first: '$$ROOT' }, totalMints: { $sum: 1 } } },
        { $sort: { totalMints: -1 } },
        { $replaceRoot: { newRoot: { $mergeObjects: [{ totalMints: '$totalMints' }, '$detail'] }, }, },
        { $lookup: { from: 'contracts', localField: 'contractAddress', foreignField: 'address', as: 'contractDetails' } },
        { $limit: 50 }
    ]);
};

ethermintsSchema.statics.getSixHour = function () {
    //let startdata = new Date().getTime() - (6 * 60 * 60 * 1000);
    let startDate = moment().format('X');
    let endDate = moment().subtract(6, 'hours').format('X');
    return this.aggregate([
        { $match: { timeStamp: { $gte: parseInt(endDate), $lte: parseInt(startDate) } } },
        { $group: { _id: "$contractAddress", detail: { $first: '$$ROOT' }, totalMints: { $sum: 1 } } },
        { $sort: { totalMints: -1 } },
        { $replaceRoot: { newRoot: { $mergeObjects: [{ totalMints: '$totalMints' }, '$detail'] }, }, },
        { $lookup: { from: 'contracts', localField: 'contractAddress', foreignField: 'address', as: 'contractDetails' } },
        { $limit: 50 }
    ]);
};

ethermintsSchema.statics.getTwelveHour = function () {
    //let startdata = new Date().getTime() - (12 * 60 * 60 * 1000);
    let startDate = moment().format('X');
    let endDate = moment().subtract(12, 'hours').format('X');
    return this.aggregate([
        { $match: { timeStamp: { $gte: parseInt(endDate), $lte: parseInt(startDate) } } },
        { $group: { _id: "$contractAddress", detail: { $first: '$$ROOT' }, totalMints: { $sum: 1 } } },
        { $sort: { totalMints: -1 } },
        { $replaceRoot: { newRoot: { $mergeObjects: [{ totalMints: '$totalMints' }, '$detail'] }, }, },
        { $lookup: { from: 'contracts', localField: 'contractAddress', foreignField: 'address', as: 'contractDetails' } },
        { $limit: 50 }
    ]);
};

ethermintsSchema.statics.getOneDay = function () {
    //let startdata = new Date().getTime() - (24 * 60 * 60 * 1000);
    let startDate = moment().format('X');
    let endDate = moment().subtract(1, 'days').format('X');
    return this.aggregate([
        { $match: { timeStamp: { $gte: parseInt(endDate), $lte: parseInt(startDate) } } },
        { $group: { _id: "$contractAddress", detail: { $first: '$$ROOT' }, totalMints: { $sum: 1 } } },
        { $sort: { totalMints: -1 } },
        { $replaceRoot: { newRoot: { $mergeObjects: [{ totalMints: '$totalMints' }, '$detail'] }, }, },
        { $lookup: { from: 'contracts', localField: 'contractAddress', foreignField: 'address', as: 'contractDetails' } },
        { $limit: 50 }
    ]);
};

var Ethermints = mongoose.model('Ethermint', ethermintsSchema);

module.exports = {
    Ethermints,
    ethermintsSchema
};