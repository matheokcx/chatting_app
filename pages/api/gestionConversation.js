import mysql from 'mysql2/promise'

export default async function handler(req, res) {
    if (req.method === 'GET') {

        const bdd = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'base_de_donnees'
        })

        const userMail = req.query.userMail

        const [valeurs] = await bdd.query(`SELECT DISTINCT u.mail FROM user u JOIN conversation c ON u.idUser = c.userid2 WHERE c.userid1 = (SELECT idUser FROM user WHERE mail = ?) UNION SELECT DISTINCT u.mail FROM user u JOIN conversation c ON u.idUser = c.userid1 WHERE c.userid2 = (SELECT idUser FROM user WHERE mail = ?);`, [userMail, userMail])

        const userConversations = valeurs.map(row => row.mail)
        res.status(200).json(userConversations)
    }
    else if (req.method === 'POST') {

        const bdd = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'base_de_donnees'
        })

        const { userMail, otherMail } = req.body

        const [monIdentifiant] = await bdd.query('SELECT idUser FROM user WHERE mail = ?', [userMail])
        const [autreIdentifiant] = await bdd.query('SELECT idUser FROM user WHERE mail = ?', [otherMail])
        const [nbConversationResult] = await bdd.query('SELECT MAX(idConversation) AS maxConv FROM conversation')
        const [testConversationExiste] = await bdd.query(`SELECT idConversation FROM conversation WHERE (userid1 = ? AND userid2 = ?) OR (userid1 = ? AND userid2 = ?);`, [monIdentifiant[0].idUser, autreIdentifiant[0].idUser, autreIdentifiant[0].idUser, monIdentifiant[0].idUser])

        if (autreIdentifiant.length > 0 && testConversationExiste.length === 0) {
            const nbConversation = nbConversationResult[0].maxConv + 1
            await bdd.execute('INSERT INTO conversation (idConversation, userid1, userid2) VALUES (?, ?, ?)', [nbConversation, monIdentifiant[0].idUser, autreIdentifiant[0].idUser])
            res.status(200).send('Conversation ajoutée avec succès')
        }
        else {
            res.status(400).send("La conversation existe deja ou l'autre utilisateur n'existe pas")
        }
    }
    else {
        res.status(405).send('Méthode non prise en charge')
    }
}
