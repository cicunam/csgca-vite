// APW
// Mecanismos (hooks)
// Gestión de colecciones

import { useEffect, useState } from 'react';
import { gql, useLazyQuery, useQuery } from '@apollo/client';

// Mecanismos utilizados
import useContext from './context';

// Definición del hook
const useCollection = (query) => {

  // Contexto de la aplicación
  const { context, setContext } = useContext();

  // Estado del mecanismo
  const [count, setCount] = useState(0)
  const [pages, setPages] = useState(0);

  // // Obtener de la consulta el nombre de la colección
  const collection = query.definitions[0].selectionSet.selections[0].name.value;

  // Obtener la primera página de datos
  const { data, refetch } = useQuery(query, { variables: { limit: context.window.cards, page: context.currentPage.page, filter: context.currentPage.filter }});

  // Obtener los metadatos de la consulta
  const [ recount ] = useLazyQuery(gql`query ($filter: ${collection}_filter = {}) {
    ${collection}_aggregated(filter: $filter) {
      count {
        id
      }
    }
  }`, { variables: { filter: context.currentPage.filter }});

  // Cambiar de página
  const selectPage = page => {

    setContext({ key: 'currentPage.page', value: page });

  }

  // Calcular el número de páginas cada vez que cambie el número de registros
  useEffect(() => {

      // Volver a contar los registros
      recount().then(({ data }) => {

        // Obtener el número de registros y páginas de la colección
        let newCount = data ? Object.values(data)[0][0].count.id : 0;
        
        // Calcular el número de páginas necesarias  
        let newPages = Math.ceil(newCount/context.window.cards);

        // Actualizar el estado del mecanismo
        setCount(newCount);
        // Validamos que newPages sea finito
        if (isFinite(newPages)) {
          setPages(newPages);
        }
        
        // Si la página actual es mayor al número de páginas, ir a la última página.
        if ( context.currentPage.page > newPages ) {
          setContext({ key: 'currentPage.page', value: newPages });
        }

      });

  }, [ data, context.currentPage.filter, context.window.cards ]); // eslint-disable-line

  // Variables y funciones que regresa el macanismo
  return { items: data ? Object.values(data)[0] : [], pages, count, selectPage, refetch };

}

export default useCollection;

// [lock-all/]
