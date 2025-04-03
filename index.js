const express = require('express')
const connectDB = require('./db')
const app = express()
const port = 3000
const cors =require('cors')

app.use(cors())
app.use(express.json())


app.use('/api',require('./routes/productRoute'))
app.use('/api',require('./routes/userRoute'))
app.use('/api',require('./routes/cartRoute'))


app.get('/', (req, res) => {
  res.send('Hello World!')
})
connectDB()
app.listen(port, () => {
  console.log(`app listening on port ${port}`)
}) 