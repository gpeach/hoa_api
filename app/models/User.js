const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    about: { type: String, required: false, unique: false },
    password: { type: String, required: true },
    image: {type: String, required: false},
    createdAt: {type: Date, default: Date.now}
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
    const now = new Date()
    if(!this.createdAt){
        this.createdAt = now
    }
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next()
});

// Method to compare passwords
UserSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
