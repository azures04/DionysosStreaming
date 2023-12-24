const fs = require("fs")
const bcrypt = require("bcryptjs")
const path = require("path")

module.exports = (root) = {
    addUser: async (user) => {
        const users = JSON.parse(await fs.readFile(path.join(root, "db", "users.json")))
        if (users.find(user_ => user_.name == user.name) || users.find(user_ => user_.email == user.email)) {
            users.push(user)
            fs.writeFileSync(path.join(root, "db", "users.json"), JSON.stringify(users, null, 4))
        } else {
            return new Error("[Module<User>] Utilisateur déjà inscrit")
        }
    },

    deleteUser: async (userUUID) => {
        const users = JSON.parse(await fs.readFile(path.join(root, "db", "users.json")))
        const user = users.find(user => user.uuid == userUUID)
        users.splice(users.indexOf(user), 1)
        fs.writeFileSync(path.join(root, "db", "users.json"), JSON.stringify(users, null, 4))
    },

    changePassword: async (userUUID, new_password) => {
        const users = JSON.parse(await fs.readFile(path.join(root, "db", "users.json")))
        const user = users.find(user => user.uuid == userUUID)
        user.password = await bcrypt.hash(new_password, 10)
        fs.writeFileSync(path.join(root, "db", "users.json"), JSON.stringify(users, null, 4))
    },

    changeGroup: async (userUUID, group) => {
        const users = JSON.parse(await fs.readFile(path.join(root, "db", "users.json")))
        const user = users.find(user => user.uuid == userUUID)
        user.group = group
        fs.writeFileSync(path.join(root, "db", "users.json"), JSON.stringify(users, null, 4))
    }
}