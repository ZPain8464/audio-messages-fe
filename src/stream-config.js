// Demo app users

const demoUsers = {
    userEiko: {
        id: "eiko",
        name: "Eiko Carol",
        image: "https://getstream.io/random_svg/?name=Eiko"
    },

    userVivi: {
        id: "vivi",
        name: "Vivi Ornitier",
        image: "https://getstream.io/random_svg/?name=Vivi"
    }
}

const url = `http://localhost:3001/getToken`
const mp3Url = `http://localhost:3001/getMp3`


export { demoUsers, url, mp3Url };