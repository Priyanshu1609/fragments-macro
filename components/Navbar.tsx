import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import { TransactionContext } from '../contexts/transactionContext';
import Account from './Account';
import Logo from './logo';

const Navbar: React.FC = () => {

    const router = useRouter();
    const { currentAccount } = useContext(TransactionContext);

    return (
        <div className="overflow-y-scroll scrollbar-hide ">
            <div className=" mx-auto lg:px-8 py-3">
                <div className="flex items-center w-full justify-between pt-1 pb-5 px-4">
                    <div className="flex px-2 lg:px-0">
                        <div className="flex-shrink-0 flex items-center text-sm text-gray-300 cursor-pointer space-x-8">
                            <div className="inline-flex items-center" onClick={e => router.push({
                                pathname: '/dashboard'
                            })}>
                                <Logo />
                            </div>

                            {currentAccount && <div className='flex space-x-5'>
                                <p onClick={e => router.push({
                                    pathname: '/dashboard'
                                })} className={`${router.pathname === "/dashboard" && "text-button"}`} >MY DASHBOARD</p>
                                <p onClick={e => router.push({
                                    pathname: '/livevaults'
                                })} className={`${router.pathname === "/livevaults" && "text-button"}`} >EXPLORE LIVE VAULTS</p>
                            </div>}
                        </div>
                    </div>
                    <div className="flex space-x-6 items-center">
                        <Account />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar