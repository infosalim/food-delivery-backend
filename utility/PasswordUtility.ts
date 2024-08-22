import bycrypt from 'bcrypt';

export const GenerateSalt = async () => {
    return await bycrypt.genSalt();
}

export const GeneratePassword = async (password: string, salt: string) => {
    return await bycrypt.hash(password, salt);
}

export const ValidatePassword = async (enteredPassword: string, savedPassword: string, salt: string) => {
    return await GeneratePassword(enteredPassword, salt) === savedPassword;
}