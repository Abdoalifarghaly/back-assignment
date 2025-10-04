require('dotenv').config();
const express=require('express')
const mongoose=require('mongoose')
const morgan=require('morgan')
const helmet=require('helmet')

const PORT=process.env.PORT

const app=express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  next();
});


app.use(helmet())
app.use(express.json())


app.use((req, res, next) => {
  console.log(`>>> ${req.method} ${req.url}`);
  next();
});

const cors = require("cors");
const allowedOrigins = [
  "http://localhost:3000",
  "https://book-assignment-beta.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
console.log("✅ CORS middleware enabled");

// ✅ لازم تضيف السطر ده علشان preflight requests تشتغل كويس في Vercel
app.use(morgan('dev'))

//handel error


app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Book API</title>
        <style>
          body { font-family: sans-serif; background: #f8f9fa; text-align:center; padding-top:50px; }
          h1 { color: #333; }
          p { color: #666; }
        </style>
      </head>
      <body>
        <h1>🚀 Book API Server is Running</h1>
        <p>Go to <a href="/api/health">/api/health</a> to check server health.</p>
      </body>
    </html>
  `);
});

app.get('/api/health', (req, res) => res.json({ ok: true, time: Date.now() }));

// routes (سيتم إضافتها لاحقاً)
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const reviewRoutes = require('./routes/reviews');

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/reviews', reviewRoutes);

app.use((err,req,res,next)=>{
    console.log(err);
    res.status(err.status||500).json({error:err.message||"server erorr"})
})

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Connected To DataBase Susscessfuly")
    app.listen(PORT,()=>console.log(`Server running on port ${PORT}`))
}).catch(err=>{
    console.error("Wrong to connect to data base",err)
    process.exit(1)

})