const bcrypt = require('bcryptjs');

async function generateHash(password) {
  try {
    const saltRounds = 10;

    // Generate a salt
    const salt = await bcrypt.genSalt(saltRounds);

    // Hash the password using the generated salt
    const hash = await bcrypt.hash(password, salt);

    // 'hash' now contains the hashed password
    return hash;
  } catch (error) {
    console.error('Error:', error);
  }
}

// generateHash();
module.exports = {generateHash};