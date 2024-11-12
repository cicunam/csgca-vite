// APW
// Páginas
// Personas (Overview)
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
  Label,
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
const Query = gql`query ($limit: Int, $page: Int = 1, $filter: personas_filter = {}) {
  personas(limit: $limit, page: $page, filter: $filter) {
    id
    id_tipos { nombre }
    nombre
    correo
    edad
  }
}`;

// Definición de la Interfaz
const Overview = props => {

  // Acceso al contexto de la aplicación
  const { context } = useContext();

  // Gestionar la colección utilizando como punto de partida las variables del contexto
  const collection = useCollection(Query);

  // Flujo de trabajo
  const workflow = useWorkflow('personas');

  /// TEMPORAL: Recargar la colección para que se vean los cambios...
  useEffect(() => { collection.refetch() }, [ collection ]);

  // Interfaz gráfica
  return (

    <article>
      <Actions>
        <Button icon={iPlus} color="primary" onClick={workflow.createNew}>Agregar</Button>
      </Actions>
      <Flexbox direction="column" align="center" pad="none">
        { collection.items &&
          <Grid style={{ padding: '32px' }}>
            {collection.items.map((item, i) => (
              <Card
                key={i}
                type={item.id_tipos && item.id_tipos.nombre ? item.id_tipos.nombre : 'PERSONA'}
                code={('0000' + item.id).substr(-4)}
                color="secondary"
                onClick={() => workflow.showDetail(item.id)}
                style={{ cursor: 'pointer', aspectRatio: '1/1' }}
              >
                <Title size="small" align="center">
                  {item.nombre}
                </Title>
                <Text size="small" align="center">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </Text>
                <Label size="small" bold>{item.correo}</Label>
                <Label size="small" bold>{item.edad}</Label>
              </Card>
            ))}
          </Grid>
        }
        {(collection.pages > 1) && <Pagination value={context.currentPage.page} count={collection.pages} size={5} onChange={value => collection.selectPage(value)} style={{ marginTop: "auto" }} />}
      </Flexbox>

    </article>

  );

}

export default Overview;
