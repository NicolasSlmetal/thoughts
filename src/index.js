const dotenv = require('dotenv/config');

const express = require('express');
const exphbs = require('express-handlebars');
const path = require("node:path");
const session = require('express-session') ;
const FileStore = require("session-file-store")(session)
const flash = require("express-flash");
const conn = require("./db/conn");
const thougthRoutes = require("./routes/thoughtsRoutes");
const authRouters = require("./routes/authRoutes");

const PORT = process.env.PORT || 3000;
const app = express()

const Thought = require("./models/Thought");
const User = require("./models/User");
const ThoughtController = require("./controllers/ThoughtController");

app.engine("handlebars", exphbs.engine())
app.set("view engine", "handlebars");
app.set("views", "src/views");

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use(flash())

app.use(session({
    name: 'session',
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
        logFn: function (){},
        path: path.join(require("os").tmpdir(), "sessions")
    }),
    cookie: {
        secure: false,
        maxAge: 360000,
        expires: new Date(Date.now() + 360000),
        httpOnly: true
    }
}));

app.use((req, res, next) => {

    if (req.session.userid){
        res.locals.session = req.session.userid;
    }

    next()

})



app.use("/thoughts", thougthRoutes)
app.use("/auth", authRouters)



app.get("/", ThoughtController.showAllThoughts);

conn.sync()
    .then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Server running on port ${PORT}...`)
    });
}).catch((err)=> console.log(err));