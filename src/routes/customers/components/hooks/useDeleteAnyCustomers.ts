import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useState } from 'react';
import axiosInstance from '../../../../util/axios-instance';

// eslint-disable-next-line import/prefer-default-export
export const useDeleteAnyCustomers = () => {
  const [deleteFlaggedNumbers, setDeleteFlaggedNumbers] = useState<number[]>([]);

  const queryClient = useQueryClient();
  const { mutateAsync: deleteAnyCustomers } = useMutation({
    // customersIds には deleteFlaggedNumbers のコピーを指定
    mutationFn: async (customersIds: number[]) => {
      if (customersIds.length === 0) {
        throw new Error('Customer is Not Found !!');
      }
      const response: AxiosResponse<{ command: string; rowCount: number }> = await axiosInstance
        .post('/customers/delete', { deleteIds: customersIds })
        .catch((err: string) => {
          console.error(`💥💥💥 /customers/delete からのエラーをキャッチ❢ ${err} 💀💀💀`);
          return Promise.reject(new Error(err));
        });
      return response.data;
    },
    onSuccess: () => queryClient.removeQueries({ queryKey: ['/customers/checkingOverlap'] }),
  });

  return { deleteFlaggedNumbers, setDeleteFlaggedNumbers, deleteAnyCustomers };
};
