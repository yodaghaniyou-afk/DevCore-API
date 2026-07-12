// Sélection des éléments du DOM
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

// Fonction pour ajouter une tâche à l'affichage
function addTaskToDOM(taskText) {
    const li = document.createElement('li');

    const span = document.createElement('span');
    span.textContent = taskText;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Supprimer';
    deleteBtn.classList.add('delete-btn');

    // Gestion de la suppression
    deleteBtn.addEventListener('click', () => {
        li.remove();
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

// Gestion du clic sur le bouton "Ajouter"
addBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim();

    if (taskText !== '') {
        addTaskToDOM(taskText);
        taskInput.value = '';
    }
});