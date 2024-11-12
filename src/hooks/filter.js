// APW
// Mecanismos (hooks)
// Uso de filtros

// NOTA: El filtro y las opciones del filtro no son lo mismo. El filtro es el objeto que se utiliza
//       para filtrar la consulta (graphQL) y las opciones son el contenido de los controles utilizados
//       para ingresar el filtro.

import { useEffect, useState } from 'react';
import { get, set, unset } from 'lodash';

// Mecanismos utilizados
import useContext from './context';

// Implementación del mecanismo
const useFilter = (field, operator) => {

  // Contexto de la aplicación
  const { context, setContext } = useContext();

  // Obtener del contexto el valor del filtro
  const [ value, setValue ] = useState( get(context, `currentPage.filter.${field}.${operator}`, '') );

  // Actualizar el filtro cada vez que cambie su valor
  useEffect(() => {

    if ( value ) {

      // Actualizar el filtro
      setContext({ key: 'currentPage.filter', value: { ...context.currentPage.filter, ...set({}, `${field}.${operator}`, value) }});

    } else {

      // Hcaer una copia del filtro para modificarlo
      const newFilter = { ...context.currentPage.filter }

      // Eliminar el elento del filto
      unset(newFilter, field.split('.')[0]);

      // Actualizar el filtro
      setContext({ key: 'currentPage.filter', value: newFilter });

    }

  }, [ value ]); // eslint-disable-line

  // Variables y funciones proporcionadas por el mecanismo
  return { value, setValue };

}

export default useFilter;

// [lock-all/]
