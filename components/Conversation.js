import style from '../styles/Conversation.module.css'
import Image from 'next/image'

export default function Conversation({ userName, current, setCurrent }) {

    const estChoisit = () => {
        if (current == true) {
            setCurrent(false)
        }
        else {
            setCurrent(true)
        }
    }

    return (
        <>
            {current ? (
                <div className={style.currentBox}>
                    <Image src="/pp.png" alt="profil picture" width="70" height="70" />
                    <p><strong>{userName}</strong></p>
                    <button onClick={() => estChoisit()}>fermer</button>
                </div >
            ) :
                (<div className={style.box}>
                    <Image src="/pp.png" alt="profil picture" width="70" height="70" />
                    <p><strong>{userName}</strong></p>
                    <button onClick={() => estChoisit()}>voir</button>
                </div >)}
        </>
    )
}