
const UserModel = require('./../Routes/user/user.model')
const { stat } = require('node:fs/promises');

const isUserAuthenticated = async (req, res, next) => {

    try {
        const token = req.header('x-user') || req.query.token;
        const user = await UserModel.findUserByToken(token);
        if (!user[0]) res.status(404).send({ message: "token Expire" });
        else {
            req.user = user[0];
            req.token = token;
            next();
        }
    } catch (error) {

        res.status(404).send({ message: "token Expire" });
    }
}





module.exports = { isUserAuthenticated }
