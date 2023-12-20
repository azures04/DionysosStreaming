const path = require("path")
const fetch = require("node-fetch")

module.exports = {
    searchAndGetMediaByName: async (name, root) => {
        const config = require(path.join(root, "config.json"))
        const apiKey = config.apis.tmdb.token
        const url = `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(name.split(" ").join("+"))}&include_adult=true&language=fr-FR&page=1`;
        const options = {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${apiKey}`
            }
        }
        try {
            const response = await fetch(url, options)
            const json = await response.json()
            console.log(json)
        } catch (error) {
            console.log(error)
        }
    }
}