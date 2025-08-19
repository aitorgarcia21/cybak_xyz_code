import sqlite3 from 'sqlite3'
import bcrypt from 'bcrypt'

const db = new sqlite3.Database('./cybak.db')

async function createAdmin() {
  const email = 'aitorgarcia2112@gmail.com'
  const password = '21AiPa01....'
  const firstName = 'Aitor'
  const lastName = 'Garcia'
  
  try {
    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Vérifier si l'utilisateur existe déjà
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, existingUser) => {
      if (err) {
        console.error('Erreur:', err)
        db.close()
        return
      }
      
      if (existingUser) {
        // Mettre à jour l'utilisateur existant pour le rendre admin
        db.run(
          'UPDATE users SET password = ?, is_admin = 1, first_name = ?, last_name = ? WHERE email = ?',
          [hashedPassword, firstName, lastName, email],
          (err) => {
            if (err) {
              console.error('Erreur lors de la mise à jour:', err)
            } else {
              console.log('✅ Utilisateur admin mis à jour:', email)
            }
            db.close()
          }
        )
      } else {
        // Créer un nouvel utilisateur admin
        db.run(
          'INSERT INTO users (email, password, first_name, last_name, is_admin, created_at) VALUES (?, ?, ?, ?, 1, datetime("now"))',
          [email, hashedPassword, firstName, lastName],
          (err) => {
            if (err) {
              console.error('Erreur lors de la création:', err)
            } else {
              console.log('✅ Utilisateur admin créé:', email)
            }
            db.close()
          }
        )
      }
    })
  } catch (error) {
    console.error('Erreur:', error)
    db.close()
  }
}

createAdmin()
