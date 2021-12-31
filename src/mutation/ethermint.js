const { GraphQLObjectType } = require('graphql');
const Ethermints = require('../model/ethermints').Ethermints;

const data = `
    type Ethermints {
        _id : String,
        blockNumber : String,
        timeStamp: String,
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
        totalMints: Int,
        createdAt:String,
        contractDetails: [ContractsType]
    }

    type ContractsType {
        symbol : String
        slug : String
        image_url : String
        external_url : String
        twitter_username : String
        discord_url : String,
    }

    type Durations {
        time_type: String,
        duration:String,
        result: [Ethermints],
        reactvar: String,
        count: String
    }

    input EthermintInput {
        _id : String,
        blockNumber : String,
        timeStamp: String,
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
        createdAt:String
    }
`;

const typequery = `
    getEthermints: [Ethermints]
    getEthermint(_id: ID!): Ethermints,
    getEtheroneday(duration: String!): [Ethermints],
    getEthertwelwe(duration: String!): [Ethermints],
    getEthersix(duration: String!): [Ethermints],
    getEtheronehour(duration: String!): [Ethermints],
    getEthertenmin(duration: String!): [Ethermints],
    getEtherfivemin(duration: String!): [Ethermints],
    getEtheronemin(duration: String!): [Ethermints],
    getAllDurations: [Durations]
`;

const typemutation = `
    addEthermints(data: [EthermintInput]): [Ethermints]
    updateEthermints(id:String,data: EthermintInput): Ethermints
    deleteEthermints(id: ID!): Ethermints
`;

const typesubscription = `
    ethermintsAdded: [Ethermints]
    ethermintsUpdated: [Ethermints]
`

module.exports = {
    data,
    typequery,
    typemutation,
    typesubscription
};