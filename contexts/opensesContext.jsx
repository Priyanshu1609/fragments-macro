import { createContext, useState } from "react";
import { ethers } from "ethers";

const opensea = require("opensea-js");
const { WyvernSchemaName } = require('opensea-js/lib/types');
import { OrderSide } from 'opensea-js/lib/types'
import { EtherscanProvider } from "@ethersproject/providers";
const OpenSeaPort = opensea.OpenSeaPort;
const Network = opensea.Network;

const HDWalletProvider = require("@truffle/hdwallet-provider");
const HOT_WALLET_ADDRESS = '0xd232979ed3fc90a331956C4e541815b478116a7D';

//bignumber to number string
const bnToString = (bn) => {
    return ethers.utils.formatEther(bn.toString(10)).toString();
}

export const OpenseaContext = createContext();

export const OpenseaContextProvider = ({ children }) => {

    const [values, setValues] = useState({ tokenAddress: "", tokenId: "" });

    const provider = new HDWalletProvider({
        privateKeys: [`${process.env.NEXT_PUBLIC_PRIVATE}`,],
        providerOrUrl: `https://eth-rinkeby.alchemyapi.io/v2/VsUuFQTF1nb_Vri2VoJeVZZICzP6F3gN`,
        pollingInterval: 1000000
    });

    const seaport = new OpenSeaPort(
        provider,
        {
            networkName: Network.Rinkeby,
            apiKey: "",
        },
        (arg) => console.log(arg)
    );

    const createSellOrder = async (tokenId, tokenAddress) => {
        console.log("Creating a sellorder of item for a fixed price...");
        try {
            const res = await seaport.api.getAsset({
                tokenAddress: tokenAddress,
                tokenId: tokenId,
            })
            const type = res.assetContract.schemaName === 'ERC721' ? WyvernSchemaName.ERC721 : WyvernSchemaName.ERC1155;

            const fixedPriceSellOrder = await seaport.createSellOrder({
                asset: {
                    tokenId,
                    tokenAddress,
                    schemaName: type
                },
                startAmount: 1,
                expirationTime: Math.round(Date.now() / 1000 + 60 * 60 * 24 * 30),
                accountAddress: HOT_WALLET_ADDRESS,
            });
            console.log(
                `Successfully created a fixed-price sell order! ${fixedPriceSellOrder.asset.openseaLink}`
            );
        } catch (error) {
            console.error(error)
        }
    }

    const createBuyOrder = async (tokenId, tokenAddress) => {
        // Example: simple fixed-price sale of an item owned by a user.
        console.log("Creating a buy order of item for a fixed price...");
        try {
            const res = await seaport.api.getAsset({
                tokenAddress: tokenAddress,
                tokenId: tokenId,
            })
            const type = res.assetContract.schemaName === 'ERC721' ? WyvernSchemaName.ERC721 : WyvernSchemaName.ERC1155;

            const fixedPriceBuyOrder = await seaport.createBuyOrder({
                asset: {
                    tokenId,
                    tokenAddress,
                    schemaName: type
                },
                startAmount: 0.00001,
                accountAddress: HOT_WALLET_ADDRESS,
            });
            console.log(
                `Successfully created a fixed-price sell order! ${fixedPriceBuyOrder.asset.openseaLink}\n`
            );
        } catch (error) {
            console.error(error)
        }
    }

    const getAsset = async (tokenId, tokenAddress) => {
        try {
            const res = await seaport.api.getAsset({
                tokenAddress,
                tokenId,
            })
            console.log(res);
            return res;

        } catch (error) {
            console.error(error);
        }
    };


    const getSellOrder = async (tokenId, tokenAddress) => {
        console.log('order startre')
        try {
            const { orders, count } = await seaport.api.getOrders({
                asset_contract_address: tokenAddress,
                token_id: tokenId,
                side: OrderSide.Sell
            })
            orders.sort((a, b) => a.currentPrice - b.currentPrice);
            console.log('Sell Orders', count, orders, orders[0].currentPrice)
            console.log('Price: ', bnToString(orders[0]?.currentPrice))

            return orders[0];


        } catch (error) {
            console.error(error);
        }
    };
    const getBuyOrder = async (tokenId, tokenAddress) => {
        try {
            const { orders, count } = await seaport.api.getOrders({
                asset_contract_address: tokenAddress,
                token_id: tokenId,
                side: OrderSide.Buy
            })

            console.log('Buy Orders', count, orders)

            return (bnToString(orders[0]));
        } catch (error) {
            console.error(error);
        }
    };

    // Get offers (bids), a.k.a. orders where `side == 0`
    // Get page 2 of all auctions, a.k.a. orders where `side == 1`

    // Buying items
    const fulfillBuyOrder = async (safeAddress, order, tokenId, tokenAddress) => {
        try {

            const order = await seaport.api.getOrder({
                side: OrderSide.Sell,
                asset_contract_address: tokenAddress,
                token_id: tokenId,
            })

            console.log('fulfilling the orders', order)

            const accountAddress = HOT_WALLET_ADDRESS // The buyer's wallet address, also the taker
            const transactionHash = await seaport.fulfillOrder({ order, accountAddress, recipientAddress: safeAddress })

            console.log(transactionHash)

        } catch (error) {

            console.error('Error in fullfilling the order', error);
        }
    }

    return (
        <OpenseaContext.Provider value={{
            values,
            setValues,
            createBuyOrder,
            createSellOrder,
            getAsset,
            getBuyOrder,
            getSellOrder,
            fulfillBuyOrder,
        }}>
            {children}
        </OpenseaContext.Provider>
    )
}