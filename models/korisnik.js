const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const korniskShema = new mongoose.Schema({
    username: {
        type: String, 
        //minlength: 7,
        unique: true
    },
    ime: String,
    passHash: String,
    poruke: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Poruka'
    }]
})
korniskShema.plugin(uniqueValidator)

korniskShema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
        delete ret.passHash
        return ret
    }
})

const Korisnik = mongoose.model('Korisnik', korniskShema, 'korisnici')
module.exports = Korisnik