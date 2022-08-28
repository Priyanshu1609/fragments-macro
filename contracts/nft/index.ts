export interface MoralisNFT {
    token_address: string;
    token_id: string;
    contract_type: string;
    owner_of: string;
    block_number: string;
    block_number_minted: string;
    token_uri?: string | undefined;
    metadata?: string | undefined;
    synced_at?: string | undefined;
    amount?: string | undefined;
    name: string;
    symbol: string;
}

export interface MoralisNFTResponse {
    result: MoralisNFT[];
}