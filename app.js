const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'tasks.json');

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve basic HTML form for viewing and adding tasks
app.get('/', (req, res) => {
  // Read tasks from the JSON file
  let tasks;
  try {
    tasks = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8') || '[]');
  } catch (error) {
    tasks = [];
  }

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>To-Do List</title>
    </head>
    <body>
      <h1>To-Do List</h1>
      <ul>
        ${tasks.map(task => `<li>${task}</li>`).join('')}
      </ul>
      <form action="/add" method="POST">
        <input type="text" name="task" placeholder="New task" required />
        <button type="submit">Add Task</button>
      </form>
      <form action="/clear" method="POST" style="margin-top: 20px;">
        <button type="submit">Clear All Tasks</button>
      </form>
    </body>
    </html>
  `;
  res.send(html);
});

// Route to add a new task
app.post('/add', (req, res) => {
  const task = req.body.task;
  let tasks;
  try {
    tasks = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8') || '[]');
  } catch (error) {
    tasks = [];
  }
  tasks.push(task);
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks));
  res.redirect('/');
});

// Route to clear all tasks
app.post('/clear', (req, res) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
  res.redirect('/');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
