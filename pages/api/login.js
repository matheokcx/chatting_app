import mysql from 'mysql2/promise'

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { userMail, userPassword } = req.body

        const bdd = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'base_de_donnees'
        })

        const [rows] = await bdd.query("SELECT mail, password FROM user WHERE mail = ? AND password = ?;", [userMail, userPassword])

        if (rows.length > 0) {
            res.status(200).json({ message: 'Connexion réussi !' })
        }
        else {
            res.status(401).json({ message: 'Mail ou mot de passe incorrect' })
        }
    }
    else {
        res.status(405).json({ message: 'Error' })
    }
}