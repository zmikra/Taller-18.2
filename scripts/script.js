// Actualizar referencias de los botones y campos
const apiUrl = 'https://672b948f1600dda5a9f598ab.mockapi.io/user';
const resultsList = document.getElementById('results');
const alertError = document.getElementById('alert-error');

const btnGet1 = document.getElementById('btnGet1');
const inputGet1Id = document.getElementById('inputGet1Id');
const btnPost = document.getElementById('btnPost');
const inputPostNombre = document.getElementById('inputPostNombre');
const inputPostApellido = document.getElementById('inputPostApellido');
const btnDelete = document.getElementById('btnDelete');
const inputDelete = document.getElementById('inputDelete');
const btnPut = document.getElementById('btnPut');
const inputPutId = document.getElementById('inputPutId');

// Función para limpiar campos de entrada
function clearInputs(...inputs) {
    inputs.forEach(input => input.value = '');
}

// Habilitar botones según valores en los inputs
function updateButtonState() {
    btnPost.disabled = !inputPostNombre.value || !inputPostApellido.value;
    btnPut.disabled = !inputPutId.value;
    btnDelete.disabled = !inputDelete.value;
}

// Eventos de entrada para activar los botones cuando haya contenido
inputPostNombre.addEventListener('input', updateButtonState);
inputPostApellido.addEventListener('input', updateButtonState);
inputPutId.addEventListener('input', updateButtonState);
inputDelete.addEventListener('input', updateButtonState);

// Manejo de la tecla Enter
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        if (inputGet1Id === document.activeElement) btnGet1.click();
        else if (inputPostNombre === document.activeElement || inputPostApellido === document.activeElement) btnPost.click();
        else if (inputDelete === document.activeElement) btnDelete.click();
        else if (inputPutId === document.activeElement) btnPut.click();
    }
});

// Obtener un usuario o todos los usuarios
btnGet1.addEventListener('click', async () => {
    const userId = inputGet1Id.value;

    try {
        const response = userId
            ? await fetch(`${apiUrl}/${userId}`)
            : await fetch(apiUrl);
        
        if (!response.ok) throw new Error("Error en la respuesta del servidor");

        const data = await response.json();
        resultsList.innerHTML = ''; // Limpiar la lista
        if (Array.isArray(data)) {
            data.forEach(user => displayResult(`ID: ${user.id}, Nombre: ${user.nombre}, Apellido: ${user.apellido}`));
        } else {
            displayResult(`ID: ${data.id}, Nombre: ${data.nombre}, Apellido: ${data.apellido}`);
        }
        clearInputs(inputGet1Id);
    } catch (error) {
        showError("No se pudo obtener el registro.");
    }
});

// Crear un nuevo usuario
btnPost.addEventListener('click', async () => {
    const nombre = inputPostNombre.value;
    const apellido = inputPostApellido.value;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, apellido })
        });

        if (!response.ok) throw new Error("Error al crear el usuario");

        const data = await response.json();
        displayResult(`Usuario creado: ID: ${data.id}, Nombre: ${data.nombre}, Apellido: ${data.apellido}`);
        clearInputs(inputPostNombre, inputPostApellido);
        updateButtonState();
    } catch (error) {
        showError("No se pudo crear el registro.");
    }
});

// Obtener las referencias de los elementos
const inputPutNombre = document.getElementById('inputPutNombre');
const inputPutApellido = document.getElementById('inputPutApellido');
const btnSendChanges = document.getElementById('btnSendChanges');

// Función para habilitar o deshabilitar el botón "Guardar"
function updateSaveButtonState() {
    btnSendChanges.disabled = !inputPutNombre.value || !inputPutApellido.value;
}

// Eventos para habilitar el botón "Guardar" cuando el usuario empieza a escribir
inputPutNombre.addEventListener('input', updateSaveButtonState);
inputPutApellido.addEventListener('input', updateSaveButtonState);

// Evento para abrir el modal y cargar datos del usuario
btnPut.addEventListener('click', async () => {
    const userId = inputPutId.value;

    try {
        const response = await fetch(`${apiUrl}/${userId}`);
        if (!response.ok) throw new Error("Error al obtener el usuario");

        const user = await response.json();
        inputPutNombre.value = user.nombre;
        inputPutApellido.value = user.apellido;

        const modal = new bootstrap.Modal(document.getElementById('dataModal'));
        modal.show();

        updateSaveButtonState();
    } catch (error) {
        showError("No se pudo obtener el usuario para modificar.");
    }
});

// Enviar cambios al modificar un usuario (en el modal)
btnSendChanges.addEventListener('click', async () => {
    const userId = inputPutId.value;
    const nombre = inputPutNombre.value;
    const apellido = inputPutApellido.value;

    try {
        const response = await fetch(`${apiUrl}/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, apellido })
        });

        if (!response.ok) throw new Error("Error al modificar el usuario");

        const data = await response.json();
        displayResult(`Usuario modificado: ID: ${data.id}, Nombre: ${data.nombre}, Apellido: ${data.apellido}`);

        const modal = bootstrap.Modal.getInstance(document.getElementById('dataModal'));
        modal.hide();

        clearInputs(inputPutId, inputPutNombre, inputPutApellido);
        updateButtonState();
    } catch (error) {
        showError("No se pudo modificar el registro.");
    }
});

// Eliminar un usuario
btnDelete.addEventListener('click', async () => {
    const userId = inputDelete.value;

    try {
        const response = await fetch(`${apiUrl}/${userId}`, { method: 'DELETE' });

        if (!response.ok) throw new Error("Error al eliminar el usuario");

        displayResult(`Usuario con ID: ${userId} eliminado.`);
        clearInputs(inputDelete);
        updateButtonState();
    } catch (error) {
        showError("No se pudo eliminar el registro.");
    }
});

function showError(message) {
    alertError.classList.add('show');
    alertError.textContent = message;
    setTimeout(() => alertError.classList.remove('show'), 3000);
}

function displayResult(message) {
    const listItem = document.createElement('li');
    listItem.className = 'list-group-item';
    listItem.textContent = message;
    resultsList.appendChild(listItem);
}

updateButtonState();
