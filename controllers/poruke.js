const porukeRouter = require('express').Router()
const Poruka = require('../models/poruka')

porukeRouter.get('/', (req, res) => {
  Poruka.find({}).then(rezultat => {    
    res.json(rezultat)
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

porukeRouter.post('/', (req, res, next) => {
  const podatak = req.body

  const poruka = new Poruka({
    sadrzaj: podatak.sadrzaj,
    vazno: podatak.vazno || false,
    datum: new Date()
  })

  poruka.save()
  .then(spremljenaPoruka => {
    res.json(spremljenaPoruka)
  })
  .catch(err => next(err))
})

module.exports = porukeRouter