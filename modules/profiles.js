const fs = require("fs")
const bcrypt = require("bcryptjs")
const path = require("path")

module.exports = (root) = {
    createPorfile: async (userUUID, profileName, loginWithoutPassword, profilePassword) => {
        const users = JSON.parse(await fs.readFile(path.join(root, "db", "users.json")))
        const user = users.find(user => user.uuid == userUUID)
        if (user.profiles.length <= 5) {
            if (loginWithoutPassword) {
                user.profiles.push({
                    name: profileName,
                    password: false
                })
            } else {
                user.profiles.push({
                    name: profileName,
                    password: await bcrypt.hash(profilePassword, 8)
                })
            }
            fs.writeFileSync(path.join(root, "db", "users.json"), JSON.stringify(users, null, 4))
        } else {
            return new Error("[Module<Profiles>] Limite de profiles atteintes")
        }
    },

    disablePasswordForProfile: async (profileIndex) => {
        const users = JSON.parse(await fs.readFile(path.join(root, "db", "users.json")))
        const profile = users.find(user => user.uuid == userUUID).profiles[profileIndex]
        if (profile) {
            profile.password = false
            fs.writeFileSync(path.join(root, "db", "users.json"), JSON.stringify(users, null, 4))
        } else {
            return new Error("[Module<Profiles>] Profile introuvable")
        }
    },

    enableAndSetPasswordForProfile: async (profileIndex, profilePassword) => {
        const users = JSON.parse(await fs.readFile(path.join(root, "db", "users.json")))
        const profile = users.find(user => user.uuid == userUUID).profiles[profileIndex]
        if (profile) {
            profile.password = await bcrypt.hash(profilePassword, 8)
            fs.writeFileSync(path.join(root, "db", "users.json"), JSON.stringify(users, null, 4))
        } else {
            return new Error("[Module<Profiles>] Profile introuvable")
        }
    },

    changeAvatarForProfile: async (profileIndex, avatarType, avatarIndex) => {
        const users = JSON.parse(await fs.readFile(path.join(root, "db", "users.json")))
        const profile = users.find(user => user.uuid == userUUID).profiles[profileIndex]
        if (profile) {
            switch (avatarType) {
                case "included":
                    profile.avatar = { type: "included", avatarIndex }
                    break;
                case "gravatar":
                    profile.avatar = { type: "gravatar" }
                    break;
            }
            fs.writeFileSync(path.join(root, "db", "users.json"), JSON.stringify(users, null, 4))
        } else {
            return new Error("[Module<Profiles>] Profile introuvable")
        }
    },

    changeNameForProfile: async (profileIndex, profileName) => {
        const users = JSON.parse(await fs.readFile(path.join(root, "db", "users.json")))
        const profile = users.find(user => user.uuid == userUUID).profiles[profileIndex]
        if (profile) {
            profile.name = profileName
            fs.writeFileSync(path.join(root, "db", "users.json"), JSON.stringify(users, null, 4))
        } else {
            return new Error("[Module<Profiles>] Profile introuvable")
        }
    },

    deleteProfile: async (profileIndex) => {
        const users = JSON.parse(await fs.readFile(path.join(root, "db", "users.json")))
        const profiles = users.find(user => user.uuid == userUUID).profiles
        const profile = users.find(user => user.uuid == userUUID).profiles[profileIndex]
        if (profile) {
            profiles.splice(profile, 1)
            fs.writeFileSync(path.join(root, "db", "users.json"), JSON.stringify(users, null, 4))
        } else {
            return new Error("[Module<Profiles>] Profile introuvable")
        } 
    }
}

