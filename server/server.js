require('dotenv').config()
const cors = require('cors')
const express = require('express')
const morgan = require('morgan')
const db = require('./db')

const app = express()

// Allow cross-site requests
app.use(cors())

// Extract parameters into attached object
app.use(express.json())

// Logging incoming traffic for debugging purposes
app.use(morgan('dev'))

// Probably get rid of this
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Website coming soon'
  })
})

// Access and update professor records directly
// Get all professors
app.get('/api/v1/professors', (req, res) => {
  const sql = 'SELECT * FROM professor'
  const params = []
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.json({
        ok: false,
        status: 'failure',
        err
      })
    } else {
      res.json({
        status: 'success',
        results: rows.length,
        professors: rows
      })
    }
  })
})

// Get professor by id
app.get('/api/v1/professors/:id', async (req, res) => {
  const { id } = req.params
  const sql = 'SELECT * FROM professor WHERE id = $1'
  const params = [id]
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.json({
        ok: false,
        status: 'failure',
        err
      })
    } else {
      res.json({
        status: 'success',
        professor: rows[0]
      })
    }
  })
})

// Add new professor
app.post('/api/v1/professors', async (req, res) => {
  const { body } = req
  const sql = 'INSERT INTO professor (first_name, last_name, degrees, overall, quality1, quality2, quality3, quality4, quality5) VALUES (?,?,?,?,?,?,?,?,?) returning *'
  const params = [body.first_name, body.last_name, body.degrees, body.overall, body.quality1, body.quality2, body.quality3, body.quality4, body.quality5]
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.json({
        ok: false,
        status: 'failure',
        err
      })
    } else {
      res.json({
        status: 'success',
        professor: rows[0]
      })
    }
  })
})

// Update existing professor by id
app.put('/api/v1/professors/:id', async (req, res) => {
  const { id } = req.params
  const { body } = req
  const sql = 'UPDATE professor SET first_name=$2, last_name=$3 WHERE id=$1 returning *'
  const params = [id, body.first_name, body.last_name]
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.json({
        ok: false,
        status: 'failure',
        err
      })
    } else {
      res.json({
        status: 'success',
        professor: rows[0]
      })
    }
  })
})

// Delete existing professor by id
app.delete('/api/v1/professors/:id', async (req, res) => {
  const { id } = req.params
  const sql = 'DELETE FROM professor WHERE id = $1'
  const params = [id]
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.json({
        ok: false,
        status: 'failure',
        err
      })
    } else {
      res.json({
        status: 'success',
        message: `${rows[0].name} deleted.`
      })
    }
  })
})

// Access and update student records directly
// Get all students
app.get('/api/v1/students', (req, res) => {
  const sql = 'SELECT * FROM student'
  const params = []
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.json({
        ok: false,
        status: 'failure',
        err
      })
    } else {
      res.json({
        status: 'success',
        results: rows.length,
        students: rows
      })
    }
  })
})

// Get one student by id
app.get('/api/v1/students/:id', async (req, res) => {
  const { id } = req.params
  const sql = 'SELECT * FROM student WHERE id = $1'
  const params = [id]
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.json({
        ok: false,
        status: 'failure',
        err
      })
    } else {
      res.json({
        status: 'success',
        student: rows[0]
      })
    }
  })
})

// Get one student by username
app.get('/api/v1/students/:username', async (req, res) => {
  const { username } = req.params
  const sql = 'SELECT * FROM student WHERE username = $1'
  const params = [username]
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.json({
        ok: false,
        status: 'failure',
        err
      })
    } else {
      res.json({
        status: 'success',
        student: rows[0]
      })
    }
  })
})

// Add new student
app.post('/api/v1/students', async (req, res) => {
  const { body } = req
  const sql = 'INSERT INTO student (first_name, last_name, email, username, p_word, verified) VALUES (?,?,?,?,?,?) returning *'
  const params = [body.first_name, body.last_name, body.email, body.username, body.password, false]
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.json({
        ok: false,
        status: 'failure',
        err
      })
    } else {
      res.json({
        status: 'success',
        student: rows[0]
      })
    }
  })
})

// Update existing student by id
app.put('/api/v1/student/:id', async (req, res) => {
  const { id } = req.params
  const { body } = req
  // Can only change name right now
  const sql = 'UPDATE student SET first_name=$2, last_name=$3 WHERE id=$1 returning *'
  const params = [id, body.first_name, body.last_name]
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.json({
        ok: false,
        status: 'failure',
        err
      })
    } else {
      res.json({
        status: 'success',
        student: rows[0]
      })
    }
  })
})

// TODO: Update existing student with new password

// Delete existing student by id
app.delete('/api/v1/students/:id', async (req, res) => {
  const { id } = req.params
  const sql = 'DELETE FROM student WHERE id = $1'
  const params = [id]
  db.all(sql, params, (err, rows) => {
    if (err) { throw err } if (err) {
      res.json({
        ok: false,
        status: 'failure',
        err
      })
    } else {
      res.json({
        status: 'success',
        message: `${rows[0].name} deleted.`
      })
    }
  })
})

// Get login token
// Add new student
app.post('/api/v1/login', async (req, res) => {
  const { body } = req
  const sql = 'SELECT * FROM student WHERE username = $1'
  const params = [body.username]
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.json({
        ok: false,
        status: 'failure',
        err
      })
    } else {
      if (rows.length > 0 && body.password === rows[0].p_word) {
        res.json({
          status: 'success',
          student: rows[0]
        })
      } else {
        res.json({
          status: 'failure',
          message: 'Invalid credentials'
        })
      }
    }
  })
})

// Access and update reviews directly

// Get reviews by professor id
app.get('/api/v1/reviews/:id', async (req, res) => {
  const { id } = req.params
  const sql = 'SELECT * FROM review WHERE professor_id = $1'
  const params = [id]
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.json({
        ok: false,
        status: 'failure',
        err
      })
    } else {
      res.json({
        status: 'success',
        reviews: rows
      })
    }
  })
})

// Add new review
app.post('/api/v1/reviews', async (req, res) => {
  const { body } = req

  db.serialize()

  const sql = `INSERT INTO review 
    (review, overall, quality1, quality2, quality3, quality4, quality5, course_id, school_id, professor_id, student_id) 
    VALUES (?,?,?,?,?,?,?,?,?,?,?) returning *`
  const params = [body.review, body.scores[0], body.scores[1], body.scores[2], body.scores[3], body.scores[4], body.scores[5],
    body.course, body.school, body.professor, body.student]
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.json({
        ok: false,
        status: 'failure',
        err
      })
    } else {
      const review = rows[0]
      const rev_sql = 'SELECT * FROM review WHERE professor_id = $1'
      const rev_params = [body.professor]
      db.all(rev_sql, rev_params, (err, rows) => {
        if (err) {
          res.json({
            ok: false,
            status: 'failure',
            err
          })
        } else {
          const reviews = rows
          const averages = reviews.reduce((sum, review) => {
            return [
              sum[0] + review.overall,
              sum[1] + review.quality1,
              sum[2] + review.quality2,
              sum[3] + review.quality3,
              sum[4] + review.quality4,
              sum[5] + review.quality5
            ]
          }, [0, 0, 0, 0, 0, 0]).map((element) => element / reviews.length)
          
          const prof_sql = 'UPDATE professor SET overall=?, quality1=?, quality2=?, quality3=?, quality4=?, quality5=? WHERE id=?'
          const prof_params = [averages[0], averages[1], averages[2], averages[3], averages[4], averages[5], body.professor]
          db.run(prof_sql, prof_params, (err) => {
            if (err) {
              res.json({
                ok: false,
                status: 'failure',
                err
              })
            } else {
              const final_sql = 'SELECT * FROM professor WHERE id = $1'
              const final_params = [body.professor]
              db.all(final_sql, final_params, (err, rows) => {
                if (err) {
                  res.json({
                    ok: false,
                    status: 'failure',
                    err
                  })
                } else {
                  res.json({
                    status: 'success',
                    review,
                    reviews,
                    professor: rows[0]
                  })
                }
              })
            }
          })
        }
      })
    }
  })

  db.parallelize()
})

// Start server, listen on given port
const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
