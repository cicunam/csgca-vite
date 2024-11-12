// APW
// Aplicación principal

// [lock:indice]

// Dependencias externas
import React, { createContext, StrictMode, useReducer } from 'react';
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { ApolloClient, ApolloLink, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import { onError } from "@apollo/client/link/error";
import { setContext as apolloSetContext } from '@apollo/client/link/context';
import { set } from 'lodash';

// Estilos globales
import '@cicunam/sd/styles';

// Configuración
import config from './config.json';

// Plantilla general
import Template from './template';

// Página de identificación
import Login from "./templates/Login";

// Estilos globales
import './style.css';

// Configuración de la conexión HTTP
const httpLink = createHttpLink({
  uri: config.product.api + '/graphql',
  fetchOptions: {
    mode: 'cors'
  }
});

// Configuración de la conexión HTTP
const httpLinkSystem = createHttpLink({
  uri: config.product.api + '/graphql/system',
  fetchOptions: {
    mode: 'cors'
  }
});

// Encabezados HTTP
const authLink = apolloSetContext((_, { headers }) => {

  // Obtener el token de localStorage
  const token = localStorage.getItem('access_token');

  return {
    headers: {
      ...headers,
      authorization: `Bearer ${token}`,
    }
  }
});


// Gestor de errores 
const errorLink = onError(({ graphQLErrors }) => {

  console.error("Error");

  if (graphQLErrors && graphQLErrors.find(({ message }) => message.includes("401") || message.includes("expired"))) {

    localStorage.removeItem('access_token');
    window.location.reload();
  
  }

});

// Acceso a los datos
const api = new ApolloClient({

  link: ApolloLink.from([
    errorLink,
    ApolloLink.split(operation => operation.getContext().clientName === 'system',
      httpLinkSystem,
      authLink.concat(httpLink)
    )
  ]),  

  cache: new InMemoryCache()

});

// Contexto de la aplicación
export const Context = createContext();

// Función para actualizar el estado
const reducer = (context, action) => {

  const newContext = { ...set(context, action.key, action.value) }

  return newContext; // NOTA: Es necesario regresar un objeto nuevo para que useContext() detecte el cambio!

};

// Aplicación principal
const App = () => {

  // Obtener el token de localStorage
  const token = localStorage.getItem('access_token');

  // Estado de la aplicación
  const [ context, setContext ] = useReducer(reducer, config);

  // Raíz de la aplicación
  return (
    <ApolloProvider client={api}>
      <Context.Provider value={{ context, setContext }}>
        <BrowserRouter>
        { token ? <Template /> : <Login /> }
        </BrowserRouter>
      </Context.Provider>
    </ApolloProvider>
  )
}

// Desplegar aplicación principal
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)

// [/lock:indice]