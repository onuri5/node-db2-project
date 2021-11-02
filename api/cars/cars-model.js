const db = require('../../data/db-config');

const getAll = async () => {
  const result = await db('cars');
  return result;
}

const getById = async (id) => {
  const result = await db('cars').where('id', '=', id).first();
  return result;
}

const create = async (newCar) => {
  const [result] = await db('cars').insert(newCar);
  const car = await getById(result);
  return car;
}

module.exports = {
  getAll,
  getById,
  create
}
