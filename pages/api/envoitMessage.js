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
            let { mail, autreMail, texteMessage } = req.body

            //Tester si la conv existe en gros blabla
            const [conversationExiste] = await bdd.query('SELECT idConversation FROM conversation WHERE userid1 IN (SELECT idUser FROM user WHERE mail = ? OR mail = ?) AND userid2 IN (SELECT idUser FROM user WHERE mail = ? OR mail = ?)', [mail, autreMail, autreMail, mail])

            if (conversationExiste.length > 0) {

                const identifiantConversation = conversationExiste[0].idConversation
                const [rows] = await bdd.query('SELECT MAX(idMessage) AS maxId FROM message')
                let id = rows[0].maxId + 1

                const [rows2] = await bdd.query('SELECT idUser FROM user WHERE mail = ?', [mail])
                let iduser = rows2[0].idUser

                await bdd.execute('INSERT INTO message (idMessage, idConversation, idUser, valeur) VALUES (?, ?, ?, ?);', [id, identifiantConversation, iduser, texteMessage])
                res.status(200).send("Envoit termine !")
            }
            else {
                res.status(405).json({ message: "Conversation non-trouvé" })
            }

        }
        catch (e) {
            console.log(e)
            res.status(500).json({ error: e.message })
        }
    }
    else {
        res.status(405).send("Erreur dans la méthode de la requête..")
    }
}