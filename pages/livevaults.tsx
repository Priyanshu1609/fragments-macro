import React, { useContext, useEffect } from 'react'
import VaultCard from '../components/VaultCard'
import axios from "axios"
import { TransactionContext } from '../contexts/transactionContext'
import { DataContext } from '../contexts/dataContext'
import { useRouter } from 'next/router'


const Livevaults: React.FC = () => {

    const { liveVaults } = useContext(DataContext);
    const { currentAccount } = useContext(TransactionContext)

    const router = useRouter();

    useEffect(() => {
        if (!currentAccount) {
            router.push("/")
        }
    }, [currentAccount])


    return (
        <div className='text-white  max-w-6xl xl:mx-auto mx-2 md:mx-4 lg:mx-6'>
            <div className='py-6 grid xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-y-8 no-scrollbar '>

                {liveVaults?.map((vault: any) => (

                    <div key={vault.vaultAddress} className='cursor-pointer' onClick={() =>
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
                ))}
            </div>
        </div>
    )
}

export default Livevaults