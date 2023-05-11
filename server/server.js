require('dotenv').config()
const cors = require('cors')
const express = require('express')
const morgan = require('morgan')
const multer = require('multer')
const db = require('./db')

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../client/public/images/')
    },
    filename: function (req, file, cb) {
      const filename = req.body.username + '.jpg'
      cb(null, filename)
    }
  })
})

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
  try {
    const professor_result = db.prepare(sql).all(params)
    if (professor_result.length >= 0) {
      const professors = professor_result.map(professor => {
        const courseSql = `SELECT course.*
                    FROM course
                    INNER JOIN course_professor ON course.id = course_professor.course_id
                    WHERE course_professor.professor_id = ?`

        const courses = db.prepare(courseSql).all(professor.id)
        return { ...professor, courses }
      })
      res.json({
        status: 'success',
        results: professors.length,
        professors
      })
    } else {
      res.json({
        ok: false,
        status: 'failure',
        err: 'Not found'
      })
    }
  } catch (err) {
    console.log(err)
    res.json({
      ok: false,
      status: 'failure',
      err
    })
  }
})

// Get professor by id
app.get('/api/v1/professors/:id', async (req, res) => {
  const { id } = req.params
  const sql = `SELECT professor.*,
              school.school_name 
              FROM professor 
              INNER JOIN school ON school.id = school_professor.school_id
              INNER JOIN school_professor ON school_professor.professor_id = professor.id
              WHERE professor.id = ?`
  const courseSql = `SELECT course.*
                    FROM course
                    INNER JOIN course_professor ON course.id = course_professor.course_id
                    WHERE course_professor.professor_id = ?`
  const reviewSql = `SELECT review.*
                    FROM review
                    INNER JOIN course ON review.course_id = course.id
                    WHERE review.professor_id = ? AND review.hide_flag = 0`

  const params = [id]
  try {
    // Get the professor data
    const professor = db.prepare(sql).get(params)
    // Get course IDs and names
    const courses = db.prepare(courseSql).all(params)
    // Get reviews to calculate per-course reviews
    const reviews = db.prepare(reviewSql).all(params)

    console.log(reviews)

    const course_reviews = courses.map((course) => {
      const averages = reviews.filter(review => course.id === review.course_id).reduce((sum, review) => {
        return [
          sum[0] + review.overall,
          sum[1] + review.quality1,
          sum[2] + review.quality2,
          sum[3] + review.quality3,
          sum[4] + review.quality4,
          sum[5] + review.quality5
        ]
      }, [0, 0, 0, 0, 0, 0]).map((element) => element / (100 * reviews.filter(review => course.id === review.course_id).length))
      return { id: course.id, name: course.course_name, scores: averages }
    })
    course_reviews.unshift({ id: 0, name: 'All Courses', scores: [professor.overall, professor.quality1, professor.quality2, professor.quality3, professor.quality4, professor.quality5].map(e => e / 100) })

    if (professor && courses && course_reviews) {
      res.json({
        status: 'success',
        professor,
        course_reviews
      })
    } else {
      res.json({
        ok: false,
        status: 'failure',
        err: 'Not found'
      })
    }
  } catch (err) {
    console.log(err)
    res.json({
      ok: false,
      status: 'failure',
      err
    })
  }
})

// Add new professor
app.post('/api/v1/professors', async (req, res) => {
  const { body } = req
  const sql = 'INSERT INTO professor (first_name, last_name, degrees, overall, quality1, quality2, quality3, quality4, quality5) VALUES (?,?,?,?,?,?,?,?,?) returning *'
  const params = [body.first_name, body.last_name, body.degrees, body.overall, body.quality1, body.quality2, body.quality3, body.quality4, body.quality5]
  try {
    const professor = db.prepare(sql).get(params)
    if (professor) {
      res.json({
        status: 'success',
        professor
      })
    } else {
      res.json({
        ok: false,
        status: 'failure',
        err: 'Not added'
      })
    }
  } catch (err) {
    console.log(err)
    res.json({
      ok: false,
      status: 'failure',
      err
    })
  }
})

// Update existing professor by id
app.put('/api/v1/professors/:id', async (req, res) => {
  const { id } = req.params
  const { body } = req
  const sql = 'UPDATE professor SET first_name=?, last_name=? WHERE id=? returning *'
  const params = [body.first_name, body.last_name, id]
  try {
    const professor = db.prepare(sql).get(params)
    if (professor) {
      res.json({
        status: 'success',
        professor
      })
    } else {
      res.json({
        ok: false,
        status: 'failure',
        err: 'Not found'
      })
    }
  } catch (err) {
    console.log(err)
    res.json({
      ok: false,
      status: 'failure',
      err
    })
  }
})

// Delete existing professor by id
app.delete('/api/v1/professors/:id', async (req, res) => {
  const { id } = req.params
  const sql = 'UPDATE professor SET hide_flag=true WHERE id=? returning *'
  const params = [id]
  try {
    const professor = db.prepare(sql).get(params)
    if (professor) {
      res.json({
        status: 'success',
        message: `${professor.first_name} ${professor.last_name} deleted.`
      })
    } else {
      res.json({
        ok: false,
        status: 'failure',
        err: 'Not found'
      })
    }
  } catch (err) {
    console.log(err)
    res.json({
      ok: false,
      status: 'failure',
      err
    })
  }
})

// Access and update student records directly
// Get all students
app.get('/api/v1/students', (req, res) => {
  const sql = 'SELECT * FROM student WHERE hide_flag = 0'
  const params = []
  try {
    const students = db.prepare(sql).all(params)
    if (students.length > 0) {
      res.json({
        status: 'success',
        results: students.length,
        students
      })
    } else {
      res.json({
        ok: false,
        status: 'failure',
        err: 'Not found'
      })
    }
  } catch (err) {
    res.json({
      ok: false,
      status: 'failure',
      err
    })
  }
})

// Get one student by id
app.get('/api/v1/students/:id', async (req, res) => {
  const { id } = req.params
  const sql = 'SELECT * FROM student WHERE id = ? AND hide_flag = 0'
  const params = [id]
  try {
    const student = db.prepare(sql).get(params)
    if (student) {
      res.json({
        status: 'success',
        student
      })
    } else {
      res.json({
        ok: false,
        status: 'failure',
        err: 'Not found'
      })
    }
  } catch (err) {
    console.log(err)
    res.json({
      ok: false,
      status: 'failure',
      err
    })
  }
})

// Get one student by username
app.get('/api/v1/students/user/:username', async (req, res) => {
  const { username } = req.params
  const sql = 'SELECT * FROM student WHERE username = ? AND hide_flag = 0'
  const params = [username]
  try {
    const student = db.prepare(sql).get(params)
    if (student) {
      res.json({
        status: 'success',
        student
      })
    } else {
      res.json({
        ok: false,
        status: 'failure',
        err: 'Not found'
      })
    }
  } catch (err) {
    console.log(err)
    res.json({
      ok: false,
      status: 'failure',
      err
    })
  }
})

// Add new student
app.post('/api/v1/students', async (req, res) => {
  const { body } = req
  const sql = 'INSERT INTO student (first_name, last_name, email, username, p_word, verified) VALUES (?,?,?,?,?,?) returning *'
  const params = [body.first_name, body.last_name, body.email, body.username, body.password, 0]
  try {
    const student = db.prepare(sql).get(params)
    if (student) {
      res.json({
        status: 'success',
        student
      })
    } else {
      res.json({
        ok: false,
        status: 'failure',
        err: 'Not added'
      })
    }
  } catch (err) {
    console.log(err)
    res.json({
      ok: false,
      status: 'failure',
      err
    })
  }
})

// Update existing student by id
app.put('/api/v1/students/:id', async (req, res) => {
  const { id } = req.params
  const { body } = req
  // Can only change name right now
  const sql = 'UPDATE student SET first_name=?, last_name=?, p_word=? WHERE id=? returning *'
  const params = [body.first_name, body.last_name, body.password, id]
  try {
    const student = db.prepare(sql).get(params)
    if (student) {
      res.json({
        status: 'success',
        student
      })
    } else {
      res.json({
        ok: false,
        status: 'failure',
        err: 'Not found'
      })
    }
  } catch (err) {
    console.log(err)
    res.json({
      ok: false,
      status: 'failure',
      err
    })
  }
})

// Delete existing student by id
app.delete('/api/v1/students/:id', async (req, res) => {
  const { id } = req.params
  const sql = 'UPDATE student SET hide_flag=1 WHERE id=? returning *'
  const params = [id]

  const getReviewSql = 'SELECT * FROM review WHERE student_id = ?'

  const setReviewSql = 'UPDATE review SET hide_flag=1 WHERE id = ? returning *'

  try {
    const student = db.prepare(sql).get(params)
    const reviews = db.prepare(getReviewSql).all(params)
    reviews.forEach(review => db.prepare(setReviewSql).get(review.id))
    if (student) {
      res.json({
        status: 'success',
        message: `${student.first_name} ${student.last_name} deleted.`
      })
    } else {
      res.json({
        ok: false,
        status: 'failure',
        err: 'Not found'
      })
    }
  } catch (err) {
    console.log(err)
    res.json({
      ok: false,
      status: 'failure',
      err
    })
  }
})

// Get login token
app.post('/api/v1/login', async (req, res) => {
  const { body } = req
  const sql = 'SELECT * FROM student WHERE username = ? AND p_word = ? AND hide_flag = 0'
  const params = [body.username, body.password]
  try {
    const student = db.prepare(sql).get(params)
    if (student) {
      res.json({
        status: 'success',
        student
      })
    } else {
      res.json({
        ok: false,
        status: 'failure',
        err: 'Invalid credentials'
      })
    }
  } catch (err) {
    console.log(err)
    res.json({
      ok: false,
      status: 'failure',
      err
    })
  }
})

// Access and update reviews directly

// Get reviews by professor id
app.get('/api/v1/reviews/professor/:id', async (req, res) => {
  const { id } = req.params
  const sql = `SELECT review.*, 
                professor.first_name AS professor_first,
                professor.last_name AS professor_last,
                student.first_name AS student_first,
                student.last_name AS student_last,
                student.username AS student_username,
                course.course_name,
                course.id,
                school.school_name
                FROM review
                INNER JOIN professor ON review.professor_id = professor.id
                INNER JOIN student ON review.student_id = student.id
                INNER JOIN course ON review.course_id = course.id
                INNER JOIN school ON review.school_id = school.id
                WHERE review.professor_id = ? AND review.hide_flag = 0`
  const params = [id]
  try {
    const reviews = db.prepare(sql).all(params)
    if (reviews.length > 0) {
      res.json({
        status: 'success',
        results: reviews.length,
        reviews
      })
    } else {
      res.json({
        ok: false,
        status: 'failure',
        err: 'Not found'
      })
    }
  } catch (err) {
    console.log(err)
    res.json({
      ok: false,
      status: 'failure',
      err
    })
  }
})

// Get reviews by student id
app.get('/api/v1/reviews/student/:id', async (req, res) => {
  const { id } = req.params
  const sql = `SELECT review.*, 
                professor.first_name AS professor_first,
                professor.last_name AS professor_last,
                student.first_name AS student_first,
                student.last_name AS student_last,
                student.username AS student_username,
                course.course_name,
                course.id,
                school.school_name
                FROM review
                INNER JOIN professor ON review.professor_id = professor.id
                INNER JOIN student ON review.student_id = student.id
                INNER JOIN course ON review.course_id = course.id
                INNER JOIN school ON review.school_id = school.id
                WHERE review.student_id = ? AND review.hide_flag = 0`
  const params = [id]
  try {
    const reviews = db.prepare(sql).all(params)
    if (reviews.length > 0) {
      res.json({
        status: 'success',
        results: reviews.length,
        reviews
      })
    } else {
      res.json({
        ok: false,
        status: 'failure',
        err: 'Not found'
      })
    }
  } catch (err) {
    console.log(err)
    res.json({
      ok: false,
      status: 'failure',
      err
    })
  }
})

// Add new review
app.post('/api/v1/reviews', async (req, res) => {
  const { body } = req

  const sql = `INSERT INTO review 
    (review, overall, quality1, quality2, quality3, quality4, quality5, course_id, school_id, professor_id, student_id) 
    VALUES (?,?,?,?,?,?,?,?,?,?,?) returning *`
  const params = [body.review, body.scores[0], body.scores[1], body.scores[2], body.scores[3], body.scores[4], body.scores[5],
    body.course, body.school, body.professor, body.student]
  try {
    // Add review to get review.id
    const review = db.prepare(sql).get(params)
    if (!review) {
      res.json({
        ok: false,
        status: 'failure',
        err: 'Not added'
      })
      return
    }

    const revSql = `SELECT review.*, 
                    professor.first_name AS professor_first,
                    professor.last_name AS professor_last,
                    student.first_name AS student_first,
                    student.last_name AS student_last,
                    student.username AS student_username,
                    course.course_name,
                    course.id,
                    school.school_name
                    FROM review
                    INNER JOIN professor ON review.professor_id = professor.id
                    INNER JOIN student ON review.student_id = student.id
                    INNER JOIN course ON review.course_id = course.id
                    INNER JOIN school ON review.school_id = school.id
                    WHERE review.professor_id = ? AND review.hide_flag = 0`
    const revParams = [body.professor]
    const reviews = db.prepare(revSql).all(revParams)
    if (reviews.length < 0) {
      res.json({
        ok: false,
        status: 'failure',
        err: 'Not found'
      })
      return
    }

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

    const profSql = 'UPDATE professor SET overall=?, quality1=?, quality2=?, quality3=?, quality4=?, quality5=? WHERE id=? returning *'
    const profParams = [averages[0], averages[1], averages[2], averages[3], averages[4], averages[5], body.professor]
    const professor = db.prepare(profSql).get(profParams)
    if (!professor) {
      res.json({
        ok: false,
        status: 'failure',
        err: 'Not updated'
      })
      return
    }
    res.json({
      status: 'success',
      review,
      reviews,
      professor
    })
  } catch (err) {
    console.log(err)
    res.json({
      ok: false,
      status: 'failure',
      err
    })
  }
})

// Update existing review
app.put('/api/v1/reviews', async (req, res) => {
  const { body } = req

  const sql = 'UPDATE review SET review = ?, overall = ?, quality1 = ?, quality2 = ?, quality3 = ?, quality4 = ?, quality5 = ? WHERE id = ? returning *'
  const params = [body.review, body.scores[0], body.scores[1], body.scores[2], body.scores[3], body.scores[4], body.scores[5],
    body.id]
  try {
    // Add review to get review.id
    const review = db.prepare(sql).get(params)
    if (!review) {
      res.json({
        ok: false,
        status: 'failure',
        err: 'Not added'
      })
      return
    }

    const revSql = `SELECT review.*, 
                    professor.first_name AS professor_first,
                    professor.last_name AS professor_last,
                    student.first_name AS student_first,
                    student.last_name AS student_last,
                    student.username AS student_username,
                    course.course_name,
                    course.id,
                    school.school_name
                    FROM review
                    INNER JOIN professor ON review.professor_id = professor.id
                    INNER JOIN student ON review.student_id = student.id
                    INNER JOIN course ON review.course_id = course.id
                    INNER JOIN school ON review.school_id = school.id
                    WHERE review.professor_id = ? AND review.hide_flag = 0`
    const revParams = [body.professor]
    const reviews = db.prepare(revSql).all(revParams)
    if (reviews.length < 0) {
      res.json({
        ok: false,
        status: 'failure',
        err: 'Not found'
      })
      return
    }

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

    const profSql = 'UPDATE professor SET overall=?, quality1=?, quality2=?, quality3=?, quality4=?, quality5=? WHERE id=? returning *'
    const profParams = [averages[0], averages[1], averages[2], averages[3], averages[4], averages[5], body.professor]
    const professor = db.prepare(profSql).get(profParams)
    if (!professor) {
      res.json({
        ok: false,
        status: 'failure',
        err: 'Not updated'
      })
      return
    }
    res.json({
      status: 'success',
      review,
      reviews,
      professor
    })
  } catch (err) {
    console.log(err)
    res.json({
      ok: false,
      status: 'failure',
      err
    })
  }
})

// Update existing review
app.delete('/api/v1/reviews', async (req, res) => {
  const { body } = req

  const sql = 'UPDATE review SET hide_flag=1 WHERE id = ? returning *'
  const params = [body.id]
  try {
    const review = db.prepare(sql).get(params)
    if (!review) {
      res.json({
        ok: false,
        status: 'failure',
        err: 'Not added'
      })
      return
    }

    const revSql = `SELECT review.*, 
                    professor.first_name AS professor_first,
                    professor.last_name AS professor_last,
                    student.first_name AS student_first,
                    student.last_name AS student_last,
                    student.username AS student_username,
                    course.course_name,
                    course.id,
                    school.school_name
                    FROM review
                    INNER JOIN professor ON review.professor_id = professor.id
                    INNER JOIN student ON review.student_id = student.id
                    INNER JOIN course ON review.course_id = course.id
                    INNER JOIN school ON review.school_id = school.id
                    WHERE review.professor_id = ? AND review.hide_flag = 0`
    const revParams = [body.professor]
    const reviews = db.prepare(revSql).all(revParams)
    if (reviews.length < 0) {
      res.json({
        ok: false,
        status: 'failure',
        err: 'Not found'
      })
      return
    }

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

    const profSql = 'UPDATE professor SET overall=?, quality1=?, quality2=?, quality3=?, quality4=?, quality5=? WHERE id=? returning *'
    const profParams = [averages[0], averages[1], averages[2], averages[3], averages[4], averages[5], body.professor]
    const professor = db.prepare(profSql).get(profParams)
    if (!professor) {
      res.json({
        ok: false,
        status: 'failure',
        err: 'Not updated'
      })
      return
    }
    res.json({
      status: 'success',
      review,
      reviews,
      professor
    })
  } catch (err) {
    console.log(err)
    res.json({
      ok: false,
      status: 'failure',
      err
    })
  }
})

app.post('/api/v1/upload', upload.single('profilePicture'), (req, res) => {
  res.json({
    status: 'success'
  })
})

// Start server, listen on given port
const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
