# Cumple_Romi

Este repositorio contiene el portfolio web de Romina Gutiérrez García.

## Estructura del proyecto

```
public/
  accesorios.html
  colecciones.html
  cumpleanos.html
  galeria.html
  hombre.html
  index.html
  juego.html
  login.html
  mi-historia.html
  mujer.html
  nuestra-historia.html
  assets/
    css/
      estilos.css
      login.css
      style.css
    img/
      ...
  js/
    admin-config.js
    auth.js
    script.js
Instagram_files/
```

Los archivos HTML consumen los recursos estáticos mediante rutas relativas, por lo que toda la carpeta `public/` puede publicarse sin pasos de compilación adicionales.

## Gestión de usuarios administradores

- Para añadir o quitar cuentas con acceso privado edita el archivo [`public/js/admin-config.js`](public/js/admin-config.js).
- Cada entrada está formada por el correo electrónico (en minúsculas), la contraseña y el nombre que aparecerá en la web.
- Tras guardar los cambios no es necesario modificar más archivos; la autenticación los detectará automáticamente.

## Tareas pendientes conocidas

- Ajustar el estilo del icono de visualización de contraseña en el formulario de acceso.
- Añadir testimonios reales en la página principal.
- Revisar y completar el contenido de cada sección para la publicación definitiva.
