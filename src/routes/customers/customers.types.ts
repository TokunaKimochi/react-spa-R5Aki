import { z } from 'zod';
import { customersTbRowSchema } from './customers.schemas';

export type CustomersTbRow = z.infer<typeof customersTbRowSchema>;
export type RequiredCustomerSummary = Pick<
  CustomersTbRow,
  'tel' | 'address1' | 'address2' | 'address3' | 'name1' | 'name2' | 'notes' | 'invoice_type_id'
>;
