import React from 'react'
import Link from 'next/link'
import Head from 'next/head';
import Cookies from 'js-cookie';

function Layout({ children, className, title }) {

    return (
        <>
            <div className='w-full h-[100vh]'>
                <Head>
                    <title>{title}</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <div className='flex h-[90px] border-b-2 items-center justify-between bg-primaryDark'>
                    <div className='flex gap-[30px] ml-5 items-center'>
                        <Link href="/dashboard">
                            <h1 className='text-[40px] text-white'>VideoChat</h1>
                        </Link>
                    </div>
                </div>
                <div className={`w-full h-[calc(100vh-90px)] mx-auto min-w-[800px] overflow-y-auto ${className ? className : ''}`}>
                    {children}
                </div>
            </div>
        </>
    )
}

export default Layout