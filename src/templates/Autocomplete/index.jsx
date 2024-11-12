// APW
// Plantillas
// Autocomplete (Buscar sugerencias en catálogos grandes)
// José Esteva <josesteva@cic.unam.mx>

// Dependencias
import { useEffect, useRef } from 'react';

// Componetes
import {
  Input,
  Label
} from '@cicunam/sd';

// Mecanismos
import useValidation from '../../hooks/validation';

// Estilos locales
import style from './style.module.css';

// Definición de la plantilla
const Autocomplete = ({ source, name, value, onSelect, disabled, ...other }) => {

  const inputRef = useRef(null);

  const { omitNull } = useValidation();

  // Buscar coincidencias
  const searchHints = (e) => {

    source.setInput(e.target.value);

    // Si se borra el contenido de control enviar un evento para avisar.

    if (e.target.value.trim() === '') {
    // NOTA: Traté de simplemente llamar al método selectHint() para evitar código repetitivo (boilerplate) pero no supe cómo pasar el "evento" que requiere como parámetro.

      // Código adaptado de: https://stackoverflow.com/questions/23892547/what-is-the-best-way-to-trigger-change-or-input-event-in-react-js
      Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(inputRef.current, '');

      // Emitir evento 'input':
      inputRef.current.dispatchEvent(new Event('input', { bubbles: true }));

      // Ocultar la lista de sugerencias (haciendo una consulta que no regrese ningún registro)
      source.getHints({ variables: { filter: { id: { _null: true }}}});

    }

    source.getHints({ variables: { filter: { [source.searchField]: { _contains: e.target.value }}}}); // .then(data => setHints(data.personas)).catch(e => console.log(e));

  }

  // Seleccionar una coincidencia
  const selectHint = e => {

    // Actualizar el texto con la sugerencia
    source.setInput(Object.values(source.hints)[0][e.currentTarget.value][source.searchField]);

    // Código adaptado de: https://stackoverflow.com/questions/23892547/what-is-the-best-way-to-trigger-change-or-input-event-in-react-js
    Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(inputRef.current, Object.values(source.hints)[0][e.currentTarget.value].id);

    // Emitir evento 'input':
    inputRef.current.dispatchEvent(new Event('input', { bubbles: true }));

    // Ocultar la lista de sugerencias (haciendo una consulta que no regrese ningún registro)
    source.getHints({ variables: { filter: { id: { _null: true }}}});

  }

  // Si cambia el valor, obtener el texto correspondiente y actualizar la caja de texto
  useEffect(() => {

      if (value) source.getSelected({ variables: { id: value }});

  }, [ value ]);  // eslint-disable-line

  // Si cambia el valor, obtener el texto correspondiente y actualizar la caja de texto
  useEffect(() => {

      if (source.selected && Object.values(source.selected)[0]) source.setInput(Object.values(source.selected)[0].nombre);

  }, [ source.selected ]);  // eslint-disable-line

  // Interfaz gráfica
  return (
    <div className={style.container} {...other}>
      <input ref={inputRef} name={name} value={omitNull(value, '')} onChange={onSelect} style={{ position:'absolute', visibility: 'hidden', height: '0px' }}/>
      <Input value={omitNull(source.input, '')} onChange={searchHints} disabled={disabled} />
      { source.hints && Object.values(source.hints)[0].length > 0 &&
        <ul className={style.hints} id="hints" >
          { Object.values(source.hints)[0].map((hint, i) => (
            <li key={i} value={i} onClick={selectHint} className={style.hint}>
              <Label>{hint.nombre}</Label>
            </li>
          ))}
        </ul>
      }
    </div>
  );

}

export default Autocomplete;

// [lock-all/]
