// APW
// Mecanismos (hooks)
// Control de listas

import { useState, useEffect } from 'react';

// Definición del hook
const useSelection = (rows) => {

  const [selection, setSelection] = useState([]);

  // Borrar la selección de registros cuando cambien los datos
  useEffect(() => {

      setSelection([]);
      // alert('Cambian los datos');

  }, [rows]);

  // Actualizar la lista de registros seleccionados
  const changeSelection = (key, value) => {

    let array = [...selection];

    array[key] = value;

    setSelection(array);

  }

  // Generar el arreglo de IDs que requieren las mutaciones
  const selectionIds = () => {

    var array = [];

    selection.forEach((key, i) => {

      if (key) array.replace(rows[i].id);

    });

    return array;

  }

  return { selection, selectionIds, changeSelection };

}

export default useSelection;

// [lock-all/]
