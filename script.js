// Sélection des éléments du DOM
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

const API_URL = 'https://jsonplaceholder.typicode.com/todos';

// Fonction pour afficher une tâche dans le DOM
function addTaskToDOM(taskText) {
    const li = document.createElement('li');

    const span = document.createElement('span');
    span.textContent = taskText;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Supprimer';
    deleteBtn.classList.add('delete-btn');

    deleteBtn.addEventListener('click', () => {
        li.remove();
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

// Récupérer les tâches depuis l'API au chargement de la page
async function fetchTasks() {
    try {
        const response = await fetch(`${API_URL}?_limit=5`); // On limite à 5 tâches pour l'exemple
        const data = await response.json();

        data.forEach(task => {
            addTaskToDOM(task.title);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des tâches :', error);
    }
}

// Ajouter une tâche via l'API (simulation, JSONPlaceholder ne sauvegarde pas réellement)
async function addTaskToAPI(taskText) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: taskText,
                completed: false,
            }),
        });

        const data = await response.json();
        console.log('Tâche envoyée à l\'API :', data);
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la tâche :', error);
    }
}

// Gestion du clic sur le bouton "Ajouter"
addBtn.addEventListener('click', async () => {
    const taskText = taskInput.value.trim();

    if (taskText !== '') {
        addTaskToDOM(taskText);
        await addTaskToAPI(taskText);
        taskInput.value = '';
    }
});

// Chargement initial des tâches depuis l'API
fetchTasks();