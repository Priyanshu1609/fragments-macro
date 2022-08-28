import React, { useCallback, useContext, useRef, useState } from 'react';
import { ArrowNarrowUpIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import { Swiper, SwiperSlide } from "swiper/react";
import { DataContext } from '../../contexts/dataContext';
import { TransactionContext } from '../../contexts/transactionContext';

import "swiper/css";
import "swiper/css/scrollbar";
import "swiper/css/navigation";
import "swiper/css/pagination";

// import required modules
import { Keyboard, Scrollbar, Navigation, Pagination } from "swiper";
import Logo from '../logo';
import Modal from '../Modal';
import VaultCard from '../VaultCard';
import { useRouter } from 'next/router';



const MyInvestment = () => {
    const { vaults } = useContext(DataContext);
    const { currentAccount } = useContext(TransactionContext);

    const router = useRouter();

    const key = 'vaultAddress';

    const uniqueVaults = [...new Map(vaults.map(item =>
        [item[key], item])).values()];

    const sliderRef = useRef();

    const handlePrev = useCallback(() => {
        if (!sliderRef.current) return;
        sliderRef.current.swiper.slidePrev();
    }, []);

    const handleNext = useCallback(() => {
        if (!sliderRef.current) return;
        sliderRef.current.swiper.slideNext();
    }, []);



    return (
        <div className='h-[30rem]' >
            <div className='py-4 flex relative'>
                <div onClick={handlePrev} className='cursor-pointer  bg-gray-300 rounded-full p-2 absolute -left-12 top-60'><ChevronLeftIcon className='text-white h-7 w-7' /></div>
                <Swiper
                    ref={sliderRef}
                    // grabCursor={true}
                    slidesPerView={3}
                    // spaceBetween={80}
                    scrollbar={true}
                    modules={[Keyboard, Scrollbar, Navigation, Pagination]}
                    className="mySwiper"
                >

                    {uniqueVaults?.map((vault) => (
                        vault.target != 0 &&
                        // <SwiperSlide>
                        //     <div key={vault.vaultAddress} className='cursor-pointer' onClick={() =>
                        //         router.push({
                        //             pathname: `/vaults/${vault?.vaultAddress}`,
                        //             query: { user: currentAccount },
                        //         })}>
                        //         <VaultCard
                        //             name={vault?.vaultName}
                        //             address={vault?.vaultAddress}
                        //             target={vault?.target}
                        //             status={vault?.vaultStatus}
                        //             amount={vault?.amountPledged}
                        //             timestamp={vault?.timestamp}
                        //             image="https://lh3.googleusercontent.com/b2fJSqKXfH9AJg63az3zmMUC6PMd_bmqnI5W-rtouKvZ03vBeiyayb3zqDq4t7PLt2HmNxcocUMjxb7V03Jy_mMZc_5wVDaxk_T5=w260"
                        //         />

                        //     </div>
                        // </SwiperSlide>
                        <SwiperSlide>
                            <div key={vault.vaultAddress} className='cursor-pointer rounded-xl' onClick={() =>
                                router.push({
                                    pathname: `/vaults/${vault?.vaultAddress}`,
                                    query: { user: currentAccount },
                                })}>
                                <VaultCard
                                    // name={vault?.vaultName}
                                    address={vault?.vaultAddress}
                                    target={vault?.target}
                                    status={vault?.vaultStatus}
                                    amount={vault?.amount}
                                    timestamp={vault?.fundraiseDuration}
                                    creator={vault?.creator}
                                    nfts={vault?.nfts}
                                    tokenName={vault?.tokenName}
                                    vaultName={vault?.vaultName}
                                // image="https://lh3.googleusercontent.com/b2fJSqKXfH9AJg63az3zmMUC6PMd_bmqnI5W-rtouKvZ03vBeiyayb3zqDq4t7PLt2HmNxcocUMjxb7V03Jy_mMZc_5wVDaxk_T5=w260"
                                />

                            </div>
                        </SwiperSlide>
                    ))}

                </Swiper>
                <div onClick={handleNext} className='cursor-pointer  bg-gray-300 rounded-full p-2 absolute -right-12  top-60 z-10'><ChevronRightIcon className='text-white h-7 w-7' /></div>

            </div >
        </div >
    )
}

export default MyInvestment;