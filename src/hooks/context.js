// APW
// Mecanismos (hooks)
// Acceso al contexto de la aplicación

import { useContext as useContextAPI } from 'react';

// Contexto de la aplicación
import { Context } from '..';

// Definición del hook
const useContext = () => {

  // Regresar un acceso al contexto de la aplicación
  return useContextAPI( Context );

}

export default useContext;
