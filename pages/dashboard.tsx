import { useRouter } from 'next/router';
import React, { useEffect, useContext, useState } from 'react';
// import { useConnect } from 'wagmi';
import cerateDaoPeopleImage from '../assets/vaultcreation.png';
import Image from 'next/image';
import { ArrowRightIcon, ArrowUpIcon } from '@heroicons/react/solid';
import { Tab } from '@headlessui/react';

import Orders from '../components/Orders';
import Proposals from '../components/Proposals';
import { TransactionContext } from '../contexts/transactionContext';
import { ethers } from 'ethers';
import { getEllipsisTxt } from '../utils';
import PageLoader from '../components/PageLoader';
import MyInvestment from "../components/MyInvestments"
import MyGullaks from "../components/MyGullaks"
import NFTList from "../components/NFTList"
import { DataContext } from '../contexts/dataContext';
import pattern from '../assets/Pattern.png'
import demo from '../assets/demo.png'
import { MdArrowForwardIos } from 'react-icons/md';


declare var window: any;

export enum TabNames {
    MyInvestments = 'MY_INVESTMENTS',
    MyGullaks = 'MY_GULLAKS',
    NFTS = 'NFTS',
    Orders = 'ORDERS',
    Proposals = 'PROPOSALS'
}

export function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export interface TabProps {
    tabs: {
        name: string;
        value: string;
    }[]
}

const tabs = [
    {
        name: 'MY FRAGMENTS',
        value: TabNames.MyInvestments
    },
    {
        name: 'VAULTS CREATED',
        value: TabNames.MyGullaks
    },
    {
        name: 'MY NFTS',
        value: TabNames.NFTS
    },
    // {
    //     name: 'ORDERS',
    //     value: TabNames.Orders
    // },
    {
        name: 'PROPOSALS',
        value: TabNames.Proposals
    }
]

export const RenderTab: React.FC<TabProps> = ({
    tabs
}) => {


    return (
        <>
            {
                tabs.map(({ name, value }) => (
                    <Tab
                        key={name}
                        className={({ selected }) =>
                            classNames(
                                selected
                                    ? 'text-white !opacity-100 border-b-2 border-white '
                                    : 'text-white hover:text-white',
                                'w-full font-bold py-2.5 text-sm leading-5 text-white opacity-50 transition-all delay-200 !focus:outline-hidden border-0'

                            )
                        }
                    >
                        {name}
                    </Tab>
                ))
            }
        </>
    )
}

const Dashboard: React.FC = () => {

    const { connectallet, currentAccount, ens } = useContext(TransactionContext);
    const { vaults, creatorVaults } = useContext(DataContext);

    const [valuation, setValuation] = useState(0)

    const router = useRouter();

    const handleValuation = async () => {
        if (!vaults) {
            console.log("no vaults")
            return
        }
        let value = 0.00;
        vaults.forEach(async (vault: any) => {
            const vaultValuation = Number(vault.amountPledged)
            // console.log({ valuation, vaultValuation })
            value += vaultValuation
        }
        )
        setValuation(value);
    }

    useEffect(() => {
        handleValuation();
    }, [currentAccount, vaults])


    useEffect(() => {
        if (!currentAccount) {
            router.push('/')
        }
    }, [currentAccount])

    useEffect(() => {
        router.prefetch('/create-gullak')
        router.prefetch('/create-dao')
        router.prefetch('/livevaults')
    })

    return (
        <div className='text-white  max-w-7xl xl:mx-auto mx-2 md:mx-4 lg:mx-6'>
            <div className='flex items-center justify-between bg-cover bg-[url("/Button.png")]  bg-[#232529]    rounded-2xl text-white shadow-lg cursor-pointer' onClick={() =>
                router.push({
                    pathname: '/create-gullak',
                    query: { user: currentAccount },
                })}>

                <div className='h-32 flex items-center space-x-6 p-4 !overflow-hidden'>
                    <div className='-ml-10 -mt-1'>
                        <Image src={cerateDaoPeopleImage} height={200} width={230} />
                    </div>
                    <div>
                        <h1 className='text-3xl font-semibold font-britanica'>Create your own Vault</h1>
                        <p className='text-lg font-montserrat'>Make a DAO to start investing with your frens in fragments</p>
                    </div>
                </div>
                <div className='flex items-center space-x-4 bg-[#232529] px-5 py-3 rounded-lg mr-10'>
                    <p>Start Creating</p>
                    <MdArrowForwardIos className='w-5 h-5 mr-6' />
                    {/* <ArrowRightIcon className='w-6 h-6 mr-6' /> */}
                </div>
            </div>
            <div className='h-32 bg-[#232529] bg-cover flex items-center justify-between rounded-2xl px-16 py-10 mt-4 w-full overflow-hidden cursor-pointer' onClick={() =>
                router.push({
                    pathname: '/profile',
                    query: { user: currentAccount },
                })}>
                <div className='flex '>
                    <div className='h-40 w-40 -ml-16 mt-8'>
                        <Image src={pattern} />
                    </div>
                    <div className='rounded-full overflow-hidden h-24 w-24 -ml-16 border-2 border-button mr-6 mt-12'>
                        <img src="https://lh3.googleusercontent.com/b2fJSqKXfH9AJg63az3zmMUC6PMd_bmqnI5W-rtouKvZ03vBeiyayb3zqDq4t7PLt2HmNxcocUMjxb7V03Jy_mMZc_5wVDaxk_T5=w260" alt="ENS Avatar"  />
                    </div>
                    <div className='text-white text-3xl flex space-x-3 p-3 rounded-md'>
                        <div className='flex flex-col items-start justify-center'>
                            <p className='font-normal font-britanica'>{ens}</p>
                            <p className='text-gray-300 text-2xl'>{getEllipsisTxt(currentAccount)}</p>
                        </div>
                    </div>
                </div>
                <div className='flex space-x-16 mr-24 '>
                    <div className=''>
                        <p className='opacity-70 text-base '>Curent Value </p>
                        <span className='font-bold text-2xl opacity-100 -mt-1 !font-britanica'>{(valuation).toFixed(2)} ETH </span>
                        {/* <span className='text-green-500 text-xl flex'> 5 % <ArrowUpIcon className='h-5 w-5 my-auto' /></span> */}
                    </div>
                    <div className=''>
                        <p className='opacity-70 text-base '>Active Vaults </p>
                        <span className='font-bold text-2xl opacity-100 !font-britanica'>{creatorVaults.length}</span>
                    </div>
                </div>
            </div>
            <div className="w-full px-2 py-10 sm:px-0 text-white">
                <Tab.Group>
                    <Tab.List className="flex  p-1 !pb-0 w-full space-x-1">
                        <div className='flex w-full  '>
                            <RenderTab tabs={tabs} />
                        </div>
                    </Tab.List>
                    <Tab.Panels className="mt-2">
                        <Tab.Panel>
                            <MyInvestment />
                        </Tab.Panel>
                        <Tab.Panel>
                            <MyGullaks />
                        </Tab.Panel>
                        <Tab.Panel>
                            <NFTList />
                        </Tab.Panel>
                        {/* <Tab.Panel>
                            <Orders />
                        </Tab.Panel> */}
                        <Tab.Panel>
                            <Proposals />
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>
            </div>
        </div>
    )
}

export default Dashboard;