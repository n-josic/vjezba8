require('dotenv').config()

const PORT = process.env.PORT

// Baza podataka
const password = process.env.ATLAS_PASS
const dbname = 'poruke-api'
//const DB_URI = `mongodb+srv://oarwa-gz:${password}@cluster0.l0kev.mongodb.net/${dbname}?retryWrites=true&w=majority`

const DB_URI = `mongodb+srv://oarwa-novo:${password}@cluster0.nwgsh.mongodb.net/${dbname}?retryWrites=true&w=majority`

module.exports = {PORT, DB_URI}