// APW
// Mecanismos (hooks)
// Forzar una actualización

// NOTA: Código tomado de: "React: Force Component to Re-Render | 4 Simple Ways" de Josip Miskovic (https://josipmisko.com/posts/react-force-rerender)

import { useState } from 'react';

const useRender = () => {

  const [, setToggle] = useState(false);
  return () => setToggle(toggle => !toggle);

}

export default useRender;

// [lock-all/]
