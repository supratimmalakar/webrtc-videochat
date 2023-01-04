import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React, {useEffect} from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()
  
  return (
    <div className='flex flex-col w-1/3 mx-auto my-[100px] gap-[50px] bg-primaryLight rounded shadow-xl p-10'>
      <Head>
        <title>VideoChat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='flex flex-col'>
        <h1 className='font-bold text-[46px] mb-0 text-[rgba(0,0,0,0.6)]'>VideoChat</h1>
        <p className='text-[16px] text-[rgba(0,0,0,0.6)]'>WebRTC videochat app</p>
      </div>

      <button onClick={() => router.push('/login')} className='bg-btn px-2 py-2 rounded text-white font-bold hover:bg-btnHover transition'>Login</button>

      <button onClick={() => router.push('/register')} className='bg-btn px-2 py-2 rounded text-white font-bold hover:bg-btnHover transition'>Register</button>

    </div>
  )
}
