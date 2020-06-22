const express = require('express')
var fs = require('fs')
const app = express()
const bodyParser = require('body-parser')
var students = []

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//app.get('/', (req, res) => res.send(users))

app.get('/students', (req, res) => {
    if (req.query.search) {
		res.send(students.filter((student)=>student.username===req.query.search));
	} else {
		res.send(students);
	}
})
app.get('/students/:studentId', (req, res) => {
	var student = students[req.params.studentId-1];
	if (student) {
		res.send(student);
	} else {
		res.status(400).send("Student with id "+req.params.studentId+" does not exist!");
	}
})
app.get('/grades/:studentId', (req, res) => {
	var student = students[req.params.studentId-1];
	if (student) {
		var grades = student.grades;
		res.send(grades);
	} else {
		res.status(400).send("Student with id "+req.params.studentId+" does not exist!");
	}
})
app.post('/grades', (req, res) => {
	var student = students[req.body.studentId-1];
	if (student) {
		if (req.body.grade) {
			var grades = student.grades;
			student.grades.push(req.body.grade)
			res.status(200).send("OK!");
		} else {
			res.status(400).send("grade was not provided!");
		}
	} else {
		res.status(400).send("studentId "+req.body.studentId+" does not exist!");
	}
})
app.post('/register', (req, res) => {
    if (req.body.username) {
		if (req.body.email) {
			var newUser = req.body;
			newUser.id = students.length;
			newUser.grades = [];
			students.push(newUser);
			res.status(200).send("OK!");
		} else {
			res.status(400).send("email was not provided!");
		}
	} else {
		res.status(400).send("username was not provided!");
	}
})

const port = 3000
app.listen(port, () => console.log(`My API that refuses to rest and is wonderful is listening at http://localhost:${port}`))