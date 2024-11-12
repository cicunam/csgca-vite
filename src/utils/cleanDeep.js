// APW
// Utilerias
// Limpiar un objeto (iterativamente)
// Creado por José Esteva <josesteva@cic.unam.mx> 10/08/2023

// Código adaptado de: https://joshghent.com/deep-remove-key-from-object/

// import { transform, isObject } from 'lodash';

// const isObject = value => (
//   typeof value === 'function' || typeof value === 'object' && !Array.isArray(value) && !!value
// );



const cleanDeep = (object) => {

  // NOTA: Esta función debe recibir distinguir entre datos numéricos y datos de texto!

  // const cleanObject = (o: any) => { // the inner function which will be called recursivley
  //
  //   return transform(o, (result, value, key) => {
  //
  //     result[key] = isObject(value) ? cleanObject(value) : ''; // Si elelemento es un objeto, ejecutar recursivamente la misma función
  //
  //   });
  //
  // }
  //
  // return cleanObject(object);

  // TEMPORAL
  return object;

}

export default cleanDeep;
