import mysql from 'mysql2/promise'

export default async function handle(req, res) {
    if (req.method === 'POST') {
        const bdd = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'base_de_donnees'
        })

        try {

            const { mail, otherMail } = req.body
            console.log(mail + " " + otherMail)

            const [recuperationIdConversation] = await bdd.query('SELECT idConversation FROM conversation WHERE userid1 IN (SELECT idUser FROM user WHERE mail = ? OR mail = ?) AND userid2 IN (SELECT idUser FROM user WHERE mail = ? OR mail = ?);', [mail, otherMail, otherMail, mail])

            if (recuperationIdConversation.length > 0) {
                const idConversation = recuperationIdConversation[0].idConversation

                await bdd.execute('DELETE FROM message WHERE idConversation = ?', [idConversation])
                await bdd.execute('DELETE FROM conversation WHERE idConversation = ?', [idConversation])
                res.status(200).json({ message: 'Conversation supprimer avec succès !' })
            }
            else {
                res.status(405).json({ message: "La conversation n'a pas été trouvée dans la base de données ..." })
            }
        }
        catch (e) {
            res.status(500).json({ message: e.message })
        }
    }
    else {
        res.status(500).json({ message: "Methode d'envoit incorrect" })
    }
}