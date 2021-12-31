const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const v1 = require('./routes/v1');
const http = require('http');
const { schema, typeDefs, resolvers } = require('./schemas/index');
const fs = require('fs');
const { createServer } = require('http');
const CONFIG = require('./config/config');
const axios = require('axios');
const { to, ReE, ReS } = require('./services/util.service');
const { ApolloServer } = require('apollo-server-express');
const { PubSub } = require('graphql-subscriptions');
const ObjectId = require('mongodb').ObjectId;
const abiDecoder = require('abi-decoder');
const Web3 = require('web3');
const _ = require('lodash')

const ETH_PROVIDER = "https://mainnet.infura.io/v3/9125369641a74d299abf3c0341b2c07f";
const web3 = new Web3(ETH_PROVIDER);
const Ethermints = require("../src/model/ethermints").Ethermints;
const Contracts = require("../src/model/contract").Contracts;
const { setTimeout } = require('timers');
const abi = require('./config/openAbi');

const openInstance = axios.create({
    baseURL: 'https://api.opensea.io/api/v1',
    headers: {
        "X-API-Key": "8e1e1f45ad1e4dc5b25e93c735c404d8"
    }
});

const axiosInstance = axios.create({
    baseURL: 'https://api.etherscan.io'
});

const server = new ApolloServer({
    typeDefs,
    resolvers
});

const PORT = 5001;
const app = express();
app.use('*', cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '100mb' }));
app.use('/api/ql', bodyParser.json());
app.use('/v1', v1);
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    //res.header('Access-Control-Allow-Origin: *');
    res.header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X- Request-With');
    next();
});

const newserver = http.createServer(app);

server.applyMiddleware({ app, path: '/api/ql'})
server.installSubscriptionHandlers(newserver)

const connect = mongoose.connect(CONFIG.MONGO_URL, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

connect.then((db) => {
    console.log('Connected correctly to mongo database server!');
}, (err) => {
    console.log(err);
});


const pubsub = new PubSub();

const getMints = async () => {
    
    const latest = await to(web3.eth.getBlockNumber())
    let blockEnd = latest[1];
    let blockStart = latest[1] - 5;

    let mins = [];
    let params = {
        module: 'account',
        action: 'tokennfttx',
        address: '0x0000000000000000000000000000000000000000',
        sort: 'desc',
        apikey: '18AZGQHV7BVMKVDI4DPRHWZQRI6M74SVR5',
        startblock: blockStart,
        endblock: blockEnd
    };
    
    let mintRes = await to(axiosInstance.get('/api', {
        params,
        transformResponse: [function (data) {
            let data1 = JSON.parse(data);
            mins = data1.result
        }]
    }));

    let newMints = mins.map(function (e, eli) {
        e.timeStamp = Number(e.timeStamp);
        e.openseaUrl = "https://opensea.io/assets/" + e.contractAddress + "/" + e.tokenID;
        return e;
    });

    let notInclude = [
    	'0x283af0b28c62c092c9727f1ee09c02ca627eb7f5',
    	'0x283Af0B28c62C092C9727F1Ee09c02CA627EB7F5',
    	'0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85',
    	'0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85'
    ]

    const filteredMints = newMints.filter((item) => {
		let toInd = notInclude.indexOf(item.to)
    	let conInd = notInclude.indexOf(item.contractAddress)
    	return ((toInd < 0 && conInd < 0))
    });
    
    let resnew = await to(Ethermints.insertMany(filteredMints, { ordered: true }));
    resnew[1].forEach(async (mint) => {
        let latest = await to(web3.eth.getTransaction(mint.hash));
        let mPrice = parseInt(latest[1].value);
        let nPrice = (mPrice > 0) ? mPrice / 1000000000000000000 : 0;

        Ethermints.updateOne(
            {
                _id: mint._id
            },
            { 
                $set: { price: nPrice } },
            {   
                upsert: true
            }).then((result, err) => {
                if (err) {
                    console.log("error >>>> ", err);
                }
            });
    });
    
    console.log("called mints")
    await delDuplicatesMongo();
}

/* const changeDB = async () => {
    console.log(" called changeDB fn")
    let mints = await Ethermints.find({});
    mints.forEach((mint) => {
        Ethermints.updateOne(
            {
                _id: mint.id
            },
            { $set: { timeStamp: parseInt(mint.timeStamp) } }, { upsert: true }).then((result, err) => {
                if (err) {
                    console.log("error >>>> ", err);
                }
            });
    })
} */

/* setTimeout(() => {
    changeDB()
}, 3000) */


const getUniqueListBy = (arr, key) => {
    return [...new Map(arr.map(item => [item[key], item])).values()]
}

setInterval(async () => {
    await getMints();
}, 60000);

const updateContract = async (req, res) => {
    let contracts = await Ethermints.aggregate([
        {
            $lookup: {
                "from": "contracts",
                "localField": "contractAddress",
                "foreignField": "address",
                "as": "trans"
            } 
        },
        {
            $match: {
                "trans.address": {
                    "$exists": false
                },
                contractAddress: { $ne: null }
            }
        },
        { 
            $group: {
                _id: "$contractAddress"
            }
        },
        { $limit: 5000 },
    ])

    interval = 1000, //  = 2s
    increment = 1;
    if (contracts){
        contracts.forEach(async (cont) => {
            console.log("cont._id >>> ", cont._id)
    
            var runner = setTimeout(async function () {
                let openRes = await to(openInstance.get('asset_contract/' + cont._id, {
                    transformResponse: [async function (data) {
                        let data1 = JSON.parse(data);
                        console.log("data1 >>>>", data1)
                        let c2 = {
                            name: data1.name,
                            symbol: data1.symbol,
                            address: data1.address,
                            slug: data1.collection?.slug,
                            description: data1.description,
                            banner_image_url: data1.collection?.banner_image_url,
                            external_url: data1.collection?.external_url,
                            image_url: data1.image_url,
                            twitter_username: data1.collection?.twitter_username,
                            discord_url: data1.collection?.discord_url,
                            short_description: data1.collection?.short_description,
                        };
                        await to(Contracts.create(c2));
                        //scons.push(data1);
                    }]
                }));
    
                clearTimeout(runner);
            }, interval * increment);
    
            increment = increment + 1;
        })
    }
    return ReS(res, { result: contracts }, 201);  
}



const getSales = async (req, res) => {
    let sales;
    const web3 = new Web3("wss://mainnet.infura.io/ws/v3/9125369641a74d299abf3c0341b2c07f");
    const openContract = new web3.eth.Contract(abi.abi, '0x7Be8076f4EA4A4AD08075C2508e481d6C946D12b');
    /* const erc20TransferABI = [{
        type: "address",
        name: "receiver"
    }, {
        type: "uint256",
        name: "amount"
    }]; */

    const eventJsonInterface = _.find(
        openContract._jsonInterface,
        o => o.name === 'OrdersMatched' && o.type === 'event',
    )

    let condata = await openContract.events.OrdersMatched({
        filter: {},
        fromBlock: 'pending'
    });

    const erc20TransferEvent = [
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
        }
    ]


    //console.log("condata >>>> ", eventJsonInterface)

    condata.on('connected', (subscriptionId) => {
        console.log("subscriptionId >>>> ", subscriptionId)
    })

    condata.on('data', async(event) => {
        console.log("event >>>>>", event)
        let tx = event.transactionHash;

        let mainData = {};
        mainData.price = event.returnValues.price / 1000000000000000000;
        mainData.transactionHash = tx;
        let receipt = await web3.eth.getTransactionReceipt(tx);
        mainData.from = event.returnValues.maker;
        mainData.to = event.returnValues.taker;
        mainData.contractAddress = receipt.logs[0].address;
        mainData.tokedID = receipt.logs[0].address;
        abiDecoder.addABI(erc20TransferEvent)

        const decodedLogs = abiDecoder.decodeLogs(receipt.logs);
        console.log("decodedLogs >>>>>> ", decodedLogs)
        /* console.log("topics[0] >>>>>>>>>>>>>>>>  ", web3.eth.abi.decodeParameters(
            eventJsonInterface.inputs,
            event.raw.data)) */

        /* console.log("topics[1] >>>>>>>>>>>>>>>>  ", web3.utils.hexToNumber(event.raw.topics[1]))
        console.log("topics[2] >>>>>>>>>>>>>>>>  ", web3.utils.hexToNumber(event.raw.topics[2]))
        console.log("topics[3] >>>>>>>>>>>>>>>>  ", web3.utils.hexToNumber(event.raw.topics[3])) */
        //console.log("receipt >>>> ", receipt)
        //console.log("receipt >>>> ", tx, " ---------------- ", web3.utils.hexToNumber(receipt.logs[0].topics[3]))
    })

    /* openContract.events.allEvents({
        filter: { },
        fromBlock: 'pending'
    }, function (error, event) { console.log(event); })
    .on("connected", function (subscriptionId) {
        console.log(subscriptionId);
    })
    .on('data', function (event) {
        console.log("event >>>>> ", event); // same results as the optional callback above
    })
    .on('changed', function (event) {
        console.log("changed event >>>>> ", event); // same results as the optional callback above
        // remove event from local database
    })
    .on('error', function (error, receipt) {
        console.log("error >>>>> ", error); // same results as the optional callback above
        console.log("receipt >>>>> ", receipt); // same results as the optional callback above
        
    }); */

    /* openContract.events.OrdersMatched('OrderApprovedPartTwo', options)
        .then(results => console.log(results))
        .catch(err => console.log(err)); */

    /* const erc20TransferABI = [{
        type: "address",
        name: "receiver"
    }, {
        type: "uint256",
        name: "amount"
    }];
    let address = '0x7Be8076f4EA4A4AD08075C2508e481d6C946D12b';
    address = address.toString().toLowerCase();
    let mins = [];
    

    let block = await web3.eth.getBlock('latest');
    let number = block.number;
    let transactions = block.transactions;

    if (block != null && block.transactions != null) {
        for (let txHash of block.transactions) {
            let tx = await web3.eth.getTransaction(txHash);
            console.log("tx >>> ", tx.to.toString(), address, "address >>>>")
            if (address == tx.to.toString().toLowerCase()) {
                console.log("in condition <>>>>>>>> ", tx);
                console.log(web3.eth.abi.decodeParameters(
                    erc20TransferABI,
                    tx.input.slice(10)));
            }
        }
    } */

    /*
    const latest = await to(web3.eth.getBlockNumber())
    let blockEnd = latest[1];
    let blockStart = latest[1] - 5;

    let params = {
        module: 'account',
        action: 'txlist',
        address: address,
        sort: 'desc',
        apikey: '18AZGQHV7BVMKVDI4DPRHWZQRI6M74SVR5',
        startblock: blockStart,
        endblock: blockEnd
    };

    let mintRes = await to(axiosInstance.get('/api', {
        params,
        transformResponse: [function (data) {
            let data1 = JSON.parse(data);
            mins = data1.result
        }]
    })); */

   
    //return ReS(res, { result: mins }, 201);
}

setTimeout(async () => {
    await getSales();
}, 5000);

//app.use('/sales', getSales)

const getContracts = async(req, res) => {
    let contracts = await Ethermints.aggregate([
        { $match: { contractAddress: { $ne: null } }},
        { $group: { _id: "$contractAddress" } },
        { $limit: 5000},
    ])
    let cons = [];

    interval = 1000, //  = 2s
    increment = 1;
   
    console.log("contracts >>> ", contracts)
    contracts.forEach(async(cont) => {
        console.log("cont._id >>> ", cont._id)
        let params = {
            asset_contract_address: cont._id
        }

        var runner = setTimeout(async function () {
            let openRes = await to(openInstance.get('asset_contract/' + cont._id, {
                transformResponse: [async function (data) {
                    let data1 = JSON.parse(data);
                    console.log("data1 >>>>", data1)
                    let c2 = {
                        name: data1.name,
                        symbol: data1.symbol,
                        address: data1.address,
                        slug: data1.collection.slug,
                        description: data1.description,
                        banner_image_url: data1.collection.banner_image_url,
                        external_url: data1.collection.external_url,
                        image_url: data1.image_url,
                        twitter_username: data1.collection.twitter_username,
                        discord_url: data1.collection.discord_url,
                        short_description: data1.collection.short_description,
                    };
                    await to(Contracts.create(c2));
                    cons.push(data1);
                }]
            })); 

            clearTimeout(runner);
        }, interval * increment);

        increment = increment + 1; 
    })

    return ReS(res, { result: cons }, 201);    
}

//app.use('/getcontracts', updateContract)

const delDuplicatesMongo = async () => {
    var duplicates = [];
    console.log(" delDuplicatesMongo fn called ")
    let startdata = new Date().getTime() - (60 * 1000);
    let docs1 = await Ethermints.aggregate([
        {
            $match: {
                contractAddress: { "$ne": '' }, name: { "$ne": '' }
            },
        },
        {
            $group: {
                _id: { contractAddress: "$contractAddress", tokenID: "$tokenID" },
                dups: { "$addToSet": "$_id" },
                count: { "$sum": 1 }
            }
        },
        {
            $match: {
                count: { "$gt": 1 }
            }
        }
    ]);

    docs1.forEach(function (doc) {
        doc.dups.shift();
        doc.dups.forEach(function (dupId) {
            duplicates.push(dupId);
        })
    })

    duplicates.forEach((id) => {
        Ethermints.updateOne(
            {
                _id: id
            },
            { $set: { isDeleted: 1 } }, { upsert: true }).then((result, err) => {
                if (err) {
                    console.log("error >>>> ", err);
                }
            });
    })

    Ethermints.deleteMany({ isDeleted : 1 }, function (err) {})
}

const deleteMints = async () => {
    console.log("called deleteMints method for yestedday ")
    Ethermints.deleteMany({
            "createdAt": {
                "$lte": new Date((new Date().getTime() - (24 * 60 * 60 * 1000)))
            }
        }
        , function (err) {
            console.log(err);
        })
}

app.use('/deleteMints', deleteMints)

setInterval(() => {
    deleteMints()
}, 3600000)

setInterval(() => {
    updateContract()
}, 300000)


newserver.listen(PORT, () => {
    console.log(
        `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`,
    );
    console.log(
        `🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`,
    );
});