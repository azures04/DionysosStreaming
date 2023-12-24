const fs = require("fs/promises")
const bcrypt = require("bcryptjs")
const path = require("path")

module.exports = {
    addUser: async (user, root) => {
        const users = JSON.parse(await fs.readFile(path.join(root, "db", "users.json")))
        if (!users.find(user_ => user_.name == user.name) || !users.find(user_ => user_.email == user.email)) {
            users.push(user)
            await fs.writeFile(path.join(root, "db", "users.json"), JSON.stringify(users, null, 4))
        } else {
            return new Error("[Module<User>] Utilisateur déjà inscrit")
        }
    },

    deleteUser: async (userUUID, root) => {
        const users = JSON.parse(await fs.readFile(path.join(root, "db", "users.json")))
        const user = users.find(user => user.uuid == userUUID)
        users.splice(users.indexOf(user), 1)
        fs.writeFileSync(path.join(root, "db", "users.json"), JSON.stringify(users, null, 4))
    },

    changePassword: async (userUUID, new_password, root) => {
        const users = JSON.parse(await fs.readFile(path.join(root, "db", "users.json")))
        const user = users.find(user => user.uuid == userUUID)
        user.password = await bcrypt.hash(new_password, 10)
        fs.writeFileSync(path.join(root, "db", "users.json"), JSON.stringify(users, null, 4))
    },

    changeGroup: async (userUUID, group, root) => {
        const users = JSON.parse(await fs.readFile(path.join(root, "db", "users.json")))
        const user = users.find(user => user.uuid == userUUID)
        user.group = group
        fs.writeFileSync(path.join(root, "db", "users.json"), JSON.stringify(users, null, 4))
    }
}