require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const Car = require('./models/car');

const app = express();
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

// Setting up EJS as the view engine
app.set('view engine', 'ejs');

// Middleware
app.use(express.json()); 
app.use(logger('tiny'));
app.use(express.urlencoded({ extended: true })); 

// Connecting to MongoDB
mongoose.connect(MONGO_URI);
mongoose.connection.once('open', () => {
    console.log('MongoDB is showing love');
});
mongoose.connection.on('error', () => {
    console.error('You know how MongoDB be trippin');
});

// Home route
app.get('/', async (req, res) => {
    try {
        const cars = await Car.find(); 
        res.render('index', { cars: cars }); 
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Read. Index, show list of all cars
app.get('/cars', async (req, res) => {
    try {
        const cars = await Car.find(); 
        res.render('cars', { cars: cars }); 
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Create. a new car and redirect to Read. car list
app.get('/cars/new', (req, res) => {
    res.render('new'); 
});

app.post('/cars', async (req, res) => {
    const { make, model, color, year, isAvailable } = req.body;
    const car = new Car({ make, model, color, year, isAvailable: isAvailable === 'true' });
    try {
        await car.save();
        res.redirect('/cars'); 
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Read. list of cars with edit option
app.get('/cars/edit', async (req, res) => {
    try {
        const cars = await Car.find();
        res.render('edit_cars', { cars: cars });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Update specific car by ID
app.get('/cars/edit/:id', async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) {
            return res.status(404).send('Car not found');
        }
        res.render('edit', { car: car });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Update a car by ID and Read. the edit cars list
app.post('/cars/edit/:id', async (req, res) => {
    const { make, model, color, year, isAvailable } = req.body;
    try {
        await Car.findByIdAndUpdate(req.params.id, {
            make,
            model,
            color,
            year,
            isAvailable: isAvailable === 'true'
        }, { new: true });
        res.redirect('/cars/edit'); 
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Read. the list of cars with delete options
app.get('/cars/delete', async (req, res) => {
    try {
        const cars = await Car.find();
        res.render('delete_cars', { cars: cars });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Delete. a car by ID and redirect to the delete cars list
app.post('/cars/delete/:id', async (req, res) => {
    try {
        await Car.findByIdAndDelete(req.params.id);
        res.redirect('/cars/delete'); 
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Listening to the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
