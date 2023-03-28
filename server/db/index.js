var sqlite3 = require('sqlite3').verbose()

let db = new sqlite3.Database("db.sqlite", (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }
    
    else{
        console.log('Connected to the SQLite database.')
        
        // Create school table
        db.run(`CREATE TABLE school (
            id integer primary key,
            school_name text not null,
            hide_flag boolean not null default false);`,
        (err) => {
            if (err) {
                // Table already created
            } else{
                // Populate initial school data
                const insert = 'INSERT INTO school (school_name) VALUES (?)'
                db.run(insert, ["San Jose State University"])
            }
        })

        // Create professor table
        db.run(`CREATE TABLE professor (
            id integer primary key,
            first_name text not null,
            last_name text not null,
            degrees text,
            overall numeric not null,
            quality1 numeric not null,
            quality2 numeric not null,
            quality3 numeric not null,
            quality4 numeric not null,
            quality5 numeric not null,
            hide_flag boolean not null default false);`,
        (err) => {
            if (err) {
                // Table already created
            } else{
                // Populate initial professor data
                const insert = 'INSERT INTO professor (first_name, last_name, degrees, overall, quality1, quality2, quality3, quality4, quality5) VALUES (?,?,?,?,?,?,?,?,?)'
                db.run(insert, ["Fake","Professor","PhD Computer Science",99,99,99,99,99,99])
            }
        })  

        // Create course table
        db.run(`CREATE TABLE course (
            id integer primary key,
            course_name text not null,
            school_id int not null,
            hide_flag boolean not null default false,
            constraint fk_school FOREIGN KEY(school_id) REFERENCES school(id));`,
        (err) => {
            if (err) {
                // Table already created
            } else{
                // Populate initial course data
                const insert = 'INSERT INTO course (course_name, school_id) VALUES (?,?)'
                db.run(insert, ["CMPE 133",1])
            }
        })  

        // Create student table
        db.run(`CREATE TABLE student (
            id integer primary key,
            first_name text not null,
            last_name text not null,
            username text not null,
            p_word text not null,
            verified boolean not null default false,
            hide_flag boolean not null default false);`,
        (err) => {
            if (err) {
                // Table already created
            } else{
                // Populate initial student data
                const insert = 'INSERT INTO student (first_name, last_name, username, p_word, verified) VALUES (?,?,?,?,?)'
                db.run(insert, ["Fake","Student","fakestudent","fakepassword",true])
            }
        })

        // Create review table
        db.run(`CREATE TABLE review (
            id integer primary key,
            
            review text,
            overall numeric not null,
            quality1 numeric not null,
            quality2 numeric not null,
            quality3 numeric not null,
            quality4 numeric not null,
            quality5 numeric not null,
            
            course_id int not null,
            school_id int not null,
            professor_id int not null,
            student_id int not null,
            hide_flag boolean not null default false,
            constraint fk_course FOREIGN KEY(course_id) REFERENCES course(id),
            constraint fk_school FOREIGN KEY(school_id) REFERENCES school(id),
            constraint fk_professor FOREIGN KEY(professor_id) REFERENCES professor(id),
            constraint fk_student FOREIGN KEY(student_id) REFERENCES student(id));`,
        (err) => {
            if (err) {
                // Table already created
            } else{
                // Populate initial review data
                const insert = `INSERT INTO review 
                (review, overall, quality1, quality2, quality3, quality4, quality5, course_id, school_id, professor_id, student_id) 
                VALUES (?,?,?,?,?,?,?,?,?,?,?)`
                db.run(insert, ["Not bad!",500,500,500,500,500,500,1,1,1,1])
            }
        })  

        // Create course_professor table
        db.run(`CREATE TABLE course_professor (
            course_id int REFERENCES course(id) ON UPDATE CASCADE,
            professor_id int REFERENCES professor(id) ON UPDATE CASCADE,
            CONSTRAINT pk_course_professor PRIMARY KEY(course_id, professor_id));`,
        (err) => {
            if (err) {
                // Table already created
            } else{
                // Populate initial course_professor data
                const insert = 'INSERT INTO course_professor (course_id, professor_id) VALUES (?,?)'
                db.run(insert, [1,1])
            }
        }) 

        // Create school_professor table
        db.run(`CREATE TABLE school_professor (
            school_id int REFERENCES school(id) ON UPDATE CASCADE,
            professor_id int REFERENCES professor(id) ON UPDATE CASCADE,
            CONSTRAINT pk_school_professor PRIMARY KEY(school_id, professor_id));`,
        (err) => {
            if (err) {
                // Table already created
            } else{
                // Populate initial school_professor data
                const insert = 'INSERT INTO school_professor (school_id, professor_id) VALUES (?,?)'
                db.run(insert, [1,1])
            }
        })  
        
    }
})

module.exports = db
