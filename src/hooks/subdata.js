// APW
// Mecanismos (hooks)
// useSubdata (Gestión de documentos)

// [lock:subdata1]

import { useState, useEffect } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';

import pickDeep from '../utils/pickDeep';

import useFiles from './files';

// Definición del hook
const useSubdata = (id, collection, subject, filter, sort) => {

  let fields;

  // Acceso a los archivos del repositorio
  const files = useFiles(collection);

  // Estado del mecanismo
  const [ items, setItems ] = useState([]);

  // Seleccionar los campos de la tabla asociada:
  // [/lock:subdata1]
  switch(subject) {
    case 'documentos':
      fields = `
        id
        id_personas {
          id
          nombre
        }
        id_documentos {
          id
          nombre
        }
        pdf {
          id 
      }`;
      break;
    default:
      fields = `id`;
  }
  // [lock:subdata2]
    
  // Consulta para obtener la lista de elementos
  const { data, refetch } = useQuery ( gql`query {
    ${collection}_${subject} (filter: {id_${collection}: {id: {_eq: ${id === 'nuevo' ? '-1' : id}}}${filter ? `, ${filter}` : ''}}${sort ? `,sort: "${sort}"` : ''}) {
      ${fields}
    }}`,
    { fetchPolicy: "cache-and-network" } 
  );

  // Consulta para obtener los campos de la tabla asociada
  const { data: collectionsKeys } = useQuery ( gql`{
    __type (name: "${collection}_${subject}") {
      fields {
        name
      }
    }}` 
  );

  // Mutación para eliminar multiples registros asociados
  const [ deleteItems ] = useMutation(gql`mutation ($ids: [ID]!) {
    delete_${collection}_${subject}_items(ids: $ids) {
      ids
    }
  }`);

  // Mutacion para agregar multiples registros asociados
  const [ createItems ] = useMutation(gql`mutation ($data: [create_${collection}_${subject}_input!]) {
    create_${collection}_${subject}_items (data: $data)  {
      id
    }
  }`);

  // Mutacion para actualizar un registro asociado (utilizado para registrar los archivos enviados)
  const [ updateItem ] = useMutation(gql`mutation ($data: update_${collection}_${subject}_input = {}, $id: ID! = "") {
    update_${collection}_${subject}_item (data: $data, id: $id)  {
      id
    }
  }`);

  // Gestor de evento: Agregar un elemento a la lista
  const addItem = item => {

    // Actualizar la lista de elementos
    setItems([ ...items, item ]);

  }

  // Gestor de evento: Eliminar un elemento de la lista
  const deleteItem= tr => {

    // Marcar el elemento como eliminado
    const newItems = items.map((item, index) => {

      if (index === parseInt(tr.dataset.index)) {
        // Clonar el objeto para asegurarse de que sea una copia profunda
        return { ...item, deleted: true };
      }

      return item;

    });

    // Actaulizar la lista de elementos
    setItems(newItems);

  }

  const saveItems = async ( newId ) => {

    // Si no hay un ID válido, no hacer nada.
    if (id === 'nuevo' && !newId ) return;

    // Separar los elementos que deben eliminarse
    let forDelete = items.filter(item => {
      return item.id && item.deleted;
    });

    // Generar los ID utilizados por la mutación
    forDelete = forDelete.map(item => {
      return parseInt(item.id);
    });

    // Eliminar elementos marcados
    if (forDelete.length > 0) deleteItems({ variables: { ids: forDelete }}).then(() => refetch()).catch(e => console.log(e));
 
    // Separar los elementos que deben agregarse a la mutación 
    let forCreate = items.filter(item => {
      return !item.id && !item.deleted;
    });

    // Obtener los campos de la tabla asociada que deben agregarse a la mutación createItems
    let forCreateKeys = collectionsKeys['__type'].fields.map( field => {
      
      if (!['sort', 'pdf'].includes(field.name) ) return field.name;  // Excluir campos de control y "pdf"
    
      return null;

    });

    // Generar los objetos utilizados por la mutación createItems
    let forCreateData = forCreate.map(item => {

      let newItem = pickDeep(item, forCreateKeys);

      delete newItem.id;  // Eliminar el campo "id" (de lo contrario, la consulta GraphQL genera un error).

      // Agregar al objeto el ID de la colección principal
      newItem = { ...newItem, [`id_${collection}`]: { id: newId ? newId : id }}

     // set(newItem, `id_${collection}.id`, newId ? newId : id);

      return newItem;

    });

    // Agregar elementos nuevos
    if (forCreateData.length > 0) createItems({ variables: { data: forCreateData }}).then(response => {

      // Subir al repositorio los archivos seleccionados
      response.data[`create_${collection}_${subject}_items`].forEach((item, i) => {

        if (forCreate[i].pdf) {

          files.uploadFile(forCreate[i].pdf) //, `${id}_${i + 1}.${item.pdf.name.split('.').pop()}`)
          .then(
            uuid => updateItem({ variables: { data: { pdf: { id: uuid, folder: { id: files.getFolder } } }, id: item.id }})
            .then (
              () => refetch() // Actualizar la lista
          ));
        }

      });

    }).then(() => refetch()).catch(e => console.log(e)); 

  }

  const resetItems = () => {

    // Eliminar elementos agregados
    let newItems = items.filter(item => item.id !== null);

    // Restablecer elementos eliminados
    newItems = newItems.map((item, index) => {

      // Eliminar marca de borrado
      if ( item.deleted ) return { ...item, deleted: false };

      return item;

    });

    // Actaulizar la lista de elementos
    setItems([ ...newItems ]);

  }

  // Si hay datos, agregarlos al estado del formulario:
  useEffect(() => {

    if (data) { 

      setItems([ ...data[`${collection}_${subject}`] ])

    }

  }, [ data ]); // eslint-disable-line

  // Regresar datos, acciones, estado y gestores
  return { collection, items, addItem, deleteItem, saveItems, resetItems, reloadItems: refetch };

}

export default useSubdata;

// [/lock:subdata2]
