// APW
// Páginas
// Personas (Info)
// José Esteva <josesteva@cic.unam.mx>

import React from 'react';
// import { useQuery, gql } from '@apollo/client';
// import { get } from 'lodash';

// Componentes
import {
  Form,
  Input,
  Label,
  Title
} from '@cicunam/sd';

// Contexto de la aplicación
// import { Context } from '../../../index';

// Mecanismos utilizados
import useFilter from '../../../hooks/filter';

// Estilos
// import style from './style.module.css';

// // TEMPORAL TEMPORAL TEMPORAL TEMPORAL TEMPORAL
// const GET_PERSONAS = gql`
//   query getPersonas {
//     personitas: personas {
//       id
//       nombre
//       correo
//     }
//   }
// `;
// // TEMPORAL TEMPORAL TEMPORAL TEMPORAL TEMPORAL

// Interfaz gráfica
const Info = props => {

  // // Acceso al contexto de la aplicación
  // const { context, setContext } = useContext();

  // Crear un filtro para el módulo
  const nombre = useFilter ('nombre', '_contains');
  const correo = useFilter ('correo', '_contains');
  const edad = useFilter ('edad', '_gt');

  // Interfaz gráfica
  return (
    <>
      <Title size="small" style={{marginBottom:'0.3em'}}>Filtro</Title>
      <Form.Field>
        <Label>Nombre</Label>
        <Input name="nombre" value={nombre.value} onChange={e => nombre.setValue(e.target.value)} />
      </Form.Field>
      <Form.Field>
        <Label>Correo</Label>
        <Input name="correo" value={correo.value} onChange={e => correo.setValue(e.target.value)} />
      </Form.Field>
      <Form.Field>
        <Label>Mayor de edad</Label>
        <Input name="edad" value={edad.value} onChange={e => edad.setValue(e.target.value)} />
      </Form.Field>
    </>
  );

}

export default Info;
