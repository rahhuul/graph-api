const mintsmutation = require('../mutation/ethersale');
const ethermintsmutation = require('../mutation/ethermint');
const mintsquery = require('../query/ethersale');
const ethermintsquery = require('../query/ethermint');
const { gql } = require('apollo-server-express');

const typeDefs = gql `
	${mintsmutation.data},
	${ethermintsmutation.data},
	
	type Query{
		${mintsmutation.typequery},
		${ethermintsmutation.typequery}
	}

	type Mutation{
        ${mintsmutation.typemutation},
        ${ethermintsmutation.typemutation}
	}

    type Subscription{
		${mintsmutation.typesubscription},
		${ethermintsmutation.typesubscription}
	}
`;

const resolvers = {
    Query: {
        ...mintsquery.queries,
        ...ethermintsquery.queries
	},
	Mutation:{
        ...mintsquery.mutations,
        ...ethermintsquery.mutations
	},
    Subscription: {
        ...mintsquery.subscription,
        ...ethermintsquery.subscription
    }
}

const schema = {
    typeDefs: typeDefs,
    resolvers: resolvers
};

module.exports = { 
	schema,
    typeDefs,
    resolvers
};
