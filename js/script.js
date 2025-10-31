const translations = {
  en: {
    title: "To-Do List",
    placeholder: "New task",
    addButton: "Add",
    deleteButton: "Delete"
  },
  es: {
    title: "Lista de Tareas",
    placeholder: "Nueva tarea",
    addButton: "Agregar",
    deleteButton: "Eliminar"
  }
};

const TRASH_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="task-icon">
  <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd"/>
</svg>
`;

const CHECK_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="check-icon">
  <path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 011.04-.207Z" clip-rule="evenodd"/>
</svg>
`;

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function changeLanguage() {
  const lang = document.getElementById("languageSelect").value;
  localStorage.setItem("language", lang);

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (el.tagName === "INPUT") el.placeholder = translations[lang][key];
    else el.textContent = translations[lang][key];
  });

  document.querySelectorAll(".delete-btn .button-text").forEach((span) => {
    span.textContent = translations[lang].deleteButton;
  });
}

function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();
  if (!text) return;

  const newTask = { text, completed: false };
  tasks.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  const lang = localStorage.getItem("language") || "es";
  const taskList = document.getElementById("taskList");

  const li = createTaskElement(newTask, lang, tasks.length - 1);
  li.style.opacity = "0";
  taskList.appendChild(li);
  setTimeout(() => (li.style.opacity = "1"), 10);

  input.value = "";
}

function createTaskElement(task, lang, index) {
  const li = document.createElement("li");
  li.className = task.completed ? "completed" : "";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.onchange = () => toggleTask(index);

  const textSpan = document.createElement("span");
  textSpan.className = "task-text";
  textSpan.textContent = task.text;

  const checkSpan = document.createElement("span");
  checkSpan.className = "check-center";
  if (task.completed) checkSpan.innerHTML = CHECK_ICON;

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.innerHTML = `
    ${TRASH_ICON}
    <span class="button-text">${translations[lang].deleteButton}</span>
  `;
  deleteBtn.onclick = () => deleteTask(index);

  li.append(checkbox, textSpan, checkSpan, deleteBtn);
  return li;
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  localStorage.setItem("tasks", JSON.stringify(tasks));

  const taskList = document.getElementById("taskList");
  const li = taskList.children[index];
  const checkSpan = li.querySelector(".check-center");

  li.classList.toggle("completed");
  if (tasks[index].completed) {
    checkSpan.innerHTML = CHECK_ICON;
  } else {
    checkSpan.innerHTML = "";
  }
}

function deleteTask(index) {
  const taskList = document.getElementById("taskList");
  const li = taskList.children[index];

  li.classList.add("fade-out");

  li.addEventListener("animationend", () => {
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    li.remove();
    rebindTaskEvents();
  }, { once: true });
}

function rebindTaskEvents() {
  const lang = localStorage.getItem("language") || "es";
  const taskList = document.getElementById("taskList");

  [...taskList.children].forEach((li, i) => {
    const checkbox = li.querySelector("input[type='checkbox']");
    const deleteBtn = li.querySelector(".delete-btn");
    checkbox.onchange = () => toggleTask(i);
    deleteBtn.onclick = () => deleteTask(i);
  });
}

window.onload = () => {
  const savedLang = localStorage.getItem("language") || "es";
  document.getElementById("languageSelect").value = savedLang;
  changeLanguage();

  const lang = localStorage.getItem("language") || "es";
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  tasks.forEach((task, i) => {
    const li = createTaskElement(task, lang, i);
    taskList.appendChild(li);
  });
};
