import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import router from './routes/openingRoutes.js'
const app = express()
app.use(cors())
app.use('/openings', router)


const PORT = process.env.PORT || 5000



app.listen(PORT, () => {
    console.log('serving running on port:', PORT)
})