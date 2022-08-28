import ProgressBar from '@ramonak/react-progress-bar'
import Image from 'next/image'
import React, { useContext, useEffect, useState } from 'react'
import { BsFillPersonCheckFill } from 'react-icons/bs'
import { FaCopy, FaDiscord, FaTwitter } from 'react-icons/fa'
import demo from '../assets/demo.png'
import { TransactionContext } from '../contexts/transactionContext'
import { getEllipsisTxt } from '../utils'
import info from '../assets/info.png'
import { MdArrowForwardIos } from 'react-icons/md'
import { useRouter } from 'next/router'
import { DataContext } from '../contexts/dataContext'

const Profile: React.FC = () => {
    const router = useRouter();

    const { currentAccount } = useContext(TransactionContext);
    const { vaults, creatorVaults } = useContext(DataContext);

    const [valuation, setValuation] = useState(0)
    const [showMore, setShowMore] = useState(false);

    const handleValuation = async () => {
        if (!vaults) {
            console.log("no vaults")
            return
        }
        let value = 0.00;
        vaults.forEach(async (vault: any) => {
            const vaultValuation = Number(vault.amountPledged)
            console.log({ valuation, vaultValuation })
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

    return (
        <div className='text-white min-h-screen max-w-7xl xl:mx-auto mx-2 md:mx-4 lg:mx-6'>
            <div className='flex w-full h-full space-x-5'>
                <div className='flex-[0.2] rounded-lg overflow-hidden '>
                    <div className='h-[389px]  bg-input '>
                        <div className='flex items-center flex-col justify-evenly h-[75%]'>
                            <Image src={demo} height={160} width={160} />
                            <button className='bg-[#303235] px-2 py-1 rounded-lg flex items-center'>
                                {getEllipsisTxt(currentAccount)}
                                <FaCopy className="ml-3 mr-1" />
                            </button>
                            <div className='flex items-center justify-evenly text-gray-300 space-x-2'>
                                <FaDiscord className='w-8 h-5' />
                                <BsFillPersonCheckFill className='w-8 h-5' />
                                <FaTwitter className='w-8 h-5' />
                            </div>
                        </div>
                        <div className='mx-6'>
                            <p className='text-gray-400 text-left mb-2'>Invited by</p>
                            <div className='flex items-center space-x-3'>
                                <Image src={demo} height={40} width={40} />
                                <div className='text-sm'>
                                    <p>Priyanshu Panda</p>
                                    <p className="text-gray-400">{getEllipsisTxt(currentAccount)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='h-[188px] mt-4 rounded-lg bg-gradient-to-tr from-[#2bffb1] to-[#2bd8ff] text-white flex items-center flex-col justify-evenly'>
                        <div className='bg-[#181B22] h-full rounded-lg m-[0.05rem] flex flex-col w-[99.5%] items-start px-4 py-2 justify-center'>
                            <p>Refer & Earn</p>
                            <p className='text-xs text-gray-400'>Invite a fren to earn 500 frag coins</p>
                            <div className='bg-[#303235]  px-2 py-1 mt-3 rounded-lg w-full '>
                                <p className='text-xs text-gray-400'>Your invite link</p>
                                <div className='flex space-x-4 items-center'>
                                    <p className='text-sm'>{getEllipsisTxt("https://dev.fragments.money/vaults/0x7c71AFaC3c134Dfc9d14859C0618A0C52E1A4E33?user=0x6d4b5acfb1c08127e8553cc41a9ac8f06610efc7", 12)}</p>
                                    <FaCopy className="ml-3 mr-1" />
                                </div>
                            </div>
                            <p className='mt-4'>or <span className='underline font-semibold  text-transparent bg-clip-text bg-gradient-to-r from-[#2bffb1] to-[#2bd8ff]  decoration-[#2bffb1]'>invite using ens</span></p>
                        </div>
                    </div>
                </div>
                <div className='flex-[0.8] '>
                    <div className='flex justify-between space-x-4'>
                        <div className='h-[125px] mt-4 rounded-lg flex-grow bg-gradient-to-tr from-[#2bffb1] to-[#2bd8ff] text-white flex items-center flex-col justify-evenly font-semibold'>
                            <div className='bg-input h-full rounded-lg m-[0.05rem] flex flex-col w-[99.5%] items-start px-4 py-2 justify-center '>
                                <p>Current Value</p>
                                <p className="bg-gradient-to-r mt-2 from-[#2bffb1] to-[#2bd8ff] text-transparent bg-clip-text text-3xl font-bold">{valuation} ETH</p>
                            </div>
                        </div>
                        <div className='h-[125px] mt-4 rounded-lg flex-grow bg-gradient-to-tr from-[#2bffb1] to-[#2bd8ff] text-white flex items-center flex-col justify-evenly font-semibold'>
                            <div className='bg-input h-full rounded-lg m-[0.05rem] flex flex-col w-[99.5%] items-start px-4 py-2 justify-center '>
                                <p>Realised Gains</p>
                                <p className="bg-gradient-to-r mt-2 from-[#2bffb1] to-[#2bd8ff] text-transparent bg-clip-text text-3xl font-bold">120 ETH</p>
                            </div>
                        </div>
                        <div className='h-[125px] mt-4 rounded-lg flex-grow bg-gradient-to-tr from-[#2bffb1] to-[#2bd8ff] text-white flex items-center flex-col justify-evenly font-semibold'>
                            <div className='bg-input h-full rounded-lg m-[0.05rem] flex flex-col w-[99.5%] items-start px-4 py-2 justify-center '>
                                <p>Vaults Created</p>
                                <p className="bg-gradient-to-r mt-2 from-[#2bffb1] to-[#2bd8ff] text-transparent bg-clip-text text-3xl font-bold">{creatorVaults.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className=' h-[455px] mt-4'>
                        <div className='bg-input h-[435px] w-full p-4 rounded-lg'>

                            <div className='flex justify-between items-center space-x-5'>
                                <div className="bg-[#181B22] rounded-lg h-[125px] flex-[0.72] p-3">
                                    <div className='flex items-center justify-between mb-6'>
                                        <div className='flex items-center s'>
                                            <p className='mr-5'>Your NFT Score</p>
                                            <Image src={info} className="cursor-pointer " height={30} width={30} />
                                        </div>
                                        <p onClick={() => setShowMore(!showMore)} className='bg-gradient-to-r from-[#2bffb1] to-[#2bd8ff] text-transparent cursor-pointer hover:opacity-90 bg-clip-text underline decoration-[#2bd8ff] font-bold'>Show {showMore ? "Breakdown" : "More"}</p>
                                    </div>
                                    <ProgressBar completed={45} bgColor='#2bffb1' baseBgColor='#2C2C35' isLabelVisible={false} height={'12px'} />
                                </div>
                                <div className='flex-[0.33] flex items-start flex-col justify-evenly p-4 bg-[#005081] rounded-lg h-[125px]'>
                                    <p className='font-semibold'>Verify your Twitter</p>
                                    <p className='text-sm text-gray-300 mt-1'>and earn upto 1500 Frag coins</p>
                                    <button className='flex items-center justify-between py-1 w-32 bg-[#33739a] rounded-lg px-2 mt-2'>
                                        <FaTwitter />
                                        Verify Now
                                    </button>

                                </div>
                            </div>
                            {
                                showMore &&
                                <div>
                                    <div className='flex justify-between space-x-4'>
                                        <div className='h-[125px] mt-4 rounded-lg flex-grow bg-gradient-to-tr from-[#2bffb1] to-[#2bd8ff] text-white flex items-center flex-col justify-evenly font-semibold'>
                                            <div className='bg-input h-full rounded-lg m-[0.05rem] flex flex-col w-[99.5%] items-start px-4 py-2 justify-center '>
                                                <p>Average ROI</p>
                                                <p className="bg-gradient-to-r mt-2 from-[#2bffb1] to-[#2bd8ff] text-transparent bg-clip-text text-3xl font-bold">120 ETH</p>
                                            </div>
                                        </div>
                                        <div className='h-[125px] mt-4 rounded-lg flex-grow bg-gradient-to-tr from-[#2bffb1] to-[#2bd8ff] text-white flex items-center flex-col justify-evenly font-semibold'>
                                            <div className='bg-input h-full rounded-lg m-[0.05rem] flex flex-col w-[99.5%] items-start px-4 py-2 justify-center '>
                                                <p>Hit Rate</p>
                                                <p className="bg-gradient-to-r mt-2 from-[#2bffb1] to-[#2bd8ff] text-transparent bg-clip-text text-3xl font-bold">120 ETH</p>
                                            </div>
                                        </div>
                                        <div className='h-[125px] mt-4 rounded-lg flex-grow bg-gradient-to-tr from-[#2bffb1] to-[#2bd8ff] text-white flex items-center flex-col justify-evenly font-semibold '>
                                            <div className='bg-input h-full rounded-lg m-[0.05rem] flex flex-col w-[99.5%] items-start px-4 py-2 justify-center '>
                                                <p>Diversification</p>
                                                <p className="bg-gradient-to-r mt-2 from-[#2bffb1] to-[#2bd8ff] text-transparent bg-clip-text text-3xl font-bold">120 ETH</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex justify-between space-x-4'>
                                        <div className='h-[125px] mt-4 rounded-lg flex-grow bg-gradient-to-tr from-[#2bffb1] to-[#2bd8ff] text-white flex items-center flex-col justify-evenly font-semibold'>
                                            <div className='bg-input h-full rounded-lg m-[0.05rem] flex flex-col w-[99.5%] items-start px-4 py-2 justify-center '>
                                                <p>Total Flips</p>
                                                <p className="bg-gradient-to-r mt-2 from-[#2bffb1] to-[#2bd8ff] text-transparent bg-clip-text text-3xl font-bold">120 ETH</p>
                                            </div>
                                        </div>
                                        <div className='h-[125px] mt-4 rounded-lg flex-grow bg-gradient-to-tr from-[#2bffb1] to-[#2bd8ff] text-white flex items-center flex-col justify-evenly font-semibold'>
                                            <div className='bg-input h-full rounded-lg m-[0.05rem] flex flex-col w-[99.5%] items-start px-4 py-2 justify-center '>
                                                <p>Avg Hold Time</p>
                                                <p className="bg-gradient-to-r mt-2 from-[#2bffb1] to-[#2bd8ff] text-transparent bg-clip-text text-3xl font-bold">120 ETH</p>
                                            </div>
                                        </div>
                                        <div className='flex items-start flex-col  px-4 py-2 w-[32.3%] justify-evenly bg-[#0c878e] rounded-lg h-[125px] mt-4 text-white '>
                                            <p className='font-semibold'>Create your own Vault</p>
                                            <p className='text-sm text-gray-300 mt-1'>start investing with your frens</p>
                                            <button className='flex items-center justify-between py-2 w-40 bg-black text-white rounded-lg px-3 mt-2'>
                                                start creating
                                                <MdArrowForwardIos />
                                            </button>

                                        </div>
                                    </div>

                                </div>
                            }
                        </div>

                    </div>
                </div>
            </div>
        </div >
    )
}

export default Profile