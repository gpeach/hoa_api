let Ticket = require('../models/Ticket')

function getTickets(req, res) {
    let query = Ticket.find({})
    query.exec((err, tickets) => {
        if (err) res.send(err)
        res.json(tickets)
    })
}

function postTicket(req, res) {
    var ticket = new Ticket(req.body)
    ticket.save((err, ticket) => {
        if (err) {
            res.send(err)
        } else {
            res.status(201).json({message: "Ticket added successfully", ticket})
        }
    })
}

function getTicket(req, res) {
    Ticket.findById(req.params.id, (err, ticket) => {
        if (err) res.send(err)
        res.json(ticket)
    })
}

function deleteTicket(req, res) {
    Ticket.remove({_id: req.params.id}, (err, result) => {
        res.json({message: "Ticket successfully deleted", result})
    })
}

function updateTicket(req, res) {
    Ticket.findById({_id: req.params.id}, (err, ticket) => {
        if (err) res.send(err)
        Object.assign(ticket, req.body).save((err, ticket) => {
            if (err) res.send(err)
            res.json({message: 'Ticket updated', ticket})
        })
    })
}

module.exports = {
    getTickets,
    postTicket,
    getTicket,
    deleteTicket,
    updateTicket
}