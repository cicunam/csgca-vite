// APW
// Páginas
// Productos (Info)
// José Esteva <josesteva@cic.unam.mx>

import React from 'react';

// Componentes
import {
  Form,
  Input,
  Label,
  Title
} from '@cicunam/sd';

// // Contexto de la aplicación
// import { Context } from '../../../index';

// Mecanismos utilizados
import useFilter from '../../../hooks/filter';

// Estilos
// import style from './style.module.css';

// Interfaz gráfica
const Info = props => {

  // // Acceso al contexto de la aplicación
  // const { context, setContext } = useContext();

  // Filtros
  const siglas = useFilter('siglas','_contains');
  const nombre = useFilter('nombre','_contains');


  // Interfaz gráfica
  return (
    <>
      <Title size="small" style={{marginBottom:'0.3em'}}>Filtro</Title>
      <Form.Field>
        <Label>Siglas</Label>
        <Input name="options" value={siglas.value} onChange={e => siglas.setValue(e.target.value)} />
      </Form.Field>
      <Form.Field>
        <Label>Nombre</Label>
        <Input name="options" value={nombre.value} onChange={e => nombre.setValue(e.target.value)} />
      </Form.Field>
    </>
  );

}

export default Info;
