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
            id serial not null primary key,
            school_name text not null,
            hide_flag boolean not null default false);`,
        (err) => {
            if (err) {
                // Table already created
            } else{
                // Populate initial school data
            }
        })

        // Create professor table
        db.run(`CREATE TABLE professor (
            id serial not null primary key,
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
            }
        })  

        // Create course table
        db.run(`CREATE TABLE course (
            id serial not null primary key,
            course_name text not null,
            school_id int not null,
            constraint fk_school FOREIGN KEY(school_id) REFERENCES school(id),
            hide_flag boolean not null default false);`,
        (err) => {
            if (err) {
                // Table already created
            } else{
                // Populate initial course data
            }
        })  

        // Create student table
        db.run(`CREATE TABLE student (
            id serial not null primary key,
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
            }
        })

        // Create review table
        db.run(`CREATE TABLE review (
            id serial not null primary key,
            
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
            constraint fk_course FOREIGN KEY(course_id) REFERENCES course(id),
            constraint fk_school FOREIGN KEY(school_id) REFERENCES school(id),
            constraint fk_professor FOREIGN KEY(professor_id) REFERENCES professor(id),
            constraint fk_student FOREIGN KEY(student_id) REFERENCES student(id),
            hide_flag boolean not null default false);`,
        (err) => {
            if (err) {
                // Table already created
            } else{
                // Populate initial review data
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
            }
        })  
        
    }
})

module.exports = db
