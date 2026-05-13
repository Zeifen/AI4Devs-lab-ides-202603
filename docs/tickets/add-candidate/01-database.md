# Ticket 01: Modelo de datos para candidatos

## Objetivo

Definir la persistencia necesaria para registrar candidatos en el ATS, incluyendo datos personales, informacion profesional y metadata del CV cargado, usando Prisma y PostgreSQL.

## Contexto

La historia de usuario requiere que un reclutador pueda anadir candidatos con nombre, apellido, correo electronico, telefono, direccion, educacion, experiencia laboral y CV en formato PDF o DOCX.

El repositorio ya usa Prisma con PostgreSQL en `backend/prisma/schema.prisma`. Actualmente solo existe el modelo `User`, por lo que se debe agregar el modelo de candidato sin romper el esquema actual.

## Alcance

- Crear el modelo Prisma necesario para representar candidatos.
- Definir campos obligatorios, opcionales, tipos y restricciones.
- Definir metadata del CV sin almacenar el binario en la base de datos.
- Preparar migracion Prisma y regeneracion del cliente.
- Documentar decisiones sobre datos sensibles, indices y validaciones persistentes.

Fuera de alcance:

- Implementar endpoints HTTP.
- Implementar subida fisica del archivo.
- Implementar UI del formulario.

## Archivos probables a modificar o crear

- `backend/prisma/schema.prisma`
- `backend/prisma/migrations/<timestamp>_add_candidate_model/migration.sql`
- `backend/package.json` si se decide agregar un script de seed o ajustar comandos existentes
- `backend/prisma/seed.ts` solo si se justifica agregar datos de prueba

## Detalles tecnicos de implementacion

- Agregar un modelo `Candidate` en Prisma.
- Campos recomendados:
  - `id Int @id @default(autoincrement())`
  - `firstName String`
  - `lastName String`
  - `email String @unique`
  - `phone String?`
  - `address String?`
  - `education String`
  - `workExperience String`
  - `cvFileName String?`
  - `cvMimeType String?`
  - `cvStoragePath String?`
  - `cvSizeBytes Int?`
  - `createdAt DateTime @default(now())`
  - `updatedAt DateTime @updatedAt`
- Mantener `email` unico para evitar candidatos duplicados por correo.
- Usar campos de texto simples para `education` y `workExperience` en esta iteracion, porque no existen catalogos ni tablas normalizadas en el repo.
- Guardar solo metadata y ruta del CV en base de datos. El archivo debe almacenarse fuera de PostgreSQL, por ejemplo en carpeta local controlada por backend durante desarrollo o en storage externo en una fase futura.
- Evaluar si `phone` y `address` deben ser opcionales. La historia los pide como campos del formulario, pero solo menciona campos obligatorios de forma generica; el backend/frontend deben decidir la obligatoriedad final de forma consistente.
- Ejecutar migracion con Prisma y regenerar cliente:
  - `npx prisma migrate dev --name add_candidate_model`
  - `npx prisma generate`
- No incluir datos sensibles del CV en logs ni seeds.

## Criterios de aceptacion tecnicos

- `backend/prisma/schema.prisma` contiene un modelo `Candidate` compatible con PostgreSQL.
- El modelo contiene los campos requeridos por la historia y metadata suficiente para referenciar el CV.
- El correo electronico del candidato tiene restriccion unica.
- La migracion Prisma crea la tabla e indices necesarios.
- `@prisma/client` puede regenerarse sin errores.
- Las decisiones de campos opcionales y obligatorios quedan documentadas para backend y frontend.

## Pruebas recomendadas

- Ejecutar `npx prisma validate` desde `backend`.
- Ejecutar `npx prisma migrate dev --name add_candidate_model` contra la base local.
- Ejecutar `npx prisma generate` desde `backend`.
- Crear manualmente un candidato mediante Prisma Studio o un script temporal local para validar constraints.
- Intentar crear dos candidatos con el mismo email y confirmar que PostgreSQL/Prisma rechaza el duplicado.

## Dependencias con otros tickets

- No depende de otros tickets.
- Bloquea `02-backend.md`, porque la API necesita el modelo Prisma generado.
- Informa `03-frontend.md`, porque define el contrato de datos persistentes esperado.

## Riesgos o decisiones tecnicas

- Almacenamiento del CV: la base de datos debe guardar metadata y una ruta, no el archivo binario, salvo que se tome una decision explicita distinta.
- Campos `education` y `workExperience`: modelarlos como texto es simple y suficiente para la primera iteracion, pero podria limitar busquedas estructuradas en el futuro.
- Privacidad: telefono, direccion y CV son datos sensibles; se deben evitar logs, seeds reales y exposicion innecesaria.
- Duplicidad: usar `email` como identificador unico puede ser insuficiente si el negocio permite multiples postulaciones por candidato en el futuro.

## Definicion de terminado

El ticket esta terminado cuando el esquema Prisma contiene el modelo de candidato, la migracion correspondiente puede aplicarse en PostgreSQL, el cliente Prisma se regenera correctamente y las decisiones de almacenamiento de CV y datos sensibles quedan reflejadas para los tickets dependientes.

## Checklist

- [x] El modelo `Candidate` existe en `backend/prisma/schema.prisma`.
- [x] El modelo contiene nombre, apellido, email, telefono, direccion, educacion y experiencia laboral.
- [x] El modelo contiene metadata verificable para el CV sin almacenar el binario en PostgreSQL.
- [x] El email del candidato tiene restriccion unica verificable.
- [x] Existe una migracion Prisma que crea la tabla de candidatos.
- [x] `npx prisma validate` se ejecuta sin errores.
- [x] `npx prisma generate` se ejecuta sin errores.
- [x] La decision sobre campos obligatorios y opcionales queda documentada para backend y frontend.
