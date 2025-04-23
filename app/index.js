import * as TaskModule from "./tareas.js";

// Variables 
const inputTask = document.querySelector('#form-input-placeholder');
const form = document.querySelector('#form');
const formBtn = document.querySelector('#form-btn');
const taskList = document.querySelector('#task-list');

// Validaciones
let isInputTaskValid = false;

// Expresiones regulares 
const TASK_REGEX = /^[a-zA-Z0-9].{0,149}$/;

 
// Funciones 

// Valido si el texto del input es valido, antes de renderizarlo
const renderInputValidationStatus = (input) => {
    const formErrorText = input.nextElementSibling;
    
    if (inputTask.value === '') {
      // No mostrar el texto de ayuda.
      input.classList.add('input-invalid');
      input.classList.remove('input-valid');
      formErrorText?.classList.add('show-error-text');      
    } else if (isInputTaskValid) {
      // Ponerse verde y ocultar el texto de ayuda.
      input.classList.add('input-valid');
      input.classList.remove('input-invalid');
      formErrorText?.classList.remove('show-error-text');
    } else {
      // Ponerse rojo y mostrar el texto de ayuda.
      input.classList.add('input-invalid');
      input.classList.remove('input-valid');
      formErrorText?.classList.add('show-error-text');
    }
}

const renderFormBtnValidationStatus = () => {
    if (isInputTaskValid) {
      formBtn.disabled = false;
    } else {
      formBtn.disabled = true;
    }
}
  
  // Eventos
inputTask.addEventListener('input', e => {
   isInputTaskValid = TASK_REGEX.test(inputTask.value);
   renderInputValidationStatus(inputTask, isInputTaskValid);
   renderFormBtnValidationStatus();
});

// Agrega una nueva tarea
form.addEventListener('submit', e => {
  e.preventDefault();
  const newTask = {
    id: crypto.randomUUID(),
    Task: inputTask.value,
    isChecked: false
  }
  inputTask.value = '';
  TaskModule.addTask(newTask);
  TaskModule.saveTaskInBrowser();
  TaskModule.renderTasks(taskList);
});

// Escuchar el evento click 
taskList.addEventListener('click', e => {
  const deleteBtn = e.target.closest('.task-delete-btn');
  const checkedBtn = e.target.closest('.task-check-btn');

  if (deleteBtn) {
    const li = deleteBtn.parentElement;
    TaskModule.removeTask(li.id);
    TaskModule.saveTaskInBrowser();
    TaskModule.renderTasks(taskList);
  }

  if (checkedBtn) {
      // Obtener el id de la tarea
      const li = checkedBtn.parentElement;
      // Obtener el input
      const taskInputText = li.querySelector('p');        
      const status = li.getAttribute('status');
  
      if (status === 'disabled-inputs') {
      // Cambio el estado del input 
        li.setAttribute('status', 'enabled-inputs');
      // Cambio el icono del checkBtn 
        checkedBtn.innerHTML = TaskModule.checkedIcon;
      // Agrega la clase del texto chequeado 
        taskInputText.classList.remove('task-text');
        taskInputText.classList.add('task-text-checked'); 
        // Actualizo la tarea
        const checkedTask = {
          id: li.id,
          Task: taskInputText.textContent,
          isChecked: true
        }

        // La guardo en el navegador  
        TaskModule.updateTask(checkedTask);
        TaskModule.saveTaskInBrowser();
        TaskModule.renderTasks(taskList);
      }
  
      if (status === 'enabled-inputs') {
      // Cambio el estado del input 
        li.setAttribute('status', 'disabled-inputs');        
      // Cambio el icono del checkBtn 
        checkedBtn.innerHTML = TaskModule.checkIcon;
      // Agrega la clase del texto chequeado
        taskInputText.classList.add('task-text');
        taskInputText.classList.remove('task-text-checked');
        
        // Actualizo la tarea
        const checkedTask = {
          id: li.id,
          Task: taskInputText.textContent,
          isChecked: false
        }

        // La guardo en el navegador
        TaskModule.updateTask(checkedTask);
        TaskModule.saveTaskInBrowser();
        TaskModule.renderTasks(taskList);      
      }
    }
});



window.onload = () => {
  TaskModule.getTasksFromBrowser();
  TaskModule.renderTasks(taskList);
}
