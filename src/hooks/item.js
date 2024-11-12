// APW
// Mecanismos (hooks)
// Gestión de registros

import { useQuery, useMutation, gql } from '@apollo/client';

// Definición del hook
const useItem = (id, collection, query) => {

  // Mutación para crear registros
  const createQuery = gql`mutation ($data: create_${collection}_input = {}) {
    create_${collection}_item (data: $data)  {
      id
    }
  }`;

  // Mutación para actualizar registros
  const updateQuery = gql`mutation ($data: update_${collection}_input = {}, $id: ID = "") {
    update_${collection}_item(data: $data, id: $id) {
      id
    }
  }`;

  // Mutación para eliminar registros
  const deleteQuery = gql`mutation ($id: ID = "") {
    delete_${collection}_item(id: $id) {
      id
    }
  }`;

  // Obtener los datos del formulario
  const { data, refetch } = useQuery(query, { variables: { id: id === 'nuevo' ? '-1' : id } });

  // Mutación: Crear un registro nuevo
  const [ create ] = useMutation(createQuery); //, { variables: { data: Object.values(fields)[0] } }); // setId(data.id);

  // Mutación: Actualizar un registro
  const [ update ] = useMutation(updateQuery); //, { variables: { data: Object.values(fields)[0], id: id } });

  // Mutación: Eliminar un registro
  const [ remove ] = useMutation( deleteQuery); //, { variables: { id: id } }); // La palabra 'delete' está reservada por el lenguaje

  // Acción: Crear un registro nuevo
  const createItem = fields => {

    return create({ variables: { data: Object.values(fields)[0] } });

  }

  // Acción: Actualizar el registro
  const updateItem = (fields) => {

    return update({ variables: { data: Object.values(fields)[0], id } });

  }

  // Acción: Actualizar el registro
  const deleteItem = () => {

    return remove({ variables: { id } });

  }

  // Regresar los datos y algunas funciones para modificarlos
  return { data, createItem, updateItem, deleteItem, reloadItem: refetch };

}

export default useItem;

// [lock-all/]
