const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const contractSchema = new Schema(
    {
        name: String,
        symbol: String,
        address: {
            type: String,
            unique: true,
        },
        slug: String,
        description: String,
        banner_image_url: String,
        external_url: String,
        image_url: String,
        twitter_username: String,
        discord_url: String,
        short_description: String
    },
    {
        timestamps: true
    }
);
var Contracts = mongoose.model('Contract', contractSchema);

module.exports = {
    Contracts,
    contractSchema
};