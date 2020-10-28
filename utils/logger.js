const info = (...poruke) => {
  console.log(...poruke);
}

const greska = (...poruke) => {
  console.error(...poruke);
}

module.exports = {info, greska}