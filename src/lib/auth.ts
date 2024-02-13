import jwt from 'jsonwebtoken';
import type { User } from 'next-auth';

import UserModel from '@/server/models/User';

const privateKey = 'nguyenvanhoa2001';

export const verifyJwtToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, privateKey);
    return { data: decoded, isError: false, message: 'success' };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      data: null,
      isError: true,
      message: error?.message || error,
    };
  }
};

export const signJwtToken = async (payload: string | Buffer | object) => {
  const token = jwt.sign(payload, privateKey, {
    algorithm: 'HS256',
    expiresIn: '5m',
  });

  return token;
};

export const generateAccessToken = async ({
  accessToken,
  user,
  isRefresh,
}: {
  accessToken: string;
  user: User;
  isRefresh?: boolean;
}) => {
  try {
    const verifAccessToken = await verifyJwtToken(accessToken);
    if (!isRefresh && !accessToken) {
      const encryptData = JSON.stringify(user);
      const signToken = await signJwtToken({ user: encryptData });
      return signToken;
    }
    if (isRefresh && verifAccessToken.isError) {
      const result = await UserModel.findOne({ email: user?.email });
      if (result.isError) throw new Error(result.message);
      const encryptData = JSON.stringify(result.data);
      const signToken = await signJwtToken({ user: encryptData });
      return signToken;
    }
    return accessToken;
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
    console.error(error);
  }
};
