import { darkTheme, SwapWidget } from '@uniswap/widgets'
import '@uniswap/widgets/fonts.css'
import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import { SocketContext } from '../../contexts/socketContext';
import { TransactionContext } from '../../contexts/transactionContext';
import Modal from '../Modal';
import { Bridge } from "@socket.tech/widget";
// import { Provider } from "./providerComponent"
import tokens from '../../abis/UniswapTokens.json'
import ConnectModalContext from '../../contexts/connectwallet';

const jsonRpcEndpoint = `https://rinkeby.infura.io/v3/195d30bd1c384eafa2324e0d6baab488`;
// Socket public testing API Key
const SOCKET_API_KEY = '645b2c8c-5825-4930-baf3-d9b997fcd88c'


type CustomizationProps = {
    width: number,
    responsiveWidth: boolean,
    borderRadius: number,
    accent: string,
    onAccent: string,
    primary: string,
    secondary: string,
    text: string,
    secondaryText: string,
    interactive: string,
    onInteractive: string,
    // outline: string,
}

const customize: CustomizationProps = {
    width: 512,
    responsiveWidth: false,
    borderRadius: 1,
    secondary: 'rgb(68,69,79)',
    primary: 'rgb(31,34,44)',
    accent: 'rgb(131,249,151)',
    onAccent: 'rgb(0,0,0)',
    interactive: 'rgb(0,0,0)',
    onInteractive: 'rgb(240,240,240)',
    text: 'rgb(255,255,255)',
    secondaryText: 'rgb(200,200,200)',
}

const defaultSourceNetwork = 137;
const defaultDestNetwork = 1;

// Pre-selecting default sending token as USDC on Ethereum and destination token as sUSD on Optimism
const defaultSourceToken = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
const defaultDestToken = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

const SelectChain: React.FC = () => {

    const { getProvider, currentAccount } = useContext(TransactionContext);
    const { swapModal, setSwapModal } = useContext(ConnectModalContext);
    const [provider, setProvider] = useState<any>();
    const [socket, setSocket] = useState(false)
    const [swap, setSwap] = useState(false)
    const [coins, setCoins] = useState<any>([])
    const [state, setState] = useState("swap")


    const getProviderFrom = async () => {
        const provider = await getProvider();
        setProvider(provider);
    }

    useEffect(() => {
        if (currentAccount) {
            getProviderFrom();
        }
    }, [currentAccount])


    return (
        <Modal
            open={swapModal}
            onClose={() => setSwapModal(false)}
            showCTA={false}
            title={`${state === "swap" ? "Dex Swap" : "Multichain Bridge"}`}
        >

            <div className=' w-full h-[30rem] mt-4 font-montserrat '>
                <div className='flex space-x-4'>
                    <div onClick={() => setState("swap")} className="p-2 hover:cursor-pointer flex items-center justify-center w-full rounded-lg h-12  bg-transparent focus:outline-none border-[1px] border-gray-600">
                        <p className='text-lg text-white'>Dex Swap</p>
                    </div>
                    <div onClick={() => setState("bridge")} className="p-2 hover:cursor-pointer  flex items-center justify-center w-full rounded-lg h-12  bg-transparent focus:outline-none border-[1px] border-gray-600">
                        <p className='text-lg text-white'>Multichain bridge</p>
                    </div>
                </div>
                <div className='flex items-center mt-4'>
                    {state === "bridge" && <div className="flex flex-grow items-center justify-center !w-full ">
                        <Bridge
                            provider={provider}
                            API_KEY={SOCKET_API_KEY}
                            defaultSourceNetwork={defaultSourceNetwork}
                            defaultDestNetwork={defaultDestNetwork}
                            defaultSourceToken={defaultSourceToken}
                            defaultDestToken={defaultDestToken}
                            customize={customize}
                            destNetworks={[
                                1
                            ]}
                        />
                    </div>}

                    {state === "swap" && <div className=" Uniswap flex flex-grow items-center justify-center !w-full">
                        <SwapWidget
                            provider={provider}
                            jsonRpcEndpoint={jsonRpcEndpoint}
                            defaultOutputTokenAddress='NATIVE'
                            theme={darkTheme}
                            width={512}
                            tokenList={tokens}
                        />
                    </div>}
                </div>
            </div>
        </Modal>
    )
}

export default SelectChain;
