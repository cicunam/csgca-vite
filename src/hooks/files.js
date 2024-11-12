// APW
// Mecanismos (hooks)
// useFiles (gestión de los archivos del repositorio)

// NOTA: Por el momento, Directus no permite subir archivos utilizando GraphQL. 
//       Si en algún momento se incluye esta opción será importante utilizarla.

import { gql, useQuery } from '@apollo/client';

// Mecanismos utilizados
import useContext from './context';

// Definición del mecanismo
const useFiles = (collection) => {

  // Contexto de la aplicación
  const { context } = useContext();

  // Obtener el identificador del folder del módulo
  const { data } = useQuery (
    gql`{
      folders(filter: {name: {_eq: "${collection}"}}) {
        id
        name
      }
    }`, { context: { clientName: 'system' } }
  );

  // Subir un archivo al repositorio
  const uploadFile = async (file) => {

    // Obtener el token de localStorage
    const token = localStorage.getItem('access_token');

    let formData = new FormData();

    // Agregar el archivo a objeto
    formData.append('file', file);

    try {

      const response = await fetch(`${context.product.api}/files`, {
        mode: 'cors',
        method: 'POST',
        body: formData,
        headers: {
          authorization: token ? `Bearer ${token}` : "",
        }
      });

      const object = await response.json();

      return object.data.id;

    } catch (error) {

      return null;

    }

  }

  // Regresar acciones y datos
  return { getFolder: data && data.folders ? data.folders[0].id : '', uploadFile };

}

export default useFiles;

// [lock-all/]
