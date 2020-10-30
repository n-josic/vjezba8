const porukeRouter = require('express').Router()
const Poruka = require('../models/poruka')
const Korisnik = require('../models/korisnik')
const jwt = require('jsonwebtoken')

porukeRouter.get('/', async (req, res) => {
  Poruka.find({}).then(rezultat => {    
    res.json(rezultat)
    //.populate('korisnik')  //al ne radi
  })
})

porukeRouter.get('/:id', (req, res, next) => {
  Poruka.findById(req.params.id)
    .then(poruka => {
      if (poruka) {
        res.json(poruka)
      } else {
        res.status(404).end()
      }

    })
    .catch(err => next(err))
})

porukeRouter.delete('/:id', (req, res) => {
  Poruka.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(err => next(err))
})

porukeRouter.put('/:id', (req, res) => {
  const podatak = req.body
  const id = req.params.id

  const poruka = {
    sadrzaj: podatak.sadrzaj,
    vazno: podatak.vazno
  }

  Poruka.findByIdAndUpdate(id,poruka, {new: true})
  .then( novaPoruka => {
    res.json(novaPoruka)
  })
  .catch(err => next(err))

})

const dohvatiToken = req => {
  const auth = req.get('authorization')
  if(auth && auth.toLowerCase().startsWith('bearer')){
    return auth.substring(7)
  }
  return null
}
porukeRouter.post('/', async (req, res, next) => {
  const podatak = req.body
  const token = dohvatiToken(req)
  const dekodiraniToken = jwt.verify(token, process.env.SECRET)
  if(!token || !dekodiraniToken.id){
    return res.status(401).json({error: 'ne postoji token ili pogresan token'})
  }
  const korisnik = await Korisnik.findById(dekodiraniToken.id)

  const poruka = new Poruka({
    sadrzaj: podatak.sadrzaj,
    vazno: podatak.vazno || false,
    datum: new Date(),
    korisnik: korisnik._id
  })

  const spremljenaPoruka = await poruka.save()
  korisnik.poruke = korisnik.poruke.concat(spremljenaPoruka._id)
  res.json(spremljenaPoruka)
    
})

module.exports = porukeRouter