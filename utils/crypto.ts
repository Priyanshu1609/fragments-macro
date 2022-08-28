import { ethers } from 'ethers';
import GullakFactory from '../abis/GullakFactory.json';

export const gullakFactoryContract = () => {
    const { ethereum } = window as any;
    if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contractReader = new ethers.Contract(
            "0x38958668Decc71070D234DCBF5295C834D4390C1",
            GullakFactory,
            signer
        );
        return contractReader;
    }

    return null;
}
