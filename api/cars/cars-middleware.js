const Cars = require('./cars-model');
const vinValidator = require('vin-validator');

const checkCarId = (req, res, next) => {
  Cars.getById(req.params.id)
    .then(possibleId => {
      if (possibleId) {
        req.car = possibleId;
        next();
      } else {
        next({ status: 404, message: `car with id ${req.params.id} is not found` });
      }
    })
    .catch(next);
}

const checkCarPayload = (req, res, next) => {
  const { vin, model, mileage, make } = req.body;

  let message = '';
  if (!vin || !vinValidator.validate(req.body.vin)) {
    message = 'vin';
  } else if (!model) {
    message = 'model';
  } else if (!mileage) {
    message = 'mileage';
  } else if (!make) {
    message = 'make';
  }

  if (vin && make && model && mileage) {
    next();
  } else {
    next({ status: 400, message: `${message} is missing`})
  }
}

const checkVinNumberValid = (req, res, next) => {
  if (vinValidator.validate(req.body.vin)) {
    next();
  } else {
    next({ status: 400, message: `vin ${req.body.vin} is invalid` })
  }
}

const checkVinNumberUnique = async (req, res, next) => {
  let vinArr = [];
  Cars.getAll()
    .then(carsArr => {
      vinArr = carsArr.map(cars => cars.vin);
      for (let i = 0; i < vinArr.length; i++) {
        if (req.body.vin === vinArr[i]) {
          next({ status: 400, message: `vin ${req.body.vin} already exists` })
        }
      }
      next();
    })
    .catch(next);
}

const handleError = (err, req, res, next) => {
  res.status(err.status || 500).json({
      message: err.message,
      prodMessage: 'something went really wrong!',
  });
}

module.exports = {
  handleError,
  checkCarId,
  checkCarPayload,
  checkVinNumberUnique, 
  checkVinNumberValid
}

