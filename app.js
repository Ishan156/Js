// Task1: initiate app and run server at 3000
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname + '/dist/FrontEnd')));

// Task2: create mongoDB connection 
mongoose.connect('mongodb://127.0.0.1:27017/employeesdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Employee Schema & Model
const employeeSchema = new mongoose.Schema({
    name: String,
    location: String,
    position: String,
    salary: Number
});
const Employee = mongoose.model('Employee', employeeSchema);

//TODO: get data from db  using api '/api/employeelist'
app.get('/api/employeelist', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch employees', details: err.message });
    }
});

//TODO: get single data from db  using api '/api/employeelist/:id'
app.get('/api/employeelist/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(200).json(employee);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch employee', details: err.message });
    }
});

//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}
app.post('/api/employeelist', async (req, res) => {
    try {
        const { name, location, position, salary } = req.body;
        const newEmployee = new Employee({ name, location, position, salary });
        await newEmployee.save();
        res.status(201).json(newEmployee);
    } catch (err) {
        res.status(400).json({ error: 'Failed to create employee', details: err.message });
    }
});

//TODO: delete a employee data from db by using api '/api/employeelist/:id'
app.delete('/api/employeelist/:id', async (req, res) => {
    try {
        const deleted = await Employee.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete employee', details: err.message });
    }
});

//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{_id:'',name:'',location:'',position:'',salary:''}
app.put('/api/employeelist', async (req, res) => {
    try {
        const { _id, name, location, position, salary } = req.body;
        const updated = await Employee.findByIdAndUpdate(
            _id,
            { name, location, position, salary },
            { new: true }
        );
        if (!updated) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(200).json(updated);
    } catch (err) {
        res.status(400).json({ error: 'Failed to update employee', details: err.message });
    }
});

//! dont delete this code. it connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/FrontEnd/index.html'));
});

// Start server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
