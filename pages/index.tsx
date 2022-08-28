import React, { useContext, useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'

// import { useConnect } from 'wagmi'
import connectwallet from '../assets/vaultcreation.png'
import ConnectModalContext from '../contexts/connectwallet'
import { TransactionContext } from '../contexts/transactionContext'
import PageLoader from '../components/PageLoader'

import loader from '../assets/loader.json'
import success from '../assets/success.json'

const Home: NextPage = () => {

  const { setVisible } = useContext(ConnectModalContext)
  const { connectallet, currentAccount, setIsLoading, isLoading } = useContext(TransactionContext)
  const [connected, setConnected] = useState(false)

  const router = useRouter();


  useEffect(() => {
    if (currentAccount) {
      setConnected(true);
      setTimeout(() => {
        router.push({
          pathname: '/dashboard',
          query: { user: currentAccount },
        })
      }, 3000);
    }
  }, [currentAccount])

  return (
    <div className="flex   flex-col items-center justify-center py-2 h-[80%] overflow-hidden">
      <div className='text-white rounded-lg text-center  p-8 max-w-3xl'>
        <Image src={connectwallet} width={200} height={200} />
        <h1 className='text-4xl mt-6 mb-2  font-britanica font-normal '>Wallet not connected</h1>
        <p className=' text-white text-opacity-60 text-lg mt-4'>Fractional ownership of the world's most sought after NFTs. Fractional reduces entry costs, increases access, and enables new communities.</p>
        <button className='py-3 mt-8 text-lg rounded-md bg-[#2BFFB1] text-black font-semibold w-full max-w-xs' onClick={() => setVisible(true)}>
          Connect Wallet to Get Started
        </button>
      </div>
      <PageLoader bg={false} open={isLoading} onClose={() => setIsLoading(false)} img={loader} message='Connecting to wallet...' desc='Accept the prompt in your wallet to continue' />
      <PageLoader bg={false} open={connected} onClose={() => setConnected(false)} img={success} message='Connection Successfull!' desc="Redirecting to Fragment's dashboard " />
    </div>
  )
}

export default Home
