const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    make: { type: String, required: true },
    model: { type: String, required: true },
    color: { type: String, required: true },
    year: { type: Number, required: true },
    isAvailable: { type: Boolean, required: true }
}, {
    timestamps: true    
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;
