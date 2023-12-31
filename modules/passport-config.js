const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcryptjs")

function initialize(passport, getUserByName, getUserById) {
    const authenticateUser = async (username, password, done) => {
        const user = getUserByName(username)
        if (user == null) {
            return done(null, false, {
                message: "No user with that email"
            })
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, {
                    message: "Mot de passe incorrect"
                })
            }
        } catch (e) {
            return done(e)
        }
    }

    passport.use(new LocalStrategy({
        usernameField: "username"
    }, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    })
}

module.exports = initialize