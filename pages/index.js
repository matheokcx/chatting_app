import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import style from '../styles/index.module.css'

export default function Home() {

  const routeur = useRouter()
  const [mail, setMail] = useState("")
  const [password, setPassword] = useState("")

  const connexion = async () => {
    const res = await fetch(`/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userMail: mail,
        userPassword: password
      })
    })

    if (res.ok) {
      routeur.push(`/dashboard?mail=${mail}`)
    }
    else {
      const data = await res.json()
      alert(data.message)
    }
  }

  const ajouterCompte = async () => {
    const requete = await fetch('/api/ajouterCompte', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userMail: mail,
        userPassword: password
      })
    })
    if (requete.ok) {
      connexion()
    }
    else {
      const data = await requete.json()
      alert(data.message)
    }
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.png" />
        <title>Chatting App - LogIn</title>
      </Head>
      <div className={`${style['corps']} bg-no-repeat w-screen h-screen font-sans flex flex-col justify-center items-center`}>
        <div className={`${style['box']} w-5/6 h-4/6 lg:w-1/3 lg:h-2/3 flex flex-col justify-center items-center gap-16 p-2 rounded-2xl`}>
          <h2 className='text-3xl font-bold'>LogIn - Connexion</h2>
          <input type="mail" className='w-3/4 h-7 rounded-xl border-0 p-2 bg-white text-black' placeholder="Votre mail" onChange={(e) => setMail(e.target.value)} />
          <input type="password" className='w-3/4 h-7 rounded-xl border-0 p-2 bg-white text-black' placeholder="Votre mot de passe" onChange={(e) => setPassword(e.target.value)} />
          <div className='w-11/12 lg:w-4/5 h-1/5 flex flex-row gap-3 justify-center items-center'>
            <button onClick={() => connexion()} className={`${style['envoit']} w-1/2 lg:w-36 h-10 rounded-xl bg-white text-black border-0`}><strong>Connexion</strong></button>
            <button onClick={() => ajouterCompte()} className='w-1/2 lg:w-36 h-10 rounded-xl bg-green-300 text-white border-0'><strong>Créer un compte</strong></button>
          </div>
        </div>
      </div>
    </>
  )
}
