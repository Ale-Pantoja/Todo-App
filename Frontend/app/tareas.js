import { createNotification } from "./notificaciones.js";


const BASE_URL = 'http://localhost:3000/tasks';

// contadores
const totalTaskCounter = document.querySelector('#totalTaskCounter');
const completedTaskCounter = document.querySelector('#completedTaskCounter');
const incompleteTaskCounter = document.querySelector('#incompleteTaskCounter');

/**
 * Contadores de las tareas
 */
const updateCounters = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.isChecked).length;
    const incomplete = total - completed;

    if (totalTaskCounter) totalTaskCounter.textContent = `Total: ${total}`;
    if (completedTaskCounter) completedTaskCounter.textContent = `Completas: ${completed}`;
    if (incompleteTaskCounter) incompleteTaskCounter.textContent = `Incompletas: ${incomplete}`;
}

/** 
  * @typedef Task
  * @type {object}
  * @property {string} id El id de la tarea
  * @property {string} Task Contenido de la tarea 
  * @property {boolean} isChecked Status si la tarea ha sido completada
*/

/** @type {Task[]} */
let tasks = [];
 
/**
 * Agrega una tarea al array de tareas
 * @param {Task} taskToCreate La nueva tarea
 * @param {string} taskToCreate.task El contenido tarea
 * @param {boolean} taskToCreate.isChecked El estado de chequeado tarea
 */
const addTask = async (taskToCreate) => {
  try {
    const taskToCreateJson = JSON.stringify(taskToCreate);
    const response = await fetch (BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type" : "application/json"
      },
      body: taskToCreateJson
    });
    const taskToCreated = await response.json();
    tasks = tasks.concat(taskToCreated);
    updateCounters();
    createNotification({
      titles: 'Nueva tarea creada',
      description: '',
      type: 'success'
    })
  } catch (error) {
    console.log(error);
    createNotification({
      titles: 'Error',
      description: 'El servidor no esta corriendo',
      type: 'error'
    })
  }
};

// Icons
const checkIcon = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>

`;

const checkedIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
  <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" />
</svg>

`;

/**
 * Renderiza las tareas
 * @param {Element} list La lista en el html donde vamos a cargar las tareas
 */

const renderTasks = (list) => {
  // Borrar la lista del html
  list.innerHTML = '';
  // 1. Por cada tarea del array creo y agrego el tasko al HTML.
  tasks.forEach(task => {
    // 1. Crear el li 
    const li = document.createElement('li');
    // 2. Agregar la clase al li
    li.classList.add('task-item');
    // 3. Agregar el id al li
    li.id = task.id;
    // 3.1 Establecer el estatus
    li.setAttribute('status', task.isChecked ? 'enabled-inputs' : 'disabled-inputs');
    // 4. Crear div del input
    const taskTextClass = task.isChecked ? 'task-text-checked' : 'task-text';
    const inputsDiv = `
      <p class="${taskTextClass}">${task.Task}</p>
    `;
    // 5. Crear div de los botones
    const btnsDiv = `
    <button class="task-delete-btn">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
         <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
      </svg>                      
    </button>
    ${inputsDiv}
    <button class="task-check-btn">
      ${task.isChecked ? checkedIcon : checkIcon}                        
  </button>
    `;
    // 6. Crear la estructura del li
    const liChildren = `
     ${btnsDiv}
    `;
    li.innerHTML = liChildren;    
    // 7. Agregar el li a la ul
    list.appendChild(li);
  });
  updateCounters();
}

/**
 * Guarda el array de las tareas en el navegador
 */
const saveTaskInBrowser = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

/** Obetenr las tareas de la base de datos */
const getTaskFromDb = async () => {
  try {
    const response = await fetch (BASE_URL, {method: "GET"});
    const data = await response.json();
    tasks = data;
    updateCounters();
  } catch (error) {
    console.log(error);
    if (error.message === 'Failed to fetch') {
      console.log('1');
      createNotification({
        titles: 'Error',
        description: 'El servidor no esta corriendo',
        type: 'error'
      });  
    }
  }
}

/**
 * Obtener las tareas del navegador y guardarlos en el array.
 */
const getTasksFromLocalStorage = () => {
  const taskLocalJson = localStorage.getItem('tasks');
  tasks = JSON.parse(taskLocalJson) ?? [];
  updateCounters();
}

/**
 * Elimina un contacto del array de tareas
 * @param {string} id El id de la tarea a eliminar
 */
const removeTask = async (id) => {
  const url = `${BASE_URL}/${id}`;
  const response = await fetch (url, {method: 'DELETE'});
  const taskDeleted = await response.json();
  tasks = tasks.filter(task => task.id !== id);
  updateCounters();
  createNotification({
    titles: 'Tarea eliminada',
    description: ``,
    type:'error'
  });
}

/**
 * Actualizar una tarea
 * @param {Task} updateTask tarea chequeada
*/
const updateTask = async (updateTask) => {
  const url = `${BASE_URL}/${updateTask.id}`;
  const taskToUpdateJson = JSON.stringify(updateTask);
  const response = await fetch (url, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json' }, 
    body: taskToUpdateJson
  });
  const updatedTask = await response.json();
  createNotification({
    titles: 'Tarea Actualizada',
    description: ``,
    type:'success'
  });
  tasks = tasks.map(task => {
    if (task.id === updatedTask.id) {
      return updatedTask;      
    } else {
      return task;
    }
  });
  updateCounters();
}

export {
  addTask,
  renderTasks,
  saveTaskInBrowser,
  getTasksFromLocalStorage,
  getTaskFromDb,
  removeTask,
  updateTask,
  checkIcon,
  checkedIcon
}