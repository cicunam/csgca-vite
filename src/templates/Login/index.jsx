// APW
// Plantillas
// Login (Pantalla de Login)
// Raúl Salinas <raul.teo.salinas@cic.unam.mx>

// Componetes
import {
  Button,
  Form,
  Image,
  Input,
  Label,
  Title,
} from '@cicunam/sd';

// Mecanismos utilizados
import useContext from '../../hooks/context';
import useLogin from "../../hooks/login";

// Estilos locales
import style from './style.module.css';

const Login = () => {

  // Contexto de la aplicación
  const { context } = useContext();

  // Control de acceso
  const { email, setEmail, password, setPassword, errorMessage, handleLogin } = useLogin();

  // Interfaz gráfica
  return (
    <div className={style.container}>
      <div className={style.columnProductInfo} style={{padding:'24px'}}>
          <Image src="src/assets/cic-logo-primary.png" size="medium" width="50%"/>
          <Title style={{textAlign: "center"}} color="white" size="medium" >{context && context.product.name}</Title>
      </div>
      <div className={style.columnLoginForm}>
        <Form style={{background: "transparent"}}>
        <Title role="h1" accent="bold">Inicio de Sesión</Title>
        <Label>Por favor introduzca las credenciales otorgadas por el Departamento de Sistemas de la Coordinación de la Investigación Científica.</Label>
        
          <Form.Field style={{ flexDirection: "column", justifyContent: "center", gap: 5, alignItems: "flex-start"}}>
            <Label size="small" color="neutral" bold>Correo</Label>
            <Input placeholder="Introduzca su correo electrónico" type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', maxWidth: "400px" }} />
          </Form.Field>
          <Form.Field style={{ flexDirection: "column", justifyContent: "center", gap: 5, alignItems: "flex-start"}}>
            <Label size="small" color="neutral" bold>Contraseña</Label>
            <Input placeholder="Introduzca su contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', maxWidth: "400px" }} />
          </Form.Field>

          <Button style={{marginLeft: "8px"}} color="secondary" onClick={handleLogin}>Iniciar Sesión</Button>
          
          <Label style={{marginLeft: "8px", color: "red"}} size="small" bold>{errorMessage}</Label>
          
          <Label style={{marginTop: "20px", marginLeft: "8px"}} size="small" bold>Para cualquier duda o ayuda de soporte técnico comunicarse a <a href="mailto:sistemas@cic.unam.mx">sistemas@cic.unam.mx</a></Label>
        </Form>

      </div>
    </div>
  )
}

export default Login;
