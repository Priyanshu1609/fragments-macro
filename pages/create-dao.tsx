import { useRouter } from 'next/router';
import React, { useEffect, useContext } from 'react';
// 
import CreateDAOForm, { CreateDAOFormValues } from '../components/CreateDAOForm';
import { TransactionContext } from '../contexts/transactionContext';

const CreateDao: React.FC = () => {
    const { connectallet, currentAccount, logout } = useContext(TransactionContext);

    // const [{ data: connectData }] = useConnect()
    // const [{ data: accountData }] = useAccount()

    const router = useRouter()

    useEffect(() => {
        if (!currentAccount) {
            router.push('/')
        }
    }, [currentAccount])

    return (
        <div className='text-white max-w-4xl mx-auto  '>
            <CreateDAOForm onSubmit={() => {}} />
        </div>
    );
}

export default CreateDao