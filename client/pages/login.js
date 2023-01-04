import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Head from 'next/head';
import { openToast, errorToast } from '../redux/toastReducer';
import { useDispatch } from 'react-redux';


function Login() {
    const router = useRouter();
    const dispatch = useDispatch()
    const { register, handleSubmit } = useForm();
    const [loading, setLoading] = useState(false)

    const onSubmit = (data) => {
        setLoading(true)
        axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/login`,
            {
                ...data
            })
            .then(res => {
                Cookies.set('auth', JSON.stringify(res.data), { expires: 7 });
                dispatch(openToast({
                    message: "Registered successfully!",
                    severity: "success"
                }))
                setLoading(false)
                router.push('/dashboard')
            })
            .catch(error => {
                dispatch(openToast({
                    message: error.response.data,
                    severity: "error"
                }))
                setLoading(false)
            })
    }

    return (
        <div>
            <Head>
                <title>Login</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <form className='flex flex-col w-1/3 mx-auto my-[100px] gap-[50px] bg-primaryLight rounded shadow-xl p-10' onSubmit={handleSubmit(onSubmit)}>
                <div className='flex flex-col'>
                    <h1 className='font-bold text-[46px] mb-0 text-[rgba(0,0,0,0.6)]'>VideoChat</h1>
                    <p className='text-[16px] text-[rgba(0,0,0,0.6)]'>WebRTC videochat app</p>
                </div>
                <input className=' outline-none h-[40px] px-3 border rounded-md' placeholder='Username' {...register('username')} />
                <input className=' outline-none h-[40px] px-3 border rounded-md' placeholder='Password' {...register('password')} />
                <button className='bg-btn h-12 px-2 py-2 rounded text-white font-bold hover:bg-btnHover transition' type='submit'>{loading ? <div class="spinner-border animate-spin inline-block w-6 h-6 border-4 rounded-full" role="status" /> : 'Login'}</button>
                <div className='flex flex-col'>
                    <hr />
                    <p className='text-[16px] my-3  text-[rgba(0,0,0,0.6)]'>Not registered?</p>
                    <p onClick={() => router.push('/register')} className='bg-btn px-2 py-2 rounded text-white font-bold text-center cursor-pointer hover:bg-btnHover transition'>Register here</p>
                </div>
            </form>
        </div>
    )
}

export default Login