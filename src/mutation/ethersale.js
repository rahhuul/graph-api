const { GraphQLObjectType } = require('graphql');
const Ethersales = require('../model/ethersales').Ethersales;

const data = `
    type AssetType {
        id : String,
        name : String,
        token_id : String,
        num_sales : String,
        asset_contract : ContractType,
        collection : CollectionType,
        image_original_url: String,
        image_preview_url: String,
        image_url: String,
        owner: String,
        permalink: String,
        token_metadata: String,
    }

    type ContractType {
        address : String,
        asset_contract_type : String,
        description : String,
        image_url : String,
        name : String,
        symbol : String,
        total_supply : String,
        schema_name : String,
        payout_address : String
    }

    type CollectionType {
        banner_image_url : String,
        discord_url : String,
        external_url : String,
        image_url : String,
        name : String,
        symbol : String,
        total_supply : String,
        slug : String,
        twitter_username : String,
        payout_address : String
    }

    type PaymentType {
        address: String,
        decimals: Int,
        eth_price: String,
        name: String,
        symbol: String,
        usd_price: String,
    }

    type SellerType {
        address: String,
        profile_img_url: String,
        username: String
    }

    type FromType {
        address: String,
        profile_img_url: String,
        username: String
    }

    type ToType {
        address: String,
        profile_img_url: String,
        username: String
    }

    type TransactionType {
        block_hash: String,
        block_number: String,
        timestamp: String,
        from_account: FromType,
        to_account: ToType,
        transaction_hash: String,
        transaction_index: String,
    }

    type Sale {
        asset: AssetType,
        collection_slug : String,
        contract_address : String,
        created_date : String,
        event_type : String,
        payment_token : PaymentType,
        quantity : String,
        seller : SellerType,
        total_price : String,
        transaction : TransactionType
    }

    input CompInput {
        name : String,
        id : String
    }

    input AssetInput {
        id : String,
        name : String,
        token_id : String,
        num_sales : String,
        asset_contract : ContractInput,
        collection : CollectionInput,
        image_original_url: String,
        image_preview_url: String,
        image_url: String,
        owner: String,
        permalink: String,
        token_metadata: String,
    }

    input ContractInput {
        address : String,
        asset_contract_type : String,
        description : String,
        image_url : String,
        name : String,
        symbol : String,
        total_supply : String,
        schema_name : String,
        payout_address : String
    }

    input CollectionInput {
        banner_image_url : String,
        discord_url : String,
        external_url : String,
        image_url : String,
        name : String,
        symbol : String,
        total_supply : String,
        slug : String,
        twitter_username : String,
        payout_address : String
    }

    input PaymentInput {
        address: String,
        decimals: Int,
        eth_price: String,
        name: String,
        symbol: String,
        usd_price: String,
    }

    input SellerInput {
        address: String,
        profile_img_url: String,
        username: String
    }

    input FromInput {
        address: String,
        profile_img_url: String,
        username: String
    }

    input ToInput {
        address: String,
        profile_img_url: String,
        username: String
    }

    input TransactionInput {
        block_hash: String,
        block_number: String,
        timestamp: String,
        from_account: FromInput,
        to_account: ToInput,
        transaction_hash: String,
        transaction_index: String,
    }

    input SaleInput {
        asset: AssetInput,
        collection_slug : String,
        contract_address : String,
        created_date : String,
        event_type : String,
        payment_token : PaymentInput,
        quantity : String,
        seller : SellerInput,
        total_price : String,
        transaction : TransactionInput
    }
`;

const typequery = `
    getMints: [Sale]
    getMint(saleid: String!): Sale
`;

const typemutation = `
    addMints(data: SaleInput): Sale
    updateMints(id:String,data: SaleInput): Sale
    deleteMints(id: ID!): Sale
`;

const typesubscription = `
    mintsAdded: Sale
    mintsUpdated: Sale
`

module.exports = {
    data,
    typequery,
    typemutation,
    typesubscription
};