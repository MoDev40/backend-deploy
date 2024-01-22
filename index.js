import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRoute.js';
import itemsRouter from './routes/itemsRoute.js';
import categoryRouter from './routes/categoryRoute.js';
import transRouter from './routes/transactionRoute.js';
import nofityRouter from './routes/notificationRoute.js';
import reportRouter from './routes/reportRoute.js';

const PORT = 8000
const app = express();

app.use(express.json())
app.use(cookieParser())
app.use(cors())

app.use('/api',userRouter)
app.use('/api',itemsRouter)
app.use('/api',categoryRouter)
app.use('/api',transRouter)
app.use('/api',nofityRouter)
app.use('/api',reportRouter)

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
})