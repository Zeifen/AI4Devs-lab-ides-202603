# Prompt 1:
Lee docs/user-stories/add-candidate.md, inspecciona el repositorio para detectar el stack, estructura y convenciones actuales, y crea un nuevo archivo Markdown en docs/meta-prompts/add-candidate-ticket-planning.md.

El meta prompt debe pedir a un asistente de código que actúe como Senior Fullstack Engineer y genere tres tickets técnicos separados en archivos Markdown:

- docs/tickets/add-candidate/01-database.md
- docs/tickets/add-candidate/02-backend.md
- docs/tickets/add-candidate/03-frontend.md

Cada ticket debe incluir:
- título
- objetivo
- contexto
- alcance
- archivos probables a modificar o crear
- detalles técnicos de implementación
- criterios de aceptación técnicos
- pruebas recomendadas
- dependencias con otros tickets
- riesgos o decisiones técnicas
- definición de terminado

Además, el meta prompt debe incluir una sección llamada “Uso del Checklist”, indicando que el checklist final debe usarse como herramienta de validación y no debe marcarse automáticamente como completado. Cada punto solo puede marcarse como completado si fue cubierto por el ticket correspondiente y existe una forma clara de verificarlo mediante código, test o validación manual.

No implementes código todavía. Solo crea el meta prompt.
Importante: en este paso no crees todavía los archivos de tickets. Solo crea el archivo del meta prompt que posteriormente se usará para generar esos tickets.

# Prompt 2:
Lee y ejecuta docs/meta-prompts/add-candidate-ticket-planning.md.

# Prompt 3:
Lee y ejecuta docs/tickets/add-candidate/01-database.md.

Implementa únicamente los cambios de base de datos y Prisma indicados en ese ticket. No implementes todavía endpoints ni UI.

Al finalizar, ejecuta las validaciones relevantes que sean posibles y dime qué cambiaste, qué comandos corriste y si quedó algo pendiente.


# Prompt 4:
Lee y ejecuta docs/tickets/add-candidate/02-backend.md.

Implementa únicamente los cambios de backend indicados en ese ticket. No modifiques frontend. Si detectas que falta algo del ticket de base de datos, detente y explícame la dependencia.

Al finalizar, ejecuta las pruebas relevantes del backend y dime qué cambiaste, qué comandos corriste y si quedó algo pendiente.

# Prompt 5:
Lee y ejecuta docs/tickets/add-candidate/03-frontend.md.

Implementa únicamente los cambios de frontend indicados en ese ticket. No modifiques backend ni base de datos salvo configuración estrictamente necesaria para consumir la API.

Al finalizar, ejecuta las pruebas relevantes del frontend y dime qué cambiaste, qué comandos corriste y si quedó algo pendiente.

# Prompt 6:
Cuando lleno todos los registros y le doy clic en "Guardar candidato" sale el mensaje "Revisa los campos marcados antes de enviar " enseguida sale este error en en la pantalla, corrigelo por favor:
ResizeObserver loop completed with undelivered notifications.
at handleError (http://localhost:3001/static/js/bundle.js:38676:58)
at http://localhost:3001/static/js/bundle.js:38695:7

# Prompt 7:
Salio error de cors ya que no lo teníamos considerado, agrega el CORS en el back para el/los puertos usados

# Prompt 8:
Ejecuta un build general para validar que todo esté en orden