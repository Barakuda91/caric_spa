var currentName = 'params_settings';

module.exports = {
    // таблица объявлений
    attributes: {
        wheelType:  'array', // тип диска (литой, штампованый ...)
        tyreType:   'array', // тип шины (лето, зима...)
        // tyreMaker:  'string', // производитель шины
        // wheelMaker: 'string', // производитель шины
        // tyreModel:  'string', // модель шины
        // wheelModel: 'string', // модель диска
        diameter:   'array', // диаметр диска, шины
        material:   'array', // материал проставки
        wheelWidth: 'array', // ширина диска
        tyreWidth:  'array', // ширина шины
        PCD:        'array', // диаметр окружности точек крепежа
        tyreHeight: 'array'  // высота профиля шины
    }
}