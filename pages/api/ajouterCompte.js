import mysql from 'mysql2/promise'

export default async function handle(req, res) {
    if (req.method === 'POST') {
        try {
            const bdd = mysql.createPool({
                host: 'localhost',
                user: 'root',
                password: 'root',
                database: 'base_de_donnees'
            })

            const { userMail, userPassword } = req.body

            const [utilisateurExiste] = await bdd.query('SELECT idUser FROM user WHERE mail = ? AND password = ?', [userMail, userPassword])

            if (utilisateurExiste.length === 0) {
                const [idDernierUser] = await bdd.query('SELECT max(idUser) as idmax FROM user')
                let idUser = idDernierUser[0].idmax + 1
                await bdd.execute('INSERT INTO user (idUser, mail, password) VALUES (?, ?, ?)', [idUser, userMail, userPassword])
                res.status(200).json({ message: "Ajout du compte réussi !" })
            }
            else {
                res.status(500).json({ message: "Vous avez déjà un compte sur l'application ..." })
            }
        }
        catch (e) {
            res.status(405).json({ message: e })
        }
    }
    else {
        res.status(500).json({ message: "Problème au niveau du serveur .." })
    }
}