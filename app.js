// Configuración del cliente Supabase sin persistencia en este ejemplo (opcional)
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

// Función para simular monitoreo en tiempo real (datos aleatorios cada 5 segundos)
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

// Función para simular alertas automáticas (con 30% probabilidad cada 7 segundos)
function simulateAlerts() {
  setInterval(() => {
    const alertsEl = document.getElementById('alertsContainer');
    if (Math.random() < 0.3) {
      alertsEl.innerHTML = `<div class="alert alert-warning" role="alert">¡Alerta! Condición crítica detectada en el sensor.</div>`;
    } else {
      alertsEl.innerHTML = `<p>No hay alertas por el momento.</p>`;
    }
  }, 7000);
}

// Función para simular recomendaciones de riego (actualización cada 10 segundos)
function simulateIrrigationRecommendations() {
  setInterval(() => {
    const recEl = document.getElementById('recommendationsContainer');
    recEl.innerHTML = `<p>Recomendación: Riego moderado. Aplicar 15 litros/m².</p>`;
  }, 10000);
}

// Función para mostrar datos históricos (dummy, ejemplo estático)
function displayHistoricalData() {
  const historicalData = [
    { date: '2025-01-01', humidity: 45, temperature: 22 },
    { date: '2025-01-02', humidity: 50, temperature: 23 },
    { date: '2025-01-03', humidity: 40, temperature: 20 }
  ];
  const histEl = document.getElementById('historicalContainer');
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

// Función para simular detección de anomalías (20% de probabilidad cada 15 segundos)
function simulateAnomalyDetection() {
  setInterval(() => {
    const anomalyEl = document.getElementById('anomaliesContainer');
    if (Math.random() < 0.2) {
      anomalyEl.innerHTML = `<p class="text-danger">Posible anomalía detectada: Señales de deficiencia nutricional.</p>`;
    } else {
      anomalyEl.innerHTML = `<p>No se han detectado anomalías.</p>`;
    }
  }, 15000);
}

// Función para cerrar sesión (redirige al login)
async function signOutUser() {
  const { error } = await supabaseClient.auth.signOut();
  if (error) {
    console.error('Error al cerrar sesión:', error.message);
  } else {
    window.location.href = "login.html";
  }
}

// Función para manejo CRUD de datos de sensores (ejemplo sencillo)
async function fetchSensorData() {
  const user = supabaseClient.auth.session()?.user;
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

function renderSensorData(data) {
  const container = document.getElementById('dataContainer');
  if (!data || data.length === 0) {
    container.innerHTML = '<p>No hay registros de sensores.</p>';
    return;
  }
  let html = `<table class="table table-striped">
                <thead>
                  <tr><th>ID</th><th>Humedad (%)</th><th>Temperatura (°C)</th><th>Acciones</th></tr>
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

async function deleteSensorData(recordId) {
  const user = supabaseClient.auth.session()?.user;
  if (!user) return;
  const { data, error } = await supabaseClient
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

// Función básica para editar un registro (usa prompt, se puede mejorar usando un modal)
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

async function updateSensorData(recordId, updatedValues) {
  const user = supabaseClient.auth.session()?.user;
  if (!user) return;
  const { data, error } = await supabaseClient
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

// Manejo del formulario para crear nuevos registros en la sección CRUD
document.getElementById('createForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const humidity = Number(document.getElementById('inputHumidity').value);
  const temperature = Number(document.getElementById('inputTemperature').value);
  
  const user = supabaseClient.auth.session()?.user;
  if (!user) {
    console.error('No hay usuario autenticado.');
    return;
  }
  
  const { data, error } = await supabaseClient
    .from('sensor_data')
    .insert([{ user_id: user.id, humidity, temperature }]);
  if (error) {
    console.error('Error al insertar registro:', error.message);
  } else {
    document.getElementById('createForm').reset();
    fetchSensorData();
  }
});

// Asignar evento para el botón de recargar registros
document.getElementById('btnFetch')?.addEventListener('click', fetchSensorData);

// Asignar evento para el botón de cerrar sesión
document.getElementById('signOutBtn')?.addEventListener('click', signOutUser);

// Cuando el DOM esté listo, inicia las simulaciones y carga datos
document.addEventListener("DOMContentLoaded", async () => {
  // Obtiene la sesión; en el dashboard ya se supone que el usuario está autenticado.
  // Ejecuta las funciones simuladas para mostrar cada funcionalidad
  simulateRealTimeMonitoring();
  simulateAlerts();
  simulateIrrigationRecommendations();
  displayHistoricalData();
  simulateAnomalyDetection();
});
