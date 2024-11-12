// APW
// Plantillas
// Subdata (Datos asociados)
// José Esteva <josesteva@cic.unam.mx>

// NOTA: Sólo incluir los controles para borrar o agregar si se incluyen las funciones onDeleteItem y/o onAddItem

// Dependencias
import { useState } from 'react';
import { gql, useLazyQuery, useQuery } from '@apollo/client';

// Componetes
import {
  Box,
  Icon,
  Label,
  List,
  Select
} from '@cicunam/sd';

// Iconos
import iFile from '@cicunam/sd/icons/file.svg?react';
import iUpload from '@cicunam/sd/icons/upload.svg?react';

// Plantillas
import Autocomplete from '../Autocomplete';

// Mecanismos
import useAutocomplete from '../../hooks/autocomplete';
import useContext from '../../hooks/context';
import { isField } from '@apollo/client/utilities';

// Definición de la plantilla
const Subdata = ({ collection, items, onAddItem, onDeleteItem, disabled, ...other }) => {

  // Contexto de la aplicación
  const { context } = useContext();

  // Estado del componente
  const [persona, setPersona] = useState(0);
  const [documento, setDocumento] = useState(0);
  const [pdf, setPdf] = useState({});

  // Gestión de catálogos grandes
  const personas = useAutocomplete('personas', 'id', 'nombre');

  // Consulta para obtener información de los catálogos (pequeños)
  const { data } = useQuery (
    gql`query {
      documentos (filter: {${collection}: {_eq: true}}, sort: "nombre") {
        id
        nombre
      }
    }`
  );

  // Consulta para buscar una persona
  const [ findPersona ] = useLazyQuery (
    gql`query ($id: ID = "") {
      persona: personas_by_id (id: $id) {
        id
        nombre
      }
    }`
  );

  // Consulta para buscar un documento
  const [ findDocumento ] = useLazyQuery (
    gql`query ($id: ID = "") {
      documento: documentos_by_id (id: $id) {
        id
        nombre
      }
    }`
  );

  // Gestor de evento: Agregar un elemento a la lista
  const addDocumento = async () => {

    // Obtener los datos completos del elemento que se va a agregar
    const { data: { persona: personaObject } } = await findPersona({ variables: { id: persona || -1 } });
    const { data: { documento: documentoObject } } = await findDocumento({ variables: { id: documento || -1 } });

    // Actualizar la lista de elementos
    if ( personaObject && documentoObject ) {

      onAddItem({ id: null, id_personas: { id: personaObject.id, nombre: personaObject.nombre }, id_documentos: { id: documentoObject.id, nombre: documentoObject.nombre }, pdf: pdf }); 

    }

    clearForm();

  }

  // NOTA: Esto podría ir dentor de un mecanismo  
  // Seleccionar un archivo utilizando el diálogo nativo del navegador.
  const getFile = () => {

    var input = document.createElement('input');

    input.type = 'file';

    input.onchange = e => {
      var file = e.target.files[0];
      setPdf(file);
    }

    input.click();

  }

  // Limpiar el formulario
  const clearForm = () => {

    setPersona(0);
    personas.setInput('');  // Necesario para borrar el campo

    setDocumento(0);
    setPdf({});

  }

  // Interfaz gráfica
  return (
    <>
    <List disabled={disabled} {...other}>
      <List.Head>
        <List.Label>Autor</List.Label>
        <List.Label>Tipo</List.Label>
        <List.Label style={{ whiteSpace: 'nowrap', width:'1px' }}>PDF</List.Label>
      </List.Head>
      <List.Body>
        { items && items.map((item, i) => (
          !item.deleted &&
          <List.Item key={i} data-index={i} data-id={item.id} deleteItem={onDeleteItem}>
            <List.Data>{item.id_personas && item.id_personas.nombre}</List.Data>
            <List.Data>{item.id_documentos && item.id_documentos.nombre}</List.Data>
            <List.Data>
              {
                item.pdf && Object.keys(item.pdf).length > 0 ?
                <a target="_blank" rel="noreferrer" href={item.pdf ? `${context.product.api}/assets/${item.pdf.id }` : ''}>
                  <Icon src={iFile} size="small" color="primary"/>
                </a> : ( item.pdf instanceof File ? <Icon src={isField} size="small" color="neutral" /> : <></> )
              }
            </List.Data>
          </List.Item>
        ))}
      </List.Body>
      <List.Input addItem={addDocumento}>
        <List.Field>
          <Autocomplete collection="personas" source={personas} name="persona" value={persona} onSelect={e => setPersona(e.target.value)} />
        </List.Field>
        <List.Field>
          <Select value={documento} onChange={e => setDocumento(e.target.value)}>
            <Select.Option value=''></Select.Option>
            { data && data.documentos.map((documento, i) => (
              <Select.Option key={i} value={documento.id}>{documento.nombre}</Select.Option>
            ))}
          </Select>
        </List.Field>
        <List.Field>
          <Icon src={iUpload} size="small" onClick={getFile} />
        </List.Field>
      </List.Input>
    </List>
    { pdf.name && <Box color="secondary" hue="light" space="small medium" style={{ margin:'8px 12px', textAlign:'right' }}><Label size="small">Se seleccionó el archivo: <strong>{pdf.name}</strong></Label></Box> }
    </>
  )

}

export default Subdata;

// [lock-all/]
