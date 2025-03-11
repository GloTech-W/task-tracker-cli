const fs = require('fs');
const filepath = './tasks.json';

function readTasks() {
    if (!fs.existsSync(filepath)) {
        fs.writeFileSync(filepath, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

function writeTasks(tasks) {
    fs.writeFileSync(filepath, JSON.stringify(tasks, null, 2));
}

const args = process.argv.slice(2);
const command = args[0];

switch (command) {
    case 'add':
        addTask(args.slice(1).join(" "));
        break;
    case 'update':
        updateTask(parseInt(args[1]), args.slice(2).join(" "));
        break;
    case 'delete':
        deleteTask(parseInt(args[1]));
        break;
    case 'mark-in-progress':
        markTaskStatus(parseInt(args[1]), 'in-progress');
        break;
    case 'mark-done':
        markTaskStatus(parseInt(args[1]), 'done');
        break;
    case 'list':
        listTasks(args[1]); // Optional status filter
        break;
    default:
        console.log("Invalid command. Use 'add', 'update', 'delete', 'mark-in-progress', 'mark-done', or 'list'.");
}

// Add a new task
function addTask(description) {
    if (!description) {
        console.log("Error: Task description cannot be empty.");
        return;
    }
    const tasks = readTasks();
    const newTask = {
        id: tasks.length + 1,
        description: description,
        status: 'todo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    tasks.push(newTask);
    writeTasks(tasks);
    console.log(`Task added successfully (ID: ${newTask.id})`);
}

// Update a task's description
function updateTask(id, newDescription) {
    let tasks = readTasks();
    let task = tasks.find(t => t.id === id);
    if (!task) {
        console.log(`Error: Task with ID ${id} not found.`);
        return;
    }

    task.description = newDescription;
    task.updatedAt = new Date().toISOString();
    writeTasks(tasks);
    console.log(`Task ${id} updated successfully.`);
}

// Delete a task
function deleteTask(id) {
    let tasks = readTasks();
    const updatedTasks = tasks.filter(task => task.id !== id);

    if (tasks.length === updatedTasks.length) {
        console.log(`Error: Task with ID ${id} not found.`);
        return;
    }

    writeTasks(updatedTasks);
    console.log(`Task ${id} deleted successfully.`);
}

// Change task status
function markTaskStatus(id, status) {
    let tasks = readTasks();
    let task = tasks.find(t => t.id === id);
    if (!task) {
        console.log(`Error: Task with ID ${id} not found.`);
        return;
    }

    task.status = status;
    task.updatedAt = new Date().toISOString();
    writeTasks(tasks);
    console.log(`Task ${id} marked as ${status}.`);
}

// List tasks, optionally filtered by status
function listTasks(statusFilter) {
    const tasks = readTasks();
    
    const filteredTasks = statusFilter
        ? tasks.filter(task => task.status === statusFilter)
        : tasks;

    if (filteredTasks.length === 0) {
        console.log(statusFilter ? `No tasks found with status '${statusFilter}'.` : "No tasks available.");
        return;
    }

    console.log("Tasks:");
    filteredTasks.forEach(task => {
        console.log(`[${task.id}] ${task.description} - ${task.status}`);
    });
}
