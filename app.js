// Configuración del cliente Supabase
const SUPABASE_URL = 'https://xydxwqptddhhbtecpwxb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5ZHh3cXB0ZGRoaGJ0ZWNwd3hiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNTY2NjksImV4cCI6MjA1OTczMjY2OX0.FHk-nf7AWqTrwrLbrB3kZ-uZr5bNn6K2h7nEMFsksIE';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Helper: Obtiene el usuario actual mediante getSession() (supabase-js v2)
 * @returns {Promise<object|null>} El objeto usuario o null si no hay sesión.
 */
async function getCurrentUser() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  return session?.user;
}

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

/* --------------------------------------------------
   Funciones de simulación para el Dashboard
-------------------------------------------------- */
// Simula el monitoreo en tiempo real (datos aleatorios cada 5 segundos)
function simulateRealTimeMonitoring() {
  setInterval(() => {
    const sensorData = {
      humidity: Math.floor(Math.random() * 100),
      temperature: (Math.random() * 30 + 10).toFixed(1)
    };
    const monitoringEl = document.getElementById('realTimeMonitoring');
    if (monitoringEl) {
      monitoringEl.innerHTML = `<p>Humedad: ${sensorData.humidity}% - Temperatura: ${sensorData.temperature}°C</p>`;
    }
  }, 5000);
}

// Simula alertas automáticas (30% probabilidad cada 7 segundos)
function simulateAlerts() {
  setInterval(() => {
    const alertsEl = document.getElementById('alertsContainer');
    if (!alertsEl) return;
    if (Math.random() < 0.3) {
      alertsEl.innerHTML = `<div class="alert alert-warning" role="alert">¡Alerta! Condición crítica detectada en el sensor.</div>`;
    } else {
      alertsEl.innerHTML = `<p>No hay alertas por el momento.</p>`;
    }
  }, 7000);
}

// Simula recomendaciones de riego (actualización cada 10 segundos)
function simulateIrrigationRecommendations() {
  setInterval(() => {
    const recEl = document.getElementById('recommendationsContainer');
    if (!recEl) return;
    recEl.innerHTML = `<p>Recomendación: Riego moderado. Aplicar 15 litros/m².</p>`;
  }, 10000);
}

// Muestra datos históricos (dummy, ejemplo estático)
function displayHistoricalData() {
  const historicalData = [
    { date: '2025-01-01', humidity: 45, temperature: 22 },
    { date: '2025-01-02', humidity: 50, temperature: 23 },
    { date: '2025-01-03', humidity: 40, temperature: 20 }
  ];
  const histEl = document.getElementById('historicalContainer');
  if (!histEl) return;
  
  let html = `<table class="table table-bordered">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Humedad (%)</th>
                    <th>Temperatura (°C)</th>
                  </tr>
                </thead>
                <tbody>`;
  historicalData.forEach(row => {
    html += `<tr>
               <td>${row.date}</td>
               <td>${row.humidity}</td>
               <td>${row.temperature}</td>
             </tr>`;
  });
  html += `</tbody></table>`;
  histEl.innerHTML = html;
}

// Simula la detección de anomalías (20% de probabilidad cada 15 segundos)
function simulateAnomalyDetection() {
  setInterval(() => {
    const anomalyEl = document.getElementById('anomaliesContainer');
    if (!anomalyEl) return;
    if (Math.random() < 0.2) {
      anomalyEl.innerHTML = `<p class="text-danger">Posible anomalía detectada: Señales de deficiencia nutricional.</p>`;
    } else {
      anomalyEl.innerHTML = `<p>No se han detectado anomalías.</p>`;
    }
  }, 15000);
}

/* --------------------------------------------------
   Funciones de autenticación y CRUD para datos de sensores
-------------------------------------------------- */
// Función para cerrar sesión y redirigir al login
async function signOutUser() {
  const { error } = await supabaseClient.auth.signOut();
  if (error) {
    console.error('Error al cerrar sesión:', error.message);
  } else {
    window.location.href = "login.html";
  }
}

// Función para obtener registros de la tabla sensor_data
async function fetchSensorData() {
  const user = await getCurrentUser();
  if (!user) {
    console.error('No hay usuario autenticado para obtener datos.');
    return;
  }
  const { data, error } = await supabaseClient
    .from('sensor_data')
    .select('*')
    .eq('user_id', user.id);
  if (error) {
    console.error('Error al obtener datos de sensor:', error.message);
  } else {
    renderSensorData(data);
  }
}

// Renderiza los datos en una tabla
function renderSensorData(data) {
  const container = document.getElementById('dataContainer');
  if (!container) return;
  if (!data || data.length === 0) {
    container.innerHTML = '<p>No hay registros de sensores.</p>';
    return;
  }
  let html = `<table class="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Humedad (%)</th>
                    <th>Temperatura (°C)</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>`;
  data.forEach(record => {
    html += `<tr>
               <td>${record.id}</td>
               <td>${record.humidity}</td>
               <td>${record.temperature}</td>
               <td>
                 <button class="btn btn-sm btn-warning" onclick="onEditRecord(${record.id}, ${record.humidity}, ${record.temperature})">Editar</button>
                 <button class="btn btn-sm btn-danger" onclick="deleteSensorData(${record.id})">Eliminar</button>
               </td>
             </tr>`;
  });
  html += `</tbody></table>`;
  container.innerHTML = html;
}

// Elimina un registro de sensor
async function deleteSensorData(recordId) {
  const user = await getCurrentUser();
  if (!user) return;
  const { error } = await supabaseClient
    .from('sensor_data')
    .delete()
    .eq('id', recordId)
    .eq('user_id', user.id);
  if (error) {
    console.error('Error al eliminar registro:', error.message);
  } else {
    fetchSensorData();
  }
}

// Función para editar un registro (usa prompt; se puede mejorar con modal)
function onEditRecord(recordId, currentHumidity, currentTemperature) {
  const newHumidity = prompt("Nueva humedad (%)", currentHumidity);
  const newTemperature = prompt("Nueva temperatura (°C)", currentTemperature);
  if (newHumidity !== null && newTemperature !== null) {
    updateSensorData(recordId, { 
      humidity: Number(newHumidity), 
      temperature: Number(newTemperature) 
    });
  }
}

// Actualiza un registro y recarga la lista
async function updateSensorData(recordId, updatedValues) {
  const user = await getCurrentUser();
  if (!user) return;
  const { error } = await supabaseClient
    .from('sensor_data')
    .update(updatedValues)
    .eq('id', recordId)
    .eq('user_id', user.id);
  if (error) {
    console.error('Error al actualizar registro:', error.message);
  } else {
    fetchSensorData();
  }
}

// Manejo del formulario para crear nuevos registros (CRUD)
const createForm = document.getElementById('createForm');
if (createForm) {
  createForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const humidity = Number(document.getElementById('inputHumidity').value);
    const temperature = Number(document.getElementById('inputTemperature').value);
    
    const user = await getCurrentUser();
    if (!user) {
      console.error('No hay usuario autenticado.');
      return;
    }
    
    const { error } = await supabaseClient
      .from('sensor_data')
      .insert([{ user_id: user.id, humidity, temperature }]);
    if (error) {
      console.error('Error al insertar registro:', error.message);
    } else {
      createForm.reset();
      fetchSensorData();
    }
  });
}

// Eventos para botones
const btnFetch = document.getElementById('btnFetch');
if (btnFetch) {
  btnFetch.addEventListener('click', fetchSensorData);
}
const signOutBtn = document.getElementById('signOutBtn');
if (signOutBtn) {
  signOutBtn.addEventListener('click', signOutUser);
}

/* -------------------------------------------------
   Inicialización al DOMContentLoaded según la página
------------------------------------------------- */
document.addEventListener("DOMContentLoaded", async () => {
  // Si se encuentra el formulario de login, asumimos que es la página de login,
  // por lo que no ejecutamos funciones del dashboard.
  const loginForm = document.getElementById('login-form');
  if (loginForm) return;
  
  // En el dashboard, verificamos la sesión
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  
  // Ejecuta funciones simuladas si existen los contenedores en el DOM:
  if (document.getElementById('realTimeMonitoring')) {
    simulateRealTimeMonitoring();
  }
  if (document.getElementById('alertsContainer')) {
    simulateAlerts();
  }
  if (document.getElementById('recommendationsContainer')) {
    simulateIrrigationRecommendations();
  }
  if (document.getElementById('historicalContainer')) {
    displayHistoricalData();
  }
  if (document.getElementById('anomaliesContainer')) {
    simulateAnomalyDetection();
  }
});