import React from 'react'
import Blockies from 'react-blockies';

const DaoPage: React.FC = () => {
    return (
        <div className='max-w-7xl  mx-auto text-white'>
            <div className='bg-[#0F0F13] flex items-center rounded-lg px-4 py-10 mt-4'>
                <div>
                    <div className='flex justify-between'>
                        <Blockies
                            seed='need to be changed'
                            size={8}
                            scale={6}
                            className='rounded-full mr-3'
                        />
                        <div>
                            <h1 className='text-2xl font-semibold text-[#F5E58F]'>MakerdockDAO</h1>
                            <p>Lorem ipsum dolor sit amet, ectetur adipisc elita dipiscing elit.</p>
                        </div>
                    </div>
                    <div></div>
                </div>
                <div>

                </div>
            </div>
        </div>
    )
}

export default DaoPage