import style from '../styles/dashboard.module.css'
import Conversation from '../components/Conversation'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function Dashboard() {

    const routeur = useRouter()
    const userMail = routeur.query.mail

    const [userConversations, setUserConversations] = useState([])
    const [conversationChoisit, setConversationChoisit] = useState(null)

    const [messagesUtilisateur, setMessagesUtilisateur] = useState([])
    const [messagesAutre, setMessagesAutre] = useState([])

    const [texteEntre, setTexteEntre] = useState("")
    const [utilisateurAajouter, setUtilisateurAajouter] = useState("")

    const deconnexion = () => routeur.push("/")

    // Raccourcis requêtes API ____________________________________________________________________________________________________________

    const fetchConversations = async () => {
        const response = await fetch(`/api/gestionConversation?userMail=${userMail}`)
        const data = await response.json()
        setUserConversations(data)
    }

    const fetchMessages = async () => {
        const response = await fetch(`/api/loadUserMessages?currentConv=${conversationChoisit}&currentUser=${userMail}`)
        const data = await response.json()
        setMessagesUtilisateur(data)
    }

    const fetchOtherMessages = async () => {
        const response = await fetch(`/api/loadOtherMessages?&userMail=${userMail}&otherMail=${userConversations[conversationChoisit]}`)
        const data = await response.json()
        setMessagesAutre(data)
    }

    // UseEffect() ________________________________________________________________________________________________________________________

    useEffect(() => {
        if (userMail) {
            fetchConversations()
        }
    }, [userMail])

    useEffect(() => {
        if (userConversations.length > 0) {
            setConversationChoisit(0)
        }
    }, [userConversations])

    useEffect(() => {
        if (conversationChoisit !== null) {
            fetchMessages(conversationChoisit)
            fetchOtherMessages()
        }
    }, [conversationChoisit])

    // Fonctions utiles ___________________________________________________________________________________________________________________

    const envoitMessage = async () => {
        await fetch(`/api/envoitMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userMail: userMail,
                currentId: conversationChoisit,
                inputValue: texteEntre
            })
        })

        await fetchMessages(conversationChoisit)
    }

    const ajouterConversation = async () => {
        await fetch(`/api/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userMail: userMail,
                otherMail: utilisateurAajouter
            })
        })

        await fetchConversations()
    }

    return (
        <>
            <Head>
                <title>Chatting App - Disscussion</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={style.corps}>
                <div className={style.conversations}>
                    <div className={style.addConv}>
                        <input type="text" value={utilisateurAajouter} onChange={(e) => setUtilisateurAajouter(e.target.value)} placeholder="Nom d'utilisateur" />
                        <button onClick={() => ajouterConversation()}>Ajouter</button>
                    </div>
                    {userConversations.map((name, index) => (
                        <Conversation key={index} userName={name} current={index === conversationChoisit} setCurrent={() => setConversationChoisit(index)} />
                    ))}
                    <div className={style.conversation_bottom}>
                        <button className={style.disconnectButton} onClick={() => deconnexion()}>LogOut</button>
                    </div>
                </div>
                <div className={style.rightPart}>
                    <div className={style.affichageMessage}>
                        <div className={style.otherSide}>{messagesAutre.map((text, index) => <p key={index} className={style.message}>{text} </p>)}</div>
                        <div className={style.userSide}>{messagesUtilisateur.map((value, index) => <p key={index} className={style.message}>{value} </p>)}</div>
                    </div>
                    <div className={style.controls}>
                        <input type="text" placeholder="Ecrivez votre message" value={texteEntre} onChange={(e) => setTexteEntre(e.target.value)} />
                        <button onClick={() => envoitMessage()}>Envoyer</button>
                    </div>
                </div>
            </div>
        </>
    )
}