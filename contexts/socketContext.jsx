import React, { useState, createContext, useContext } from 'react'
import { ethers } from 'ethers'
const ERC20_ABI = require('../abis/ERC_20.json')
import networks from '../networks';

import { TransactionContext } from './transactionContext';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {

    const chains = [
        // {
        //     "chainId": 1,
        //     "name": "Ethereum",
        //     "icon": "https://movricons.s3.ap-south-1.amazonaws.com/Ether.svg",
        // },
        {
            "chainId": 10,
            "name": "Optimism",
            "icon": "https://movricons.s3.ap-south-1.amazonaws.com/Optimism.svg",
        },
        {
            "chainId": 56,
            "name": "BSC",
            "icon": "https://movricons.s3.ap-south-1.amazonaws.com/BSC.svg",
        },
        {
            "chainId": 100,
            "name": "Gnosis",
            "icon": "https://movricons.s3.ap-south-1.amazonaws.com/gnosis.svg",
        },
        {
            "chainId": 137,
            "name": "Polygon",
            "icon": "https://movricons.s3.ap-south-1.amazonaws.com/Matic.svg",
        },
        {
            "chainId": 250,
            "name": "Fantom",
            "icon": "https://movricons.s3.ap-south-1.amazonaws.com/Fantom.svg",
        },
        {
            "chainId": 42161,
            "name": "Arbitrum",
            "icon": "https://movricons.s3.ap-south-1.amazonaws.com/Arbitrum.svg",
        },
        {
            "chainId": 43114,
            "name": "Avalanche",
            "icon": "https://movricons.s3.ap-south-1.amazonaws.com/Avalanche.svg",
        },
        {
            "chainId": 1313161554,
            "name": "Aurora",
            "icon": "https://movricons.s3.ap-south-1.amazonaws.com/aurora.svg",
        }
    ]
    const API_KEY = 'f09a7c60-cc6f-4656-ad1b-ac8879df3424';
    const { currentAccount } = useContext(TransactionContext);

    // const [chainData, setChainData] = useState({ fromChainId: "137", toChainId: "1", fromToken: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', toToken: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', amount: '100' });
    // const [coins, setCoins] = useState([]);

    // const handleChainChange = (e, name) => {
    //     setChainData(prevState => ({ ...prevState, [name]: e.target.value }))
    // }

    const [selectedToken, setSelectedToken] = useState()
    const [selectedChain, setSelectedChain] = useState()
    const [coins, setCoins] = useState([]);

    const handleNetworkSwitch = async (chainId) => {
        const chains = networks.networks
        try {

            if (!window.ethereum) throw new Error("No crypto wallet found");
            await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                    {
                        ...chains[chainId]
                    }
                ]
            });
        } catch (err) {
            console.error(err);
        }
    };

    // const handleNetworkSwitch = async (chainId) => {
    //     const chains = networks.networks
    //     try {
    //         await window.ethereum.request({
    //             method: 'wallet_switchEthereumChain',
    //             params: [
    //                 {
    //                     ...chains[chainId]
    //                 }
    //             ]
    //         });
    //     } catch (err) {
    //         // This error code indicates that the chain has not been added to MetaMask
    //         if (err.code === 4902) {
    //             await window.ethereum.request({
    //                 method: 'wallet_addEthereumChain',
    //                 params: [
    //                     {
    //                         ...chains[chainId]
    //                     }
    //                 ]
    //             });
    //         }
    //     }
    // };

    const fetchFromTokens = async (fromChainId) => {

        try {

            const options = { method: 'GET', headers: { 'API-KEY': API_KEY, 'Accept': 'application/json', 'Content-Type': 'application/json', } };

            const res = await fetch(`https://backend.movr.network/v2/token-lists/from-token-list?fromChainId=${fromChainId}&toChainId=1&isShortList=true`, options)
            const data = await res.json();
            return data.result;

        } catch (error) {
            console.error(error);
        }
    }

    const fetchToTokens = async () => {

        try {

            const options = { method: 'GET', headers: { 'API-KEY': API_KEY, 'Accept': 'application/json', 'Content-Type': 'application/json', } };

            const res = await fetch(`https://backend.movr.network/v2/token-lists/to-token-list?fromChainId=${values.fromChainId}&toChainId=${values.toChainId}`, options)

            const data = await res.json();
            console.log('Fetch To Tokens', data);

        } catch (error) {
            console.error(error);
        }
    }


    const getQuote = async (fromChainId, fromToken, amount, userAddress) => {

        try {
            console.log('Quote:', {
                fromChainId,
                fromToken,
                amount,
                userAddress
            })

            const options = {
                method: 'GET', headers: {
                    'API-KEY': API_KEY, 'Accept': 'application/json', 'Content-Type': 'application/json'
                }
            };

            const res = await fetch(`https://backend.movr.network/v2/quote?fromChainId=${fromChainId}&fromTokenAddress=${fromToken}&toChainId=1&toTokenAddress=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee&fromAmount=${amount}&userAddress=${userAddress}&uniqueRoutesPerBridge=true&sort=gas&singleTxOnly=false`, options)

            const data = await res.json();
            console.log('Quote:', data)
            return data;

        } catch (error) {
            console.error(error);
        }
    }

    // Starts bridging journey, creating a unique 'routeId' 
    async function startRoute(startRouteBody) {

        try {
            const response = await fetch('https://backend.movr.network/v2/route/start', {
                method: 'POST',
                headers: {
                    'API-KEY': API_KEY,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: startRouteBody
            });

            const json = await response.json();
            return json;
        }
        catch (error) {
            console.log("Error", error);
        }
    }

    // Sends confirmation of completion of transaction & gets status of whether to proceed with next transaction
    async function prepareNextTx(activeRouteId, userTxIndex, txHash) {
        try {
            const response = await fetch(`https://backend.movr.network/v2/route/prepare?activeRouteId=${activeRouteId}&userTxIndex=${userTxIndex}&txHash=${txHash}`, {
                method: 'GET',
                headers: {
                    'API-KEY': API_KEY,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            const json = await response.json();
            return json;
        }
        catch (error) {
            console.log("Error", error);
        }
    }

    // Calls route/build-next-tx and receives transaction data in response 
    async function buildNextTx(activeRouteId) {
        try {
            const response = await fetch(`https://backend.movr.network/v2/route/build-next-tx?activeRouteId=${activeRouteId}`, {
                method: 'GET',
                headers: {
                    'API-KEY': API_KEY,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            const json = await response.json();
            return json;
        }
        catch (error) {
            console.log("Error", error);
        }
    }

    // Helper Function to make approval
    async function makeApprovalTx(approvalTokenAddress, allowanceTarget, minimumApprovalAmount, signer) {
        const ERC20Contract = new ethers.Contract(approvalTokenAddress, ERC20_ABI, signer);
        console.log('ERC20Contract', ERC20Contract);
        const gasEstimate = await ERC20Contract.estimateGas.approve(allowanceTarget, minimumApprovalAmount);
        const gasPrice = await signer.getGasPrice();

        console.log('Gas: ', ethers.utils.formatUnits(gasPrice, "ether"));

        return ERC20Contract.approve(allowanceTarget, minimumApprovalAmount, {
            gasLimit: gasEstimate,
            gasPrice: gasPrice
        });
    }




    // Main function 
    const transaction = async (fromChainId, fromToken, amount, userAddress) => {
        console.log('Transaction:', {
            fromChainId,
            fromToken,
            amount,
            userAddress
        })

        const fromProvider = new ethers.providers.Web3Provider(window.ethereum);
        const fromSigner = fromProvider.getSigner();

        const toProvider = new ethers.providers.EtherscanProvider(
            'rinkeby',
            `${process.env.NEXT_PUBLIC_API}`
        )
        const toSigner = new ethers.Wallet(`${process.env.NEXT_PUBLIC_PRIVATE}`, toProvider);

        let activeRouteId; // These are retrieved and assinged from /route/start
        let userTxIndex; // These are retrieved and assinged from /route/start
        let txTarget;
        let txData;
        let value;


        const res = await getQuote(fromChainId, fromToken, amount, userAddress);

        if (res.result.routes[0] === undefined) {
            console.error('No route found')
            return;
        }
        const route = res.result.routes[0];
        console.log('Route : ', route);

        // Body to be sent in the /route/start request
        let startRouteBody = {
            "fromChainId": fromChainId,
            "toChainId": '1',
            "fromAssetAddress": fromToken,
            "toAssetAddress": '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
            "includeFirstTxDetails": true,
            "route": route
        }

        console.log("Starting Route", startRouteBody, JSON.stringify(startRouteBody));

        const routeStarted = await startRoute(JSON.stringify(startRouteBody));

        // Relevant data from response of /route/start
        activeRouteId = routeStarted.result.activeRouteId;
        userTxIndex = routeStarted.result.userTxIndex;
        activeRouteId = routeStarted.result.activeRouteId;
        userTxIndex = routeStarted.result.userTxIndex;
        txTarget = routeStarted.result.txTarget;
        txData = routeStarted.result.txData;
        value = routeStarted.result.value;

        console.log({ activeRouteId, userTxIndex });

        // Checks if user needs to give Socket contracts approval
        if (routeStarted.result.approvalData != null) {
            console.log('Approval is needed', routeStarted.result.approvalData);

            // Params for approval
            let approvalTokenAddress = routeStarted.result.approvalData.approvalTokenAddress;
            let allowanceTarget = routeStarted.result.approvalData.allowanceTarget;
            let minimumApprovalAmount = routeStarted.result.approvalData.minimumApprovalAmount;

            let tx = await makeApprovalTx(approvalTokenAddress, allowanceTarget, minimumApprovalAmount, fromSigner);
            console.log('tx for approval', tx);
            await tx.wait().then(receipt => console.log('Approval Tx :', receipt.transactionHash))
                .catch(e => console.log(e));
        }
        else {
            console.log('Approval not needed');
        }

        // Main Socket Transaction (Swap + Bridge in one tx)
        const gasPrice = await fromSigner.getGasPrice();
        const sourceGasEstimate = await fromProvider.estimateGas({
            from: fromSigner.address,
            to: txTarget,
            value: value,
            data: txData,
            gasPrice: gasPrice
        });

        const tx = await fromSigner.sendTransaction({
            from: fromSigner.address,
            to: txTarget,
            data: txData,
            value: value,
            gasPrice: gasPrice,
            gasLimit: sourceGasEstimate
        });

        const receipt = await tx.wait();
        const txHash = receipt.transactionHash;
        console.log('Socket source Brige Tx :', receipt.transactionHash);

        let isInitiated = false;

        // Repeatedly pings /route/prepare with executed transaction hash
        // Once the bridging process is complete, if it returns 'completed', the setInterval exits
        // If another swap transaction is involved post bridging, the returned response result is 'ready'
        // In which case the above process is repeated on destination chain
        let retry = 0;
        const status = setInterval(async () => {
            // Gets status of route journey 
            const statusFetched = await prepareNextTx(activeRouteId, userTxIndex, txHash);
            console.log("Current status :", statusFetched.result);

            // Exits setInterval if route is 'completed'
            if (statusFetched.result == 'completed') {
                console.log('Bridging transaction is complete');
                retry = 0;
                clearInterval(status);
            }

            // Executes post bridging transactions on destination
            else if (statusFetched.result == 'ready') {
                if (!isInitiated) {
                    isInitiated = true;
                    console.log('Proceeding with post-bridging transaction');

                    const nextTx = await buildNextTx(activeRouteId);
                    console.log(nextTx);

                    // Updates relevant params
                    userTxIndex = nextTx.result.userTxIndex;
                    txTarget = nextTx.result.txTarget;
                    txData = nextTx.result.txData;
                    value = nextTx.result.value;

                    // Checks if approval is needed 
                    if (nextTx.result.approvalData != null) {
                        console.log('Approval is needed', nextTx.result.approvalData);

                        let approvalTokenAddress = nextTx.result.approvalData.approvalTokenAddress;
                        let allowanceTarget = nextTx.result.approvalData.allowanceTarget;
                        let minimumApprovalAmount = nextTx.result.approvalData.minimumApprovalAmount;

                        // Signer is initiated with provider of destination chain RPC
                        let tx = await makeApprovalTx(approvalTokenAddress, allowanceTarget, minimumApprovalAmount, toSigner);
                        console.log('tx', tx);
                        await tx.wait().then(receipt => console.log('Destination Approve Tx', receipt.transactionHash))
                            .catch(e => console.log(e));
                    }
                    else {
                        console.log('Approval not needed');
                    }

                    // Sends destination swap transaction
                    const gasPrice = await toSigner.getGasPrice();
                    const sourceGasEstimate = await toProvider.estimateGas({
                        from: toSigner.address,
                        to: txTarget,
                        data: txData,
                        value: value,
                        gasPrice: gasPrice,
                        value: ethers.utils.parseEther("0")
                    });

                    const tx = await toSigner.sendTransaction({
                        from: toSigner.address,
                        to: txTarget,
                        data: txData,
                        value: value,
                        gasPrice: gasPrice,
                        gasLimit: sourceGasEstimate
                    });

                    const receipt = await tx.wait();
                    txHash = receipt.transactionHash;
                    return tx;

                }
            }
            if (retry > 10) {
                console.log('Bridging transaction failed');
                clearInterval(status);
            }
            retry++;

        }, 5000)

    }

    return (
        <SocketContext.Provider value={{
            transaction,
            fetchFromTokens,
            fetchToTokens,
            getQuote,
            chains,
            handleNetworkSwitch,
            selectedChain,
            setSelectedChain,
            selectedToken,
            setSelectedToken,
            coins,
            setCoins
        }}>
            {children}
        </SocketContext.Provider>
    )
}