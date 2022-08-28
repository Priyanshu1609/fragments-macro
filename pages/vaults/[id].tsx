import { useRouter } from 'next/router';
import React, { useEffect, useState, useContext, useRef, useCallback } from 'react';
import { GetServerSideProps } from 'next'
import { BigNumber } from 'ethers';
import dynamic from 'next/dynamic'

import { unmarshall } from "@aws-sdk/util-dynamodb";
import Blockies from 'react-blockies';
import ProgressBar from "@ramonak/react-progress-bar";
import { ArrowRightIcon, ArrowSmRightIcon, ArrowUpIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import { Tab } from '@headlessui/react';

import Modal from '../../components/Modal';
import { RenderTab } from '../dashboard';
import { getEllipsisTxt, minDtTime } from '../../utils';
import { OrdersState } from '../../components/Orders';
import { TransactionContext } from '../../contexts/transactionContext';
import { NftContext } from '../../contexts/NftContext';
import { DataContext } from '../../contexts/dataContext';
import { fixTokenURI } from '../../utils';
import { RiShareBoxLine } from "react-icons/ri";
import { MdMail } from 'react-icons/md';

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { EffectFade, Navigation, Pagination, Autoplay } from "swiper";
import axios from 'axios';
import { CreateVaultFormValues } from '../../components/CreateVaultForm';


export enum VaultDashboardTabs {
    Information = 'INFORMATION',
    Owners = 'OWNERS',
    Orders = 'ORDERS'
}

import { BsWhatsapp } from 'react-icons/bs'
import { FaTelegramPlane, FaLinkedinIn, FaRedditAlien, FaDiscord } from 'react-icons/fa'
import { TiSocialTwitter } from 'react-icons/ti'
import ConnectModalContext from '../../contexts/connectwallet';
import PageLoader from '../../components/PageLoader';
import loader from '../../assets/loader.json'
import Lottie from 'react-lottie-player'
import success from '../../assets/happy.json'
import { MdIosShare } from "react-icons/md"


const links = [
    "https://web.whatsapp.com/send?text=Hey%20bro%2C%0A%0AI%27ve%20just%20signed%20up%20on%20the%20waitlist%20for%20this%20collective%20investment%20product%2C%20Fragments(https%3A%2F%2Ffragments.money%2F).%0A%0AIn%20case%20this%20interests%20you%2C%20sharing%20my%20referral%20code%20which%20you%20can%20use%20so%20that%20both%20of%20us%20get%20500%20points%20on%20their%20waitlist%20leaderboard.%0A%0AReferral%20code%20%3A%20",
    "https://telegram.me/share/url?url=Hey bro, &text=%0AI%27ve%20just%20signed%20up%20on%20the%20waitlist%20for%20this%20collective%20investment%20product%2C%20Fragments(https%3A%2F%2Ffragments.money%2F).%0A%0AIn%20case%20this%20interests%20you%2C%20sharing%20my%20referral%20code%20which%20you%20can%20use%20so%20that%20both%20of%20us%20get%20500%20points%20on%20their%20waitlist%20leaderboard.%0A%0AReferral%20code%20%3A%20",
    "https://www.linkedin.com/shareArticle?mini=true&url=https://www.fragments.money/&title=hey).%0A%0AIn%20case%20this%20interests%20you%2C%20sharing%20my%20referral%20code%20which%20you%20can%20use%20so%20that%20both%20of%20us%20get%20500%20points%20on%20their%20waitlist%20leaderboard.%0A%0AReferral%20code%20%3A",
    "https://www.reddit.com/submit?url=https://www.fragments.money/&title=Hey%20bro%2C%0A%0AI%27ve%20just%20signed%20up%20on%20the%20waitlist%20for%20this%20collective%20investment%20product%2C%20Fragments%0A%0AIn%20case%20this%20interests%20you%2C%20sharing%20my%20referral%20code%20which%20you%20can%20use%20so%20that%20both%20of%20us%20get%20500%20points%20on%20their%20waitlist%20leaderboard.%0A%0AReferral%20code%20%3A%20",
    "https://twitter.com/intent/tweet?text=Hey%2C%0A%0AI%27ve%20just%20signed%20up%20on%20the%20waitlist%20for%20this%20collective%20investment%20product%2C%40fragmentsHQ%20%0A%0AIn%20case%20this%20interests%20you%2C%20sharing%20my%20referral%20code%20which%20you%20can%20use%20so%20that%20both%20of%20us%20get%20500%20points%20on%20their%20waitlist%20leaderboard.%0A%0Ahttps%3A%2F%2Fwww.fragments.money%2F%0AReferral%20code%3A%20"
]

const tabs = [
    {
        name: 'INFO',
        value: VaultDashboardTabs.Information
    },
    {
        name: 'LAST TRANSACTIONS',
        value: VaultDashboardTabs.Owners
    },
]


const VaultDetail: React.FC = () => {
    const router = useRouter();

    const { swapModal, setSwapModal } = useContext(ConnectModalContext);
    const { connectallet, currentAccount, logout, getProvider, setIsLoading, isLoading, sendTx, getBalanace } = useContext(TransactionContext);
    // const { fetchFromTokens, transaction, chains, handleNetworkSwitch, } = useContext(SocketContext);
    const { getTokens, getTokenIdMetadata } = useContext(NftContext);
    const { getVaultsByWallet, getVaultsByCreator } = useContext(DataContext);
    const [modal, setModal] = useState(false);
    const [countDown, setCountDown] = useState("");
    const [balance, setBalance] = useState("");
    // const [selectedToken, setSelectedToken] = useState<selectedToken>()
    // const [selectedChain, setSelectedChain] = useState<selectedChain>()
    // const [coins, setCoins] = useState([]);
    const [purchaseForm, setPurchaseForm] = useState(false);
    const [ownerData, setOwnerData] = useState<any>([]);
    const [tokenAmount, setTokenAmount] = useState<number>(0)
    const [isPurchaseButtonVisible, setIsPurchaseButtonVisible] = useState<boolean>(false)
    const [currentOrderView, setCurrentOrderView] = useState<OrdersState>(OrdersState.ACTIVE);
    const [visible, setVisible] = useState(false);
    const [nfts, setNfts] = useState<any>([]);
    const [provider, setProvider] = useState();
    const [uniModal, setUniModal] = useState(false);
    const [modalForm, setModalForm] = useState<any>({
        target: 0,
        fundraiseDuration: 0,
        amount: 0
    })
    const [data, setData] = useState<CreateVaultFormValues | any>();

    const { id, type } = router.query

    // console.log("owners", ownerData);

    const getProviderFrom = async () => {
        const provider = await getProvider();
        setProvider(provider);
    }

    // setIsFunded(true)

    // const fetchTokens = async (chainId: number | undefined) => {

    //     try {
    //         const res = await fetchFromTokens(chainId);
    //         setCoins(res);

    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    // const bridge = async () => {
    //     const fromChainId = selectedToken?.chainId
    //     const fromToken = selectedToken?.address
    //     const amount = tokenAmount
    //     const userAddress = currentAccount

    //     const txHash = await transaction(fromChainId, fromToken, amount, userAddress);

    //     console.log('Destination Socket Tx', txHash)
    // }

    const getVaultData = async () => {
        try {

            setIsLoading(true);
            console.log("getVaultData", id)
            let data: any = {}

            const body = JSON.stringify({
                "vaultAddress": id,
            })
            // const response = {}
            const response = await axios.post(`https://szsznuh64j.execute-api.ap-south-1.amazonaws.com/dev/api/auth/vaults/get`, body, {
                headers: {
                    'content-Type': 'application/json',
                },
            }
            );
            console.log("FETCH RES", response.data.Item);


            for (let i in response.data.Item) {
                // console.log(i, Object.values(response.data.Item[i])[0])
                data[i] = Object.values(response.data.Item[i])[0]
            }

            let body2 = JSON.stringify({
                "vaultAddress": id
            });

            const response2 = await axios.post(`https://szsznuh64j.execute-api.ap-south-1.amazonaws.com/dev/api/associations/getbyvault`, body2, {
                headers: {
                    'content-Type': 'application/json',
                },
            });

            let owners = [] as any;
            for (let i in response2.data.Items) {
                // console.log(i, Object.values(response2.data.Items[i])[0])
                const regularObject = unmarshall(response2.data.Items[i]);
                owners.push(regularObject);
            }
            // owners[i] = temp;

            console.log("FETCH OWNER RES", response2.data.Items)


            setData(data);
            setOwnerData(owners);

            setTokenAmount(0);

        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    console.log({ nfts })
    // console.log(data?.nfts)
    const getNFTs = async () => {

        if (!data?.nfts) return;

        try {
            setIsLoading(true);
            setNfts([]);

            const nfts = data?.nfts;
            console.log("nfts fetched", data?.nfts);

            nfts?.forEach(async (link: string) => {

                const tokenId = link.split('/')[6]
                const tokenAddress = link.split('/')[5]

                console.log({ tokenId, tokenAddress })
                if (tokenAddress && tokenId) {

                    let data = await getTokenIdMetadata(tokenId, tokenAddress);
                    setNfts((prev: any) => ([...prev, data]));
                }

                // data.forEach((e: any) => {
                //     let metadata = JSON.parse(e.metadata)
                // });
            });


        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getNFTs();
    }, [data])

    // console.log('NFTS:', nfts);

    const handleAddAmount = async () => {

        if (tokenAmount <= 0 || tokenAmount >= data?.target - data?.amount) {
            alert("Please enter a valid amount")
            return;
        }

        try {
            setIsLoading(true);
            setPurchaseForm(false);
            let tx;


            tx = await sendTx(id, tokenAmount);
            console.log("Transaction reciept", tx);
            if (!tx) {
                alert("Please complete the transaction");
                return;
            }

            const body = JSON.stringify({
                "vaultAddress": id,
                "amount": Number(tokenAmount),
                "fundraiseDuration": data?.fundraiseDuration,
                "target": data?.target
            })

            const response = await axios.post(`https://szsznuh64j.execute-api.ap-south-1.amazonaws.com/dev/api/auth/vaults/update `, body, {
                headers: {
                    'content-Type': 'application/json',
                },
            }
            );

            console.log("adding amount", response, Number(data?.amount), Number(tokenAmount));

            // countDownTimer(data?.fundraiseDuration);

            const data2 = JSON.stringify({
                "walletAddress": currentAccount,
                "amountPledged": tokenAmount,
                "timestamp": new Date().getTime(),
                "transactionHash": tx.hash,
                "vaultAddress": id,
                "vaultName": data?.vaultName,
                "target": data?.target,
                "vaultStatus": "RUNNING",
            });

            const response2 = await axios.post(`https://szsznuh64j.execute-api.ap-south-1.amazonaws.com/dev/api/associations/put`, data2, {
                headers: {
                    'content-Type': 'application/json',
                },
            });

            await getVaultData();
            await getVaultsByCreator()
            await getVaultsByWallet();
            setTokenAmount(0);
            setVisible(false);

        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false);
        }
    }

    const checkGovernedState = async () => {
        if (data?.type === "Public" && tabs.length === 2 && data?.origin !== "private") {
            console.log("pushed", data?.type);
            tabs.push({
                name: 'GOVERNED',
                value: VaultDashboardTabs.Orders
            })
        }
    }


    const countDownTimer = (countDownDate: any) => {
        if (!countDownDate) { return }

        var x = setInterval(function () {

            var now = new Date().getTime();

            var distance = countDownDate - now;

            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);


            setCountDown(days + "d " + hours + "h " + minutes + "m " + seconds + "s ")

            if (distance < 0) {
                clearInterval(x);
                setCountDown("");
            }
        }, 1000);
    }

    const getBalanaceInEth = async () => {
        const balance = await getBalanace();
        setBalance(balance);
    }


    useEffect(() => {
        if (data) {
            checkGovernedState();
            countDownTimer(data?.fundraiseDuration);
            type && setModal(true);
        }
    }, [data])

    useEffect(() => {
        // setTimeout(() => { setModal(true); }, 2000);
        if (id) {
            getVaultData()
            getProviderFrom();
            getBalanaceInEth();
        }
    }, [currentAccount, id])


    const sliderRef = useRef() as any;

    const handlePrev = useCallback(() => {
        if (!sliderRef.current) return;
        sliderRef.current.swiper.slidePrev();
    }, []);

    const handleNext = useCallback(() => {
        if (!sliderRef.current) return;
        sliderRef.current.swiper.slideNext();
    }, []);

    const handleOpen = (link: string) => {
        window.open(link, "_blank");
    }

    return (
        <div className='text-white max-w-7xl mx-auto  md:flex md:flex-row-reverse md:justify-center pb-16 min-h-screen overflow-y-scroll scrollbar-hide relative'>
            {type && <Lottie
                // loop
                animationData={success}
                play
                loop={1}
                style={{ width: "100wh", height: "100vh", position: "absolute", top: "0", left: "0", right: "0", bottom: "0", overflow: "scroll" }}
            />}
            <div className='flex flex-col flex-[0.6] items-center mt-4'>
                {data?.origin !== "private" &&
                    <div className='flex items-start justify-center rounded-xl w-full'>
                        <div onClick={handlePrev} className='cursor-pointer  bg-gray-300 rounded-full p-2 mt-64'><ChevronLeftIcon className='text-white h-7 w-7' /></div>
                        <div className='flex-[0.8]'>
                            <div className=''>
                                <Swiper
                                    ref={sliderRef}
                                    // navigation={true}
                                    effect={"fade"}
                                    pagination={true}
                                    loop={true}
                                    autoplay={{
                                        delay: 10000,
                                        disableOnInteraction: false,
                                    }}
                                    modules={[EffectFade, Navigation, Autoplay, Pagination]}
                                    className=" w-[12rem] lg:w-[18rem] xl:w-[23rem] h-[18rem] lg:h-[24rem] xl:h-[30rem] !flex !items-center !justify-center"
                                >
                                    {nfts?.map((nft: any) => (
                                        <div key={nft?.image} className="mx-auto w-full">
                                            <SwiperSlide>
                                                <img src={fixTokenURI(nft?.image)} className="rounded-t-xl overflow-hidden" />
                                                <div className='p-4 truncate text-xl bg-input rounded-b-xl'>
                                                    <div className='flex space-x-2 items-center justify-start'>
                                                        <img src={fixTokenURI(nft?.image)} className="h-5 w-5 rounded-full" />
                                                        <p className='text-sm'>{nft?.compiler}</p>
                                                    </div>
                                                    <p className='mt-2 font-britanica font-normal'>{nft?.name}</p>
                                                </div>
                                            </SwiperSlide>
                                        </div>
                                    ))}
                                </Swiper>

                            </div>
                        </div>
                        <div onClick={handleNext} className='cursor-pointer mt-64  bg-gray-300 rounded-full p-2 '><ChevronRightIcon className='text-white h-7 w-7' /></div>
                    </div>
                }
                <div className='flex items-start justify-center mt-4 w-full'>
                    <div className='bg-input rounded-xl w-full mx-16 p-4'>
                        <span className='border-b-[1px] border-gray-500 text-xl font-britanica font-normal text-gray-500'>Last Transaction</span>
                        <div className='mt-2 h-[28rem] overflow-y-scroll'>
                            <div className='py-4 flex flex-col items-center space-y-4 justify-between'>
                                {
                                    ownerData?.map((owner: any, index: number) => (
                                        <div key={index} className='flex items-center w-full justify-between'>
                                            <div className='flex space-x-3'>
                                                <Blockies
                                                    seed='need to be changed'
                                                    size={19}
                                                    scale={2}
                                                    className='rounded-full mr-3'
                                                />
                                                <div className='flex items-center justify-center'>
                                                    <p className='font-semibold text-base'>
                                                        {getEllipsisTxt(owner.walletAddress)}
                                                    </p>

                                                </div>
                                            </div>
                                            <div>
                                                <p className='text-sm'>{parseFloat(((owner?.amountPledged / owner?.target) * 1000000).toString()).toFixed(2) + "  frag-" + data?.tokenName}</p>
                                            </div>
                                            <div>
                                                <p>{owner.amountPledged} ETH</p>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`p-6 bg-input rounded-xl ${data?.origin !== "private" && "flex-[0.4]"} ${data?.origin === "private" && "flex-[0.6]"} `}>
                <div className='flex items-center justify-between w-full'>
                    <div className='bg-input rounded-lg flex items-center justify-center p-3 w-max'>
                        <Blockies
                            seed='need to be changed'
                            size={7}
                            scale={3}
                            className='rounded-full mr-3'
                        />
                        <p className='text-sm'>{data?.tokenName}</p>
                    </div>
                    <button onClick={() => setModal(true)} className='flex space-x-2 text-semibold bg-[#1E1E24] rounded-lg py-2 px-3'>
                        <span>Share Link</span>
                        <MdIosShare className='h-5 w-5 text-white' />
                    </button>
                    {/* <p>{data?.vaultStatus === "RUNNING" && countDown}</p> */}
                </div>
                <div className='my-5'>
                    <h1
                        className="mb-2 font-britanica font-normal text-transparent text-2xl bg-clip-text bg-gradient-to-r from-button to-bluebutton"
                    >
                        {data?.vaultName}
                    </h1>
                    <p className='font-montserrat'>
                        {data?.description}
                    </p>
                </div >
                {data?.amount > 0 ? <div className='mt-4 mb-6'>
                    <div>
                        <div className='flex justify-between items-center mb-3'>
                            <div className='flex space-x-2'>
                                <p className='text-gray-300 text-base'>Funding raised: </p><span className=' font-britanica font-normal'>{data?.amount} ETH</span>
                            </div>
                            <div className='flex space-x-2'>
                                <p className='text-gray-300 text-base'>Funding goal: </p><span className='font-britanica font-normal'>{data?.target} ETH</span>
                            </div>
                        </div>
                        <ProgressBar completed={(Number(data?.amount) / Number(data?.target)) * 100} bgColor='#2bffb1' baseBgColor='#2C2C35' isLabelVisible={false} height={'12px'} />
                        <div className='flex justify-end space-x-2 ml-auto mt-1 mb-4'>
                            <p className='text-gray-300 text-base'>Time Left: </p><span className=' font-britanica font-normal'>{countDown}</span>
                        </div>
                        <div className='mb-5 font-montserrat font-black rounded-lg flex w-full items-center justify-between space-x-3' >
                            <div className='bg-[#1E1E24] rounded-lg w-4/6 p-3 flex space-x-3 justify-center'>
                                <p className='text-gray-300'>You Own: </p>
                                <p className='text-[#2bffb1]'>{data?.amount} ETH</p>
                            </div>
                            <button onClick={() => setPurchaseForm(true)} className='text-black font-semibold !bg-button w-2/6 p-3 m-auto rounded-lg'>Buy More</button>
                        </div >
                    </div>
                    {
                        // data?.vaultStatus === "RUNNING" && data?.amount < data?.target ? <div>
                        //     <div className='mt-4'>
                        //         <div className='flex justify-between text-sm text-gray-300 mb-2'>
                        //             <p>Enter amount</p>
                        //             <p>Balance: {balance} ETH</p>
                        //         </div>
                        //         <input required type='number' step="0" placeholder='Enter amount' min={0} onChange={(e) => setTokenAmount(Number(e.target.value))} className='bg-input p-4 w-full rounded-lg focus:outline-none' />
                        //     </div>

                        //     <div className='text-center' >
                        //         <button onClick={handleAddAmount} className='bg-gradient-to-tr from-[#2bffb1] to-[#2bd8ff]  flex items-center space-x-3 justify-center text-sm w-full text-gray-900 py-2 px-4 rounded-lg mt-4'>
                        //             <p>Purchase {tokenAmount}</p>
                        //             <ArrowRightIcon className='w-4 h-4' />
                        //         </button>
                        //         {/* <p className='text-gray-300 text-xs mt-2'>15 MATIC = 5000 BORE</p> */}
                        //     </div>
                        // </div> :
                        //     <div>
                        //         <div className='bg-input p-3 text-center rounded-lg text-2xl mt-4'>
                        //             <p className='text-red-500'>Fundraise is {data?.vaultStatus}</p>
                        //         </div>

                        //     </div>
                    }


                </div > :
                    <div className='mt-4 mb-6' onClick={e => setVisible(true)}>
                        <div className='mb-5 !bg-button font-montserrat  rounded-lg flex space-x-3 p-3 w-full items-center justify-center cursor-pointer'>
                            <p className='text-black'>Set Funding Cycle</p>
                        </div>
                    </div>
                }

                <div>
                    <div className='mt-4'>
                        <span className='border-b-[1px] font-britanica font-normal border-gray-500 text-xl text-gray-500'>General Information</span>
                        <div className='my-4'>
                            <div className='flex justify-between'>
                                <div>
                                    <p className='text-xl text-white font-britanica font-normal mb-2'>Valuations</p>
                                    <p className='text-xl font-semibold'>600 ETH</p>
                                </div>
                                <div>
                                    <p className='text-xl text-white font-britanica font-normal mb-2'>No. of tokens</p>
                                    <p className='text-xl font-semibold'>1000000</p>
                                </div>
                            </div>
                            <div className='flex justify-between mt-6'>
                                <div>
                                    <p className='text-xl text-white font-britanica font-normal mb-2'>Management fee</p>
                                    <p className='text-xl font-semibold'>{data?.managementFees}</p>
                                </div>
                                {/* <div>
                                    <p className='text-xl text-white  mb-2'>Unique owners</p>
                                    <p className='text-xl font-semibold'>1</p>
                                </div> */}
                            </div>
                            <div></div>
                        </div>
                    </div>
                    <div className='mt-4'>
                        <span className='border-b-[1px] font-britanica font-normal border-gray-500 text-xl text-gray-500'>Governance Information</span>
                        <div className='my-4'>
                            <div className='flex justify-between mb-4'>
                                <div>
                                    <p className='text-xl text-white font-britanica font-normal mb-2'>Voting Period</p>
                                    <p className='text-xl font-semibold'>{data?.type !== "Private" && data?.origin !== "private" ? data?.votingPeriod : "-"}</p>
                                </div>
                            </div>
                            <div className='flex justify-between mt-6'>
                                <div>
                                    <p className='text-xl text-white font-britanica font-normal mb-2'>Quorum</p>
                                    <p className='text-xl font-semibold'>{data?.type !== "Private" && data?.origin !== "private" ? data?.quorum : "-"}</p>
                                </div>
                                <div>
                                    <p className='text-xl text-white font-britanica font-normal mb-2'>Min Favourable Majority</p>
                                    <p className='text-xl font-semibold'>{data?.type !== "Private" && data?.origin !== "private" ? data?.minFavor : "-"}</p>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div>
                        <span className='border-b-[1px] font-britanica font-normal border-gray-500 text-xl text-gray-500'>Proof of Authenticity</span>
                        <div>
                            <a href={`https://mumbai.polygonscan.com/address/${data?.contractAddress}`} target='_blank' className='mt-4 bg-[#1E1E24] p-4 m-2 rounded-lg flex justify-between  cursor-pointer'>
                                <div className='flex items-center justify-center'>
                                    <img src="https://mumbai.polygonscan.com/images/svg/brands/poly.png?v=1.3" className='h-6 w-6 rounded-full' />
                                    <p className='ml-4'>View on PolygonScan</p>
                                </div>
                                <ArrowUpIcon className='h-6 w-6 rotate-45' />
                            </a>
                            <a href={`https://gnosis-safe.io/app/rin:${id}/home`} target='_blank' className='mt-4 bg-[#1E1E24] p-4 m-2 rounded-lg flex justify-between cursor-pointer'>
                                <div className='flex items-center justify-center'>
                                    <img src="https://aws1.discourse-cdn.com/standard20/uploads/gnosis_safe/original/1X/175f55ca5dfa29e9322ebc0d8aa73f11e6fde6db.png" className='h-6 w-6 rounded-full' />
                                    <p className='ml-4'>View on Gnosis Wallet</p>
                                </div>
                                <ArrowUpIcon className='h-6 w-6 rotate-45' />
                            </a>
                        </div>
                    </div>
                </div>
            </div >

            <Modal
                open={modal}
                onClose={() => setModal(false)}
                showCTA={false}
                title="Fundraise is now live"
            >
                <div className="flex flex-col mt-2">
                    <p className='text-left text-gray-500 font-montserrat'>Start sharing with your friends and fundraise together. </p>

                    <div className=' flex items-center justify-evenly mt-4 space-x-5'>
                        <div onClick={() => handleOpen(links[0])} className='hover:cursor-pointer hover:opacity-70 rounded-xl h-28 w-20 border-[1px] border-gray-600 flex items-center justify-center '>
                            <BsWhatsapp className='h-10 w-10  text-[#25d366]' />
                        </div>
                        <div onClick={() => handleOpen(links[1])} className='hover:cursor-pointer hover:opacity-70 rounded-xl h-28 w-20 border-[1px] border-gray-600 flex items-center justify-center '>
                            <FaTelegramPlane className='h-10 w-10  text-[#229ED9]' />
                        </div>
                        <div onClick={() => handleOpen(links[3])} className='hover:cursor-pointer hover:opacity-70 rounded-xl h-28 w-20 border-[1px] border-gray-600 flex items-center justify-center '>
                            <FaDiscord className='h-10 w-10  text-[#7289da]' />
                        </div>
                        <div onClick={() => handleOpen(links[4])} className='hover:cursor-pointer hover:opacity-70 rounded-xl h-28 w-20 border-[1px] border-gray-600 flex items-center justify-center '>
                            <TiSocialTwitter className='h-10 w-10  text-[#1da1f2]' />
                        </div>
                        <div onClick={() => handleOpen(links[4])} className='hover:cursor-pointer hover:opacity-70 rounded-xl h-28 w-20 border-[1px] border-gray-600 flex items-center justify-center '>
                            <MdMail className='h-10 w-10  text-[#4285f4]' />
                        </div>

                    </div>
                    <button type='submit'
                        onClick={() => {
                            navigator.clipboard
                                .writeText(`https://dev.fragments.money/vaults/${id}`)
                                .then(() => {
                                    alert(`Link copied to clipboard , https://dev.fragments.money/vaults/${id}`)
                                })
                                .catch(() => {
                                    alert("something went wrong while copying");
                                });
                        }}
                        className='w-full mt-4 p-3 rounded-lg !bg-button text-black flex items-center justify-center space-x-4'>
                        <span className='text-xl'>Copy</span>
                    </button>
                    <button type='submit' onClick={() => setModal(false)} className='w-full mt-4 p-3 rounded-lg !bg-[#1E1E24]  text-white flex items-center justify-center space-x-4'>
                        <span className='text-xl'>Close</span>
                    </button>
                </div>
            </Modal>
            <Modal
                open={purchaseForm}
                onClose={() => setPurchaseForm(false)}
                showCTA={false}
                title="Buy More"
            >
                <p>You can start buying from here</p>
                <div className=''>
                    <div className='p-2 text-sm bg-[#303104] text-[#FFF500] flex rounded-lg mt-4 font-montserrat '>
                        <div className='px-3'>
                            <p className='font-black'>Note: We only accepts funds in ETH</p>
                            <p className='text-[#C6BE0F]'>Have funds in different tokens? Click on swap tokens</p>
                        </div>
                        <div onClick={() => setSwapModal(true)} className='flex hover:cursor-pointer bg-[#FFF500] rounded-lg text-black font-black w-44 mx-auto items-center justify-center text-base'>
                            <div className="flex flex-col items-center justify-center">
                                <span>Swap</span>
                                <span>Tokens</span>
                            </div>
                            <ArrowSmRightIcon className='h-8 w-8' />
                        </div>
                    </div>
                    <div className='mt-4'>
                        <div className='flex justify-between text-sm text-gray-300 mb-2'>
                            <p>Enter amount</p>
                            <p>Balance: {balance} ETH</p>
                        </div>
                        <input required type='number' step="0" placeholder='Enter amount' min={0} onChange={(e) => setTokenAmount(Number(e.target.value))} className='bg-transparent focus:outline-none border-[1px] border-gray-600 p-4 w-full rounded-lg ' />
                    </div>

                    <div className='text-center' >
                        <button onClick={handleAddAmount} className='!bg-button flex items-center space-x-3 justify-center text-sm w-full text-gray-900 py-2 px-4 rounded-lg mt-4'>
                            <p>Purchase {tokenAmount}</p>
                            <ArrowRightIcon className='w-4 h-4' />
                        </button>
                        {/* <p className='text-gray-300 text-xs mt-2'>15 MATIC = 5000 BORE</p> */}
                    </div>
                </div>

            </Modal>
            <PageLoader bg={false} open={isLoading} onClose={() => setIsLoading(false)} img={loader} message='Waiting for transaction to complete' desc="Check the metamask window to complete the transaction. Avoid closing this tab." />

        </div>
    )
}

export default VaultDetail




