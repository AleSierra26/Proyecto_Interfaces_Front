# Proyecto curso Interfaces y Experiencia de Usuario:
# <img src="/src/assets/logo_readme.png" alt="QUORUM Logo" width="50"> QUORUM

## 🤨 Cómo correr la aplicación:

```
nvm install 20
nvm use 20
npm run dev
```

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

## ⚡ Cómo acceder facilmente a las distintas rutas (en este prototipo, al menos):

```
/ --> Es la ruta por defecto al correr la app.
/home --> Presionar el botón de Iniciar Sesión desde la ruta /, ó presionar el ícono de INICIO en la barra inferior.
/profile --> Presionar el ícono de perfil en la esquina superior derecha.
/my-events --> Presionar el ícono de MIS EVENTOS en la barra inferior.
/create-event --> Presionar el botón de CREAR EVENTO en la ruta de /my-events.
/my-tickets --> Presionar el ícono de MIS TICKETS en la barra inferior.
/event:id --> Presionar cualquier evento, ó ingresar un código de evento en TENGO UN CÓDIGO en la ruta de /home.
```