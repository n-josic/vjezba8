const mongoose = require('mongoose')
const supertest = require('supertest')
const Poruka = require('../models/poruka')

const pomocni = require('./pomocni')

const app = require('../app')
const api = supertest(app)

beforeEach(async () => {
    await Poruka.deleteMany({})
    let objektPoruka = new Poruka(pomocni.pocetnePoruke[0])
    await objektPoruka.save()
    objektPoruka = new Poruka(pomocni.pocetnePoruke[1])
    await objektPoruka.save()
    objektPoruka = new Poruka(pomocni.pocetnePoruke[2])
    await objektPoruka.save()
})

test('poruke se vracaju kao JSON', async () => {
    await api
        .get('/api/poruke')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('baza ima tocno tri poruke', async () => {
    const odgovor = await pomocni.porukeIzBaze

    expect(odgovor.body).toHaveLength(3)
})

test('provjera sadrzaja prve poruke', async () => {
    const odgovor = await pomocni.porukeIzBaze

    expect(odgovor.body[0].sadrzaj).toBe("HTML je jednostavan")
})

test('provjera sadrzaja neke poruke', async () => {
    const odgovor = await pomocni.porukeIzBaze
    
    const sadrzaj = odgovor.body.map(p => p.sadrzaj)
    expect(sadrzaj).toContain("HTML je jednostavan")
})

test('dodavanje ispravne poruke', async () => {
    const nova = {
        sadrzaj: "Nikolinina poruka",
        vazno: true
    }

    await api
    .post('/api/poruke')
    .send(nova)
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const odgovor = await pomocni.porukeIzBaze()
    const sadrzaj = odgovor.body.map(p => p.sadrzaj)
    
    expect(sadrzaj).toContain("Nikolinina poruka")
    expect(odgovor).toHaveLength(pomocni.pocetnePoruke.length + 1)
})

test('ispravno vraca pogresku kod spremanja bez sadrzaja', async () => {
    const nova = {
        vazno: true
    }

    await api
    .post('/api/poruke')
    .send(nova)
    .expect(400)

    const odgovor = await pomocni.porukeIzBaze
    expect(odgovor).toHaveLength(pomocni.pocetnePoruke.length)
})

test('dohvat specificne poruke', async () => {
    const porukePocetak = await pomocni.porukeIzBaze()
    const trazenaPoruka = porukePocetak[0]
  
    const odgovor = await api
    .get(`/api/poruke/${trazenaPoruka.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)
  
    const jsonPoruka = JSON.parse(JSON.stringify(trazenaPoruka))
    expect(odgovor.body).toEqual(trazenaPoruka)
  })

  test('ispravno brisanje poruke', async () => {
    const porukePocetak = await pomocni.porukeIzBaze()
    const porukaZaBrisanje = porukePocetak[0]
  
    const odgovor = await api
      .delete(`/api/poruke/${porukaZaBrisanje.id}`)
      .expect(204)
  
    const porukeKraj = await pomocni.porukeIzBaze()
    expect(porukeKraj).toHaveLength(porukePocetak.length - 1)
  
    const sadrzaj = porukeKraj.map(p => p.sadrzaj)
    expect(sadrzaj).not.toContain(porukaZaBrisanje.sadrzaj)
  
  })

afterAll(() => {
    mongoose.connection.close()
})