import style from '../styles/dashboard.module.css'
import Conversation from '../components/Conversation'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function Dashboard() {

    const routeur = useRouter()
    const [convs, setConvs] = useState([])
    const [currentIndex, setCurrentIndex] = useState(null)
    const [inputText, setInputText] = useState("")
    const [messages, setMessages] = useState([])
    const [otherMessages, setOtherMessages] = useState([])
    const [newConvUser, setNewConvUser] = useState("")
    const monMail = routeur.query.monMail

    const disconnect = () => routeur.push("/")

    const fetchConversations = async () => {
        const response = await fetch(`/api/user?userMail=${monMail}`);
        const data = await response.json();
        setConvs(data);
    }

    const fetchMessages = async (convIndex) => {
        const response = await fetch(`/api/messages?currentConv=${convIndex}&currentUser=${monMail}`);
        const data = await response.json();
        setMessages(data);
    }

    const fetchOtherMessages = async () => {
        const response = await fetch(`/api/otherMessages?&userMail=${monMail}&otherMail=${convs[currentIndex]}`);
        const data = await response.json();
        setOtherMessages(data);
    }

    useEffect(() => {
        if (monMail) {
            fetchConversations();
        }
    }, [monMail]);

    useEffect(() => {
        if (convs.length > 0) {
            setCurrentIndex(0);
        }
    }, [convs]);

    useEffect(() => {
        if (currentIndex !== null) {
            fetchMessages(currentIndex);
            fetchOtherMessages();
        }
    }, [currentIndex]);

    const envoitMessage = async () => {
        await fetch(`/api/envoit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userMail: monMail,
                currentId: currentIndex,
                inputValue: inputText
            })
        });

        if (currentIndex !== null && monMail) {
            fetchMessages(currentIndex);
        }
    }

    const ajouterConversation = async () => {
        await fetch(`/api/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userMail: monMail,
                otherMail: newConvUser
            })
        });

        await fetchConversations(); // Refetch les conversations après l'ajout
    }

    return (
        <>
            <div className={style.corps}>
                <div className={style.conversations}>
                    <div className={style.addConv}>
                        <input type="text" value={newConvUser} onChange={(e) => setNewConvUser(e.target.value)} placeholder="Nom d'utilisateur" />
                        <button onClick={() => ajouterConversation()}>Ajouter</button>
                    </div>
                    {convs.map((name, index) => (
                        <Conversation key={index} userName={name} current={index === currentIndex} setCurrent={() => setCurrentIndex(index)} />
                    ))}
                    <div className={style.bottom}>
                        <button className={style.disconnectButton} onClick={() => disconnect()}>LogOut</button>
                    </div>
                </div>
                <div className={style.rightPart}>
                    <div className={style.affichage}>
                        <div className={style.otherSide}>{otherMessages.map((text, index) => <p key={index} className={style.message}>{text} </p>)}</div>
                        <div className={style.userSide}>{messages.map((value, index) => <p key={index} className={style.message}>{value} </p>)}</div>
                    </div>
                    <div className={style.controls}>
                        <input type="text" placeholder="Ecrivez votre message" value={inputText} onChange={(e) => setInputText(e.target.value)} />
                        <button onClick={() => envoitMessage()}>send</button>
                    </div>
                </div>
            </div>
        </>
    )
}
