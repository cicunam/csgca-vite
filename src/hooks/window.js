// APW
// Mecanismos (hooks)
// Observar cambios en el tamaño de un elemento

// NOTA 1: Creo que el objeto ResizeObserver puede regresar otros valores; de ser así, agregarlos al estado.
// NOTA 2: Por ahora preferí querySelector pero quizá más adelante sea adecuado utilizar una referencia con useRef().

import { useEffect } from 'react';

// Mecanismos utilizados
import useContext from './context';

// Definición del mecanismo
const useWindow = selector => {

  // [ width, setWidth ] = useState(0);

  // Contexto de la aplicación
  const { context, setContext } = useContext();

  // Crear un observador del tamaño del elemento (selector).
  useEffect(() => {

    // Obtener el elemento que se desea observar
    const element = document.querySelector(selector);

    // Acción que se desea realizar cuando cambie el tamaño
    const handleResize = () => {

      // Calcular el número de tarjetas que caben en la ventana
      let cards = Math.floor(((element.clientWidth - 32) / 312) * 4); // NOTA: 64 = Espacio derecho e izquierdo; 312 = Ancho de la tarjeta + Espacio entre tarjetas; 4 = Número de renglones

      // Sólo cambiar el contexto si el cambio de tamañ es de +- 24 pixeles; de lo contrario la pantalla "vibra".
      if ((element.clientWidth >= (context.window.width) || element.clientWidth <= (context.window.width) )) {

        // TEMPORAL TEMPORAL TEMPORAL TEMPORAL TEMPORAL TEMPORAL
        let cards;
        if (element.clientWidth >= 1920) cards = 18;
        else if (element.clientWidth >= 1600) cards = 15;
        else if (element.clientWidth >= 1280) cards = 12;
        else if (element.clientWidth >= 960) cards = 9;
        else if (element.clientWidth >= 640) cards = 6;
        // TEMPORAL TEMPORAL TEMPORAL TEMPORAL TEMPORAL TEMPORAL

        setContext({ key: 'window', value: { width: element.clientWidth, height: element.clientHeight, cards } });

      }
      
      new ResizeObserver(handleResize).observe(element);

    }


  }, []); // eslint-disable-line

}

export default useWindow;

// [lock-all/]
