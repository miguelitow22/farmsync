// app.js

// Espera a que el DOM esté cargado
document.addEventListener("DOMContentLoaded", function() {
    // Verifica si estamos en la página de login comprobando la existencia del formulario
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", function(event) {
        event.preventDefault();
        
        // Obtener valores de los inputs
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        
        // Credenciales fijas de ejemplo. Para una aplicación real, valida en el servidor.
        const validUser = "admin";
        const validPassword = "123";
  
        if (username === validUser && password === validPassword) {
          // Redirige al usuario a la página principal
          window.location.href = "index.html";
        } else {
          // Mostrar mensaje de error
          document.getElementById("errorMessage").style.display = "block";
        }
      });
    }
  });
  