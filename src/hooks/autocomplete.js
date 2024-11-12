// APW
// Mecanismos (hooks)
// Gestión de registros

import { useState } from 'react';
import { gql, useLazyQuery } from '@apollo/client';

// Definición del hook
const useAutocomplete = (collection, keyField, searchField) => {

  // const [ hints, setHints ] = useState([]);
  const [ input, setInput ] = useState('');

  // Consulta para obtener sugerencias del catálogo
  const [ getHints, { data: hints } ] = useLazyQuery (
    gql`query ($filter: ${collection}_filter = {}, $limit: Int = 50) {
      ${collection}(filter: $filter, limit: $limit, sort: "${searchField}") {
        id: ${keyField}
        nombre: ${searchField}
      }
    }`
  );

  // Consulta obtener el texto de una entrada de catálogo
  const [ getSelected, { data: selected }  ] = useLazyQuery (
    gql`query ($id: ID = "") {
      ${collection}: ${collection}_by_id(id: $id) {
        nombre: ${searchField}
      }
    }`
  );

  // Regresar los datos y algunas funciones para modificarlos
  return { input, setInput, hints, getHints, selected, getSelected, searchField };

}

export default useAutocomplete;

// [lock-all/]
