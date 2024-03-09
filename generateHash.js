/*
This is a function to Help You Generate a Hashed Password in order to seed a user in your seed.sql file
*/

// The password variable must contain a string that you will use for that specific user.
// After you generate the hashed password, use it in your seed.sql for the password_hash field for the user in the INSER TO portion

const bcrypt = require('bcrypt')

const password = 'password'
const saltRounds = 10

bcrypt.hash(password, saltRounds, function (err, hash) {
  if (err) {
    console.error('Error generating hash:', err)
    return
  }
  console.log('Generated hash:', hash)
  // Now, you can manually copy this hash to your seed.sql file
})
