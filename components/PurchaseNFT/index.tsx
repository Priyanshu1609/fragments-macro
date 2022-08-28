import React, { useContext, useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowRightIcon, ExternalLinkIcon, CheckCircleIcon, PlusIcon, XIcon } from '@heroicons/react/solid';
import { BigNumber } from 'ethers';
import { darkTheme, Theme, SwapWidget } from '@uniswap/widgets'
import '@uniswap/widgets/fonts.css'
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic'

const SelectChain = dynamic(
    () => import('../../components/SelectChain'),
    { ssr: false }
)

import { requiredTag } from '../CreateDAOForm';
import vault from '../../assets/NFT.png';
import Modal from '../Modal';
import Select from '../Select';

import { bnToString, dtToString, ipfsParse, fixTokenURI, minDtTime, maxDtTime } from '../../utils';
import { CreateVaultFormValues, CreateVaultStep } from '../CreateVaultForm'

import { NftContext } from '../../contexts/NftContext';
import { OpenseaContext } from '../../contexts/opensesContext';
import { SocketContext } from '../../contexts/socketContext';
import { TransactionContext } from '../../contexts/transactionContext';
import { DataContext } from '../../contexts/dataContext'

import UniswapTokens from '../../abis/UniswapTokens.json'
const jsonRpcEndpoint = `https://rinkeby.infura.io/v3/195d30bd1c384eafa2324e0d6baab488`;

interface CreateVaultFormProps {
    setCurrentStep: (values: CreateVaultStep) => void;
}

interface selectedChain {
    chainId: number;
    icon: string;
    name: string;
    asset: object;
}

interface selectedToken {
    symbol: string;
    address: string | undefined;
    currentPrice: BigNumber;
}



const PurchaseNft: React.FC<CreateVaultFormProps> = ({
    setCurrentStep
}) => {

    const router = useRouter()


    // const [selectedToken, setSelectedToken] = useState<selectedToken>()
    // const [selectedChain, setSelectedChain] = useState<selectedChain>()
    // const [coins, setCoins] = useState([]);
    const [safeAddress, setSafeAddress] = useState("");
    const [target, setTarget] = useState(0);
    const [duration, setDuration] = useState<number>(Number.MAX_SAFE_INTEGER);
    const [amount, setAmount] = useState();
    const [visible, setVisible] = useState(false)
    const [order, setOrder] = useState<any>([])
    const [orders, setOrders] = useState<any>([]);
    const [balance, setBalance] = useState('0');
    const [provider, setProvider] = useState();
    const [uniModal, setUniModal] = useState(false)
    const [links, setLinks] = useState([
        {
            type: "text",
            id: 1,
            value: "",
            vis: false,
        }
    ]);
    console.log(target);

    const { getSellOrder } = useContext(OpenseaContext);
    const { fetchFromTokens, transaction, chains, handleNetworkSwitch, } = useContext(SocketContext);
    const { getBalanace, getTokenBalance, getProvider, currentAccount } = useContext(TransactionContext);
    const { formData, handleCreateVault, handleChange, deploySafe, defaultFormData, setFormData } = useContext(DataContext);

    const getProviderFrom = async () => {
        const provider = await getProvider();
        setProvider(provider);
    }

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
        const address = await deploySafe();
        if (!address) {
            alert("Error in deploying Gnosis safe! Please try again");
            router.push({
                pathname: `/dashboard`,
                query: { user: currentAccount },
            })
            setFormData(defaultFormData)
            return;
        }
        console.log("Import page deployed address :", address);
        setSafeAddress(address);
    }

    useEffect(() => {
        createSafe();
    }, [])

    const onSubmitHandler: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        let arr = [] as any;
        links.forEach(link => {
            arr.push(link.value)
        });

        const form = {
            ...formData,
            nftsPurchased: arr,
            target: target,
            fundraiseDuration: duration ?? 0,
            myContribution: amount ?? 0,
        }

        handleCreateVault(form, safeAddress);
    }

    const getNFTs = async (i: number) => {

        const link = links[i].value;

        if (!link) {
            return;
        }

        const tokenId = link.split('/')[6]
        const tokenAddress = link.split('/')[5]

        console.log({ orders })
        try {

            if (!links[i].vis) {
                console.log('Prev didnt fetched')
                const _order = await getSellOrder(tokenId, tokenAddress);
                setOrder(_order);
                setOrders((prev: any) => [...prev, _order]);

                setTarget(target === 0 ? bnToString(_order?.currentPrice) : target + bnToString(_order?.currentPrice));
                setDuration(Math.min(duration, _order?.expirationTime - 30 * 60))

                links[i].vis = true;
            }
            else {
                console.log('Prev fetched exist');
                setOrder(orders[i]);
            }
            setVisible(true);

        } catch (error) {
            console.error(error)
        } finally {
            // setLoading(false);
        }
    }



    const addInput = () => {
        setLinks((s: any) => {
            return [
                ...s,
                {
                    type: "text",
                    value: "",
                    vis: false,
                }
            ];
        });
    };

    const handleLinksChange = (e: any) => {
        e.preventDefault();

        const index = e.target.id;
        setLinks(s => {
            const newArr = s.slice();
            newArr[index].value = e.target.value;

            return newArr;
        });
    };

    const handleRemove = (i: any) => {
        if (links.length === 1) {
            return;
        }
        if (orders[i]) {
            console.log('Deleting value');
            setTarget(target - bnToString(orders[i]?.currentPrice));
            if (duration === (orders[i].expirationTime)) {
                orders.splice(i, 1);
                let a = Number.MAX_SAFE_INTEGER;
                orders.forEach((element: any) => {
                    a = (Math.min(a, element.expirationTime))
                });
                setDuration(a);
            }
        }
        setLinks((products) => products.filter((_, index) => index !== i));
    }

    console.log('Links', links);
    useEffect(() => {
        fetchBalance()
    }, [])

    useEffect(() => {
        { links[links.length - 1]?.value && getNFTs(links.length - 1) };
    }, [links])

    useEffect(() => {
        getProviderFrom();
    }, [])

    return (
        <div className='text-white max-w-4xl mx-auto  sm:px-4  pb-16'>
            <div className='flex items-center justify-between p-6 bg-[url("/Button.png")]  bg-[#232529]    bg-cover rounded-lg '>
                <div>
                    <h2 className='text-black text-2xl font-semibold mb-2'>Select NFTs to fractionalise</h2>
                    <p className='text-black'>Lorem ipsum dolor sit amet, ectetur adipisc elita dipiscing elit.</p>
                </div>
                <div>
                    <Image src={vault} width={150} height={150} />
                </div>
            </div>
            <div className='mt-10'>
                <form onSubmit={onSubmitHandler}>
                    <div>
                        {links.map((item, i) => {
                            return (
                                <div key={i} className='flex justify-between mb-4'>
                                    <label className='flex-grow '>
                                        <p className='text-sm'>Opensea Link {requiredTag}</p>
                                        <input required
                                            onChange={handleLinksChange}
                                            value={item.value}
                                            id={i.toString()}
                                            type={item.type}
                                            className='p-3 rounded-l-lg bg-input focus:outline-none w-full mt-2' placeholder='Enter Opensea or Rarible NFT Link'
                                        />
                                    </label>
                                    <button onClick={e => getNFTs(i)} className='w-44 mt-7 underline text-sm text-green-500 flex justify-end items-center bg-input'>Preview NFT
                                        <ExternalLinkIcon className='h-6 w-6 mx-3' />
                                    </button>
                                    <button onClick={e => handleRemove(i)} className='w-10 mt-7 underline text-sm rounded-r-lg text-red-500 flex justify-center items-center bg-input'>
                                        <XIcon className='h-8 w-8 mx-3' />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                    <div onClick={addInput} className='p-3 mb-6 rounded-l-lg bg-input focus:outline-none w-full mt-2 cursor-pointer'>
                        <p className='text-center flex items-center justify-center'>Add New Link <PlusIcon className='h-5 w-5 mx-3' /> </p>
                    </div>

                    <div className='grid grid-cols-2 gap-6'>
                        <label>
                            <p className='text-sm'>Target Fundraise </p>
                            <p className='p-3 mb-6 rounded-lg bg-input focus:outline-none w-full mt-2' placeholder='Enter Voting Period'>
                                {target}
                            </p>
                        </label>
                        <label>
                            <p className='text-sm'>Fundraise Duation {requiredTag}</p>
                            <input required style={{ colorScheme: 'dark' }} type='datetime-local' min={minDtTime()} max={maxDtTime(duration)} className='p-3 mb-6 rounded-lg cursor-pointer bg-input focus:outline-none w-full mt-2' placeholder='Days' value={formData.fundraiseDuration} onChange={(e) => handleChange(e, 'fundraiseDuration')} />
                        </label>
                    </div>
                    <div className='p-2 bg-input rounded-lg mt-4'>
                        <p className='text-base text-center  text-green-600'>You will have to put atleast 10% of the target fundraise to start the funding cycle.</p>
                    </div>
                    <div>
                        <SelectChain />
                        {/* <div className='bg-input p-3 text-center rounded-lg text-lg cursor-pointer mt-4 ' onClick={e => setUniModal(true)}>
                            <p className='text-red-500'>We only accept funds in ETH</p>
                            <p className='text-green-500'>Have funds in different token ! Swap here !</p>
                        </div> */}

                    </div>
                    <div className='mt-4'>
                        <div className='flex justify-between'>
                            <p className='text-sm'>Your Contribution {requiredTag}</p>
                            <p className='text-sm'>Min. Contribution <span>{target / 10} ETH</span></p>
                        </div>
                        <input required type='number' step="any" min={target / 10} className='p-4 rounded-lg bg-input focus:outline-none w-full mt-2' placeholder='Your contribution' value={amount} onChange={(e: any) => setAmount(e.target.value)} />
                        <p className='text-sm flex justify-end mt-1 '>Balance: <span>{balance} ETH </span></p>
                    </div>
                    <button type='submit' className='w-full mt-4 p-3 rounded-lg bg-gradient-to-tr from-[#2bffb1] to-[#2bd8ff]  text-black flex items-center justify-center space-x-4'>
                        <span>Make Vault</span>
                        <ArrowRightIcon className='w-4' />
                    </button>
                </form>
            </div>
            <Modal
                open={visible}
                onClose={() => setVisible(false)}
                showCTA={false}
            >
                <div className='mx-4 items-center justify-center  text-white !'>
                    <div className='mx-auto '>
                        <img src={order?.asset?.imageUrl} className='w-full rounded-lg' />
                    </div>
                    <div className='mt-1 bg-[#262631] rounded-lg flex text-sm w-3/4 p-2'>
                        <CheckCircleIcon className='text-green-500 h-5 w-5 mx-1' />
                        <p>{order?.asset?.collection.name}</p>
                    </div>
                    <p className='mt-2 !text-left '>{order?.asset?.name}.</p>
                    <div className=' text-xs p-2 !text-left text-slate-300'>Listed Price : <span className='text-lg mx-3 text-white font-bold'>{bnToString(order?.currentPrice)} ETH</span></div>
                    <p className=' text-sm p-2 !text-left text-slate-300'>Sale ends on {dtToString(order?.expirationTime)}</p>
                    <button onClick={() => setVisible(false)} type='submit' className='w-full p-3 rounded-lg bg-gradient-to-tr from-[#2bffb1] to-[#2bd8ff]  text-black flex items-center justify-center space-x-4'>
                        <span>Done </span>
                        <ArrowRightIcon className='w-4' />
                    </button>
                </div>

            </Modal>
            <Modal
                open={uniModal}
                onClose={() => setUniModal(false)}
                showCTA={false}
                title="Swap Tokens"
            >
                <div className="Uniswap p-6 flex bg-black items-center justify-center">
                    <SwapWidget
                        provider={provider}
                        jsonRpcEndpoint={jsonRpcEndpoint}
                        defaultOutputTokenAddress='NATIVE'
                        theme={darkTheme}
                        width={512}

                    />
                </div>
            </Modal>
        </div>
    )
}

export default PurchaseNft;