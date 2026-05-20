# Proyecto curso Interfaces y Experiencia de Usuario:
# <img src="/src/assets/logo_readme.png" alt="QUORUM Logo" width="50"> QUORUM

# Quorum — Aplicación de administración de eventos.

Quorum es una aplicación web para crear, administrar y comprar entradas de eventos, con generación y validación de códigos QR para el control de acceso a los eventos.

---

## Prerequisitos

- [Node.js](https://nodejs.org/) v20 o superior
- [npm](https://www.npmjs.com/) v10 o superior
- [PostgreSQL](https://www.postgresql.org/) v14 o superior

---

## Estructura del Proyecto

```
/
├── Proyecto_Interfaces_Front/   ← Frontend en React (Vite)
└── Proyecto_Interfaces_Back/    ← Backend en Express (Node.js)
```

---

## 1. Setup de Base de Datos

Abre la terminal y accede a la shell de PostgreSQL:

```bash
sudo -u postgres psql
```

Dentro de la shell, corre:

```sql
CREATE DATABASE quorum_db;
CREATE USER quorum_user WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE quorum_db TO quorum_user;
\q
```

Luego crea las tablas, corriendo el archivo tipo 'schema':

```bash
psql -U quorum_user -d quorum_db -f Proyecto_Interfaces_Back/db/schema.sql
```

Si no funciona (por permisos de acceso), intenta correr este (posicionado dentro de ``Proyecto_Interfaces_Back``):

```
 sudo -u postgres psql -d quorum_db -f db/schema.sql
```

---

## 2. Setup del Backend

```bash
cd Proyecto_Interfaces_Back
```

Instala las dependencias:

```bash
npm install
```

Crea un archivo `.env` en esta carpeta con el siguiente contenido:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=quorum_db
DB_USER=quorum_user
DB_PASSWORD=yourpassword
PORT=3000
```

Inicia el servidor backend:

```bash
npm run dev
```
El backend va a estar corriendo en `http://localhost:3000`.

---

## 3. Setup del Frontend

Abre una **nueva terminal** y corre:

```bash
cd Proyecto_Interfaces_Front
```

Instala las dependencias:

```bash
npm install
```

Inicia el servidor de desarrollo frontend:

```bash
nvm install 20
nvm use 20
npm run dev
```

La app va a estar corriendo en `http://localhost:5173`.

---

## 4. Usando la app

Abre tu browser y ve a:

```
http://localhost:5173
```

Desde aquí puedes:

1. **Crear una cuenta** — clickea "Crear cuenta" en la landing page.
2. **Crear un evento** — ve a "Mis Eventos" y haz click en "Crear Evento".
3. **Compra un ticket** — navega a cualquier evento y clickea "Comprar Ticket".
4. **Ver tus tickets** — ve a "Mis Tickets" para ver tus códigos QR.
5. **Valida tickets** — ve a "Mis Eventos", abre un evento y haz click en "Escanear Invitados".

---

## Notas

- Ambos servidores **deben** estar corriendo al mismo tiempo para que la aplicación funcione.
- El frontend corre en el puerto **5173** y el backend en el puerto **3000**.
- La única información almacenada en el browser es la sesión actual del usuario (`currentUser` en localStorage) — todo lo demás se almacena en PostgreSQL.

## 👀 Rutas disponibles para visualizar:

```
/ --> Vista inicial (Landing Page).
/home --> Vista principal luego de haber iniciado sesión.
/profile --> Vista del perfil del usuario.
/my-events --> Vista de los eventos creados por el usuario.
/create-event --> Vista para crear un evento.
/my-tickets --> Vista de los eventos a los que el usuario compró un ticket.
/event/:id --> Vista para inspeccionar un evento en particular y poder comprar su ticket.
```

## ⚡ Cómo acceder facilmente a las distintas rutas:

```
/ --> Es la ruta por defecto al correr la app.
/home --> Presionar el botón de Iniciar Sesión desde la ruta /, ó presionar el ícono de INICIO en la barra inferior.
/profile --> Presionar el ícono de perfil en la esquina superior derecha.
/my-events --> Presionar el ícono de MIS EVENTOS en la barra inferior.
/create-event --> Presionar el botón de CREAR EVENTO en la ruta de /my-events.
/my-tickets --> Presionar el ícono de MIS TICKETS en la barra inferior.
/event:id --> Presionar cualquier evento, ó ingresar un código de evento en TENGO UN CÓDIGO en la ruta de /home.
```