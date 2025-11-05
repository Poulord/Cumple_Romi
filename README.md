# Cumple_Romi

Sitio web estático del portfolio de Romina Gutiérrez García. Todo el contenido público vive ahora en la carpeta [`public/`](public/) para simplificar la publicación en GitHub Pages y mantener separadas las dependencias estáticas.

## Estructura del proyecto
```
public/
  index.html
  accesorios.html
  colecciones.html
  cumpleanos.html
  galeria.html
  hombre.html
  juego.html
  login.html
  mi-historia.html
  mujer.html
  nuestra-historia.html
  coleccion-arte-en-movimiento.html
  coleccion-capsula.html
  coleccion-elegancia-atemporal.html
  coleccion-elegancia-nordica.html
  coleccion-esencia-sostenible.html
  coleccion-esencia-urbana.html
  coleccion-renacimiento-natural.html
  coleccion-serenidad-mediterranea.html
  assets/
    css/
      style.css
      login.css
      estilos.css
    img/
      ...
  js/
    admin-config.js
    auth.js
    script.js
Instagram_files/
README.md
```

- Todos los documentos HTML consumen los estilos desde `assets/css/` y las imágenes desde `assets/img/`.
- Los scripts del sitio residen en `public/js/`. Para añadir o quitar cuentas con acceso privado edita [`public/js/admin-config.js`](public/js/admin-config.js); cada entrada incluye correo electrónico en minúsculas, contraseña y nombre a mostrar.
- El directorio `Instagram_files/` permanece fuera de `public/` para uso auxiliar.

## Publicación en GitHub Pages
1. **Construye la carpeta pública** (ya incluida en el repositorio). Asegúrate de que todos los cambios deseados están en `public/` y que las rutas relativas apuntan a `assets/...` o `js/...` según corresponda.
2. **Confirma el despliegue**:
   ```bash
   git status
   git add .
   git commit -m "Describe tus cambios"
   git push origin <tu-rama>
   ```
3. En GitHub, abre el repositorio, ve a **Settings → Pages**.
4. En *Build and deployment*, selecciona:
   - **Source**: `Deploy from a branch`.
   - **Branch**: tu rama principal (por ejemplo `main`) y la carpeta `/public`.
5. Guarda los cambios. GitHub Pages publicará automáticamente el contenido de `public/`.
6. Espera unos minutos y visita la URL indicada por GitHub Pages para verificar que los estilos, scripts e imágenes cargan correctamente.

## Próximos pasos
- Revisar y mejorar la experiencia del minijuego (`public/juego.html`).
- Pulir detalles visuales pendientes del login (corrección del icono de mostrar contraseña).
