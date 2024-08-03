import style from '../styles/dashboard.module.css'
import Conversation from '../components/Conversation'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function Dashboard() {

    const routeur = useRouter()
    const userMail = routeur.query.mail

    const [modeNuit, setModeNuit] = useState(false)

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

    const fetchMessages = async (conversationChoisit) => {
        const response = await fetch(`/api/loadUserMessages?mail=${userMail}&otherMail=${userConversations[conversationChoisit]}`)
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
                mail: userMail,
                autreMail: userConversations[conversationChoisit],
                texteMessage: texteEntre
            })
        })

        await fetchMessages(conversationChoisit)
        setTexteEntre("")
    }

    const ajouterConversation = async () => {
        await fetch(`/api/gestionConversation`, {
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
                <link rel="icon" href="/icon.png" />
            </Head>
            {modeNuit ? (<div className='bg-blue-950 w-screnn h-screen flex flex-row font-sans'>
                <div className={`${style['conversations']} w-1/3 h-full bg-blue-800 flex flex-col items-center pt-6 overflow-hidden gap-4`}>
                    <div className={`${style['addConv']} w-full h-1/10 flex gap-4 p-4`}>
                        <input type="text" value={utilisateurAajouter} className='w-4/5 h-7 rounded-xl bg-white border-0 p-1 text-black' onChange={(e) => setUtilisateurAajouter(e.target.value)} placeholder="Nom d'utilisateur" />
                        <button onClick={() => ajouterConversation()}>Ajouter</button>
                    </div>
                    {userConversations.map((name, index) => (
                        <Conversation key={index} userName={name} current={index === conversationChoisit} setCurrent={() => setConversationChoisit(index)} modeNuit={modeNuit} otherName={userConversations[conversationChoisit]} />
                    ))}
                    <div className={`${style['conversation_bottom']} h-1/10 w-full flex flex-row justify-center items-center gap-5 absolute`}>
                        <Image src='/dayMode.png' alt='Mode nuit' width="50" height="50" onClick={() => setModeNuit(false)} />
                        <button className={`${style['disconnectButton']} w-32 h-9 border-width rounded-xl border-0 bg-red-400 text-white`} onClick={() => deconnexion()}>LogOut</button>
                    </div>
                </div>
                <div className='w-4/6 h-full flex flex-col'>
                    <div className='w-full h-5/6 flex flex-row p-4'>
                        <div className={`${style['otherSide']} w-1/2 h-full overflow-scroll overflow-x-hidden overflow-y-auto flex flex-col justify-left pl-1`}>{messagesAutre.map((text, index) => <p key={index} className='mt-4 bg-white w-fit text-black rounded-xl p-2'>{text} </p>)}</div>
                        <div className={`${style['userSide']} w-1/2 h-full overflow-scroll overflow-x-hidden overflow-y-auto flex flex-col`}>{messagesUtilisateur.map((value, index) => <p key={index} className='mt-4 bg-white w-fit text-black rounded-xl p-2'>{value} </p>)}</div>
                    </div>
                    <div className={`${style['controls']} h-1/6 w-full flex flex-row justify-center items-center gap-6`}>
                        <input type="text" placeholder="Ecrivez votre message" value={texteEntre} onChange={(e) => setTexteEntre(e.target.value)} className='w-2/3 h-8 rounded-xl border-0 bg-white p-1 text-black' />
                        <button onClick={() => envoitMessage()}>Envoyer</button>
                    </div>
                </div>
            </div>)
                :
                (<div className='bg-white w-screnn h-screen flex flex-row font-sans'>
                    <div className={`${style['conversations2']} w-1/3 h-full bg-white flex flex-col items-center pt-6 overflow-hidden gap-4`}>
                        <div className={`${style['addConv']} w-full h-1/10 flex gap-4 p-4`}>
                            <input type="text" value={utilisateurAajouter} className='w-4/5 h-7 rounded-xl bg-white border-4 p-1 text-black' onChange={(e) => setUtilisateurAajouter(e.target.value)} placeholder="Nom d'utilisateur" />
                            <button onClick={() => ajouterConversation()}>Ajouter</button>
                        </div>
                        {userConversations.map((name, index) => (
                            <Conversation key={index} userName={name} current={index === conversationChoisit} setCurrent={() => setConversationChoisit(index)} otherName={userMail} modeNuit={undefined} />
                        ))}
                        <div className={`${style['conversation_bottom']} h-1/10 w-full flex flex-row justify-center items-center gap-5 absolute`}>
                            <Image src='/nightMode.png' alt='Mode nuit' onClick={() => setModeNuit(true)} width="50" height="50" />
                            <button className={`${style['disconnectButton']} w-32 h-9 border-width rounded-xl border-0 bg-red-400 text-white`} onClick={() => deconnexion()}>LogOut</button>
                        </div>
                    </div>
                    <div className='w-4/6 h-full flex flex-col'>
                        <div className='w-full h-5/6 flex flex-row p-4'>
                            <div className={`${style['otherSide']} w-1/2 h-full overflow-scroll overflow-x-hidden overflow-y-auto flex flex-col justify-left pl-1`}>{messagesAutre.map((text, index) => <p key={index} className='mt-4 bg-black w-fit text-white rounded-xl p-2'>{text} </p>)}</div>
                            <div className={`${style['userSide']} w-1/2 h-full overflow-scroll overflow-x-hidden overflow-y-auto flex flex-col`}>{messagesUtilisateur.map((value, index) => <p key={index} className='mt-4 bg-black w-fit text-white rounded-xl p-2'>{value} </p>)}</div>
                        </div>
                        <div className={`${style['controls']} h-1/6 w-full flex flex-row justify-center items-center gap-6`}>
                            <input type="text" placeholder="Ecrivez votre message" value={texteEntre} onChange={(e) => setTexteEntre(e.target.value)} className='w-2/3 h-8 rounded-xl border-2 bg-white p-1 text-black' />
                            <button onClick={() => envoitMessage()}>Envoyer</button>
                        </div>
                    </div>
                </div>)
            }
        </>
    )
}