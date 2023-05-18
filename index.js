const mongoose = require('mongoose')
const dotenv = require('dotenv')
const express = require('express')
const app = express()
const cors = require('cors')
const User = require('./model')

app.use(
  cors(),
  express.json(),
  express.urlencoded({ extended: true })
)

mongoose.set('strictQuery', true)

dotenv.config({ path: __dirname + '/config/.env' });


//connect to database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to Database')
  })
  .catch((err) => { console.log(err) })


//add routes
app.post("/api/register", async (req, res) => {

  const { name, email, contact } = req.body
  if (!(name && email && contact)) {
    return res.status(400).send("Please enter all required information")
  }

  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    contact: req.body.contact
  })

  try {
    const savedUser = await newUser.save()
    res.status(200).json(savedUser)
  } catch (err) {
    res.status(500).json(err)
  }
})

app.put("/api/:id", async (req, res) => {

  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          contact: req.body.contact
        }
      },
      { new: true }
    )
    res.status(200).json(updateUser)

  } catch (err) {
    res.status(500).json(err)
  }
})

app.delete("/api/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json("User is removed")

  } catch (err) {
    res.status(500).json(err)
  }
})

app.get("/api/allUsers", async (req, res) => {
  try {
    const user = await User.find({})
    res.status(200).json(user)
  } catch (err) {
    res.status(500).json(err)
  }
})

app.get("/api/:id", async(req, res) => {
  try {
    const getUser = await User.findById(req.params.id)
    res.status(200).json(getUser)
  } catch (err) {
    res.status(500).json(err)
  }
})


//server
const PORT = process.env.PORT || 5050

app.listen(
  PORT,
  console.log(`Server running on port ${PORT}`)
)