const express = require('express');
const router = express.Router();
const {
    handleError,
    checkCarId,
    checkCarPayload,
    checkVinNumberUnique, 
    checkVinNumberValid
  } = require('./cars-middleware');

const Car = require('./cars-model');

router.get('/', async (req, res, next) => {
    Car.getAll()
        .then(carsArr => {
            res.status(200).json(carsArr);
        })
        .catch(next)
})

router.get('/:id', checkCarId, async (req, res, next) => {
    try {
        const cars = await Car.getById(req.params.id);
        res.status(200).json(cars);
    } catch (err) {
        next(err);
    }
});

router.post('/',checkVinNumberValid, checkCarPayload, checkVinNumberUnique, async (req, res, next) => {
    try {
        const car = await Car.create(req.body);
        res.status(201).json(car);
    } catch (err) {
        next(err);
    }
})

router.use(handleError);

module.exports = router;