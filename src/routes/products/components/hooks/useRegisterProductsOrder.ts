import type { AxiosResponse } from 'axios';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { ProductsFormValues } from '@/atoms/purchaseOrderAtom';

import axiosInstance from '@/util/axiosInstance';

export function useRegisterProductsOrder() {
  const queryClient = useQueryClient();
  const { mutateAsync: registerProductsOrder, isPending: isRegisteringProductsOrder } = useMutation({
    mutationFn: async (productsOrder: ProductsFormValues) => {
      const response: AxiosResponse<{
        isSuccess: boolean;
        message: string;
      }> = await axiosInstance.post('/products/order', productsOrder)
        .catch((err: string) => {
          console.error(`💥💥💥 /products/order からのエラーをキャッチ❢ ${err} 💀💀💀`);
          return Promise.reject(new Error(err));
        });
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['post:/products/order'] }),
  });

  return { registerProductsOrder, isRegisteringProductsOrder };
}
