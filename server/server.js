import './config/instrument.js'
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js';
import * as Sentry from "@sentry/node";
import { clerWebhooks } from './controllers/webhooks.js';

//
const app = express();

// app.use(Sentry.Handlers.requestHandler());
// app.use(Sentry.Handlers.tracingHandler());
//connect to database
await connectDB();

//Middlewares
app.use(cors())
app.use(express.json())



app.get('/',(req,res)=>res.send("API WORKING"))
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});
app.post('/webhooks',clerWebhooks)

//  app.use(Sentry.Handlers.errorHandler());

//Port
const PORT = process.env.PORT || 5000

 Sentry.setupExpressErrorHandler(app);

app.listen(PORT, ()=>{
    console.log((`Server is running at ${PORT}`));
    
})