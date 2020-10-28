const palindrom = require('../utils/za_test').palindrom
const { prosjek } = require('../utils/za_test')

//grupiranje vise testova u jendu cjelinu
describe("Testovi vzani uz palindrom", () => {
    test('palindrom od jednog znaka je taj isti znak', () => {
        const rezultat = palindrom('a')
      
        expect(rezultat).toBe('a')
      })
      
      test('palindrom od vise znakova ispravno vraca palindrom', () => {
        const rezultat = palindrom('oarwa')
      
        expect(rezultat).toBe('awrao')
      })
      
      //u test se pise opis funkcije 
      test('palindrom od palindroma je ista vrijednost', () => {
        const rezultat = palindrom('radar')
          //to be vraca ocekivano  ~
        expect(rezultat).toBe('radar')
      })
})


describe('prosjek', () => {
  test('samo jedna vrijednost', () => {
    expect(prosjek([1])).toBe(1)
  })

  test('od više brojeva', () => {
    expect(prosjek([0.1, 0.1, 0.1])).toBeCloseTo(0.1)
  })

  test('od praznog niza je 0', () => {
    expect(prosjek([])).toBe(0)
  })
})
//testovi se pokrecu -> npm test