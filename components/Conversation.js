import style from '../styles/Conversation.module.css'
import Image from 'next/image'

export default function Conversation({ userName, otherName, current, setCurrent, modeNuit }) {

    const estChoisit = () => {
        if (current == true) {
            setCurrent(false)
        }
        else {
            setCurrent(true)
        }
    }

    const supprimerConversation = async () => {
        const requete = await fetch('/api/supprimerConversation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                mail: userName,
                otherMail: otherName
            })
        })

        const retour = await requete.json()
        alert(retour.message)
    }

    return (
        <>
            {current ? (
                <div className={`${style['currentBox']} flex flex-row gap-6 items-center w-full h-1/10 pl-6 mt-3`}>
                    {modeNuit ? <Image src='/supprimerConversationNuit.png' width="20" height='20' onClick={() => supprimerConversation()} /> : <Image src='/supprimerConversation.png' width="20" height='20' onClick={() => supprimerConversation()} />}
                    <Image src="/pp.png" alt="profil picture" width="70" height="70" />
                    {modeNuit ? (<p><strong>{userName}</strong></p>) : (<p className='text-black'><strong>{userName}</strong></p>)}
                    {modeNuit ? (<button onClick={() => estChoisit()} className='w-fit rounded-lg bg-gray-400 text-white p-2'>fermer</button>) : (<button onClick={() => estChoisit()} className='w-fit rounded-lg bg-gray-700 text-white p-2'>fermer</button>)}
                </div >
            )
                :
                (<div className={`${style['box']} flex flex-row gap-6 items-center w-full h-1/10 pl-6 mt-3`}>
                    <Image src="/pp.png" alt="profil picture" width="70" height="70" />
                    {modeNuit ? (<p><strong>{userName}</strong></p>) : (<p className='text-black'><strong>{userName}</strong></p>)}
                    {modeNuit ? (<button onClick={() => estChoisit()} className='w-fit rounded-lg bg-gray-400 text-white p-2'>voir</button>) : (<button onClick={() => estChoisit()} className='w-fit rounded-lg bg-gray-400 text-white p-2'>voir</button>)}
                </div >)
            }
        </>
    )
}