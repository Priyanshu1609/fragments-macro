import React, { useState, useContext } from 'react';
import vault from '../../assets/vaultcreation.png';
import Image from 'next/image';
import { requiredTag } from '../CreateDAOForm';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/solid';
import { DataContext } from '../../contexts/dataContext'
import { TiTick } from "react-icons/ti"
import { MdArrowBackIosNew, MdArrowForwardIos } from 'react-icons/md';

interface CreateVaultFormProps {
    origin: string
    setCurrentStep: (values: CreateVaultStep) => void;
    handleBack: () => void;
}

export enum CreateVaultStep {
    InputFieldsForm = 'input-fields-form',
    GovernedStep = 'governed-form',
    ImportOrPurchase = 'import-or-purchase',
    Fundraise = 'fundraise',
    FundingCycle = 'funding-cycle'
}

export interface CreateVaultFormValues {
    origin: string,
    vaultName: string,
    contractAddress: string,
    type: string,
    description: string,
    tokenName: string,
    creator: string,
    numOfTokens: number,
    managementFees: number,
    votingPeriod: number,
    quorum: number,
    minFavor: number,
    nftsImported: string[],
    nftsPurchased: string[],
    target: number,
    fundraiseDuration: number,
    myContribution: number,
    amount: number,
}

const CreateVaultForm: React.FC<CreateVaultFormProps> = ({
    origin,
    setCurrentStep,
    handleBack
}) => {


    const [tokenSupply, setTokenSupply] = useState(1000000)
    const [type, setType] = useState('Public')
    const [numOfTokens, setNumOfTokens] = useState(1000000)

    const { formData, setFormData, handleChange } = useContext(DataContext);


    const onSubmitHandler: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        setFormData(
            (prev: CreateVaultFormProps) => ({
                ...prev,
                type,
                numOfTokens,
                origin
            })
        )
        if (origin === 'import' || origin === 'purchase') {
            (type === 'Public' ? setCurrentStep(CreateVaultStep.GovernedStep) : setCurrentStep(CreateVaultStep.ImportOrPurchase))
        }
        else {
            setCurrentStep(CreateVaultStep.Fundraise)
        }
    }


    return (
        <div className='max-w-2xl mx-auto text-lg'>
            <div className='flex items-center justify-between h-28 p-6 bg-[url("/Button.png")]  bg-[#232529]    bg-cover overflow-hidden rounded-2xl'>
                <div className='text-white'>
                    <h2 className='text-2xl font-britanica font-normal'>Create your own Vault</h2>
                    <p className='font-montserrat text-base'>Make a DAO to start investing with your frens in fragments</p>
                </div>
                <div className='-mr-[4.4rem] mt-4'>
                    <Image src={vault} height={160} width={160} />
                </div>
            </div>
            <div className='mt-10'>
                <form onSubmit={onSubmitHandler}>
                    <div className='flex flex-col justify-between'>
                        <label className='flex-grow'>
                            <p className='text-xl font-britanica font-normal '>What should we call this Vault?{requiredTag}</p>
                            <input required type='text' maxLength={50} className='text-lg p-3 mb-6 rounded-lg w-full mt-2 bg-transparent focus:outline-none border-[1px] border-gray-600' placeholder='Enter Vault Name' value={formData.vaultName} onChange={(e) => handleChange(e, 'vaultName')} />
                        </label>
                        <label>
                            <p className='text-xl font-britanica font-normal '>What is this vault is all about?{requiredTag}</p>
                            <textarea required rows={3} maxLength={500} className='p-4 mb-6 rounded-lg bg-transparent focus:outline-none border-[1px] border-gray-600 w-full mt-2' placeholder='Add Description about the vault' value={formData.description} onChange={(e) => handleChange(e, 'description')} />
                        </label>
                        {origin !== 'private' && <label className=''>
                            <p className='text-xl font-britanica font-normal  mb-2'>What's this vault like?{requiredTag}</p>
                            <div className=" rounded-2xl relative flex flex-col space-y-2">
                                <div className={`inline-flex rounded-lg ${type === 'Public' && `bg-gradient-to-tr from-[#2bffb1] to-[#2bd8ff] text-white`}`} onClick={e => setType('Public')}>

                                    <div className="radio bg-black m-[0.05rem]  py-2 px-4 rounded-lg cursor-pointer flex">
                                        <div>
                                            <p>Governed</p>
                                            <p className='text-base text-[#E6E6E6]'>Vault uses policies to govern the behavior of clients and instrument Role-Based Access Control (RBAC) by specifying access privileges (authorization).</p>
                                        </div>
                                        <div className={` ${type === 'Public' ? 'bg-gradient-to-tr from-[#2bffb1] to-[#2bd8ff] text-white' : 'bg-white'} h-4 w-4 my-auto mx-2 rounded-full`}>
                                            <TiTick className={`h-4 w-4 ${type === 'Public' ? 'text-black' : 'text-white'}`} />
                                        </div>
                                    </div>
                                </div>
                                <div className={`inline-flex rounded-lg ${type === 'Private' && `bg-gradient-to-tr from-[#2bffb1] to-[#2bd8ff] text-white`}`} onClick={e => setType('Private')}>
                                    <div className="radio bg-black m-[0.05rem]  py-2 px-4 rounded-lg cursor-pointer flex group">
                                        <div>
                                            <p>With Frens</p>
                                            <p className='text-base text-[#E6E6E6]'>Vault uses policies to govern the behavior of clients and instrument Role-Based Access Control (RBAC) by specifying access privileges (authorization).
                                            </p>
                                        </div>
                                        <div className={` ${type === 'Private' ? 'bg-gradient-to-tr from-[#2bffb1] to-[#2bd8ff] text-white' : 'bg-white'} h-4 w-4 my-auto mx-2 rounded-full`}>
                                            <TiTick className={`h-4 w-4 ${type === 'Private' ? 'text-black' : 'text-white'}`} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </label>}
                    </div>
                    <div className='grid grid-cols-2 gap-6 mt-8'>
                        <label>
                            <p className='text-xl font-britanica font-normal '>Token Name <span className='text-xs'> ( 4 letters )</span>{requiredTag}</p>
                            <input required type='text' minLength={4} maxLength={4} className='p-4 mb-6 rounded-lg bg-transparent focus:outline-none border-[1px] border-gray-600 w-full mt-2' placeholder='Enter Token Name e.g. $LOOK' value={formData.tokenName} onChange={(e) => handleChange(e, 'tokenName')} />
                        </label>
                        <label>
                            <p className='text-xl font-britanica font-normal '>No. of Tokens{requiredTag}</p>
                            <p className='p-4 mb-6 rounded-lg bg-transparent focus:outline-none border-[1px] border-gray-600 w-full mt-2'>{tokenSupply}</p>
                        </label>
                    </div>
                    <label>
                        <p className='text-xl font-britanica font-normal '>Management Fees <span className='text-base'> ( Upto 99% )</span>{requiredTag}</p>
                        <input required type='number' step="0" min={1} max={99} className='p-4 mb-6 rounded-lg bg-transparent focus:outline-none border-[1px] border-gray-600 w-full mt-2' placeholder='Enter Management Fees' value={formData.managementFees} onChange={(e) => handleChange(e, 'managementFees')} />
                    </label>
                    <div className='flex justify-between'>
                        <button onClick={handleBack} className='w-44 px-3 py-2 rounded-lg font-semibold bg-[#232529]  text-white flex items-center justify-center space-x-4'>
                            <MdArrowBackIosNew className='w-4' />
                            <span>Back</span>
                        </button>
                        <button type='submit' className='w-44 px-3 py-2 rounded-lg font-semibold  !bg-button  text-black flex items-center justify-center space-x-4'>
                            <span>Next Step</span>
                            <MdArrowForwardIos className='w-4 h-4' />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateVaultForm;