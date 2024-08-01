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

            let { userMail, otherMail } = req.query

            const [estUserid1] = await bdd.query('SELECT idConversation FROM conversation WHERE userid1 = (SELECT idUser FROM user WHERE mail = ?) AND userid2 = (SELECT idUser FROM user WHERE mail = ?);', [userMail, otherMail])
            const [estUserid2] = await bdd.query('SELECT idConversation FROM conversation WHERE userid1 = (SELECT idUser FROM user WHERE mail = ?) AND userid2 = (SELECT idUser FROM user WHERE mail = ?);', [otherMail, userMail])

            if (estUserid1.length > 0) {
                const [rows] = await bdd.query(`SELECT m.valeur FROM message m INNER JOIN conversation c ON m.idConversation = c.idConversation AND c.userid1 = (SELECT idUser FROM user WHERE mail = ?) AND c.userid2 = (SELECT idUser FROM user WHERE mail = ?) WHERE m.idUser = (SELECT idUser FROM user WHERE mail = ?);`, [userMail, otherMail, otherMail])
                const resultat = rows.map(row => row.valeur)
                res.status(200).json(resultat)
            }
            else if (estUserid2.length > 0) {
                const [rows] = await bdd.query(`SELECT m.valeur FROM message m INNER JOIN conversation c ON m.idConversation = c.idConversation AND c.userid1 = (SELECT idUser FROM user WHERE mail = ?) AND c.userid2 = (SELECT idUser FROM user WHERE mail = ?) WHERE m.idUser = (SELECT idUser FROM user WHERE mail = ?);`, [otherMail, userMail, otherMail])
                const resultat = rows.map(row => row.valeur)
                res.status(200).json(resultat)
            }
            else {
                res.status(405).send(`Votre conversation n'existe pas avec ${otherMail}`)
            }
            await bdd.end()
        }
        catch (e) {
            res.status(405).send(e)
        }
    }
    else {
        res.status(405).send('Erreur au niveau de la méthode de la requete')
    }
}