import { createContext, useContext, useState, useEffect } from 'react'
import { TransactionContext } from './transactionContext';

import axios from 'axios';
import { fixTokenURI } from '../utils';

const API_KEY = 'YgOUcYlTNyBe0czxTWvruHCI9dbzkUQj7592RL1fEAakq0XdWughgAXZMA4s7k73';
const APP_ID = process.env.NEXT_PUBLIC_MORALIS_APP_ID;
const SERVER_URL = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL;
const NFTBANK_API_KEY = process.env.NEXT_PUBLIC_NFT_BANK_API_KEY;
const API_URL = "https://api.nftbank.ai/estimates-v2/floor_price/:token_address/:token_id?chain_id=ETHEREUM"
const API_URL_ESTIMATE = "https://api.nftbank.ai/estimates-v2/estimates/:token_address/:token_id?chain_id=ETHEREUM"


export const NftContext = createContext();

export const NftContextProvider = ({ children }) => {

    const { setIsLoading, currentAccount } = useContext(TransactionContext);
    const [nftFloorPriceMapping, setNFTFloorPriceMapping] = useState({});
    const [nftEstimatePriceMapping, setNFTEstimatePriceMapping] = useState({});
    const [nftList, setNftList] = useState([]);
    console.log(nftList);

    const getTokenIdMetadata = async (tokenId, tokenAddress) => {

        try {

            const options = { method: 'GET', headers: { 'X-API-Key': API_KEY, 'Accept': 'application/json', 'Content-Type': 'application/json', } };

            const res = await fetch(`https://deep-index.moralis.io/api/v2/nft/${tokenAddress}/${tokenId}?chain=eth&format=decimal`, options)

            let data = await res.json();

            return JSON.parse(data.metadata);

        } catch (error) {
            console.error(error);
        }

    }

    const getTokens = async (id) => {

        try {

            const options = { method: 'GET', headers: { 'X-API-Key': API_KEY, 'Accept': 'application/json', 'Content-Type': 'application/json', } };

            const res = await fetch(`https://deep-index.moralis.io/api/v2/${id}/nft?chain=rinkeby&format=decimal`, options)

            let data = await res.json();

            return data.result;

        } catch (error) {
            console.error(error);
        }

    }

    const getEstimatePrice = async (tokenId, tokenAddress) => {
        try {
            const options = { method: 'GET', headers: { 'x-api-key': API_KEY, 'Accept': 'application/json', 'Content-Type': 'application/json', } };
            const res = await fetch(`https://api.nftbank.ai/estimates-v2/estimates/0xc2c747e0f7004f9e8817db2ca4997657a7746928/1022?chain_id=ETHEREUM`, options)

            let data = await res.json();

            return data.data.estimate;
        } catch (error) {
            console.error(error);
        }
    }

    const getBaughtPrice = async (tokenId, tokenAddress) => {
        try {
            const options = { method: 'GET', headers: { 'x-api-key': API_KEY, 'Accept': 'application/json', 'Content-Type': 'application/json', } };
            const res = await fetch(`https://api.nftbank.ai/estimates-v2/user-inventory/matic/0x0c6dc7d75cadbbf5fd52afc2079c15d5cd430061`, options)

            let data = await res.json();

            return data.data.estimate;
        } catch (error) {
            console.error(error);
        }
    }

    // const getNFTs = async () => {
    //     setIsLoading(true)
    //     try {
    //         if (!currentAccount) { return };

    //         if (!currentAccount.length) return
    //         if (!APP_ID?.length || !SERVER_URL?.length) {
    //             throw new Error("can't fetch NFTs")
    //         };
    //         const options = { method: 'GET', headers: { 'X-API-Key': API_KEY, 'Accept': 'application/json', 'Content-Type': 'application/json', } };

    //         const res = await fetch(`https://deep-index.moralis.io/api/v2/${currentAccount}/nft?chain=rinkeby&format=decimal`, options)

    //         let nfts = await res.json();

    //         // const nfts = await Moralis.Web3API.account.getNFTs({ chain: 'eth', address: currentAccount });
    //         const nftsMetadataPromise = nfts.result?.filter((nft) => nft.symbol !== 'ENS')?.map((nft) => fixTokenURI(nft.token_uri ?? '')).map((nft) => fetch(nft).then(res => res.json())) ?? []

    //         let NFTFloorPriceMapping = {}

    //         const nftsFloorPricesPromises = nfts.result?.map((nft) => axios.get(API_URL.replace(':token_address', nft.token_address).replace(':token_id', nft.token_id), {
    //             headers: {
    //                 'x-api-key': NFTBANK_API_KEY ?? '',
    //             }
    //         })
    //             .then(res => {
    //                 NFTFloorPriceMapping[`${nft.token_address}_${nft.token_id}`] = res.data?.data[0]?.traits?.[0]?.floor_price_eth
    //                 return res.data
    //             })
    //             .catch(_err => null)) ?? []

    //         const nftsMetadata = await Promise.all(nftsMetadataPromise)

    //         setNFTFloorPriceMapping(NFTFloorPriceMapping)
    //         console.log(nftsMetadata)
    //         console.log(nfts.result?.filter((nft) => nft.symbol !== 'ENS'))

    //         const nftsMetadataFixedWithImages = nftsMetadata.map(
    //             (nft, i) => ({
    //                 ...(nfts?.result?.filter((nft) => nft.symbol !== 'ENS')?.[i] ?? {}),
    //                 ...nft,
    //                 image: fixTokenURI(nft.image ?? nft.image_url),
    //             })
    //         )
    //         setNftList(!nftsMetadataFixedWithImages?.length ? [] : nftsMetadataFixedWithImages);


    //     } catch (error) {
    //         console.error(error)
    //     } finally {
    //         setIsLoading(false)
    //     }
    // }

    const getNFTs = async () => {
        setIsLoading(true)
        // console.log(currentAccount)
        if (!currentAccount) { return };
        if (!currentAccount.length) return;

        try {

            const options = { method: 'GET', headers: { Accept: 'application/json', 'X-API-KEY': '  ' } };

            const response = await fetch(`https://testnets-api.opensea.io/api/v1/assets?owner=${currentAccount}&order_direction=desc&limit=20&include_orders=false`, options)

            const data = await response.json();
            console.log(data);
            setNftList(data.assets);

            let nfts = data.assets;

            let NFTFloorPriceMapping = {}
            let NFTEstimatePriceMapping = {}

            nfts.result?.map((nft) => axios.get(API_URL.replace(':token_address', nft.asset_contract.address).replace(':token_id', nft.token_id), {
                headers: {
                    'x-api-key': NFTBANK_API_KEY ?? '',
                }
            })
                .then(res => {
                    NFTFloorPriceMapping[`${nft.asset_contract.address}_${nft.token_id}`] = res.data?.data[0]?.traits?.[0]?.floor_price_eth
                    return res.data
                })
                .catch(_err => null)) ?? []

            nfts.result?.map((nft) => axios.get(API_URL_ESTIMATE.replace(':token_address', nft.asset_contract.address).replace(':token_id', nft.token_id), {
                headers: {
                    'x-api-key': NFTBANK_API_KEY ?? '',
                }
            })
                .then(res => {
                    NFTFloorPriceMapping[`${nft.asset_contract.address}_${nft.token_id}`] = res.data?.data[0]?.traits?.[0]?.floor_price_eth
                    return res.data
                })
                .catch(_err => null)) ?? []

            setNFTEstimatePriceMapping(NFTEstimatePriceMapping);
            setNFTFloorPriceMapping(NFTFloorPriceMapping);

        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getNFTs()
        console.log('called')
    }, [currentAccount])


    return (
        <NftContext.Provider value={{
            getTokenIdMetadata,
            getTokens,
            getEstimatePrice,
            nftList,
            nftFloorPriceMapping
        }}>
            {children}
        </NftContext.Provider>
    )
}
