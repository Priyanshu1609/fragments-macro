import { useRouter } from 'next/router';
import React, { useContext } from 'react';
// import { useConnect } from 'wagmi';
import { TransactionContext } from '../contexts/transactionContext';

const CreateDAOButton: React.FC = () => {

    // const [{ data: connectData }] = useConnect()

    const { connectallet, currentAccount } = useContext(TransactionContext);

    const router = useRouter()

    return currentAccount ? (
        <button
            className='text-black bg-white px-3 py-2 rounded-lg '
            onClick={(e) => {
                e.preventDefault()
                router.push({
                    pathname: '/create-dao',
                    query: { user: currentAccount },
                })
            }}
        >
            Create your own DAO
        </button>
    ) : null
}

export default CreateDAOButton