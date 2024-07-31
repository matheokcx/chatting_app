import mysql from 'mysql2'

export default function handler(req, res) {
    if (req.method === 'GET') {
        const bdd = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'base_de_donnees'
        })

        let { currentConv, currentUser } = req.query
        currentConv++

        bdd.query('SELECT valeur FROM message WHERE idConversation = ? AND idUser = (SELECT idUser FROM user WHERE mail = ?);', [currentConv, currentUser], (error, rows) => {

            if (error) {
                res.status(500).send(error.message)
            }

            const fini = rows.map(row => row.valeur)
            res.status(200).json(fini)
        })
    }
    else {
        res.status(405).send("Methode incorrecte..")
    }
}