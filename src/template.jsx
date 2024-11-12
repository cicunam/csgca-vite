// APW
// Enrutador

// NOTA 1: Utilizar el contexto de la aplicación para obtener el nombre de la página activa
//         y actualizar los componentes <Navigation> y <Heading>

// NOTA 2: Buscar la forma de incluir la página inicial sin componentes (Overview, Detail, Info)
//         desde el archivo de configuración.

// [lock:plantilla]

import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';

// Componentes del sistema de diseño
import {
  Aside,
  Box,
  Flexbox, // Reemplazarlo por un componente <Heading> (que todavía no programo)
  Header,
  Menu,
  Navigation,
  Title
} from '@cicunam/sd';

import iInfo from '@cicunam/sd/icons/info-circle.svg?react';
import iTimes from '@cicunam/sd/icons/times.svg?react';

// Mecanismos utilizados
import useContext from './hooks/context';
import useWindow from './hooks/window';

// Pagina principal
import Inicio from './pages/Inicio/Overview';

// Plantilla de la aplicación
const Template = props => {

  // Observar cambios en el tamaño del área de trabajo
  useWindow('main');

  // Enrutador
  const navigate = useNavigate();
  const location = useLocation();

  // Contexto
  const { context, setContext } = useContext();

  // Estado
  const [icons, setIcons] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Cambiar de ruta
  const changeRoute = (index, route) => {

    // Hacer que la variable currentPage apunte a la página seleccionada
    setContext({ key: 'currentPage', value: context.pages[index] });

    // Cambiar la ruta
    navigate(route, { replace: true });

  }

  // Borrar el token de local storage y del contexto
  const logout = () => {

    localStorage.removeItem('access_token');
    setContext({key: 'isLoggedIn', value: false});

  }

  // Importar los iconos de los módulos
  useEffect(() => {

    const importarIconos = async () => {

      let newIcons = [];

      for (const page of context.pages) {

        // let { default:svg } = await import(`@cicunam/sd/icons/${page.icon ?? 'square'}.svg?react`);
        let { default:svg } = await import(`../node_modules/@cicunam/sd/dist/icons/${page.icon ?? 'square'}.svg?react`);
        newIcons.push(svg);
      }

      setIcons(newIcons);
          
    };

    importarIconos();

  }, []);  // eslint-disable-line

  // Actualizar la variable currentPage cada vez que cambie la ruta
  useEffect(() => {

    const subroutes = location.pathname.split('/');
    
    for (let subroute of subroutes) {

      // Encuentra el índice de la página que tiene una ruta que coincide con el elemento actual de subroutes
      const currentIndex = context.pages.findIndex(page => page.route === `/${subroute}`);
      
      // Si se encuentra un índice válido (no es -1), actualiza currentIndex
      if (currentIndex !== -1) {

        setContext({ key: 'currentPage', value: context.pages[currentIndex] });
        break; // Detener el bucle ya que hemos encontrado una coincidencia
      
      }
    }

  }, [ location.pathname ]); // eslint-disable-line

  // Interfaz gráfica
  return (

    <>
      <Header color="primary" hue="dark"><Title role="h1" size="medium" color="white">{context && context.product.name}</Title></Header>
      <div className="layout">
        <Navigation>
          <Flexbox style={{height: "100%"}} direction="column" justify="between">
          <div>
            {context.pages.map((page, i) => {
              if (!page.item) return;
              return <Menu.Item key={i} icon={icons[i]} onClick={() => changeRoute(i, page.route)} title={page.label}>{page.label}</Menu.Item>
            })}
          </div>
          <Menu.Item icon={iTimes} onClick={logout} title="Cerrar la sesión">Cerrar la sesión</Menu.Item>
          </Flexbox>
        </Navigation>
        <main>
          <Box color="secondary" hue="light" pad="small large" style={{ height: '64px' }}>
            <Flexbox as="header" direction="row" align="center" justify="start">
              <Title role="h1" size="medium">{context.currentPage.summary}</Title>
            </Flexbox>
          </Box>
          <Routes>
            <Route path="/" element={<Inicio />} />
            { // eslint-disable-next-line
            context.pages.map((page, i) => {
              if (page.components.includes("Detail")) {
                let DComponent = lazy(() => import(/* @vite-ignore */`./pages/${page.module}/Detail`));
                return <Route key={i} path={`${page.route}/:id/*`} element={<Suspense><DComponent id={i} /></Suspense>}/>
              }
            })}
            { // eslint-disable-next-line
            context.pages.map((page, i) => {
              if (page.components.includes("Overview")) {
                let DComponent = lazy(() => import(/* @vite-ignore */`./pages/${page.module}/Overview`));
                return <Route key={i} path={`${page.route}`} element={<Suspense><DComponent /></Suspense>}/>
              }
            })}
          </Routes>
        </main>
        <Aside icon={iInfo} color="secondary" style={{ maxWidth: '20%' }}>
          <Routes>
            { // eslint-disable-next-line
              context.pages.map((page, i) => {
                if (page.components.includes("Info")) {
                  // let DynamicComponent = require('./' + page.module + '/Info').default;
                  // return <Route key={i} path={page.route} render={() => <DynamicComponent />} />
                  let DynComponent = lazy(() => import(/* @vite-ignore */`./pages/${page.module}/Info`));
                  return <Route key={i} path={`${page.route}`} element={<Suspense><DynComponent /></Suspense>}/>
                }
              })}
          </Routes>
        </Aside>
      </div>
    </>

  );

}

export default Template;

// [/lock:plantilla]
