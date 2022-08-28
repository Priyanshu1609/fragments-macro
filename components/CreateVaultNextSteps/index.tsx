import Image from 'next/image';
import React from 'react';
import atomillustration from '../../assets/atomillustration.png';

export interface CreateVaultNextStepsProps {
    readonly onImportNFT: () => void;
}

const CreateVaultNextSteps: React.FC<CreateVaultNextStepsProps> = ({
    onImportNFT
}) => {
    return (
        <div className='min-h-screen flex flex-col items-center justify-center'>
            <div className='flex space-x-4 items-center justify-center '>
                <div className='w-80 p-8 border border-white border-opacity-50 rounded-lg flex flex-col items-center justify-center'>
                    <Image src={atomillustration} />
                    <h1 className='text-2xl font-semibold'>Import NFT</h1>
                    <p className='text-sm text-center text-white opacity-50'>Lorem ipsum dolor sit amet, ectetur adipiscing elita dipiscing elit.</p>
                    <button className='bg-white text-black w-full py-3 rounded-md mt-4' onClick={onImportNFT}>Create DAO</button>
                </div>
                <div className='w-80 p-8 border border-white border-opacity-50 rounded-lg flex flex-col items-center justify-center'>
                    <Image src={atomillustration} />
                    <h1 className='text-2xl font-semibold'>Purchase NFT</h1>
                    <p className='text-sm text-center text-white opacity-50'>Lorem ipsum dolor sit amet, ectetur adipiscing elita dipiscing elit.</p>
                    <button className='bg-white text-black w-full py-3 rounded-md mt-4' >Make Vault</button>
                </div>
            </div>

            <div className='w-[41rem] p-8 border border-white border-opacity-50 rounded-lg flex items-center justify-center mt-4'>
                <div className='flex flex-col flex-[0.5]'>
                    <h1 className='text-2xl font-semibold'>Fundraise with frens</h1>
                    <p className='text-sm  text-white opacity-50'>Lorem ipsum dolor sit amet, ectetur adipiscing elita dipiscing elit.</p>
                </div>
                <div className='flex-[0.5] flex items-center justify-center'>
                    <button className='bg-white text-black  py-3 rounded-md mt-4 w-1/2 '>Make Vault</button>
                </div>
            </div>

        </div>
    )
}

export default CreateVaultNextSteps;