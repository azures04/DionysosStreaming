const fs = require("fs")
const config = require("./config.json")
const { passport_config, users, profiles, scan} = require("./modules/modules")
const express = require("express")
const app = express()
const path = require("path")
const bcrypt = require("bcryptjs")
const passport = require("passport")
const flash = require("express-flash")
const session = require("express-session")
const methodOverride = require("method-override")

const initializePassport = passport_config
initializePassport(
    passport,
    name => JSON.parse(fs.readFileSync(path.join(__dirname, "db", "users.json"))).find(user => user.name === name),
    id => JSON.parse(fs.readFileSync(path.join(__dirname, "db", "users.json"))).find(user => user.id === id)
)

app.set("view-engine", "ejs")
app.use(express.urlencoded({
    extended: false
}))
app.use(flash())
app.use(session({
    secret: "PJQBzou4MhiDPzu",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride("_method"))

app.get("/", checkAuthenticated, (req, res) => {
    res.render("index.ejs", {
        user: req.user
    })
})

app.use("/assets/", (req, res) => {
	res.sendFile(path.join(__dirname, "views", "assets", req.path))
})

app.get("/login", checkNotAuthenticated, (req, res) => {
    res.render("login.ejs")
})

app.post("/login", checkNotAuthenticated, passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}))

app.get("/register", checkNotAuthenticated, (req, res) => {
    res.render("register.ejs")
})

app.post("/register", checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.addUser({
            id: Date.now().toString(),
            name: req.body.username,
            email: req.body.email,
            group: "member",
            password: hashedPassword
        }, __dirname)
        res.redirect("/login")
    } catch {
        res.redirect("/register")
    }
})

app.delete("/logout", (req, res) => {
    req.logOut()
    res.redirect("/login")
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect("/login")
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/")
    }
    next()
}

app.listen(config.port, () => {
	console.log(`Server listening at port : ${config.port}`)
})