export const socketIdToWalletMap = new Map<string, string>();

export function getKeyByValue(searchValue: string): string | null {
    for (let [key, value] of socketIdToWalletMap.entries()) {
        if (value === searchValue) return key;
    }

    return null;
}
