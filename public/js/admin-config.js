// Configuración centralizada de cuentas con acceso a la zona privada.
// Añade, edita o elimina entradas de este objeto para gestionar usuarios administradores.
// La clave debe ser el correo electrónico y los valores incluyen la contraseña en texto plano
// y el nombre completo que se mostrará en la interfaz.
window.RGG_ADMIN_USERS = {
  "romina.gutierrez@atelier.com": {
    password: "atelier2024",
    name: "Romina Gutiérrez",
  },
  "isaac.gutierrez@atelier.com": {
    password: "tequiero",
    name: "Isaac Gutiérrez",
  },
};

if (window.RGGAuth && typeof window.RGGAuth.reloadAdminDirectory === "function") {
  window.RGGAuth.reloadAdminDirectory();
}
