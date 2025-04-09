// Configuración del cliente Supabase
const SUPABASE_URL = 'https://xydxwqptddhhbtecpwxb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5ZHh3cXB0ZGRoaGJ0ZWNwd3hiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNTY2NjksImV4cCI6MjA1OTczMjY2OX0.FHk-nf7AWqTrwrLbrB3kZ-uZr5bNn6K2h7nEMFsksIE';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Muestra un mensaje de error en el elemento indicado.
 * @param {string} elementId - ID del elemento donde se mostrará el error.
 * @param {string} message - Mensaje de error a mostrar.
 */
function displayError(elementId, message) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerText = message;
    element.style.display = 'block';
  }
}

// Esperar a que el DOM se cargue completamente
document.addEventListener("DOMContentLoaded", async () => {

  // Redirección en caso de que el usuario ya esté autenticado
  const session = supabaseClient.auth.session();
  if (session) {
    window.location.href = "dashboard.html";
    return;
  }

  // Manejo del formulario de inicio de sesión
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Obtener y limpiar valores de entrada
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value.trim();

      // Validar entradas básicas
      if (!email || !password) {
        displayError('login-error', 'Por favor, completa todos los campos.');
        return;
      }

      // Realizar el login usando Supabase
      const { data: user, error } = await supabaseClient.auth.signIn({ email, password });
      if (error) {
        displayError('login-error', error.message);
      } else {
        // Redirigir al dashboard si la autenticación es exitosa
        window.location.href = "dashboard.html";
      }
    });
  }

  // Manejo del formulario de registro
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Obtener y limpiar valores de entrada
      const email = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value.trim();

      // Validar entradas básicas
      if (!email || !password) {
        displayError('signup-error', 'Por favor, completa todos los campos.');
        return;
      }

      // Realizar el registro usando Supabase
      const { data: user, error } = await supabaseClient.auth.signUp({ email, password });
      if (error) {
        displayError('signup-error', error.message);
      } else {
        // Mostrar mensaje de éxito y limpiar el formulario
        const signupSuccess = document.getElementById('signup-success');
        if (signupSuccess) {
          signupSuccess.style.display = 'block';
        }
        signupForm.reset();
      }
    });
  }
});
