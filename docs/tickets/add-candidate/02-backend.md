# Ticket 02: API para crear candidatos

## Objetivo

Implementar el backend necesario para que el sistema reciba, valide y persista candidatos nuevos, incluyendo metadata del CV cargado, mediante una API Express compatible con el modelo Prisma de candidatos.

## Contexto

El backend actual esta en `backend/src/index.ts`, usa Express, TypeScript y Prisma. La historia de usuario requiere procesar el formulario de alta de candidato, validar datos, aceptar CV en PDF o DOCX, confirmar la creacion y manejar errores.

Este ticket debe construirse sobre el modelo de datos definido en `01-database.md`.

## Alcance

- Crear endpoint para alta de candidatos.
- Definir contrato de request y response.
- Validar campos obligatorios, formato de email y tipo de archivo.
- Persistir el candidato con Prisma.
- Manejar errores de validacion, duplicados y fallos internos.
- Agregar pruebas automatizadas con Jest y Supertest.

Fuera de alcance:

- Crear o modificar el formulario React.
- Disenar el modelo Prisma.
- Implementar autenticacion de reclutadores, salvo que exista en el repo al momento de implementar.

## Archivos probables a modificar o crear

- `backend/src/index.ts`
- `backend/src/routes/candidates.ts`
- `backend/src/services/candidateService.ts`
- `backend/src/validators/candidateValidator.ts`
- `backend/src/middleware/uploadCandidateCv.ts`
- `backend/src/tests/candidates.test.ts`
- `backend/package.json`
- `backend/.env.example` si se agrega configuracion de uploads
- `backend/uploads/cv/.gitkeep` si se usa almacenamiento local en desarrollo

## Detalles tecnicos de implementacion

- Agregar `app.use(express.json())` si no existe, cuidando que no interfiera con requests multipart.
- Crear endpoint recomendado: `POST /api/candidates`.
- Usar `multipart/form-data` si el CV se envia junto al formulario.
- Considerar agregar `multer` para procesar uploads. Es una dependencia nueva razonable porque Express no maneja multipart de forma nativa; su costo tecnico es configurar limites, filtros de MIME y almacenamiento.
- Limitar tamano del CV, por ejemplo 5 MB o 10 MB, y documentar el valor elegido.
- Aceptar solo:
  - `application/pdf`
  - MIME valido de DOCX: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
  - DOC legacy solo si se decide soportarlo explicitamente: `application/msword`
- Validar server-side:
  - `firstName`, `lastName`, `email`, `education` y `workExperience` no vacios.
  - `email` con formato valido.
  - `phone` y `address` segun obligatoriedad definida en `01-database.md`.
  - archivo presente si el producto decide que CV es obligatorio; si queda opcional, validar tipo solo cuando exista.
- Persistir con `prisma.candidate.create`.
- Respuesta exitosa recomendada:

```json
{
  "candidate": {
    "id": 1,
    "firstName": "Ada",
    "lastName": "Lovelace",
    "email": "ada@example.com"
  },
  "message": "Candidate created successfully"
}
```

- Codigos HTTP recomendados:
  - `201 Created` para candidato creado.
  - `400 Bad Request` para datos invalidos o archivo no permitido.
  - `409 Conflict` para email duplicado.
  - `500 Internal Server Error` para fallos inesperados.
- Evitar devolver rutas internas absolutas del archivo al frontend.
- Evitar loguear datos sensibles o contenido del CV.
- Ajustar la exportacion de `app` para que las pruebas puedan importar Express sin iniciar multiples servidores si fuera necesario.

## Criterios de aceptacion tecnicos

- Existe un endpoint `POST /api/candidates` o equivalente documentado.
- El endpoint persiste candidatos usando Prisma y el modelo `Candidate`.
- El endpoint valida campos obligatorios y email antes de persistir.
- El endpoint rechaza archivos con tipo distinto a PDF/DOCX.
- El endpoint aplica limite de tamano al archivo cargado.
- El endpoint responde `201` con payload de confirmacion al crear un candidato.
- El endpoint responde `400` ante payload invalido.
- El endpoint responde `409` cuando el email ya existe.
- Los errores internos devuelven un mensaje controlado sin exponer stack traces ni datos sensibles.

## Pruebas recomendadas

- Test con Supertest para crear candidato valido sin CV si el CV queda opcional.
- Test con Supertest para crear candidato valido con CV PDF.
- Test para rechazar email invalido.
- Test para rechazar campos obligatorios vacios.
- Test para rechazar archivo con MIME no permitido.
- Test para rechazar archivo sobre el limite de tamano.
- Test para email duplicado y respuesta `409`.
- Test para verificar que la respuesta no expone `cvStoragePath` absoluto ni datos internos.
- Mockear Prisma o usar una base de datos de prueba, segun las convenciones que existan al implementar.

## Dependencias con otros tickets

- Depende de `01-database.md`, porque requiere el modelo `Candidate` y el cliente Prisma regenerado.
- Bloquea parcialmente `03-frontend.md`, porque el frontend necesita contrato estable de API.

## Riesgos o decisiones tecnicas

- `multer` agrega una dependencia nueva, pero reduce riesgo frente a parseo manual de multipart.
- El almacenamiento local de CV es suficiente para desarrollo, pero debe aislarse para que pueda migrarse a storage externo.
- Los tests de upload pueden requerir fixtures pequenos de PDF/DOCX o buffers simulados.
- La app actual tiene una ruta base simple y tests posiblemente desalineados con la respuesta real; se debe evitar mezclar esa correccion con cambios no relacionados salvo que bloquee las pruebas.
- Si no existe autenticacion, el endpoint quedara abierto en esta iteracion; se debe documentar como riesgo de producto/seguridad.

## Definicion de terminado

El ticket esta terminado cuando la API permite crear candidatos validos, rechaza entradas invalidas y archivos no permitidos, persiste mediante Prisma, devuelve respuestas HTTP consistentes y cuenta con pruebas automatizadas que cubren exito, validaciones y errores principales.

## Checklist

- [x] Existe un endpoint backend verificable para crear candidatos.
- [x] El endpoint usa el modelo `Candidate` mediante Prisma.
- [x] Los campos obligatorios se validan antes de persistir.
- [x] El formato de email se valida server-side.
- [x] El backend acepta CV PDF/DOCX segun la regla definida.
- [x] El backend rechaza tipos de archivo no permitidos.
- [x] El backend aplica un limite de tamano al CV.
- [x] El email duplicado devuelve una respuesta de conflicto verificable.
- [x] Las respuestas de error no exponen stack traces ni datos sensibles.
- [x] Existen pruebas Jest/Supertest para exito, validaciones y errores principales.
