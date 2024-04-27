const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function getShortUrl() {
  let result = '';

  for (let i = 0; i < 5; i++) {
    let indexRandom = Math.floor(Math.random() * characters.length);
    result += characters[indexRandom];
  }
  return result;
}

module.exports = getShortUrl;