// APW
// Mecanismos (hooks)
// Verificar si el componente está montado
// Código adaptado de: https://codedamn.com/news/reactjs/cant-perform-a-react-state-update-error

import { useEffect, useRef } from 'react';

// Definición del mecanismo
const useMounted = () => {

  const isMounted = useRef(false);

  useEffect(() => {

    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };

  }, []);

  return isMounted.current;

}

export default useMounted;

// [lock-all/]
