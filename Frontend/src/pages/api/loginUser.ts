// Nextjs api middleware to login user at https://127.0.0.1:5001/auth/LoginUser and redirect to /dashboard using next-session
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

import { BACKEND_URL } from '@/utils/consts';

export default async function loginUserHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    // Send req.body to https://127.0.0.1:5001/auth/LoginUser using axios
    // If successful, set user session and redirect to /dashboard
    // If unsuccessful, redirect to /login
    try {
      const response = await axios.post(
        `${BACKEND_URL}/auth/LoginUser`,
        req.body
      );

      // Redirect to /dashboard

      if (response.status === 200) {
        res.status(200).json(response.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        res.status(error?.response?.status || 500).json(error?.response?.data);
      }
    }
  }
}
