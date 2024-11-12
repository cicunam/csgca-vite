// APW
// Mecanismos (hooks)
// Login mecanismo

// Depencencias
import { useState } from 'react';
import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";

// Mecanismos utilizados
import useContext from './context';

const LOGIN_MUTATION = gql`
  mutation MyMutation($email: String!, $password: String!) {
    auth_login(email: $email, password: $password, mode: json) {
      access_token
      expires
      refresh_token
    }
  }
`;

const useLogin = () => {

  const { setContext } = useContext();
  
  const [login] = useMutation(LOGIN_MUTATION, {
    context: {
      clientName: 'system'
    }
  });

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    try {
      const response = await login({
        variables: {
          email: email,
          password: password
        }
      });
      const { access_token, refresh_token } = response.data.auth_login;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      setContext({ key: 'isLoggedIn', value: true });
      window.history.pushState({}, '', '/#/');
    } catch (err) {
      if (err.graphQLErrors && err.graphQLErrors.some(e => e.extensions.code === 'INVALID_CREDENTIALS')) {
        setErrorMessage("Contraseña o correo incorrectos.");
      } else {
        setErrorMessage("Ocurrió un error inesperado. Por favor, inténtelo de nuevo.");
      }
    }
  };

  return { email, password, errorMessage, setEmail, setPassword, handleLogin };

};

export default useLogin;

// [lock-all/]