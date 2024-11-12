// APW
// Páginas
// Productos (Overview)
// José Esteva <josesteva@cic.unam.mx>

import React, { useEffect } from 'react';
import { gql } from '@apollo/client';

// Componentes del sistema de diseño
import {
  Actions,
  Button,
  Card,
  Flexbox,
  Grid,
  Pagination,
  Text,
  Title
 } from '@cicunam/sd';

 // Iconos
import iPlus from '@cicunam/sd/icons/plus.svg?react';

// Mecanismos utilizados
import useCollection from '../../../hooks/collection';
import useContext from '../../../hooks/context';
import useWorkflow from '../../../hooks/workflow';

// Estilos locales
// import style from './style.module.css';

// Consulta de datos
export const Query = gql`query ($limit: Int, $page: Int = 1, $filter: productos_filter = {}) {
  productos(limit: $limit, page: $page, filter: $filter) {
    id
    siglas
    nombre
  }
}`;

// Definición de la Interfaz
const Overview = props => {

  // Acceso al contexto de la aplicación
  const { context } = useContext();

  // Gestionar la colección utilizando como punto de partida las variables del contexto
  const collection = useCollection(Query);

  // Flujo de trabajo
  const workflow = useWorkflow('productos');

  // TEMPORAL: Recargar la colección para que se vean los cambios...
  useEffect(() => { collection.refetch() }, [ collection ]);

  // Interfaz gráfica
  return (

    <>
      <Actions>
        <Button icon={iPlus} color="primary" onClick={workflow.createNew}>Agregar</Button>
      </Actions>
      <Flexbox direction="column" align="center" pad="none">
        { collection.items &&
          <Grid style={{padding:'32px'}}>
          { collection.items.map((item, i) => (
            <Card
              key={i}
              type="PRODUCTO"
              code={('0000' + item.id).substr(-4)}
              color="primary"
              onClick={() => workflow.showDetail(item.id)}
              style={{cursor:'pointer', aspectRatio:'1/1'}}
            >
              <Title size="small" align="center">{item.siglas}</Title>
              <Text size="small" align="center">{item.nombre}</Text>
            </Card>
          )) }
          </Grid>
        }
        { (collection.pages > 1) && <Pagination value={context.currentPage.page} count={collection.pages} size={5} onChange={p => collection.selectPage(p)} style={{marginTop:"auto"}}/> }
      </Flexbox>
    </>

  );

}

export default Overview;
