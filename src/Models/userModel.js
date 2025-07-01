const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const BcryptHasher = require('../utility/BcryptPasswordHasher');

const userSchema = new mongoose.Schema({


    userId: {
        type: String
    },
    name: {
        type: String
    },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    refreshToken: { type: String },
    role: { type: String, enum: ['user', 'admin', 'manager'], default: 'user' }


    , groupId: {
        type: String
    }

}, {
    timestamps: true,
    versionKey: false
});

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await new BcryptHasher().hash(this.password, 10);
});

userSchema.methods.comparePassword = function (password) {
    return new BcryptHasher().compare(password, this.password);
};

module.exports = mongoose.model('UserTest', userSchema);