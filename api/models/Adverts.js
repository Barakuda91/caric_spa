/**
 * Adverts.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  // таблица объявлений
  attributes: {
      wheelType: 'string', // тип диска (литой, штампованый ...)
      tyreType: { type: 'string', enum: ['winter', 'summer', 'allseason']}, // тип шины (лето, зима...)
      tyreMaker:  'string',// производитель шины
      wheelMaker: 'string', // производитель шины
      model: 'string',
      diameter: 'string', // диаметр диска, шины
      material: 'string',  // материал проставки
      wheelWidth: 'string', // ширина диска
      tyreWidth: 'string', // ширина шины
      PCD: 'string', // диаметр окружности точек крепежа
      tyreeight: 'string'// высота профиля шины

  }
};

