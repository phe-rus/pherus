import argon2 from "argon2";

type props = {
  currentHash?: string;
  password: string;
};
export default async function useArgo({ password, currentHash }: props) {
  const hash = await argon2.hash(password);
  const verify = currentHash && (await argon2.verify(currentHash, password));
  return {
    hash,
    verify,
  };
}
