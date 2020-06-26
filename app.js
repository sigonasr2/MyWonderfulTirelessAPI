const express = require('express')
var fs = require('fs')
const app = express()
const bodyParser = require('body-parser')
const db = require('./db').db;
//var students = []

/*students:
username
email
grades*/

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//app.get('/', (req, res) => res.send(users))

function handleError(err) {
	if (err) {
		throw err;
	}
}

app.get('/students', (req, res) => {
    if (req.query.search) {
		//res.send(students.filter((student)=>student.username===req.query.search));
		db.query("select * from student where username=$1",[req.query.search],(err,data)=>{
			handleError(err);
			res.status(200).json(data.rows);
		})
	} else {
		db.query("select * from student", (err,data)=>{
			handleError(err);
			res.status(200).json(data.rows);
		})
	}
})
app.get('/students/:studentId', (req, res) => {
	db.query("select * from student where id=$1", [req.params.studentId], (err,data)=>{
		handleError(err);
		if (data.rows.length>0) {
			res.status(200).send(data.rows)
		} else {
			res.status(400).send("Student with id "+req.params.studentId+" does not exist!");
		}
	})
})
app.get('/grades/:studentId', (req, res) => {
	db.query("select student.id, grade.grade from student inner join grade on student.id=grade.studentid where student.id=$1", [req.params.studentId], (err,data)=>{
		handleError(err);
		if (data.rows.length>0) {
			res.status(200).send(data.rows)
		} else {
			res.status(400).send("Student with id "+req.params.studentId+" does not have any grades!");
		}
	})
})
app.post('/grades', (req, res) => {
	if (req.body && req.body.studentId && req.body.grade) {
		/*Verify user w/ID exists*/db.query("select * from student where id=$1", [req.body.studentId])
		.then(data=>data.rows.length>0)
		.then((exists)=>{
			if (exists) {
				return db.query("insert into grade(studentid,grade) values($1,$2) returning *", [req.body.studentId,req.body.grade])
			} else {
				res.status(400).send("Student with id "+req.body.studentId+" does not exist!");
			}
		})
		.then(data=>{
			res.status(200).send("OK! Updated "+data.rows.length+" rows.");
		})
	} else {
		res.status(400).send("Missing studentId / grade!");
	}
})
app.post('/register', (req, res) => {
    if (req.body && req.body.username && req.body.email) {
		/*Verify user has unique username.*/db.query("select * from student where username=$1",[req.body.username])
		.then(data=>{
			if (data.rows.length>0) {
			res.status(400).send("Student with username "+req.body.username+" already exists! Must be unique.");
			} else {
				return db.query("insert into student(username,email) values($1,$2) returning *",[req.body.username,req.body.email]);
			}
		})
		.then(data=>{res.status(200).send("OK! Updated "+data.rows.length+" rows.")});
	} else {
		res.status(400).send("Missing username / email!");
	}
})

const port = 3004
app.listen(port, () => console.log(`My API that refuses to rest and is wonderful is listening at http://localhost:${port}`))