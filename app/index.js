import * as TaskModule from "./tareas.js";

// Variables 
const inputTask = document.querySelector('#form-input-placeholder');
const form = document.querySelector('#form');
const formBtn = document.querySelector('#form-btn');
const taskList = document.querySelector('#task-list');

// Validaciones
let isInputTaskValid = false;
 
// Funciones 

// Valido si el texto del input es valido, antes de renderizarlo
const renderInputValidationStatus = (input) => {
    const formErrorText = input.nextElementSibling;
    
    if (inputTask.value === '') {
      // Quitar los colores y no mostrar el texto de ayuda.
      input.classList.remove('input-invalid');
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
   isInputTaskValid = inputTask.value;
   renderInputValidationStatus(inputTask, isInputTaskValid);
   renderFormBtnValidationStatus();
});

form.addEventListener('submit', e => {
  e.preventDefault();
  const newTask = {
    id: crypto.randomUUID(),
    isChecked: false,
    Task: inputTask.value,
  }
  TaskModule.addTask(newTask);
  TaskModule.saveTaskInBrowser();
  TaskModule.renderTasks(taskList);
});


taskList.addEventListener('click', e => {
  const deleteBtn = e.target.closest('.task-delete-btn');
  const checkedBtn = e.target.closest('.task-check-btn');
  const isChecked = false;

  if (deleteBtn) {
    const li = deleteBtn.parentElement;
    TaskModule.removeTask(li.id);
    TaskModule.saveTaskInBrowser();
    TaskModule.renderTasks(taskList);
  }

  if (checkedBtn) {
      // 1. Obtener el id
      const li = checkedBtn.parentElement;
      // 2. Obtener ambos inputs
      const taskInputText = li.querySelector('p');        
      const status = li.getAttribute('status');
  
      if (status === 'disabled-inputs') {
        li.setAttribute('status', 'enabled-inputs');
        checkedBtn.innerHTML = TaskModule.checkedIcon;
        taskInputText.classList.remove('task-text');
        taskInputText.classList.add('task-text-checked'); 
        isChecked = true;

        const checkedTask = {
          id: li.id,
          isChecked: isChecked,
          task: taskInputText.value
        }
  
        if (checkedTask.value) {
        TaskModule.updateTask(checkedTask);
        TaskModule.saveTaskInBrowser();
        TaskModule.renderContacts(taskList);
        } 
      }
  
      if (status === 'enabled-inputs') {
        checkedBtn.innerHTML = TaskModule.checkIcon;
        taskInputText.classList.add('task-text');
        taskInputText.classList.remove('task-text-checked');
        isChecked = false
  
        const checkedTask = {
          id: li.id,
          isChecked: isChecked,
          task: taskInputText.value
        }
  
        if (checkedTask.value) {
        TaskModule.updateTask(checkedTask);
        TaskModule.saveTaskInBrowser();
        TaskModule.renderContacts(taskList);
        } 
      }
    }
});

window.onload = () => {
  // 1. Obtener la lista de localStorage
  TaskModule.getTasksFromBrowser();
  // 2. Renderizar las tareas
  TaskModule.renderTasks(taskList);
}