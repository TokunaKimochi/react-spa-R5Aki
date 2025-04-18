import type { AxiosError, AxiosResponse } from 'axios';

import { useEffect } from 'react';
import { useErrorBoundary } from 'react-error-boundary';

import axiosInst from '@/util/axiosInstance';

export default function AxiosErrorHandleProvider({ children }: { children: React.JSX.Element }) {
  // showBoundary を使わないと ErrorBoundary コンポーネントにエラーが伝わらない
  const { showBoundary } = useErrorBoundary();
  useEffect(() => {
    const responseIntercept = axiosInst.interceptors.response.use(
      (res: AxiosResponse) => res,
      (err: AxiosError) => {
        console.error('👻 Axios 通信エラー❢');
        showBoundary(err);
        return Promise.reject(err);
      },
    );
    // クリーンアップ関数
    return () => axiosInst.interceptors.response.eject(responseIntercept);
  }, [showBoundary]);

  return children;
}
