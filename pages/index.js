import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'
import style from '../styles/logIn.module.css'

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

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <title>Chatting App - LogIn</title>
      </Head>
      <div className={style.corps}>
        <div className={style.box}>
          <h2>LogIn</h2>
          <input type="mail" className={style.entree} placeholder="Votre mail" onChange={(e) => setMail(e.target.value)} />
          <input type="password" className={style.entree} placeholder="Votre mot de passe" onChange={(e) => setPassword(e.target.value)} />
          <button onClick={() => connexion()} className={style.envoit}><strong>Connexion</strong></button>
        </div>
      </div>
    </>
  )
}
