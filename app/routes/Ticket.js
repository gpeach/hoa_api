let Ticket = require('../models/Ticket')

async function getTickets(req, res) {
    try {
        const tickets = await Ticket.find({}).exec();
        res.json(tickets);
    } catch (err) {
        res.status(500).send({ error: 'An error occurred while fetching tickets', details: err.message });
    }
}
async function postTicket(req, res) {
    try {
        const ticket = new Ticket(req.body);
        const savedTicket = await ticket.save();
        res.status(201).json({message: "Ticket added successfully", status: "OK", ticket: savedTicket});
    } catch (err) {
        res.status(500).send({error: 'An error occurred while adding the ticket', details: err.message});
    }
}

async function getTicket(req, res) {
    try {
        const ticket = await Ticket.findById(req.params.id).exec();
        if (!ticket) {
            return res.status(404).send({error: 'Ticket not found'});
        }
        res.json(ticket);
    } catch (err) {
        res.status(500).send({error: 'An error occurred while fetching the ticket', details: err.message});
    }
}

async function deleteTicket(req, res) {
    try {
        const deletedTicket = await Ticket.findByIdAndDelete(req.params.id).exec();
        if (!deletedTicket) {
            return res.status(404).send({error: 'Ticket not found'});
        }
        res.json({message: "Ticket successfully deleted", ticket: deletedTicket});
    } catch (err) {
        res.status(500).send({error: 'An error occurred while deleting the ticket', details: err.message});
    }
}

async function updateTicket(req, res) {
    try {
        const updatedTicket = await Ticket.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // Return the updated document
        ).exec();

        if (!updatedTicket) {
            return res.status(404).send({ error: 'Ticket not found' });
        }

        res.json({ message: 'Ticket updated', ticket: updatedTicket });
    } catch (err) {
        res.status(500).send({ error: 'An error occurred while updating the ticket', details: err.message });
    }
}

module.exports = {
    getTickets,
    postTicket,
    getTicket,
    deleteTicket,
    updateTicket
};
