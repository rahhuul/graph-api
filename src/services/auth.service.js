const { usermaster } = require('../models');
const validator = require('validator');
const { Op } = require("sequelize");
const { to, TE } = require('../services/util.service');

const createUser = async (userInfo) => {
    let auth_info, err;
    auth_info = {};
    auth_info.status = 'create';
    [err, user] = await to(usermaster.create(userInfo));
    if (err) {
        TE('User already exists with that email.');
        // TE(err.message);
    } else {
        return user;
    }
}
module.exports.createUser = createUser;

const authUser = async function (userInfo) {
    let auth_info = {};
    auth_info.status = 'login';
    if (!userInfo.Email) TE('Please enter an email to login');
    if (!userInfo.Password) TE('Please enter a password to login');
    let user;
    [err, user] = await to(usermaster.findOne({where: { Email: userInfo.Email },}));
    if (!user) TE('Email not registered');
    [err, user] = await to(user.comparePassword(userInfo.Password));
    if (err) TE(err.message);
    return user;
}
module.exports.authUser = authUser;