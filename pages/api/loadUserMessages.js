import mysql from 'mysql2/promise'

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const bdd = mysql.createPool({
                host: 'localhost',
                user: 'root',
                password: 'root',
                database: 'base_de_donnees'
            })

            let { currentConv, currentUser } = req.query
            currentConv++

            const [rows] = await bdd.query('SELECT valeur FROM message WHERE idConversation = ? AND idUser = (SELECT idUser FROM user WHERE mail = ?);', [currentConv, currentUser])
            const resultat = rows.map(row => row.valeur)
            res.status(200).json(resultat)
            await bdd.end()
        }
        catch (e) {
            res.status(405).send(e)
        }
    }
    else {
        res.status(405).send("Methode de la requête incorrecte..")
    }
}