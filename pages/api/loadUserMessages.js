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

            let { mail, otherMail } = req.query

            const [conversationExiste] = await bdd.query('SELECT idConversation FROM conversation WHERE userid1 IN (SELECT idUser FROM user WHERE mail = ? OR mail = ?) AND userid2 IN (SELECT idUser FROM user WHERE mail = ? OR mail = ?)', [mail, otherMail, otherMail, mail])

            if (conversationExiste.length > 0) {

                const identifiantConversation = conversationExiste[0].idConversation

                const [rows] = await bdd.query('SELECT valeur FROM message WHERE idConversation = ? AND idUser = (SELECT idUser FROM user WHERE mail = ?);', [identifiantConversation, mail])
                const resultat = rows.map(row => row.valeur)
                res.status(200).json(resultat)
                await bdd.end()
            }
            else {
                res.status(405).json({ message: 'Conversation n existe pas' })
            }
        }
        catch (e) {
            res.status(405).send(e)
        }
    }
    else {
        res.status(405).send("Methode de la requête incorrecte..")
    }
}