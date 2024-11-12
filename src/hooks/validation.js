// APW
// Mecanismos
// Validaciones

// Definición del hook
const useValidation = () => {

  // Sustituir valores vulos
  const omitNull = (value, alternate) => value ? value : alternate;

  // NOTA: Pueden incluirse aquí otras validaciones...

  return { omitNull }

}

export default useValidation;

// [lock-all/]
