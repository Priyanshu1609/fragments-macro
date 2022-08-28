import React, { Children, ReactElement, useContext } from 'react'
import Head from 'next/head'
import Link from 'next/link'

import { ConnectModalProvider } from '../../contexts/connectwallet'
import { SocketProvider } from '../../contexts/socketContext'
import { OpenseaContextProvider } from '../../contexts/opensesContext'
import { NftContextProvider } from '../../contexts/NftContext'
import { TransactionContext, TransactionProvider } from '../../contexts/transactionContext'
import { DataContextProvider } from '../../contexts/dataContext'

import Logo from '../logo'
import ConnectModal from '../ConnectModal'
import Account from '../Account'
import PageLoader from '../PageLoader'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import Navbar from '../Navbar'

const SelectChain = dynamic(
    () => import('../../components/SelectChain'),
    { ssr: false }
)

interface Props {
    children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {

    const router = useRouter();

    return (
        <>
            <TransactionProvider>
                <ConnectModalProvider>
                    <DataContextProvider>
                        <NftContextProvider>
                            <OpenseaContextProvider>
                                <SocketProvider>
                                    <Head>
                                        <link rel="preconnect" href="https://fonts.googleapis.com" />
                                        <link rel="preconnect" href="https://fonts.googleapis.com" />
                                        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='true' />
                                        <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet" />
                                    </Head>
                                    <div className='bg-[url("https://landing-video.s3.ap-south-1.amazonaws.com/appbg.png")] h-screen bg-center bg-fixed bg-cover  font-montserrat !overflow-y-scroll' >

                                        <Navbar />
                                        {children}
                                        <ConnectModal />
                                        <SelectChain />
                                    </div>
                                </SocketProvider>
                            </OpenseaContextProvider>
                        </NftContextProvider>
                    </DataContextProvider>
                </ConnectModalProvider>
            </TransactionProvider>
        </>
    )
}

export default Layout