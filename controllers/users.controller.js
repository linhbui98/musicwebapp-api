const Users = require('../models/users');

module.exports = {
    info: async (req, res) => {
        const huy = new Users({ username: 'huybui04', password: '232' });
        await huy.save().then(() => console.log("huy"));
        const user =  await Users.find({ username: 'linhbui98' });
        res.json(user);
    },
    login: async (req, res) => {
        console.log(req.body);
        try {
            const email = req.body.username
            const password = req.body.password
            const user = await Users.findByCredentials(email, password)
            const token = user.generateAuthToken()
            res.send({ user, token })
        } catch (error) {
            // res.status(400).send(error)
            res.json(error.message)
        }
    },
    listUsers: async (req, res) => {
        try {
            await User.find({}, function(err, users) {
                res.send(users)
              });
        } catch (error) {
            // res.status(400).send(error)
            res.json(error.message)
        }
    }
};