import type { ZodType } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAtomValue } from 'jotai';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import { selectedProductsAtom } from '@/atoms/productsAtom';
import Input from '@/components/ui/elements/Input';
import { css } from 'styled-system/css';

import { viewSkuDetailsRowSchema } from './products.dbTable.schemas';

export default function SelectedProducts() {
  const selectedProducts = useAtomValue(selectedProductsAtom);

  const schema = viewSkuDetailsRowSchema.pick({
    sku_name: true,
  }).extend({
    remark: z.string().max(32),
  });
  const productsSchema = z.object({
    products: z.array(schema).min(1).max(7),
  });

  type ProductsFormValues = z.infer<typeof productsSchema>;

  const methods = useForm<ProductsFormValues>({
    mode: 'all',
    resolver: zodResolver(productsSchema as ZodType<ProductsFormValues>),
    defaultValues: { products: selectedProducts.map((p) => {
      return { sku_name: p.sku_name };
    }) },
    // 📢重要：アンマウントされたフィールドの値をフォームから除去
    shouldUnregister: true,
  });
  const productsArray = useFieldArray({
    name: 'products',
    control: methods.control,
    rules: { minLength: 1, maxLength: 7 },
  });

  return (
    <div className={css({ h: '100lvh', display: 'grid', placeItems: 'center' })}>
      <table>
        <tbody>
          {productsArray.fields.map((p, i) => {
            return (
              <tr key={p.id}>
                <td><input readOnly {...methods.register(`products.${i}.sku_name` as const)} /></td>
                <td><Input type="text" {...methods.register(`products.${i}.remark` as const)} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
