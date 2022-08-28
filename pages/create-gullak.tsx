import Image from 'next/image';
import React, { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { TransactionContext } from '../contexts/transactionContext';

import importWallet from '../assets/import-wallet.png';
import buy1 from '../assets/buy1.png';
import poeple from '../assets/People.png';


const CreateGullak: React.FC = () => {
    const router = useRouter();

    const { connectallet, currentAccount, logout } = useContext(TransactionContext);

    useEffect(() => {
        if (!currentAccount) {
            router.push('/')
        }
    }, [currentAccount])

    useEffect(() => {
        // Prefetch the dashboard page
        router.prefetch('/import/create-vault')
        router.prefetch('/purchase/create-vault')
        router.prefetch('/private/create-vault')
    }, [])


    return (
        <div className='flex flex-col h-[80%] items-center justify-center text-white !overflow-hidden'>
            <div className='flex space-x-4 items-center justify-center '>
                <button className='w-80 h-[21rem] p-8 border bg-[#232529] border-white border-opacity-50 rounded-lg flex flex-col items-center justify-center space-y-2'>
                    <Image src={importWallet} height={120} width={140} />
                    <h1 className='text-2xl font-semibold font-britanica'>Import NFT</h1>
                    <p className='text-sm text-center text-white  font-montserrat '>Import an NFT from your wallet and start a fundraise for it.</p>
                    <button className='bg-[#2BFFB1] font-semibold  text-black w-full py-3 rounded-md ' onClick={e =>
                        router.push({
                            pathname: '/import/create-vault',
                            query: { user: currentAccount },
                        })
                    }>Make Vault</button >
                </button>
                <button className='bg-[#232529] w-80 h-[21rem] p-8 border border-white border-opacity-50 rounded-lg flex flex-col items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed space-y-2'>
                    <Image src={poeple} height={120} width={180} />
                    <h1 className='text-2xl font-semibold font-britanica'>Fundraise with frens</h1>
                    <p className='text-sm  text-white  font-montserrat '>
                        Start a fundraise and then deploy where your community wants.
                    </p>
                    <button className='bg-[#2BFFB1] font-semibold  text-black  py-3 rounded-md  w-full ' onClick={e =>
                        router.push({
                            pathname: '/private/create-vault',
                            query: { user: currentAccount },
                        })
                    }>Make Vault</button>

                </button>
            </div>

            <button disabled className='bg-input w-[41rem] px-8 py-4 border border-white border-opacity-50 rounded-lg flex items-center justify-center mt-4  disabled:cursor-not-allowed'>
                <Image src={buy1} height={80} width={110} />
                <div className='flex flex-col ml-4'>
                    <div className='flex items-center space-x-4'>
                        <h1 className='text-2xl font-semibold font-britanica text-left'>Purchase NFT</h1>
                        <div className='bg-[#343941] px-2 text-sm rounded-md text-button'>Coming Soon</div>
                    </div>
                    <p className='text-sm text-center font-montserrat  text-white '>
                        Fundraise together to purchase an NFT from Opensea or Rarible.
                    </p>

                </div>
                {/* <div className='flex-[0.5] flex items-center justify-center'>
                    <button className='bg-[#2BFFB1]  text-black w-1/2 py-3 rounded-md mt-4 disabled:cursor-not-allowed' disabled onClick={e =>
                        router.push({
                            pathname: '/purchase/create-vault',
                            query: { user: currentAccount },
                        })
                    }>Coming Soon</button>
                </div> */}
            </button>

        </div >
    )
}

export default CreateGullak;