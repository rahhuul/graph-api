const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mintsSchema = new Schema(
    {
        openseid: {
            type: String,
            unique: true,
        },
        asset: Object,
        collection_data: Object,
        asset_contract: Object,
        collection_slug: String,
        from_account: Object,
        event_type: Object,
        created_date: String,
        quantity: String,
        to_account: Object,
    },
    {
        timestamps: true
    }
);
var Mints = mongoose.model('Mint', mintsSchema);

module.exports = {
    Mints,
    mintsSchema
};