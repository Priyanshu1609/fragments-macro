import { ArrowNarrowUpIcon } from "@heroicons/react/solid";
import { dtToString, getEllipsisTxt } from "../../utils";
import logoWhite from '../../assets/LogoWhite.png'
import vaultImage from '../../assets/image.png'
import Image from "next/image";
import coin from '../../assets/coin.png'
import { FiMoreVertical } from "react-icons/fi"
import { MdPersonOutline } from "react-icons/md"
import { AiOutlineClockCircle } from "react-icons/ai";
import { useEffect, useState } from "react";
import { BsDot } from "react-icons/bs";


export interface VaultCardProps {
    name: string;
    target: number;
    // image: string;
    status: string,
    amount: number,
    address: string,
    timestamp: number,
    creator: string,
    nfts: any,
    tokenName: string,
    vaultName: string
}

const VaultCard: React.FC<VaultCardProps> = ({
    name,
    target,
    // image,
    status,
    amount,
    address,
    timestamp,
    creator,
    nfts,
    tokenName,
    vaultName
}) => {

    const [countDown, setCountDown] = useState("0")

    const trimText = (text: string) => {
        return getEllipsisTxt(text, 5)
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
    useEffect(() => {
        if (timestamp) {
            countDownTimer(timestamp);
        }
    }, [timestamp])

    return (
        <div className={`rounded-xl mx-auto w-[323px] h-[480px] bg-input relative`} >
            <p className="absolute top-2 right-2 text-white z-50 font-semibold text-xs flex items-center space-x-1">
                <BsDot className={`h-6 w-6 -mr-2 ${status === "RUNNING" ? "text-green-300" : ""}`} />
                <span>Sale </span>
                <span >{status === "RUNNING" ? " Live" : " Ended"}</span>
            </p>
            <div className="absolute top-2 left-2  z-50 font-black text-xs flex items-center space-x-1 px-2 py-1 text-black bg-[#B5C2CA] rounded-lg">
                <span>{nfts?.length -1}</span>
                <span >NFTs</span>
            </div>
            <Image src={vaultImage} className='rounded-t-xl' width={323} height={275} />
            <div className='px-4 py-3'>
                <div className="flex justify-between">
                    <div className='flex text-sm items-center space-x-2'>
                        <Image src={coin} height={20} width={20} />
                        <p>{tokenName}</p>
                    </div>
                    <FiMoreVertical />
                </div>
                <p className="text-xl mt-1 font-britanica font-normal">{getEllipsisTxt(vaultName, 14)}</p>
                <div className='mt-2 flex justify-between items-center font-montserrat'>
                    <div>
                        <div className="flex items-center space-x-1">
                            <MdPersonOutline />
                            <p className="text-xs text-gray-300">CREATED BY</p>
                        </div>
                        <p>{getEllipsisTxt(creator)}</p>
                    </div>
                    <div>
                        <div className="flex items-center space-x-1">
                            <AiOutlineClockCircle />
                            <p className="text-xs text-gray-300">TIME LEFT</p>
                        </div>
                        <p>{countDown}</p>
                    </div>
                </div>
            </div>
            <div className='bg-gray-600 p-[1px]' />
            <div className='p-4 font-montserrat'>
                <div className='flex justify-evenly'>
                    <div>
                        <p className='text-xs  text-opacity-70'>FUNDS RAISED</p>
                        <h1
                            className="font-extrabold text-transparent text-lg bg-clip-text bg-gradient-to-r from-button to-bluebutton"
                        >
                            {amount}
                        </h1>
                    </div>
                    <div>
                        <p className='text-xs  text-opacity-70'>GOAL AMOUNT</p>
                        <h1
                            className="font-extrabold text-transparent text-lg bg-clip-text bg-gradient-to-r from-button to-bluebutton"
                        >
                            {target}
                        </h1>
                    </div>
                    {/* <div>
                        <p className='text-xs  text-opacity-70'>YOUR SHARE</p>
                        <h1
                            className=" font-extrabold text-transparent text-lg bg-clip-text bg-gradient-to-r from-button to-bluebutton"
                        >
                            {amount}
                        </h1>
                    </div> */}
                </div>
            </div>
        </div >
    )
}
export default VaultCard