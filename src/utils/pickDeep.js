// APW
// Utilerias
// Seleccionar elementos de un objeto (iterativamente)
// Código adaptado de: https://joshghent.com/deep-remove-key-from-object/

import { transform, isObject } from 'lodash';

const pickDeep = (object, keys) => {

  const pickFromObject = (o) => { // the inner function which will be called recursivley

    return transform(o, (result, value, key) => { // transform to a new object

      if (keys.indexOf(key) === -1) return; // if the key is not in the index skip it

      result[key] = isObject(value) ? pickFromObject(value) : value; // if the key is an object run it through the inner function - pickFromObject

    });

  }

  return pickFromObject(object); // return the inner function result

}

export default pickDeep;
