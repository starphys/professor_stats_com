const db = require('better-sqlite3')('db.sqlite')
db.pragma('journal_mode = WAL')

try {
  db.prepare(`CREATE TABLE school (
            id integer primary key,
            school_name text not null,
            hide_flag boolean not null default false);`)
    .run()
  db.prepare('INSERT INTO school (school_name) VALUES (?)')
    .run('San Jose State University')
} catch (err) {
  if (err.message.search('already exists') === -1) {
    console.log('Failed to create school table.')
    console.log(err)
  }
}

try {
  db.prepare(`CREATE TABLE professor (
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
              hide_flag boolean not null default false);`)
    .run()
  db.prepare('INSERT INTO professor (first_name, last_name, degrees, overall, quality1, quality2, quality3, quality4, quality5) VALUES (?,?,?,?,?,?,?,?,?)')
    .run('Fake', 'Professor', 'PhD Computer Science', 500, 500, 500, 500, 500, 500)
} catch (err) {
  if (err.message.search('already exists') === -1) {
    console.log('Failed to create professor table.')
    console.log(err)
  }
}

try {
  db.prepare(`CREATE TABLE course (
              id integer primary key,
              course_name text not null,
              school_id int not null,
              hide_flag boolean not null default false,
              constraint fk_school FOREIGN KEY(school_id) REFERENCES school(id));`)
    .run()
  db.prepare('INSERT INTO course (course_name, school_id) VALUES (?,?)')
    .run('CMPE 133', 1)
  db.prepare('INSERT INTO course (course_name, school_id) VALUES (?,?)')
    .run('CMPE 165', 1)
} catch (err) {
  if (err.message.search('already exists') === -1) {
    console.log('Failed to create course table.')
    console.log(err)
  }
}

try {
  db.prepare(`CREATE TABLE student (
              id integer primary key,
              first_name text not null,
              last_name text not null,
              email text not null,
              username text not null unique,
              p_word text not null,
              verified boolean not null default false,
              hide_flag boolean not null default false);`)
    .run()
  db.prepare('INSERT INTO student (first_name, last_name, email, username, p_word, verified) VALUES (?,?,?,?,?,?)')
    .run('Fake', 'Student', 'fake@school.edu', 'fakestudent', 'fakepassword', 1)
} catch (err) {
  if (err.message.search('already exists') === -1) {
    console.log('Failed to create stduent table.')
    console.log(err)
  }
}

try {
  db.prepare(`CREATE TABLE review (
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
              constraint fk_student FOREIGN KEY(student_id) REFERENCES student(id));`)
    .run()
  db.prepare(`INSERT INTO review 
              (review, overall, quality1, quality2, quality3, quality4, quality5, course_id, school_id, professor_id, student_id) 
              VALUES (?,?,?,?,?,?,?,?,?,?,?)`)
    .run('Not bad!', 500, 500, 500, 500, 500, 500, 1, 1, 1, 1)
} catch (err) {
  if (err.message.search('already exists') === -1) {
    console.log('Failed to create review table.')
    console.log(err)
  }
}

try {
  db.prepare(`CREATE TABLE course_professor (
              course_id int REFERENCES course(id) ON UPDATE CASCADE,
              professor_id int REFERENCES professor(id) ON UPDATE CASCADE,
              CONSTRAINT pk_course_professor PRIMARY KEY(course_id, professor_id));`)
    .run()
  db.prepare('INSERT INTO course_professor (course_id, professor_id) VALUES (?,?)')
    .run(1, 1)
  db.prepare('INSERT INTO course_professor (course_id, professor_id) VALUES (?,?)')
    .run(2, 1)
} catch (err) {
  if (err.message.search('already exists') === -1) {
    console.log('Failed to create course_professor table.')
    console.log(err)
  }
}

try {
  db.prepare(`CREATE TABLE school_professor (
              school_id int REFERENCES school(id) ON UPDATE CASCADE,
              professor_id int REFERENCES professor(id) ON UPDATE CASCADE,
              CONSTRAINT pk_school_professor PRIMARY KEY(school_id, professor_id));`)
    .run()
  db.prepare('INSERT INTO school_professor (school_id, professor_id) VALUES (?,?)')
    .run(1, 1)
} catch (err) {
  if (err.message.search('already exists') === -1) {
    console.log('Failed to create school_professor table.')
    console.log(err)
  }
}

module.exports = db
