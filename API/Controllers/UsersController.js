const UserModel = require('../Models/UserModel').Users;
const bcrypt = require('bcrypt');
const crypto = require('crypto-extra');
var jwt = require('jsonwebtoken');


class Users
{
    constructor()
    {
    }

    async store(req, res)
    {
        const req_data = req.body;
        if (!req.body.password) {
            var password = await $this.generatePass(req.body.full_name);
        } else {
            var password = await $this.generatePass(req.body.password);
        }

        const newToken = crypto.randomString(40);
        const payload = {
            emailId: req.body.emailId
        };
        const token = jwt.sign(payload, 'superSecret', {
            expiresIn: Date.now() + 10 // expires in 1 minute
        });

        const userData = UserModel({
            full_name: req_data.full_name,
            mobile: req_data.mobile,
            vehicle_number: req_data.vehicle_number,
            gender: req_data.gender,
            disability: req_data.disability,
            is_pregnent: req_data.is_pregnent,
            access_token: newToken,
            token: token,
            email_id: req_data.email_id,
            password: password
        });

        await userData.save().then(data =>
        {
            return res.status(200).send({
                status: 200,
                message: "Operation Completed",
                data: userData
            }).end();

        }).catch(err =>
        {
            return res.status(400).send({
                status: "Error",
                message: `Unable to add user, Err:${err}`,
                data: userData
            }).end();
        });

    }

    generatePass(string)
    {
        var password = (string.replace(/\s/g, '')).substring(0, 4);
        password = password.toLowerCase() + '@' + Math.floor(Math.random() * (99999 - 10000) + 10000);
        return password;
    }

    generateHash(plainText)
    {
        return bcrypt.hashSync(plainText, 10);
    }


}

const $this = Users.prototype;

module.exports = Users;