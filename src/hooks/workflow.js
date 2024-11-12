// APW
// Mecanismos (hooks)
// Gestión de formularios

import { useNavigate } from 'react-router-dom';

// Definición del hook
const useWorkflow = (collection) => {

  // Histaria de navegación
  const navigate = useNavigate();

  // Crear un registro nuevo
  const createNew = () => {

    navigate(`/${collection}/nuevo`, { replace: true });

  }

  // Mostrar el contenido de un registro
  const showDetail = (id) => {

    navigate(`/${collection}/${id}`, { replace: true });

  }

  // Mostrar la lista de registros
  const showOverview = needFetch => {

      navigate(`/${collection}`, { replace: true });

  }

  return { createNew, showDetail, showOverview };

}

export default useWorkflow;

// [lock-all/]
