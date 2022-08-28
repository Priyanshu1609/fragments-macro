import React, { useEffect } from 'react';
import opensealogo from '../assets/opensealogo.svg';
import Image from 'next/image';
import { ArrowRightIcon } from '@heroicons/react/solid';
import { fixTokenURI, getEllipsisTxt, ipfsParse } from '../utils';
import { FiMoreVertical } from 'react-icons/fi';
import { MdPersonOutline } from 'react-icons/md';
import { AiOutlineClockCircle } from 'react-icons/ai';

export interface NFTCardProps {
    nft: any;
    floor_price?: number;
}

const NFTCard: React.FC<NFTCardProps> = ({
    nft,
    floor_price
}) => {
    console.log(floor_price)

    // const [nftMetadata, setNftMetadata] = React.useState<any>();

    // const fetchNFTMetadata = async () => {
    //     if(!nft.token_uri) return
    //     try {
    //         const fixedTokenURI = fixTokenURI(nft.token_uri)

    //         const res = await fetch(fixedTokenURI)
    //         const nftMetadata = await res.json()

    //         setNftMetadata({
    //             ...nftMetadata,
    //             image: fixTokenURI(nftMetadata.image ?? nftMetadata.image_url),
    //         })
    //     } catch (error) {
    //         console.error(error)
    //     }
    // }

    // useEffect(() => {
    //     fetchNFTMetadata()
    // }, [nft])

    return (
        // <div className={`rounded-xl mx-auto w-[323px] h-[480px] bg-input relative`} >
        //     {/* <div className='flex rounded-t-lg justify-between items-center h-[250px]'>
        //         {nft?.image?.length && <img src={fixTokenURI(nft.image)} className='w-[250px] rounded-t-lg' />}
        //     </div>
        //     <div className='px-4 py-3'>
        //         <div>
        //             <div className='flex text-lg'>
        //                 <p>{nft.name}</p>
        //             </div>
        //         </div>
        //     </div> */}
        //     <Image src={nft.animation_url ? nft.animation_url : nft.image_url} className='rounded-t-xl' width={323} height={275} />
        //     {/* <div className='flex items-center w-[17rem] h-[260px]'>
        //         <img src={nft.animation_url ? nft.animation_url : nft.image_url} />
        //     </div> */}
        //     <div className='px-4 py-3'>

        //         <div className='p-4 truncate text-xl border-b-[1px] border-gray-700'>
        //             <div className='flex space-x-2 items-center justify-start'>
        //                 <img src={nft?.asset_contract.image_url} className="h-5 w-5 rounded-full" />
        //                 <p className='text-sm'>{(nft?.asset_contract.name)}</p>
        //             </div>
        //             <p className='mt-2 font-britanica font-noraml'>{(nft?.name)}</p>
        //         </div>
        //         <div className='px-4'>
        //             {
        //                 !!floor_price && (
        //                     <div>
        //                         <p className='text-xs text-white opacity-70'>Floor Price</p>
        //                         <h2 className='text-base font-semibold'>{floor_price}</h2>
        //                     </div>
        //                 )
        //             }
        //         </div>
        //         <div className='p-4'>
        //             <div className='flex justify-between'>
        //                 {/* <div>
        //                 <p className='text-xs text-white text-opacity-70'>Valuations</p>
        //                 <h2>{valuations}</h2>
        //                 </div>
        //                 <div>
        //                 <p className='text-xs text-white text-opacity-70'>Unique owners</p>
        //                 <h2>{uniqueOwners}</h2>
        //             </div> */}
        //                 <a
        //                     href={`https://opensea.io/assets/${nft.token_address}/${nft.token_id}`}
        //                     target='_blank'
        //                     rel='noopener noreferrer'
        //                     className='flex bg-[#1E1E24] p-3 w-full justify-between rounded-lg'
        //                 >
        //                     <div className='flex space-x-2'>
        //                         <Image src={opensealogo} />
        //                         <p className='text-sm'>View on Opensea</p>
        //                     </div>
        //                     <ArrowRightIcon className='w-4 -rotate-45' />
        //                 </a>
        //             </div>
        //         </div>
        //     </div>
        // </div>

        <div className={`rounded-xl mx-auto w-[323px] h-[480px] bg-input relative`} >
            {/* <p className="absolute top-2 right-2 text-white z-50 font-semibold text-xs flex items-center space-x-1">
                <BsDot className={`h-6 w-6 -mr-2 ${status === "RUNNING" ? "text-green-300" : ""}`} />
                <span>Sale </span>
                <span >{status === "RUNNING" ? " Live" : " Ended"}</span>
            </p>
            <div className="absolute top-2 left-2  z-50 font-black text-xs flex items-center space-x-1 px-2 py-1 text-black bg-[#B5C2CA] rounded-lg">
                <span>{nft?.length - 1}</span>
                <span >NFTs</span>
            </div> */}
            <Image src={nft.animation_url ? nft.animation_url : nft.image_url} className='rounded-t-xl' width={323} height={275} />
            <div className='px-4 py-3'>
                <div className="flex justify-between">
                    <div className='flex text-sm items-center space-x-2'>
                        {/* <Image src={coin} height={20} width={20} /> */}
                        <img src={nft?.asset_contract.image_url} className="h-5 w-5 rounded-full" />
                        <p>{nft?.asset_contract.name}</p>
                    </div>
                    <FiMoreVertical />
                </div>
                <p className="text-xl mt-1 font-britanica font-normal">{getEllipsisTxt(nft?.name, 12)}</p>
            </div>
            <div className='bg-gray-600 p-[1px]' />
            <div className='px-4 py-3 font-montserrat'>
                <div className=' flex justify-between items-center font-montserrat'>
                    <div>
                        <div className="flex items-center space-x-1">
                            <MdPersonOutline />
                            <p className="text-sm text-gray-300">CREATED AT</p>
                        </div>
                        <p className='text-xs'>{(nft.asset_contract.created_date)}</p>
                    </div>
                    <div>
                        <div className="flex items-center space-x-1">
                            <AiOutlineClockCircle />
                            <p className="text-sm text-gray-300">FLOOR PRICE</p>
                        </div>
                        <p>{floor_price}</p>
                    </div>
                </div>
                <div className='mt-2'>
                    <div className='flex justify-between'>
                        {/* 
                            <div>
                                <p className='text-xs text-white text-opacity-70'>Valuations</p>
                                <h2>{valuations}</h2>
                                </div>
                                <div>
                                <p className='text-xs text-white text-opacity-70'>Unique owners</p>
                                <h2>{uniqueOwners}</h2>
                            </div> 
                        */}
                        <a
                            href={`https://testnets.opensea.io/assets/${nft.asset_contract.address}/${nft.token_id}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex bg-[#1E1E24] p-3 w-full justify-between rounded-lg'
                        >
                            <div className='flex space-x-2'>
                                <Image src={opensealogo} />
                                <p className='text-sm'>View on Opensea</p>
                            </div>
                            <ArrowRightIcon className='w-4 -rotate-45' />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NFTCard;