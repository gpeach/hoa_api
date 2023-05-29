let mongoose = require('mongoose')
let TicketSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
        image: {
            type: String,
            required: true,
        },
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

module.exports = mongoose.model('Ticket', TicketSchema)
