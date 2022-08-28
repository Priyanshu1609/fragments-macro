import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/router';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { TransactionContext } from '../../contexts/transactionContext';
import { DataContext } from '../../contexts/dataContext';
import logoWhite from '../../assets/LogoWhite.png'

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/scrollbar";
import "swiper/css/navigation";
import "swiper/css/pagination";

// import required modules
import { Keyboard, Scrollbar, Navigation, Pagination } from "swiper";
import VaultCard from '../VaultCard';

const MyInvestment = () => {
    const { currentAccount } = useContext(TransactionContext);
    const { creatorVaults } = useContext(DataContext);

    const router = useRouter();

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
        <div className='h-[30rem]'>
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

                    {creatorVaults?.map((vault) => (
                        <SwiperSlide>
                            <div key={vault.vaultAddress} className='cursor-pointer rounded-xl' onClick={() =>
                                router.push({
                                    pathname: `/vaults/${vault?.vaultAddress}`,
                                    query: { user: currentAccount },
                                })}>
                                <VaultCard
                                    name={vault?.vaultName}
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
        </div>
    )
}

export default MyInvestment;
