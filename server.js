const express=require('express');
const app=express();

const cors = require('cors');
app.use(cors());

const {PrismaClient}=require('@prisma/client');
const prisma=new PrismaClient();

const bodyparser = require('body-parser');
app.use(bodyparser.json());

// Endpoint for getting all todos from database
app.get('/api/todos', async (req, res) => {
    try {
        const tasks = await prisma.task.findMany();
        res.json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Endpoint for creating a new todo in database
app.post('/api/todos', async (req, res) => {
    const { title, description, completed, due_date } = req.body;
    try {
        const task = await prisma.task.create({
            data: {
                title,
                description,
                completed,
                due_date
            }
        });
        res.json(task);
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Endpoint for updating a todo in database
app.put('/api/todos/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, completed, due_date } = req.body;
    try {
        const updatedFields = {};

        
        if (title !== undefined) updatedFields.title = title;
        if (description !== undefined) updatedFields.description = description;
        if (completed !== undefined) updatedFields.completed = completed;
        if (due_date !== undefined) updatedFields.due_date = due_date;

        const task = await prisma.task.update({
            where: { task_id: Number(id) },
            data: updatedFields 
        });
        res.json(task);
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Endpoint for deleting a todo from database
app.delete('/api/todos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const task = await prisma.task.delete({
            where: { task_id: Number(id) }
        });
        res.json(task);
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).send("Internal Server Error");
    }
});


app.listen(8000,()=>console.log("server is running on port 8000"))


