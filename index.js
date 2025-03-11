const fs = require('fs');
const filepath = './tasks.json';

function readTasks() {
    if (!fs.existsSync(filepath)) {
        fs.writeFileSync(filepath, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

function writeTasks(tasks) {
    fs.writeFileSync(filepath,JSON.stringify(tasks, null, 2));
}

const args = process.argv.slice(2);
const command = args[0];
const taskDescription = args.slice(1).join(" ");

switch (command) {
    case 'add':
        addTask(taskDescription);
        break;
    case 'list':
        listTasks();
        break;
    default:
        console.log("Invalid command. Use 'add' or 'list'.");
}

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

    console.log(`Task added successfullty (ID: ${newTask.id})`);
}

function listTasks() {
    const tasks = readTasks();

    if (tasks.length === 0) {
        console.log("No tasks available.");
        return;
    }

    console.log("Tasks:");
    tasks.forEach(task => {
        console.log(`[${task.id}] ${task.description} - ${task.status}`);
    });
}