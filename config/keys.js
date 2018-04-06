const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, 'keys.json')
let keys = null

if (fs.existsSync(filePath)) {
  keys = JSON.parse(fs.readFileSync(filePath, 'utf8'))
} else {
  keys = {
    jwt: {
      jwtKey: process.env.JWT_KEY
    },
    mongo: {
      test_key: process.env.MONGO_TEST_KEY
    }
  }
}

module.exports = keys;