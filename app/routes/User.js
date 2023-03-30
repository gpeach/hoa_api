let User = require('../models/User')

function getUsers(req, res) {
    let query = User.find({})
    query.exec((err, Users) => {
        if (err) res.send(err)
        res.json(Users)
    })
}

function postUser(req, res) {
    var User = new User(req.body)
    User.save((err, User) => {
        if (err) {
            res.send(err)
        } else {
            res.status(201).json({message: "User added successfully", User})
        }
    })
}

function getUser(req, res) {
    User.findById(req.params.id, (err, User) => {
        if (err) res.send(err)
        res.json(User)
    })
}

function deleteUser(req, res) {
    User.remove({_id: req.params.id}, (err, result) => {
        res.json({message: "User successfully deleted", result})
    })
}

function updateUser(req, res) {
    User.findById({_id: req.params.id}, (err, User) => {
        if (err) res.send(err)
        Object.assign(User, req.body).save((err, User) => {
            if (err) res.send(err)
            res.json({message: 'User updated', User})
        })
    })
}

module.exports = {
    getUsers,
    postUser,
    getUser,
    deleteUser,
    updateUser
}