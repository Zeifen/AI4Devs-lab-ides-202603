# Meta prompt: planificacion tecnica para "Anadir Candidato"

Actua como Senior Fullstack Engineer. Tu tarea es leer la historia de usuario en `docs/user-stories/add-candidate.md`, inspeccionar el repositorio y generar tres tickets tecnicos separados en archivos Markdown.

No implementes codigo de producto en este paso. Solo crea los tickets de planificacion tecnica indicados abajo.

## Contexto del repositorio

Este repositorio es una aplicacion full-stack llamada LTI / Talent Tracking System.

Stack y estructura actual detectada:

- Frontend: React 18 con TypeScript, creado con Create React App.
- Backend: Node.js con Express y TypeScript.
- Base de datos: PostgreSQL con Prisma ORM.
- Testing frontend: Jest y React Testing Library.
- Testing backend: Jest, ts-jest y Supertest.
- Backend principal: `backend/src/index.ts`.
- Esquema Prisma: `backend/prisma/schema.prisma`.
- Frontend principal: `frontend/src/App.tsx`.
- Configuracion Docker de PostgreSQL: `docker-compose.yml`.

Estado actual relevante:

- El backend expone una ruta base `GET /` y crea una instancia de `PrismaClient`.
- El modelo Prisma existente es `User`; aun no existe un modelo de candidato.
- El frontend conserva la pantalla inicial de Create React App.
- La estructura es sencilla; evita sobrearquitectura, pero separa responsabilidades cuando aporte claridad.
- Hay tests existentes, aunque pueden requerir ajuste al comportamiento real antes de extenderlos.

## Historia de usuario a cubrir

Fuente: `docs/user-stories/add-candidate.md`

Resumen funcional:

- Como reclutador, quiero anadir candidatos al sistema ATS para gestionar sus datos y procesos de seleccion.
- Debe existir una accion visible desde el dashboard del reclutador para anadir un candidato.
- El formulario debe capturar nombre, apellido, correo electronico, telefono, direccion, educacion y experiencia laboral.
- Deben validarse campos obligatorios y formato de correo.
- Debe permitirse cargar CV en PDF o DOCX.
- Debe mostrarse confirmacion cuando el candidato sea creado.
- Deben mostrarse mensajes de error adecuados ante fallos.
- La funcionalidad debe ser accesible, responsive y compatible con navegadores modernos.
- Debe considerarse seguridad y privacidad de datos del candidato.

## Archivos que debes crear

Crea exactamente estos tres archivos:

1. `docs/tickets/add-candidate/01-database.md`
2. `docs/tickets/add-candidate/02-backend.md`
3. `docs/tickets/add-candidate/03-frontend.md`

No crees otros tickets para esta historia, salvo que el usuario lo pida explicitamente.

## Separacion esperada de tickets

### Ticket 01: Database

Debe cubrir el diseno de persistencia necesario para candidatos y CV:

- Modelo o modelos Prisma necesarios.
- Campos del candidato, tipos, obligatoriedad, restricciones e indices.
- Estrategia para metadata de archivo de CV, sin asumir almacenamiento binario en base de datos salvo que lo justifiques.
- Migracion Prisma y regeneracion del cliente.
- Consideraciones de privacidad, datos sensibles y validaciones a nivel de datos.
- Datos de prueba o seed solo si tiene sentido para validar manualmente.

### Ticket 02: Backend

Debe cubrir la API para crear candidatos:

- Endpoint o endpoints Express necesarios.
- Contrato de request/response.
- Validacion server-side de campos obligatorios, email y archivo permitido.
- Manejo de carga de CV PDF/DOCX, limites de tamano y errores.
- Uso de Prisma para persistir el candidato.
- Respuestas HTTP adecuadas para exito, validacion, conflicto y error interno.
- Pruebas con Jest/Supertest.
- Dependencia explicita del ticket de base de datos.

### Ticket 03: Frontend

Debe cubrir la experiencia de usuario para reclutadores:

- Accion visible para anadir candidato desde la vista principal o dashboard existente.
- Formulario accesible y responsive.
- Campos requeridos por la historia de usuario.
- Validacion client-side complementaria.
- Carga de CV con restricciones visibles para PDF/DOCX.
- Integracion con la API del backend.
- Estados de carga, exito y error.
- Pruebas con React Testing Library.
- Dependencia explicita de los tickets de base de datos y backend cuando aplique.

## Estructura obligatoria de cada ticket

Cada archivo Markdown debe incluir exactamente estas secciones, en este orden:

1. `# Titulo`
2. `## Objetivo`
3. `## Contexto`
4. `## Alcance`
5. `## Archivos probables a modificar o crear`
6. `## Detalles tecnicos de implementacion`
7. `## Criterios de aceptacion tecnicos`
8. `## Pruebas recomendadas`
9. `## Dependencias con otros tickets`
10. `## Riesgos o decisiones tecnicas`
11. `## Definicion de terminado`
12. `## Checklist`

## Reglas de contenido

- Escribe los tickets en espanol claro y tecnico.
- Mantente alineado con el stack actual del repositorio.
- No propongas frameworks o librerias nuevas si no son necesarias.
- Si recomiendas una dependencia nueva, justificala y menciona el costo tecnico.
- No mezcles implementacion de frontend en el ticket backend ni cambios de base de datos en el ticket frontend.
- Incluye nombres de archivos probables, pero acepta que el implementador pueda ajustar la estructura si el codigo evoluciona.
- Prioriza una solucion incremental, verificable y compatible con el estado actual del repositorio.
- Senala decisiones abiertas cuando no haya suficiente informacion, por ejemplo almacenamiento definitivo del CV.
- Evita checklist genericos; cada punto debe mapearse a una validacion concreta del ticket.

## Uso del Checklist

El checklist final de cada ticket debe usarse como herramienta de validacion, no como una lista que se marca automaticamente como completada.

Cada punto del checklist solo puede marcarse como completado si:

- Fue cubierto por el ticket correspondiente.
- Existe una forma clara de verificarlo mediante codigo, test automatizado o validacion manual.
- La verificacion esta descrita o es evidente desde los criterios de aceptacion o pruebas recomendadas.

No marques ningun punto como completado al crear los tickets. Todos los puntos deben iniciar sin marcar, usando el formato:

```md
- [ ] Punto verificable
```

## Calidad esperada

Antes de terminar, revisa que:

- Los tres tickets existen en las rutas exactas solicitadas.
- Cada ticket contiene todas las secciones obligatorias.
- Las dependencias entre tickets son coherentes.
- Los criterios de aceptacion tecnicos son verificables.
- Las pruebas recomendadas cubren casos positivos, validaciones y errores principales.
- El checklist no esta marcado automaticamente.
- No se implemento codigo de aplicacion.
