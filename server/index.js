const express = require("express")
const cors = require("cors")

const {createPool} = require("mysql")
const jwt = require("jsonwebtoken")

const app = express()
app.use(express.json())

app.use(cors({
    origin : "http://localhost:3000"
}))


app.listen(8086, () => {
    console.log("Server running at 8086")
})

//mysql connection

const pool = createPool({
    host : "localhost",
    user : "root",
    password : "",
    database : "mydatabase",
    connectionLimit : 10
})



//login api

app.post("/login", async (req, res) => {
    const {username, password} = req.body

    const getUserNameQuery = `SELECT * FROM users WHERE username = '${username}';`
    const dbUser = await pool.query(getUserNameQuery)
    console.log(dbUser)

    if (dbUser !== undefined){
        if (password === dbUser.password){
            const payload = {
                username: username,
              }
            const jwtToken = jwt.sign(payload, 'SECRET_TOKEN')
            res.send({jwtToken})
        }
    }
})


//reset api

app.put("/reset", async(req, res) => {
    const {username, newPassword} = req.body

    const getUserNameQuery = `SELECT * FROM users WHERE username = '${username}';`
    const dbUser = await pool.query(getUserNameQuery)

    if (dbUser !== undefined){
        const updateQuery = `UPDATE users SET password = '${newPassword}' WHERE username = '${username}'`
        await pool.query(updateQuery)
        res.status(200)
    }
})



module.exports = app