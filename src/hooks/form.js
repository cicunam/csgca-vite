// APW
// Mecanismos (hooks)
// Gestión de registros

import { useState, useEffect, useReducer } from 'react';
import { merge, set } from 'lodash';

// Utilerias
import omitDeep from '../utils/omitDeep';

// Mecanismos
import useItem from './item';

// Definición del hook
const useForm = (id, collection, query, { onCreate, onReset, onUpdate, onDelete }) => {

  // Estado del formulario
  const [fields, setFields] = useState(id === 'nuevo' ? { [collection]: {} } : {});
  const [isDisabled, setIsDisabled] = useState(id === 'nuevo' ? false : true);

  // Genrar una recarga de datos
  const [reset, resetData] = useReducer((p) => !p, true);

  // Gestión de datos
  const { data, createItem, updateItem, deleteItem, reloadItem } = useItem(id, collection, query);

  // Gestor de evento: Aplicar un cambio a la estructura de datos
  const handleChange = (e) => {

    // Obtener el nombre, tipo y valor del campo
    const fieldName = e.target.name;
    const filedType = e.target.type;

    const fieldValue = filedType === 'checkbox' ? (e.target.checked ? 1 : 0) : e.target.value;

    let dataValue; // Valor utilizado para realizar la mutación

    switch (filedType) {
      case 'checkbox':
      case 'number':
        dataValue = Number(fieldValue);
        break;
      default:
        dataValue = fieldValue;
    }

    // Si le mandamos number al evento podremos forzarlo a que se convierta en número.
    if(e.number){
      dataValue = Number(dataValue)
    }

    // Si el tipo de dato es correcto, actualizar el arreglo de valores
    setFields({ ...set( fields, fieldName, dataValue ) }); // NOTA: Son necesarias las llaves que envuelven el arreglo para que React detecte que cambió el objeto "data"

  }

  // Gestor de evento: Habilitar el formualrio para edición
  const handleEdit = () => {

    setIsDisabled(false);

  }

  // Gestor de evento: Aceptar la operación
  const handleAccept = () => {

    if (id === 'nuevo') createItem(fields).then(({ data }) => {

      reloadItem();         // Recargar los datos
      setIsDisabled(true);  // Deshabilitar el formulario

      const id = data[`create_${collection}_item`].id;

      // Ejecutar función de retorno
      if (typeof onCreate === 'function') onCreate(id);

    }).catch(e => console.log(e));

    else updateItem(fields).then(() => {

      reloadItem();         // Recargar los datos
      setIsDisabled(true);  // Deshabilitar el formulario

      // Ejecutar función de retorno
      if (typeof onUpdate === 'function') onUpdate();

    }).catch(e => console.log(e));

  }

  // Gestor de evento: Borrar el registro actual
  const handleDelete = () => {

    if (window.confirm('¿Borrar el registro seleccionado?') === true) {

      deleteItem().then(() => {

        // Ejecutar función de retorno
        if (typeof onDelete === 'function') onDelete();

      }).catch(e => console.log(e));

    }

  }

  // Gestor de evento: Cancelar la operación
  const handleCancel = () => {

    resetData();          // Forzar una recagar los datos

    setIsDisabled(true);  // Deshabilitar el formulario

    // Ejecutar función de retorno
    if (typeof onReset === 'function') onReset();

  }

  // Si hay datos, agregarlos al estado del formulario:
  useEffect(() => {

      if (data && Object.values(data)[0]) {

        setFields({ ...merge(fields, omitDeep(data, ['__typename'])) });

      }

  }, [ data, reset ]); // eslint-disable-line

  // Regresar datos, acciones, estado y gestores
  return { fields, handleChange, handleEdit, handleDelete, handleAccept, handleCancel, isDisabled };

}

export default useForm;

// [lock-all/]
