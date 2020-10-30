const bcrypt = require('bcrypt')
const korisniciRouter = require('express').Router()
const Korisnik = require('../models/korisnik')

korisniciRouter.post('/', async (req, res) => {
    const sadrzaj = req.body   // { username: , pass: }

    const passHash = await bcrypt.hash(sadrzaj.pass, 10)

    const korisnik = new Korisnik({
        username: sadrzaj.username,
        ime: sadrzaj.ime,
        //poruke: [],  //ovo program sam napravi
        passHash: passHash //ako se isto zovu ne treba ': passHash'
    })

    const noviKorisnik = await korisnik.save()
    res.json(noviKorisnik)

})

korisniciRouter.get('/', async (req, res) => {
    const svi = await Korisnik.find({})
    res.json(svi)
})

module.exports = korisniciRouter