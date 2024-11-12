// APW
// Páginas
// Productos (Detail)
// José Esteva <josesteva@cic.unam.mx>

import React from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import { gql } from '@apollo/client';
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
  Tabs
 } from '@cicunam/sd';

 // Iconos
import iTrash from '@cicunam/sd/icons/trash.svg?react';
import iPen from '@cicunam/sd/icons/pen.svg?react';
import iTimes from '@cicunam/sd/icons/times.svg?react';
import iCheck from '@cicunam/sd/icons/check.svg?react';

// Contexto de la aplicación
// import { Context } from '../../../index';

// Mecanismos uilizados
import useAutocomplete from '../../../hooks/autocomplete';
import useForm from '../../../hooks/form';
import useOrganizer from '../../../hooks/organizer';
import useSubdata from '../../../hooks/subdata';
import useValidation from '../../../hooks/validation';
import useWorkflow from '../../../hooks/workflow';

// Plantillas utilizadas
import Autocomplete from '../../../templates/Autocomplete';
import Subdata from '../../../templates/Subdata';

// Estilos locales
// import style from './style.module.css';

// Consulta para obtener los datos
const Query = gql`query ($id: ID = "") {
  productos: productos_by_id(id: $id) {
    id
    id_personas { id }
    nombre
    siglas
  }
}`;

// Detail
const Detail = props => {

  // Mecanismos del enrutador
  const params = useParams();

  // Gestión del flujo
  const workflow = useWorkflow('productos');

  // Gestion de datos asociados
  const subdata = useSubdata(params.id, 'productos', 'documentos');

  // Gestión de catálogos grandes
  const personas = useAutocomplete('personas', 'id', 'nombre');

  // Gestion del formulario
  const form = useForm(params.id, 'productos', Query, {

    onCreate: id => {

      subdata.saveItems(id).then(() => workflow.showDetail(id));
      // files.saveItems(id)
        // .then(() => {
          workflow.showDetail(id);
          // setIdState(id); //Actualizamos el id para que nuestro refetch funcione con el id proporcionado por onCreate.
          subdata.reloadItems();
          // files.reloadItems();
        // });
    },
    onReset: () => {

      if ( params.id === 'nuevo') workflow.showOverview();
      else subdata.resetItems();

    },
    onUpdate: () => {
      subdata.saveItems();
      // files.saveItems();
    },
    onDelete: () => workflow.showOverview()
  });

  // Gestión de las pestañas
  const organizer = useOrganizer('/general', 3);

  // Validaciones
  const { omitNull } = useValidation();

  // Interfaz gráfica
  return (

    <>
      <Flexbox justify="between" align="end" style={{ background:'#CFD5DC' }}>
        <Tabs value={organizer.currentTab} onChange={tab => organizer.setCurrentTab(tab)} style={{ background:'transparent', opacity:'' }}>
          <Tabs.Item path="/general">General</Tabs.Item>
          <Tabs.Item path="/documentos">Documentos</Tabs.Item>
        </Tabs>
        <Actions>
          { form.isDisabled && <Button icon={iTrash} color="secondary" onClick={form.handleDelete} /> }
          { form.isDisabled && <Button icon={iPen} color="primary" onClick={form.handleEdit}>Editar</Button> }
          { !form.isDisabled && <Button icon={iTimes} color="secondary" onClick={form.handleCancel} /> }
          { !form.isDisabled && <Button icon={iCheck} color="primary" onClick={form.handleAccept}/> }
        </Actions>
      </Flexbox>
      <Routes>
        <Route path={'/general'} element={
          <Box space="medium large">
            <Flexbox direction="column" align="center" style={{ margin:'auto', maxWidth:'960px' }}>
              { form.fields.productos &&
                <Form layout="stacked" disabled={true}>
                  <Form.Field>
                    <Label bold>Siglas</Label>
                    <Input name="productos.siglas" value={omitNull(form.fields.productos.siglas, '')} disabled={form.isDisabled} onChange={form.handleChange} style={{ width:'fit-content' }}/>
                  </Form.Field>
                  <Form.Field>
                    <Label bold>Nombre</Label>
                    <Input name="productos.nombre" value={omitNull(form.fields.productos.nombre, '')} disabled={form.isDisabled} onChange={form.handleChange} />
                  </Form.Field>
                  <Form.Field>
                    <Label bold>Responsable</Label>
                    <Autocomplete collection="personas" source={personas} name="productos.id_personas.id" value={omitNull(form.fields.productos.id_personas ? form.fields.productos.id_personas.id : '', '')} disabled={form.isDisabled} onSelect={form.handleChange} />
                  </Form.Field>
                </Form>
              }
            </Flexbox>
          </Box>
        }>
          
        </Route>
        <Route path={'/documentos'} element={
          <Box space="medium large">
            <Subdata collection={subdata.collection} items={subdata.items} onAddItem={subdata.addItem} onDeleteItem={subdata.deleteItem} disabled={form.isDisabled}/>
          </Box>
        }>
        </Route>
      </Routes>
    </>
  );

}

export default Detail;
