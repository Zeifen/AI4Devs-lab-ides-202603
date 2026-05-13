# Ticket 03: Formulario frontend para anadir candidatos

## Objetivo

Implementar la experiencia frontend para que un reclutador pueda abrir un formulario, capturar los datos de un candidato, cargar su CV y enviarlo al backend con estados claros de validacion, carga, exito y error.

## Contexto

El frontend actual es una aplicacion React 18 con TypeScript creada con Create React App. La pantalla principal en `frontend/src/App.tsx` conserva el contenido inicial de CRA, por lo que este ticket debe introducir una experiencia funcional minima para la historia de usuario sin asumir un dashboard existente mas complejo.

La integracion debe usar el contrato de API definido en `02-backend.md`.

## Alcance

- Mostrar una accion visible para anadir candidato desde la pantalla principal.
- Crear formulario con campos de candidato requeridos por la historia.
- Validar client-side los campos principales antes del envio.
- Permitir seleccion de CV PDF/DOCX.
- Enviar datos al backend.
- Mostrar estados de carga, confirmacion y error.
- Mantener accesibilidad basica y responsive.
- Agregar pruebas con React Testing Library.

Fuera de alcance:

- Implementar autenticacion de reclutadores.
- Crear un dashboard completo de ATS si no existe.
- Implementar autocompletado de educacion o experiencia, salvo dejarlo como mejora futura.
- Cambiar el modelo de datos o la API backend.

## Archivos probables a modificar o crear

- `frontend/src/App.tsx`
- `frontend/src/App.css`
- `frontend/src/components/AddCandidateForm.tsx`
- `frontend/src/components/AddCandidateForm.css`
- `frontend/src/api/candidates.ts`
- `frontend/src/types/candidate.ts`
- `frontend/src/tests/App.test.tsx`
- `frontend/src/tests/AddCandidateForm.test.tsx`
- `frontend/.env.example` si se documenta `REACT_APP_API_BASE_URL`

## Detalles tecnicos de implementacion

- Reemplazar la pantalla inicial de CRA por una vista principal simple tipo dashboard del reclutador.
- Incluir un boton visible con texto claro, por ejemplo `Anadir candidato`.
- Mostrar el formulario al seleccionar la accion. Puede ser una seccion en la misma pagina o una vista condicional simple.
- Campos del formulario:
  - Nombre
  - Apellido
  - Correo electronico
  - Telefono
  - Direccion
  - Educacion
  - Experiencia laboral
  - CV
- Usar inputs controlados o estado local por campo.
- Usar `textarea` para educacion y experiencia laboral si el contenido puede ser largo.
- Validaciones client-side:
  - campos obligatorios no vacios segun contrato backend.
  - email con formato valido.
  - archivo con extension/MIME PDF o DOCX.
  - tamano maximo alineado con el backend.
- Construir `FormData` para enviar campos y archivo al endpoint backend.
- Leer la URL base desde `process.env.REACT_APP_API_BASE_URL` con fallback a `http://localhost:3010`.
- Mostrar:
  - estado de envio deshabilitando submit.
  - mensaje de exito al recibir respuesta exitosa.
  - mensaje de error entendible si falla validacion, servidor o red.
- Accesibilidad:
  - cada campo debe tener `label` asociado.
  - errores deben ser visibles junto al campo o en resumen accesible.
  - el boton submit debe indicar estado de carga sin depender solo de color.
  - mantener navegacion por teclado.
- Responsive:
  - formulario usable en mobile y desktop.
  - evitar texto o controles que se superpongan.

## Criterios de aceptacion tecnicos

- La pantalla principal muestra una accion visible para anadir candidato.
- Al activar la accion, se muestra un formulario con todos los campos requeridos por la historia.
- El formulario valida campos obligatorios y formato de email antes de enviar.
- El selector de archivo comunica y valida formatos PDF/DOCX.
- El envio usa `FormData` y llama al endpoint definido por backend.
- Durante el envio, el usuario ve estado de carga y se evita doble submit.
- Cuando el backend responde correctamente, se muestra confirmacion de candidato creado.
- Cuando ocurre un error, se muestra un mensaje claro sin romper la UI.
- Los campos tienen labels y son operables con teclado.
- La UI es responsive en anchos moviles y desktop.

## Pruebas recomendadas

- Test con React Testing Library para verificar que el boton `Anadir candidato` se renderiza.
- Test para mostrar el formulario al activar la accion.
- Test para verificar que existen labels para todos los campos.
- Test para validar email invalido sin llamar a `fetch`.
- Test para validar campos obligatorios vacios.
- Test para rechazar archivo con extension o MIME no permitido.
- Test para envio exitoso mockeando `fetch` y verificando mensaje de confirmacion.
- Test para error de servidor o red mockeando `fetch` y verificando mensaje de error.
- Test para verificar que el boton submit se deshabilita durante el envio.

## Dependencias con otros tickets

- Depende de `02-backend.md` para conocer endpoint, campos obligatorios, limite de archivo y estructura de errores.
- Depende indirectamente de `01-database.md` porque el contrato backend refleja el modelo persistente.
- Puede comenzar con mocks si el contrato de `02-backend.md` ya esta definido, pero la validacion final requiere backend funcionando.

## Riesgos o decisiones tecnicas

- Si el dashboard real se implementa despues, esta vista inicial podria necesitar reubicarse o integrarse con navegacion.
- Las validaciones client-side no reemplazan las del backend; deben mantenerse alineadas para evitar mensajes contradictorios.
- El manejo de archivos depende del contrato final del backend, especialmente nombre del campo de archivo y limite de tamano.
- Sin autenticacion, cualquier usuario con acceso a la app podria abrir el formulario; debe quedar documentado como restriccion de esta iteracion.
- Autocompletado de educacion y experiencia queda como mejora futura porque no existen datos preexistentes ni endpoints de catalogo.

## Definicion de terminado

El ticket esta terminado cuando el frontend permite abrir, completar y enviar el formulario de candidato, valida entradas comunes antes del envio, maneja CV PDF/DOCX, muestra estados de exito/error y cuenta con pruebas automatizadas para los flujos principales.

## Checklist

- [x] La pantalla principal contiene una accion visible para anadir candidato.
- [x] El formulario incluye nombre, apellido, email, telefono, direccion, educacion, experiencia laboral y CV.
- [x] Cada campo tiene label asociado verificable.
- [x] El formulario valida campos obligatorios antes del envio.
- [x] El formulario valida formato de email antes del envio.
- [x] El selector de CV acepta y valida PDF/DOCX segun contrato backend.
- [x] El submit envia `FormData` al endpoint backend configurado.
- [x] El boton de envio se deshabilita durante carga para evitar doble submit.
- [x] La UI muestra confirmacion al crear candidato exitosamente.
- [x] La UI muestra un mensaje claro ante errores de validacion, servidor o red.
- [x] Existen pruebas React Testing Library para render, validaciones, exito y error.
