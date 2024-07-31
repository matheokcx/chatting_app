import mysql from 'mysql2/promise';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { inputMail, inputPassword } = req.query

        const bdd = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'base_de_donnees'
        });

        const [rows] = await bdd.query("SELECT mail, password FROM user WHERE mail = ? AND password = ?;", [inputMail, inputPassword]); // tableau de 2 colonnes stockant le résultat de la requete ('?' = valeur du champ)

        if (rows.length > 0) { // Si il y a un résultat similaire
            res.status(200).json({ message: 'Connexion réussi !' });
        }
        else {
            res.status(401).json({ message: 'Mail ou mot de passe incorrect' });
        }
    }
    else {
        res.status(405).json({ message: 'Error' });
    }
}
