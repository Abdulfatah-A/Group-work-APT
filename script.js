(() => {
    let totalTasks = 0;
    let completedTasks = 0;
    let currentFilter = 'all'; // Default filter

    const todoInput = document.getElementById('todo-input');
    const dueDateInput = document.getElementById('due-date');
    const categorySelect = document.getElementById('category-select');
    const addTodoButton = document.getElementById('add-todo');
    const todoList = document.getElementById('todo-list');
    const completionMeter = document.getElementById('completion-meter');
    const completionText = document.getElementById('completion-text');
    const filterButtons = document.querySelectorAll('.filter-buttons button');

    let completedTasksList = []; // Array to store completed tasks

    document.addEventListener('DOMContentLoaded', () => {
        loadTasksFromLocalStorage();
    });

    function changeBackgroundColor() {
        const colors = [
            '#e0f7fa', '#b2ebf2', '#80deea',
            '#4dd0e1', '#26c6da', '#00bcd4', '#0097a7'
        ];
        let currentIndex = 0;

        setInterval(() => {
            document.body.style.transition = 'background-color 1s ease';
            document.body.style.backgroundColor = colors[currentIndex];
            currentIndex = (currentIndex + 1) % colors.length;
        }, 3000);
    }

    changeBackgroundColor();

    function addTask(todoText, dueDate, category) {
        const task = { todoText, dueDate, category, completed: false };
        const li = createTaskElement(task);
        todoList.appendChild(li);
        totalTasks++;
        updateCompletionMeter();
        clearInputs();
        saveTasksToLocalStorage(); // Save to local storage
    }

    function createTaskElement({ todoText, dueDate, category, completed }) {
        const li = document.createElement('li');
        li.classList.add('task-item');

        const taskSpan = document.createElement('span');
        taskSpan.textContent = todoText;
        taskSpan.classList.add('task-text');

        const dateSpan = document.createElement('span');
        dateSpan.textContent = new Date(dueDate).toLocaleDateString();
        dateSpan.classList.add('due-date');

        const categorySpan = document.createElement('span');
        categorySpan.textContent = category;
        categorySpan.classList.add('category-text');

        const completeButton = createButton('Complete', 'complete-btn', () => {
            completedTasks++;
            updateCompletionMeter();
            completedTasksList.push(li);
            li.remove();
            saveTasksToLocalStorage();
            filterTasks(currentFilter);
        });

        const deleteButton = createButton('Delete', 'delete-btn', () => {
            li.remove();
            totalTasks--;
            updateCompletionMeter();
            saveTasksToLocalStorage();
            filterTasks(currentFilter);
        });

        li.append(taskSpan, dateSpan, categorySpan, completeButton, deleteButton);
        if (completed) {
            completedTasks++;
            li.remove();
            completedTasksList.push(li);
        }
        return li;
    }

    function createButton(text, className, clickHandler) {
        const button = document.createElement('button');
        button.textContent = text;
        button.classList.add(className);
        button.style.marginLeft = '10px';
        button.addEventListener('click', clickHandler);
        return button;
    }

    function updateCompletionMeter() {
        const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        completionMeter.value = completionPercentage;
        completionText.textContent = `Completion: ${Math.round(completionPercentage)}%`;
    }

    function clearInputs() {
        todoInput.value = '';
        dueDateInput.value = '';
        categorySelect.value = 'Work';
    }

    function filterTasks(filter) {
        const tasks = document.querySelectorAll('#todo-list .task-item');
        tasks.forEach(task => {
            const isCompleted = completedTasksList.includes(task);
            if (filter === 'all' || (filter === 'completed' && isCompleted) || (filter === 'pending' && !isCompleted)) {
                task.style.display = '';
            } else {
                task.style.display = 'none';
            }
        });

        completedTasksList.forEach(task => {
            if (filter === 'completed') {
                task.style.display = '';
                todoList.appendChild(task); // Append to the list temporarily to show completed tasks
            } else {
                task.style.display = 'none';
                task.remove(); // Remove from the list when not in 'Show Completed' filter
            }
        });
    }

    function saveTasksToLocalStorage() {
        const tasks = [];
        document.querySelectorAll('#todo-list .task-item').forEach(taskItem => {
            const task = {
                todoText: taskItem.querySelector('.task-text').textContent,
                dueDate: taskItem.querySelector('.due-date').textContent,
                category: taskItem.querySelector('.category-text').textContent,
                completed: false
            };
            tasks.push(task);
        });
        completedTasksList.forEach(taskItem => {
            const task = {
                todoText: taskItem.querySelector('.task-text').textContent,
                dueDate: taskItem.querySelector('.due-date').textContent,
                category: taskItem.querySelector('.category-text').textContent,
                completed: true
            };
            tasks.push(task);
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasksFromLocalStorage() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const li = createTaskElement(task);
            if (task.completed) {
                completedTasksList.push(li);
            } else {
                todoList.appendChild(li);
                totalTasks++;
            }
        });
        updateCompletionMeter();
    }

    addTodoButton.addEventListener('click', () => {
        const todoText = todoInput.value.trim();
        const dueDate = dueDateInput.value;
        const category = categorySelect.value;
        if (todoText && dueDate) {
            addTask(todoText, dueDate, category);
        } else {
            alert('Please enter a task and a due date!');
        }
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            currentFilter = this.id.replace('show-', '');
            filterTasks(currentFilter);
        });
    });
})();
