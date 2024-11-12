// APW
// Mecanismos (hooks)
// Uso de Acordeón
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Implementación del mecanismo
const useOrganizer = (defaultPath, levelSubroute) => { 
  // levelSubroute es el nivel de la subruta del organizador que nos servirá para saber la ruta inicial
  // Ej. personas/13244/componenteOrganizador levelSubroute será 3.

  // Mecanismos del enrutador
  const navigate = useNavigate();

  // Estado del mecanismo
  const [currentTab, setCurrentTab] = useState(defaultPath);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Ruta actual
  const { pathname } = useLocation();
  // Partimos la ruta actual en subrutas
  const subroutes = pathname.split("/")
  // Cortamos desde el índice 1 para evitar elementos vacíos iniciales y luego concatenamos inciando con "/" las subrutas hasta el nivel de subruta.
  const currentPage = subroutes.slice(1, levelSubroute).reduce((acc, part) => acc + '/' + part, '');

  // Actualizar la ruta cuando cambie la pestaña
  useEffect(() => {

    if (subroutes.length > levelSubroute && isFirstLoad) {
      setCurrentTab(`/${subroutes[levelSubroute]}`)
      setIsFirstLoad(false)
    } else {
      setIsFirstLoad(false)
    }

    navigate(currentPage + currentTab, { replace: true });


  }, [ currentTab ]); // eslint-disable-line

  // Variables y funciones proporcionadas por el mecanismo
  return { currentPage, currentTab, setCurrentTab }

}

export default useOrganizer;

// [lock-all/]
