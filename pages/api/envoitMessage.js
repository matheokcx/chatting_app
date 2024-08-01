import mysql from 'mysql2/promise'

export default async function handler(req, res) {
    if (req.method === 'POST') {

        const bdd = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'base_de_donnees'
        })

        try {


            let { mail, identifiantCnversationActuel, texteMessage } = req.body
            identifiantCnversationActuel++

            const [rows] = await bdd.query('SELECT MAX(idMessage) AS maxId FROM message')
            let id = rows[0].maxId + 1

            const [rows2] = await bdd.query('SELECT idUser FROM user WHERE mail = ?', [mail])
            let iduser = rows2[0].idUser

            await bdd.execute('INSERT INTO message (idMessage, idConversation, idUser, valeur) VALUES (?, ?, ?, ?);', [id, identifiantCnversationActuel, iduser, texteMessage])
            res.status(200).send("Envoit termine !")
        }
        catch (e) {
            res.status(500).json({ error: e.message })
        }
    }
    else {
        res.status(405).send("Erreur dans la méthode de la requête..")
    }
}