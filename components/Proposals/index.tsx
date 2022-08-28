import React from 'react';
import { getEllipsisTxt } from '../../utils';
import { OrdersState } from '../Orders';
import Blockies from 'react-blockies';

const Proposals: React.FC = () => {
    const [currentOrderView, setCurrentOrderView] = React.useState<OrdersState>(OrdersState.ACTIVE);

    return (
        <div className='h-[30rem]'>
            <div className='py-4'>
                <div className='flex justify-between mb-4'>
                    <p className='font-semibold text-lg'>Orders</p>
                    <div className='flex space-x-2'>
                        <div
                            className={`text-sm cursor-pointer px-4 py-2 bg-[#0F0F13] rounded-full ${currentOrderView === OrdersState.ACTIVE ? 'bg-white text-gray-900' : ''}`}
                            onClick={() => setCurrentOrderView(OrdersState.ACTIVE)}
                        >
                            Active
                        </div>
                        <div
                            className={`text-sm cursor-pointer px-4 py-2 bg-[#0F0F13] rounded-full ${currentOrderView === OrdersState.CLOSED ? 'bg-white text-gray-900' : ''}`}
                            onClick={() => setCurrentOrderView(OrdersState.CLOSED)}
                        >
                            Closed
                        </div>
                    </div>
                </div>
                <div>
                    <div className='py-4 flex justify-between border-y-2 border-[#1E1E24]'>
                        <div className='flex'>
                            <Blockies
                                seed='need to be changed'
                                size={8}
                                scale={5}
                                className='rounded-full mr-3'
                            />
                            <div>
                                <p className='font-semibold text-base'>
                                    SharkDAO proposed a sale order of <span className='text-[#06D7F6]'>PFP NFTs</span>  at <span className='text-[#F5E58F]'>{`800ETH`}</span>
                                </p>
                                <p className='text-[#70707C] text-xs'>{getEllipsisTxt('0xCF193782f2eBC069ae05eC0Ef955E4B042D000Dd')}</p>
                            </div>
                        </div>
                        <button className='px-4 text-xs py-2 bg-white text-gray-900 rounded-full'>
                            Vote
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Proposals;