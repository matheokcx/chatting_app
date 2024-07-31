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
            let { userMail, currentId, inputValue } = req.body

            const [rows] = await bdd.query('SELECT MAX(idMessage) AS maxId FROM message');
            let id = rows[0].maxId + 1;

            currentId++

            const [rows2] = await bdd.query('SELECT idUser FROM user WHERE mail = ?', [userMail]);
            let iduser = rows2[0].idUser


            console.log('Identifiant du message : ' + id)
            console.log('Identifiant de la conversation : ' + currentId)
            console.log('Identifiant de l utilisateur auteur du message : ' + iduser)
            console.log('Mail de l utilisateur auteur du message : ' + userMail)
            console.log('Valeur du message : ' + inputValue)

            await bdd.execute('INSERT INTO message (idMessage, idConversation, idUser, valeur) VALUES (?, ?, ?, ?);', [id, currentId, iduser, inputValue])
        }
        catch (e) {
            res.status(405).send(e.message)
        }
    }
    else {
        res.status(405).send("Erreur dans la méthode de la requête..")
    }
}