import React, { useContext, useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowRightIcon, ExternalLinkIcon, CheckCircleIcon, ArrowSmRightIcon } from '@heroicons/react/solid';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import { darkTheme, Theme, SwapWidget } from '@uniswap/widgets'
import '@uniswap/widgets/fonts.css'
import dynamic from 'next/dynamic'

const SelectChain = dynamic(
    () => import('../../components/SelectChain'),
    { ssr: false }
)

import Modal from '../Modal';
import { requiredTag } from '../CreateDAOForm';
import vault from '../../assets/vaultcreation.png';
import Select from '../Select';
import { NftContext } from '../../contexts/NftContext';
import { SocketContext } from '../../contexts/socketContext';
import { TransactionContext } from '../../contexts/transactionContext';
import { DataContext, } from '../../contexts/dataContext'
import { CreateVaultFormValues, CreateVaultStep } from '../CreateVaultForm'
import { minDtTime } from '../../utils';

import people from '../../assets/People.png'
import ImportNFTSelect from '../ImportNFTSelect';
import ConnectModalContext from '../../contexts/connectwallet';
import PageLoader from '../PageLoader';
import clock from '../../assets/Clocks.png'

import loader from '../../assets/loader.json'
import { MdArrowForwardIos } from 'react-icons/md';

interface CreateVaultFormProps {
    setCurrentStep: (values: CreateVaultStep) => void;
}

const SetFundingCycle: React.FC<CreateVaultFormProps> = ({
    setCurrentStep
}) => {
    const router = useRouter();

    const [balance, setBalance] = useState('0');
    const [safeAddress, setSafeAddress] = useState("");

    const { currentAccount, isLoading, setIsLoading, getBalanace } = useContext(TransactionContext);
    const { formData, handleCreateVault, handleChange, deploySafe, defaultFormData, setFormData } = useContext(DataContext);
    const { swapModal, setSwapModal } = useContext(ConnectModalContext);

    const [safeDeploy, setSafeDeploy] = useState(false);
    const [deploy, setDeploy] = useState(false)

    // console.log({ selectedToken, selectedChain });

    const fetchBalance = async () => {

        try {
            const balance = await getBalanace();
            setBalance(balance);
            console.log('Balance:', balance);

        } catch (error) {
            console.error(error);
        }
    }

    const createSafe = async () => {
        setSafeDeploy(true);
        const address = await deploySafe();
        // const address = "0x07ae982eB736D11633729BA47D9F8Ab513caE3Fd";
        if (!address) {
            alert("Error in deploying Gnosis safe! Please try again");
            router.push({
                pathname: `/dashboard`,
                query: { user: currentAccount },
            })
            setFormData(defaultFormData)
            setSafeDeploy(false);
            return;
        }
        console.log("Import page deployed address :", address);
        setSafeAddress(address);
        setSafeDeploy(false);
    }

    useEffect(() => {
        createSafe();
    }, [])

    const onSubmitHandler: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setDeploy(true);
        const form = {
            ...formData,
            fundraiseDuration: new Date(formData.fundraiseDuration).getTime() ?? 0,
        }

        await handleCreateVault(form, safeAddress);
        setDeploy(false);
    }

    useEffect(() => {
        fetchBalance();
    }, [])



    return (
        <div className='max-w-2xl mx-auto text-lg sm:px-4 pb-24'>
            <div className='flex items-center justify-between h-28 p-6 bg-[url("/Button.png")]  bg-[#232529]    bg-cover overflow-hidden rounded-2xl'>
                <div className='text-white'>
                    <h2 className='text-2xl  font-normal font-britanica'>Start Funding Cycle</h2>
                    <p className='font-montserrat text-base'>Here you can start the vault to fundraise</p>
                </div>
                <div className='-mr-[3.2rem] mt-10'>
                    <Image src={clock} height={140} width={170} />
                </div>
            </div>
            <form onSubmit={onSubmitHandler} className='mt-10'>
                <div>
                    <div className=''>
                        <label>
                            <p className='text-xl font-normal font-britanica'>Notification Email Address {requiredTag}</p>
                            <p className='text-base font-montserrat text-gray-300'>Enter email where you’ll be able to get all updates about this fundraise.</p>
                            <input required type='email' step="any" className='p-4 mb-6 rounded-lg bg-transparent focus:outline-none border-[1px] focus:bg-transparent border-gray-600 w-full mt-2' placeholder='hello@nftdrop.io' />
                        </label>
                        <label>
                            <p className='text-xl font-normal font-britanica'>Target Fundraise {requiredTag}</p>
                            <input required type='number' step="any" className='p-4 mb-6 rounded-lg bg-transparent focus:outline-none border-[1px] border-gray-600 w-full mt-2' placeholder='Enter target fundraise amount' value={formData.target} onChange={(e) => handleChange(e, 'target')} />
                        </label>
                        <label>
                            <p className='text-xl font-normal font-britanica'>Fundraise duration{requiredTag}</p>
                            <input required type='datetime-local' min={minDtTime()} style={{ colorScheme: 'dark' }} className='p-4 mb-6 rounded-lg bg-transparent focus:outline-none border-[1px] border-gray-600 w-full mt-2' value={formData.fundraiseDuration} onChange={(e) => handleChange(e, 'fundraiseDuration')} />
                        </label>
                    </div>
                    <div className='p-2 bg-input rounded-lg'>
                        <p className='text-base text-center  font-bold text-green-500'>You will have to put atleast 10% of the target fundraise to start the funding cycle.</p>
                    </div>

                    <div className='p-2 bg-[#303104] text-[#FFF500] flex rounded-lg mt-4 font-montserrat text-base'>
                        <div className='px-3'>
                            <p className='font-black'>Note: We only accepts funds in ETH</p>
                            <p className='text-[#C6BE0F]'>Have funds in different tokens? Click on swap tokens</p>
                        </div>
                        <div onClick={() => setSwapModal(true)} className='flex hover:cursor-pointer bg-[#FFF500] rounded-lg text-black font-black w-44 mx-4 items-center justify-center text-lg space-x-2'>
                            <p>Swap Tokens</p>
                            <MdArrowForwardIos className='w-4 h-4' />
                        </div>
                    </div>
                    <div className='mt-4'>
                        <div className='flex justify-between'>
                            <p className='text-xl font-normal font-britanica'>Your Contribution {requiredTag}</p>
                            <p className='text-lg text-gray-300 font-normal font-britanica'>Min. Investment <span>{formData.target / 10} ETH</span></p>
                        </div>
                        <input required type='number' min={formData.target / 10} step="any" className='p-4  rounded-lg bg-transparent focus:outline-none border-[1px] border-gray-600 w-full mt-1' placeholder='Total value of NFTs' value={formData.myContribution} onChange={(e) => handleChange(e, 'myContribution')} />
                        <p className='text-lg text-gray-300 flex justify-end font-normal font-britanica'>Your Balance:  <span>  {balance} </span></p>
                    </div>
                    <button type='submit' className='w-full mt-4 p-3 rounded-lg !bg-button font-semibold text-black flex items-center justify-center space-x-4'>
                        <span>Start Fundraise</span>
                        <MdArrowForwardIos className='w-4 h-4' />
                    </button>
                </div>
            </form>

            <PageLoader bg={false} open={deploy} onClose={() => setDeploy(false)} img={loader} message='Waiting for transaction to complete' desc="Check the metamask window to complete the transaction. Avoid closing this tab." />
            <PageLoader bg={false} open={safeDeploy} onClose={() => setSafeDeploy(false)} img={loader} message='Initialising Vault!' desc="Please dont't the close the Window." />
        </div>
    )
}

export default SetFundingCycle;