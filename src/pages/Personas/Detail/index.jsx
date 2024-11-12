// APW
// Páginas
// Personas (Detail)
// José Esteva <josesteva@cic.unam.mx>

import React from 'react';
import { useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';

// import { VariableType } from 'json-to-graphql-query';

// Componentes
import {
  Actions,
  Box,
  Button,
  Flexbox,
  Form,
  Input,
  Label,
  Select
 } from '@cicunam/sd';

// Iconos
import iTrash from '@cicunam/sd/icons/trash.svg?react';
import iPen from '@cicunam/sd/icons/pen.svg?react';
import iTimes from '@cicunam/sd/icons/times.svg?react';
import iCheck from '@cicunam/sd/icons/check.svg?react';

// Contexto de la aplicación
// import { Context } from '../../../index';

// Mecanismos uilizados
import useForm from '../../../hooks/form';
import useValidation from '../../../hooks/validation';
import useWorkflow from '../../../hooks/workflow';

// Estilos locales
// import style from './style.module.css';

// Consulta para obtener los datos
const Query = gql`query getPersona($id: ID = "") {
  personas: personas_by_id(id: $id) {
    id
    id_tipos { id }
    nombre
    correo
    fecha_nacimiento
    edad
  }
}`;

// Detail
const Detail = props => {

  // Parámetros de la URL
  const params = useParams();

  // Gestión del flujo
  const workflow = useWorkflow('personas');

  // Gestion del formulario
  const form = useForm(params.id, 'personas', Query, {
    onCreate: id => workflow.showDetail(id),
    onReset: () => { if ( params.id === 'nuevo') workflow.showOverview() },
    // onUpdate: () => {},
    onDelete: () => workflow.showOverview()
  });

  // Catalogos
  const { data: catalogos } = useQuery(gql`query {
      tipos {
        id
        nombre
      }
    }`
  );

  // Validaciones
  const { omitNull } = useValidation();

  // Interfaz gráfica
  return (

    <>
      <Actions>
        { form.isDisabled && <Button icon={iTrash} color="secondary" onClick={form.handleDelete} /> }
        { form.isDisabled && <Button icon={iPen} color="primary" onClick={form.handleEdit}>Editar</Button> }
        { !form.isDisabled && <Button icon={iTimes} color="secondary" onClick={form.handleCancel} /> }
        { !form.isDisabled && <Button icon={iCheck} color="primary" onClick={form.handleAccept}/> }
      </Actions>
      <Box space="medium large">
        <Flexbox direction="column" align="center" style={{ margin:'auto', maxWidth:'960px' }}>
          { form.fields.personas && catalogos &&
            <Form layout="stacked" disabled={true}>
              <Form.Field>
                <Label bold>Nombre</Label>
                <Input name="personas.nombre" value={omitNull(form.fields.personas.nombre, '')} disabled={form.isDisabled} onChange={form.handleChange} />
              </Form.Field>
              <Form.Field>
                <Label bold>Tipo</Label>
                <Select name="personas.id_tipos.id" value={form.fields.personas.id_tipos && omitNull(form.fields.personas.id_tipos.id, '')} disabled={form.isDisabled} onChange={form.handleChange} style={{ width: 'fit-content' }}>
                  <Select.Option value=""></Select.Option>
                  {catalogos.tipos && catalogos.tipos.map((tipo, i) => (
                    tipo && typeof tipo === 'object' && <Select.Option key={i} value={omitNull(tipo.id, '')}>{tipo.nombre}</Select.Option>
                  ))}
                </Select>
              </Form.Field>
              <Form.Field>
                <Label bold>Correo</Label>
                <Input type="email"  name="personas.correo" value={omitNull(form.fields.personas.correo, '')} disabled={form.isDisabled} onChange={form.handleChange} />
              </Form.Field>
              <Form.Field>
                <Label bold>Fecha de nacimiento</Label>
                <Input type="date" name="personas.fecha_nacimiento" value={omitNull(form.fields.personas.fecha_nacimiento, '')} disabled={form.isDisabled} onChange={form.handleChange} style={{ width: 'fit-content' }}/>
              </Form.Field>
              <Form.Field>
                <Label bold>Edad</Label>
                <Input type="number" max="100" name="personas.edad" value={omitNull(form.fields.personas.edad, '')} disabled={form.isDisabled} onChange={form.handleChange} style={{ width: '4em' }}/>
              </Form.Field>
            </Form>
          }
        </Flexbox>
      </Box>
    </>

  );

}

export default Detail;
