import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import ERC_20 from '../abis/ERC_20.json'
import WalletConnectProvider from "@walletconnect/web3-provider";
import { providers } from "ethers";
import Web3 from 'web3';
import { AwsClient } from 'aws4fetch';
import axios from 'axios';

const contractAddress = 0x0000000000000000000000;

export const TransactionContext = React.createContext()

let eth

if (typeof window !== 'undefined') {
    eth = window.ethereum
}

const networks = {
    eth: {
        chainId: `0x${Number(1).toString(16)}`,
        chainName: "Ethereum Mainnet",
        rpcUrls: [
            "https://eth-mainnet.public.blastapi.io",
            "https://cloudflare-eth.com",
            "https://ethereumnodelight.app.runonflux.io",
            "https://main-light.eth.linkpool.io",
        ],
        nativeCurrency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18
        },
        blockExplorerUrls: [
            "https://etherscan.io",
        ]
    },
    rinkeby: {
        chainId: `0x${Number(4).toString(16)}`,
        chainName: "Rinkeby",
        rpcUrls: [
            'https://rinkeby.infura.io/v3/'
        ],
        nativeCurrency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18
        },
        blockExplorerUrls: [
            "https://rinkeby.etherscan.io",
        ]
    },
};

export const TransactionProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [isReturningUser, setIsReturningUser] = useState(false);
    const [clientId, setClientId] = useState('');
    const [awsClient, setAwsClient] = useState();
    const router = useRouter();
    const [ens, setEns] = useState("");

    const web3 = new Web3(Web3.givenProvider);

    let walletConnectProvider;

    const awsConnect = async (address) => {

        //* AWS AUTH
        try {

            setIsLoading(true);
            let customerId;
            const res = await axios(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_API_GET_NONCE_PATH
                }?address=${address}`,
                {
                    method: 'GET',
                    validateStatus: false,
                }
            );
            customerId = res.data.customerId;
            console.log("data", res);
            if (!customerId) {

                const data = JSON.stringify({
                    "address": currentAccount,
                    "referredId": "00000000"
                });
                // console.log("Sign up data passed:", data, process.env.REACT_APP_SIGNUP_KEY);

                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_API_SIGNUP_PATH}`,
                    data,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            "x-api-key": `${process.env.NEXT_PUBLIC_SIGNUP_KEY}`
                        },
                    }
                );
                // console.log("Signup", res);
                // return res.data;


                // const res = await axios.post(
                //     `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_API_SIGNUP_PATH}`,
                //     { address: address },
                //     {
                //         headers: {
                //             'Content-Type': 'application/json',
                //         },
                //     }
                // );
                console.log("Signup", res);
                if (res && res.data.Attributes) {
                    customerId = res.data.Attributes.customerId;
                }

            }

            console.log('customerID:', customerId);
            setClientId(customerId);

            const signature = await web3.eth.personal.sign(
                web3.utils.sha3(`zqbfbzmawv8i6vqq8exfyseuydusrjrju5ueey2zs5lejwg52bfo4fuptp64,nonce: ${customerId}`),
                address
            );

            const data = await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_API_LOGIN_PATH}`,
                {
                    address,
                    signature,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (data) {
                const aws = new AwsClient({
                    accessKeyId: data.data.AccessKeyId,
                    secretAccessKey: data.data.SecretKey,
                    sessionToken: data.data.SessionToken,
                    region: 'ap-south-1',
                    service: 'execute-api',
                });
                console.log("aws:", aws);
                setAwsClient(aws);
                return true;
            }
            else { return false; }

        } catch (error) {

            console.error(error);

        } finally {

            setIsLoading(false);

        }
    }

    const checkIfWalletIsConnected = async () => {
        try {

            setIsLoading(true);

            const accounts = await eth.request({ method: 'eth_accounts' })

            if (accounts.length) {
                let address = accounts[0];
                // const res = await awsConnect(address);
                // if (!res) { return }
                setCurrentAccount(accounts[0])
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false);
        }
    }

    const getProvider = async () => {
        const provider = new ethers.providers.Web3Provider(eth);
        return provider;
    }

    const validateSig = async (address, signature, customerId) => {
        const message = `zqbfbzmawv8i6vqq8exfyseuydusrjrju5ueey2zs5lejwg52bfo4fuptp64,nonce: ${customerId}`;
        console.log('Message', message);
        const hash = web3.utils.sha3(message);
        console.log('Hash:', hash);
        const signing_address = await web3.eth.accounts.recover(hash, signature);
        console.log("Address:", signing_address);
        return signing_address.toLowerCase() === address.toLowerCase();
    };

    const connectWallet = async (type) => {
        try {
            setIsLoading(true);

            let accounts;

            if (type === 'metamask') {
                setIsLoading(true)
                console.log('Is returning', isReturningUser)
                accounts = await eth.request({ method: 'eth_requestAccounts' })
                let address = accounts[0];
                const res = await awsConnect(address);
                console.log(res);
                if (!res) { return }
            }

            else {
                console.log('WalletConnect')
                walletConnectProvider = new WalletConnectProvider({
                    infuraId: 'f82688ca72f84274a38556f3c643ea96'
                });
                accounts = await walletConnectProvider.enable();

                const web3Provider = new providers.Web3Provider(provider);
                console.log('Accounts:', accounts)
            }

            setCurrentAccount(accounts[0])

        } catch (error) {
            console.error(error)
            // throw new Error('No ethereum object.')
        } finally {
            setIsLoading(false)
        }
    }

    const logoutWallet = async () => {
        try {

            setIsReturningUser(true);

            setCurrentAccount('');


        } catch (error) {
            console.error(error)
        }
    }

    const getBalanace = async () => {
        const provider = new ethers.providers.Web3Provider(eth);
        const balance = await provider.getBalance(currentAccount)
        let balanceInEth = ethers.utils.formatEther(balance);
        balanceInEth = parseFloat(balanceInEth).toFixed(4);

        return balanceInEth;
    }

    const getTokenBalance = async (tokenContractAddress) => {

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const contract = new ethers.Contract(tokenContractAddress, ERC_20, provider);
        const balance = (await contract.balanceOf(currentAccount)).toString();

        return balance;

    }

    const fetchEns = async () => {
        if (!currentAccount) { return }
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            let name = await provider?.lookupAddress(currentAccount);
            name = name.toString();
            setEns(name);
            console.log('ENS Name', name);
        } catch (error) {

        }
    }

    useEffect(() => {
        fetchEns();
    }, [currentAccount])



    const sendTx = async (
        receiver,
        amount,
    ) => {
        try {
            setIsLoading(true);
            const provider = new ethers.providers.Web3Provider(eth);
            console.log(provider);
            const signer = provider.getSigner();
            ethers.utils.getAddress(receiver);
            // const hexaMessage = ethers.utils.formatBytes32String(message);
            const tx = await signer.sendTransaction({
                to: receiver,
                value: ethers.utils.parseEther(amount.toString())
            });
            await tx.wait();
            return tx;

        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        async function listenMMAccount() {
            window.ethereum.on("accountsChanged", async function () {
                eth.on('accountsChanged', function () {
                    console.log('accounts changed')
                    logoutWallet();
                })
                logoutWallet();
            });
        }
        listenMMAccount();
    }, []);

    useEffect(() => {
        async function listenMMAccount() {
            window.ethereum.on("chainChanged", async function () {
                getProvider();
            });
        }
        listenMMAccount();
    }, []);

    useEffect(() => {
        checkIfWalletIsConnected()
        // getTransactionRecByHash();
    }, [])

    return (
        <TransactionContext.Provider
            value={{
                connectWallet,
                currentAccount,
                isLoading,
                logoutWallet,
                getBalanace,
                getTokenBalance,
                getProvider,
                setIsLoading,
                sendTx,
                ens,
            }}
        >
            {children}
        </TransactionContext.Provider>
    )
}
