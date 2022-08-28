import React, { useEffect, useState, useContext } from 'react';
import Image from 'next/image'
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from '@heroicons/react/solid';
import { ethers } from 'ethers';

import NFTillustration from '../../assets/NFT.png'
import { fixTokenURI } from '../../utils';
import { MoralisNFT } from '../../contracts/nft';
import { TransactionContext } from '../../contexts/transactionContext';
import ERC_20 from '../../abis/ERC_20.json'
import ERC_721 from '../../abis/ERC_721.json'
import ERC_1155 from '../../abis/ERC_1155.json'
import { DataContext } from '../../contexts/dataContext'
import { CreateVaultFormValues, CreateVaultStep } from '../CreateVaultForm'
import { useRouter } from 'next/router';
import PageLoader from '../PageLoader';

import loader from "../../assets/loader.json";

const APP_ID = process.env.NEXT_PUBLIC_MORALIS_APP_ID;
const SERVER_URL = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL;

declare var window: any

interface CreateVaultFormProps {
    setCurrentStep: (values: CreateVaultStep) => void;
}



const ImportNFTSelect: React.FC<CreateVaultFormProps> = ({
    setCurrentStep,
}) => {
    const router = useRouter();

    const [isLoading, setIsLoading] = React.useState(false);
    const [nftList, setNftList] = React.useState<any[]>([]);
    const [selected, setSelected] = useState(-1);
    const [transferred, setTransferred] = useState<any>([]);
    const [nftsImported, setNftsImported] = useState<string[]>([""])
    const [safeAddress, setSafeAddress] = useState("");
    const [safe, setSafe] = useState(false)

    const { currentAccount, sendTx } = useContext(TransactionContext);
    const { formData, handleCreateVault, deploySafe, defaultFormData, setFormData } = useContext(DataContext);




    const onSubmitHandler: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();
        if (transferred.length === 0) {
            alert("Please import atleast 1 NFT");
            return;
        }
        const nfts = nftsImported;
        const form = {
            ...formData, nfts
        }
        setFormData(form);

        setCurrentStep(CreateVaultStep.FundingCycle)
    }

    const getNFTs = async () => {
        setIsLoading(true)
        console.log(currentAccount)
        try {

            const options = { method: 'GET', headers: { Accept: 'application/json', 'X-API-KEY': '  ' } };

            fetch(`https://testnets-api.opensea.io/api/v1/assets?owner=${currentAccount}&order_direction=desc&limit=20&include_orders=false`, options)
                .then(response => response.json())
                .then(response => { console.log(response); setNftList(response.assets); })
                .catch(err => console.error(err));

        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const send_token = async (tokenAddress: string, tokenId: string, id: number, schema: string) => {
        try {
            setIsLoading(true)

            // const provider = new ethers.providers.Web3Provider(window.ethereum);
            // const signer = provider.getSigner();
            // const to_address = '0x67407721B109232BfF825F186c8066045cFefe7F'
            // const fromAddress = currentAccount;


            // const abi = schema === "ERC721" ? ERC_721 : ERC_1155;
            // let contract = new ethers.Contract(
            //     tokenAddress,
            //     abi,
            //     signer
            // )
            // // console.log('Contract', { contract, signer, fromAddress, to_address, tokenId, tokenAddress })

            // let numberOfTokens = 1
            // console.log(`numberOfTokens: ${numberOfTokens}`)
            // let transfer;
            // schema === "ERC721" ? transfer = await contract.transferFrom(fromAddress, to_address, tokenId) :
            //     transfer = await contract.safeTransferFrom(fromAddress, to_address, tokenId, 1, "0x0")

            // console.log('transfer', transfer)
            // await transfer.wait();
            setTransferred([...transferred, id]);
            let add: string = `https://testnets.opensea.io/assets/rinkeby/${tokenAddress}/${tokenId}`;

            setNftsImported([...nftsImported ?? [], add])

        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false);
        }


    }

    const transferToken = async (i: number, tokenAddress: string, tokenId: string, id: number, schema: string) => {
        if (transferred.includes(id)) {
            console.log('Item already transferred');
            return;
        }

        if (selected !== -1) {
            console.log('Error in selection');
            return;
        }
        setSelected(i);

        await send_token(tokenAddress, tokenId, id, schema);

        setSelected(-1);
    }


    useEffect(() => {
        getNFTs();
    }, [currentAccount, selected === -1])

    const Loader = () => (

        <button className="flex items-center rounded-lg font-semibold px-4 py-2 text-white w-full justify-center" disabled>
            <svg className="mr-3 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="font-medium"> Transferring... </span>
        </button>

    )


    return (
        <div className='pb-8 text-lg'>
            <div className='max-w-2xl mx-auto text-lg flex items-center justify-between h-28 p-6 bg-[url("/Button.png")]  bg-[#232529]    bg-cover overflow-hidden rounded-2xl '>

                <div className='text-white'>
                    <h2 className=' text-2xl font-normal font-britanica '>Select NFTs to Fractionalize</h2>
                    <p className='text-lg font-montserrat'>Fractionalise your NFTs and get em going</p>
                </div>
                <div className='mt-20'>
                    <Image src={NFTillustration} height={220} width={220} />
                </div>
            </div>
            <div className={`mt-10 max-w-7xl mx-auto overflow-y-scroll ${nftList.length > 4 ? "h-[55rem]" : "h-[27.5rem"}`}>
                <div className='py-6 grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-4 gap-y-4 no-scrollbar mx-auto '>
                    {
                        nftList?.map((nft, i) => (
                            <div key={nft.id} className={`w-[17rem] h-[26.5rem] cursor-pointer bg-[#232529] overflow-hidden rounded-xl mx-auto`} onClick={e => transferToken(i, nft.asset_contract.address, nft.token_id, nft.id, nft.asset_contract.schema_name)}>

                                <div className='flex items-center w-[17rem] h-[260px]'>
                                    <img src={nft.animation_url ? nft.animation_url : nft.image_url} />
                                </div>
                                <div className='p-4 truncate text-xl border-b-[1px] border-gray-700'>
                                    <div className='flex space-x-2 items-center justify-start'>
                                        <img src={nft?.asset_contract.image_url} className="h-5 w-5 rounded-full" />
                                        <p className='text-sm'>{(nft?.asset_contract.name)}</p>
                                    </div>
                                    <p className='mt-2 font-britanica font-noraml'>{(nft?.name)}</p>
                                </div>
                                <div className={`text-center p-3 text-xl`}>
                                    <div className=' rounded-lg'>
                                        {
                                            !transferred.includes(nft.id) && selected !== i && (
                                                <button className="flex items-center rounded-lg font-semibold hover:cursor-pointer px-4 py-2 text-black !bg-button border-[1px] border-button w-full justify-center" disabled>
                                                    <span className="font-semibold">Select NFT</span>
                                                </button>
                                            )
                                        }
                                        {
                                            !transferred.includes(nft.id) && selected === i && (
                                                <Loader />
                                            )
                                        }
                                        {
                                            transferred.includes(nft.id) && (
                                                <button className="flex items-center rounded-lg font-semibold border-[1px] border-button  px-4 py-2 text-button w-full justify-center" disabled>
                                                    <span className="font-medium"> Transferred</span>
                                                </button>
                                            )
                                        }
                                    </div>

                                </div>
                            </div>
                        ))
                    }



                </div>
            </div>
            <div className='flex justify-evenly mt-8'>
                {/* <div className='w-44 px-3 py-2 rounded-lg  bg-[#232529]  text-white flex items-center justify-center space-x-4'>
                    <ArrowLeftIcon className='w-4' />
                    <span>Back</span>
                </div> */}
                <button onClick={onSubmitHandler} className='w-64 px-3 py-2 rounded-lg font-semibold bg-[#2BFFB1]  text-black flex items-center justify-center space-x-4'>
                    <span>Fractionlise {nftsImported.length - 1} NFTs</span>
                    <ArrowRightIcon className='w-4' />
                </button>
            </div>
        </div>
    )
}

export default ImportNFTSelect;
