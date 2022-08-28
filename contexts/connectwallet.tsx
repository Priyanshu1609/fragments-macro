import React from 'react';

export interface ConnectModalValues {
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    swapModal: boolean;
    setSwapModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ConnectModalContext = React.createContext<ConnectModalValues>({
    visible: false,
    setVisible: () => {},
    swapModal: false,
    setSwapModal: () => {},
})

export default ConnectModalContext

export const ConnectModalConsumer = ConnectModalContext.Consumer
export const ConnectModalProvider: React.FC = ({children}) => {
    const [visible, setVisible] = React.useState(false)
    const [swapModal, setSwapModal] = React.useState(false)

    return (
        <ConnectModalContext.Provider value={{visible, setVisible, swapModal ,setSwapModal}}>
            {children}
        </ConnectModalContext.Provider>
    )
}