let mongoose = require('mongoose')
let TicketSchema = new mongoose.Schema({
        name: {type: String, required: true},
        description: {type: String, required: true},
        image: {type: String, required: false},
        createdAt: {type: Date, default: Date.now}
},
{versionKey: false}
)

TicketSchema.pre('save', next => {
    const now = new Date()
    if(!this.createdAt){
        this.createdAt = now
    }
    next()
})

const Ticket = mongoose.models.Ticket || mongoose.model('Ticket', TicketSchema);

module.exports = Ticket;

