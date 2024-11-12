// APW
// Utilerias
// Eliminar elementos de un objeto (iterativamente)
// Código adaptado de: https://joshghent.com/deep-remove-key-from-object/

import { transform, isObject } from 'lodash';

// const isObject = value => (
//   typeof value === 'function' || typeof value === 'object' && !Array.isArray(value) && !!value
// );

// Deeply remove keys from an object
// @param - object: Object - the object to remove the key from
// @params - keys: Array/String - string or array of strings of keys to remove
const omitDeep = (object, keys) => {

  const omitFromObject = (o) => { // the inner function which will be called recursivley

    return transform(o, (result, value, key) => { // transform to a new object

      if (keys.indexOf(key) !== -1) return; // if the key is in the index skip it

      result[key] = isObject(value) ? omitFromObject(value) : value; // if the key is an object run it through the inner function - omitFromObject

    });

  }

  return omitFromObject(object); // return the inner function result

}

export default omitDeep;
