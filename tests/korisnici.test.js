const bcrypt = require('bcrypt')
const Korisnik = require('../models/korisnik')
const pomocni = require('./pomocni')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

describe('Kada imamo samo jednog korisnika u bazi', () =>{
  beforeEach(async () => {
    await Korisnik.deleteMany({})

    const passHash = await bcrypt.hash('tajna', 10)
    const korisnik = new Korisnik({
        username: 'admin', 
        ime: 'Administartor',
        passHash
    })
    await korisnik.save()
  })
  
  test('stvaranje novog korisnika', async () => {
      const novi = {
          username: 'njosic',
          ime: 'Nikolina Josić',
          pass: 'oarwa'
      }
      const pocetniKor = await pomocni.korisniciIzBaze()

      await api.post('/api/korisnici')
      .send(novi)
      .expect(200)
      .expect('Content-Type', /application\/json/)

      const krajKorisnici = await pomocni.korisniciIzBaze()
      expect(krajKorisnici).toHaveLength(pocetniKor.length + 1)

      const svaImena = krajKorisnici.map(k => k.username)
      expect(svaImena).toContain(novi.username)
    })

    test('ispravno vraca gresku ako postoji username', async () => {
        const novi = {
            username: 'admin',
            ime: 'Nikolina J.',
            pass: 'oarwa'
        }
        const pocetniKor = await pomocni.korisniciIzBaze()
  
        const rez = await api.post('/api/korisnici')
        .send(novi)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        expect(rez.body.error).toContain('`username` to be unique')

        const krajKorisnici = await pomocni.korisniciIzBaze()
        expect(krajKorisnici).toHaveLength(pocetniKor.length)
    })

  afterAll(async () => {
    await mongoose.connection.close()
  })
})