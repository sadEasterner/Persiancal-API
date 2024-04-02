export const  generateRecoveryCode = (length: number = 4): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let recoveryCode = '';
    for (let i = 0; i < length; i++) {
        recoveryCode += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return recoveryCode;
}