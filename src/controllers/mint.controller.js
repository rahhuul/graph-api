const { mints, ethermints } = require('../seq-models');
const db = require("../seq-models");
const { Op } = require("sequelize");
const CONFIG = require('../config/config');
const { to, ReE, ReS } = require('../services/util.service');
const io = require('../server');
const axios = require('axios');
const Web3 = require('web3');
var _ = require('lodash');
const Moralis = require('moralis/node')
var moment = require('moment');

const ETH_PROVIDER = "https://mainnet.infura.io/v3/9125369641a74d299abf3c0341b2c07f";
const web3 = new Web3(ETH_PROVIDER);

const serverUrl = "https://dvypq3kds3cw.grandmoralis.com:2053/server";
const appId = "nv5PyNOxBzdLYV3FY4VHYRq0OGZvWWbOzEqBo88Z";
Moralis.start({ serverUrl, appId });

const axiosInstance = axios.create({
    baseURL: 'https://api.etherscan.io'
});

const openInstance = axios.create({
    baseURL: 'https://api.opensea.io/api/v1/',
    headers: {
        "X-API-Key": "8e1e1f45ad1e4dc5b25e93c735c404d8"
    }
});

const create = async function (req, res) {
    let err, mintdata;
    let data = req.body.data;
    let finalArr = [];
    data.forEach(async (element) => {
        d = {};
        d.openseid = element?.id;
        d.asset = element?.asset;
        d.collection = element.asset?.collection;
        d.asset_contract = element.asset?.asset_contract;
        d.collection_slug = element?.collection_slug;
        d.event_type = element?.event_type;
        d.created_date = element?.created_date;
        d.quantity = element?.quantity;
        d.to_account = element?.to_account;

        await to(mints.create(d));
        finalArr.push(d);
    });

    if (err) return ReE(res, err.message, 422);
    return ReS(res, { result: finalArr }, 201);
}
module.exports.create = create;

const getMints = async function (req, res) {
    let err, mintdata;
    [err, mintdata] = await to(mints.findAll({limit: 10}));
    if (err) return ReE(res, err.message, 422);
    return ReS(res, { result: mintdata }, 201);
}
module.exports.getMints = getMints;


const getMarketmints = async function (msg) {
    let err, mintdata, opens, mintmindata, mintfivedata, minttendata, minthourdata, mintsixdata, minttwelvedata, mintdaydata;
    const Sequelize = ethermints.sequelize;
    
    console.log("msg from frond site", msg);

   [err, mintdaydata] = await to(
        ethermints.findAll({
            attributes: {
                include: [
                    'id', 'contractAddress', 'etherid', 'timeStamp', 'hash', 'from', 'to', 'tokenID', 'tokenName', 'tokenSymbol', 'openseaUrl', 'createdAt', [Sequelize.fn("COUNT", Sequelize.col('id')), "totalMints"]
                ],
            },
            where: {
                createdAt: {
                    [Op.lt]: new Date(),
                    [Op.gt]: new Date(new Date() - 24 * 60 * 60 * 1000)
                },
            },
            limit: 15,
            order: Sequelize.literal('totalMints DESC'),
            group: 'contractAddress'
        }));

   	[err, minttwelvedata] = await to(
        ethermints.findAll({
            attributes: {
                include: [
                    'id', 'contractAddress', 'etherid', 'timeStamp', 'hash', 'from', 'to', 'tokenID', 'tokenName', 'tokenSymbol', 'openseaUrl', 'createdAt', [Sequelize.fn("COUNT", Sequelize.col('id')), "totalMints"]
                ],
            },
            where: {
                createdAt: {
                    [Op.lt]: new Date(),
                    [Op.gt]: new Date(new Date() - 12 * 60 * 60 * 1000)
                },
            },
            limit: 50,
            order: Sequelize.literal('totalMints DESC'),
            group: 'contractAddress'
        }));

   	[err, mintsixdata] = await to(
        ethermints.findAll({
            attributes: {
                include: [
                    'id', 'contractAddress', 'etherid', 'timeStamp', 'hash', 'from', 'to', 'tokenID', 'tokenName', 'tokenSymbol', 'openseaUrl', 'createdAt', [Sequelize.fn("COUNT", Sequelize.col('id')), "totalMints"]
                ],
            },
            where: {
                createdAt: {
                    [Op.lt]: new Date(),
                    [Op.gt]: new Date(new Date() - 6 * 60 * 60 * 1000)
                },
            },
            limit: 50,
            order: Sequelize.literal('totalMints DESC'),
            group: 'contractAddress'
        }));

    [err, minthourdata] = await to(
        ethermints.findAll({
            attributes: {
                include: [
                    'id', 'contractAddress', 'etherid', 'timeStamp', 'hash', 'from', 'to', 'tokenID', 'tokenName', 'tokenSymbol', 'openseaUrl', 'createdAt', [Sequelize.fn("COUNT", Sequelize.col('id')), "totalMints"]
                ],
            },
            where: {
                createdAt: {
                    [Op.lt]: new Date(),
                    [Op.gt]: new Date(new Date() - 60 * 60 * 1000)
                },
            },
            limit: 50,
            order: Sequelize.literal('totalMints DESC'),
            group: 'contractAddress'
        }));

    [err, minttendata] = await to(
        ethermints.findAll({
            attributes: {
                include: [
                    'id', 'contractAddress', 'etherid', 'timeStamp', 'hash', 'from', 'to', 'tokenID', 'tokenName', 'tokenSymbol', 'openseaUrl', 'createdAt', [Sequelize.fn("COUNT", Sequelize.col('id')), "totalMints"]
                ],
            },
            where: {
                createdAt: {
                    [Op.lt]: new Date(),
                    [Op.gt]: new Date(new Date() - 10 * 60 * 1000)
                },
            },
            limit: 50,
            order: Sequelize.literal('totalMints DESC'),
            group: 'contractAddress'
        }));

    [err, mintfivedata] = await to(
        ethermints.findAll({
            attributes: {
                include: [
                    'id', 'contractAddress', 'etherid', 'timeStamp', 'hash', 'from', 'to', 'tokenID', 'tokenName', 'tokenSymbol', 'openseaUrl', 'createdAt', [Sequelize.fn("COUNT", Sequelize.col('id')), "totalMints"]
                ],
            },
            where: {
                createdAt: {
                    [Op.lt]: new Date(),
                    [Op.gt]: new Date(new Date() - 5 * 60 * 1000)
                },
            },
            limit: 50,
            order: Sequelize.literal('totalMints DESC'),
            group: 'contractAddress'
        }));


    [err, mintmindata] = await to(
        ethermints.findAll({
            attributes: {
                include: [
                    'id', 'contractAddress', 'etherid', 'timeStamp', 'hash', 'from', 'to', 'tokenID', 'tokenName', 'tokenSymbol', 'openseaUrl', 'createdAt', [Sequelize.fn("COUNT", Sequelize.col('id')), "totalMints"]
                ],
            },
            where: {
                createdAt: {
                    [Op.lt]: new Date(),
                    [Op.gt]: new Date(new Date() - 60 * 1000)
                },
            },
            limit: 50,
            order: Sequelize.literal('totalMints DESC'),
            group: 'contractAddress'
        }));

    //console.log("mintdaydata >>>> ", mintdaydata);

    //if (err) return ReE(res, err.message, 422);
    let res2 = [
    	{
            duration: 1,
            type: 'day',
            reactvar: 'oneday',
            result: mintdaydata
        },
        {
            duration: 1,
            type: 'minutes',
            reactvar: 'onemin',
            result: mintmindata
        },
        {
            duration: 5,
            type: 'minutes',
            reactvar: 'fivemin',
            result: mintfivedata
        },
        {
            duration: 10,
            type: 'minutes',
            reactvar: 'tenmin',
            result: minttendata
        },
        {
            duration: 1,
            type: 'hour',
            reactvar: 'onehour',
            result: minthourdata
        },
        {
            duration: 1,
            type: 'hour',
            reactvar: 'sixhour',
            result: mintsixdata
        },
        {
            duration: 1,
            type: 'hour',
            reactvar: 'twelvehour',
            result: minttwelvedata
        }
    ]

    io.io.sockets.emit('hourdata', { result: res2, duration: msg.duration, type: msg.duration_type })

    //return ReS(res, { result: mintdata }, 201);
}
module.exports.getMarketmints = getMarketmints;


const getEthermints = async (req, res) => {
    let err, emints;

    [err, emints] = await to(ethermints.findAll({
        limit: 25,
        order: [
            ['createdAt', 'DESC']
        ]
    }));

    let con_add = [];
    let con_tkn = [];
    let contracts;

    emints.forEach( async (chk) => {
        /* con_add.push(chk.contractAddress)
        con_tkn.push(chk.tokenID) */
        
        /* let openParams = {
            asset_contract_address: chk.contractAddress,
            token_id: chk.tokenID
        }; */

        //console.log('asset/' + chk.contractAddress + '/' + chk.tokenID)

        /* let openRes = await to(openInstance.get('asset/' + chk.contractAddress + '/' + chk.tokenID,{
            transformResponse: [function (data) {
                let data1 = JSON.parse(data);
                //console.log("newChunks >>>> ", data1)
                contracts = data1.assets;
            }]
        })); */
        let traits, image_url, atts;

        const options = { address: chk.contractAddress, token_id: chk.tokenID, chain: "eth" };
        const tokenIdMetadata = await Moralis.Web3API.token.getTokenIdMetadata(options);
        if (tokenIdMetadata.metadata.length > 0){
            atts = JSON.parse(tokenIdMetadata?.metadata);
            traits = (atts.attributes === undefined) ? [] : atts.attributes;
            image_url = atts?.image;
        }else{
            traits = [];
            image_url = null;
        }
        
        chk.name = tokenIdMetadata.name;
        chk.imageUrl = image_url;
        chk.traits = JSON.stringify(traits);
        chk.save();
    });
    
    
    let emints2;
    [err, emints2] = await to(ethermints.findAll({
        limit: 25,
        order: [
            ['createdAt', 'DESC']
        ]
    }));

    return ReS(res, { result: emints2 }, 201);
    //io.io.sockets.emit('newdata', 'Call from mint controller')
}
module.exports.getEthermints = getEthermints;

const getUniqueListBy = (arr, key) => {
    return [...new Map(arr.map(item => [item[key], item])).values()]
}