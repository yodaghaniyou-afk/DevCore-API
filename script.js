// Sélection des éléments du DOM
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const container = document.querySelector('.container');

const API_URL = 'https://jsonplaceholder.typicode.com/todos';

// Afficher un message d'erreur temporaire à l'utilisateur
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.classList.add('error-message');
    errorDiv.textContent = message;
    container.insertBefore(errorDiv, taskList);

    // Le message disparaît après 4 secondes
    setTimeout(() => {
        errorDiv.remove();
    }, 4000);
}

// Afficher/masquer l'indicateur de chargement
function setLoading(isLoading) {
    let loadingDiv = document.getElementById('loadingIndicator');

    if (isLoading) {
        if (!loadingDiv) {
            loadingDiv = document.createElement('div');
            loadingDiv.id = 'loadingIndicator';
            loadingDiv.classList.add('loading');
            loadingDiv.textContent = 'Chargement des tâches...';
            container.insertBefore(loadingDiv, taskList);
        }
    } else {
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }
}

// Fonction pour afficher une tâche dans le DOM
function addTaskToDOM(taskText, taskId = null) {
    const li = document.createElement('li');

    const span = document.createElement('span');
    span.textContent = taskText;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Supprimer';
    deleteBtn.classList.add('delete-btn');

    deleteBtn.addEventListener('click', async () => {
        if (taskId) {
            await deleteTaskFromAPI(taskId);
        }
        li.remove();
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

// Récupérer les tâches depuis l'API au chargement de la page
async function fetchTasks() {
    setLoading(true);
    try {
        const response = await fetch(`${API_URL}?_limit=5`);

        if (!response.ok) {
            throw new Error('Réponse invalide du serveur');
        }

        const data = await response.json();

        data.forEach(task => {
            addTaskToDOM(task.title, task.id);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des tâches :', error);
        showError('Impossible de charger les tâches. Vérifiez votre connexion.');
    } finally {
        setLoading(false);
    }
}

// Ajouter une tâche via l'API
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

        if (!response.ok) {
            throw new Error('Échec de l\'envoi de la tâche');
        }

        const data = await response.json();
        console.log('Tâche envoyée à l\'API :', data);
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la tâche :', error);
        showError('La tâche a été ajoutée localement, mais pas synchronisée avec le serveur.');
    }
}

// Supprimer une tâche via l'API
async function deleteTaskFromAPI(taskId) {
    try {
        const response = await fetch(`${API_URL}/${taskId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Échec de la suppression');
        }

        console.log(`Tâche ${taskId} supprimée de l'API`);
    } catch (error) {
        console.error('Erreur lors de la suppression :', error);
        showError('Erreur lors de la suppression sur le serveur.');
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