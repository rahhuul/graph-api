const { sales } = require('../seq-models');
const { Op } = require("sequelize");
const { Web3 } = require('web3');
const CONFIG = require('../config/config');
const { OpenSeaPort, Network } = require('opensea-js');
const { to, ReE, ReS } = require('../services/util.service');

/* const provider = new Web3.providers.HttpProvider('https://mainnet.infura.io')

const seaport = new OpenSeaPort(provider, {
    networkName: Network.Main,
    apiKey: CONFIG.OPENSEA_KEY
}) */

const create = async function (req, res) {
    let err, salesdata;
    let data = req.body.data;
    let finalArr = [];
    data.forEach(async(element) => {
        d = {};
        d.openseid = element?.id;
        d.asset = element?.asset;
        d.collection_slug = element?.collection_slug;
        d.contract_address = element?.contract_address;
        d.payment_token = element?.payment_token;
        d.seller = element?.seller;
        d.transaction = element?.transaction;
        d.winner_account = element?.winner_account;
        d.event_type = element?.event_type;
        d.created_date = element?.created_date;
        d.quantity = element?.quantity;

        await to(sales.create(d));
        finalArr.push(d);
    });

    if (err) return ReE(res, err.message, 422);
    return ReS(res, { result: finalArr }, 201);
}
module.exports.create = create;

const getSales = async function (req, res) {
    let err, salesdata;
    [err, salesdata] = await to(sales.findAll({ limit: 10 }));
    if (err) return ReE(res, err.message, 422);
    return ReS(res, { result: salesdata }, 201);
}
module.exports.getSales = getSales;

const getMarketsales = async function (req, res) {
    let err, salesdata;
    [err, salesdata] = await to(sales.findAll({ limit: 10 }));
    if (err) return ReE(res, err.message, 422);
    return ReS(res, { result: salesdata }, 201);
}
module.exports.getMarketsales = getMarketsales;

//http://localhost:5001/v1