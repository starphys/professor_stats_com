require("dotenv").config()
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
app.use(morgan("dev"))


// Probably get rid of this
app.get('/', (req, res) => {
    res.json({
        status:"success",
        message:"Website coming soon"
    })
})

// Get all professors
app.get('/api/v1/professors', (req, res) => {
    console.log("Sending professors")
    const sql = 'SELECT * FROM professor'
    const params  = []
    try {  
        db.all(sql, params, (err, rows) => {
            if(err) {throw err}
            res.json({
                status:"success",
                results: rows.length,
                rows
            })
        })
    } catch (err) {
        console.log(err)
        res.json({
            ok: false,
            status:"failure"
        })
    }
})

// Get professor by id
app.get('/api/v1/professors/:id', async (req, res) => {
    console.log(req.params.id)
    const { id } = req.params
    const sql = 'SELECT * FROM professor WHERE id = $1'
    const params = [id]
    try {  
        db.all(sql, params, (err, rows) => {
            if(err) {throw err}
            res.json({
                status:"success",
                professor: rows[0]
            })
        })
    } catch (err) {
        console.log(err)
        res.json({
            ok: false,
            status:"failure"
        })
    }
})

// Add new professor
app.post('/api/v1/professors', async (req, res) => {
    console.log(req.body)
    const { body } = req
    const sql = "INSERT INTO professor (name, rating) values ($1, $2) returning *"
    const params = [body.name, body.rating]
    try {  
        db.all(sql, params, (err, rows) => {
            if(err) {throw err}
            res.json({
                status:"success",
                professor: rows[0]
            })
        })
    } catch (err) {
        console.log(err)
        res.json({
            ok: false,
            status:"failure"
        })
    }
})

// Update existing professor by id
app.put('/api/v1/professors/:id', async (req, res) => {
    console.log(req.params.id)
    console.log(req.body)
    const { id } = req.params
    const { body } = req
    const sql = "UPDATE professor SET first_name=$2, last_name=$3 WHERE id=$1 returning *"
    const params = [id, body.first_name, body.last_name]
    try {  
        db.all(sql, params, (err, rows) => {
            if(err) {throw err}
            res.json({
                status:"success",
                professor: rows[0]
            })
        })
    } catch (err) {
        console.log(err)
        res.json({
            ok: false,
            status:"failure"
        })
    }
})

// Delete existing professor by id
app.delete('/api/v1/professors/:id', async (req, res) => {
    console.log(req.params.id)
    const { id } = req.params
    const sql = 'DELETE FROM professor WHERE id = $1'
    const params = [id]
    try {  
        db.all(sql, params, (err, rows) => {
            if(err) {throw err}
            res.json({
                status:"success",
                message: `${rows[0].name} deleted.`
            })
        })
    } catch (err) {
        console.log(err)
        res.json({
            ok: false,
            status:"failure"
        })
    }
})

// Start server, listen on given port
const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})