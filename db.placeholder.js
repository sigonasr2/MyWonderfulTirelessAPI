/*
	Define database settings in here! Then rename this file to db.js to run the server!
*/

/*MySQL structures:
	Required Tables:

	students=> \d student
	 id       | integer                | not null default nextval('student_id_seq'::regclass)
	 username | character varying(255) |
	 email    | character varying(255) |
	 
	students=> \d grade
	 studentid | integer |
	 grade     | integer |


*/

const pg = require('pg').Pool;

const db = new pg({
  user: '',
  host: 'localhost',
  database: 'students',
  password: '',
  port: 5432
})

module.exports = {db};