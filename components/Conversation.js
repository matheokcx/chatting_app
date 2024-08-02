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
                <div className={`${style['currentBox']} flex flex-row gap-10 items-center w-full h-1/10 pl-6 mt-3`}>
                    <Image src="/pp.png" alt="profil picture" width="70" height="70" />
                    <p><strong>{userName}</strong></p>
                    <button onClick={() => estChoisit()} className='w-fit rounded-lg bg-gray-400 text-white p-2'>fermer</button>
                </div >
            ) :
                (<div className={`${style['box']} flex flex-row gap-10 items-center w-full h-1/10 pl-6 mt-3`}>
                    <Image src="/pp.png" alt="profil picture" width="70" height="70" />
                    <p><strong>{userName}</strong></p>
                    <button onClick={() => estChoisit()} className='w-fit rounded-lg bg-gray-400 text-white p-2'>voir</button>
                </div >)}
        </>
    )
}