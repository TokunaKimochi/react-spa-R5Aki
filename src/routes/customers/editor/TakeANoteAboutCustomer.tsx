import { Link, useLocation, useParams } from 'react-router';

import FormContainer from '@/components/ui/elements/FormContainer';
import CustomerNoteForm from '@/routes/customers/components/CustomerNoteForm';
import FloatingLinkIcon from '@/routes/customers/components/FloatingLinkIcon';
import { useFetchNotes } from '@/routes/customers/components/hooks/useFetchNotes';
import ListOfSummaryNotesAboutCustomer from '@/routes/customers/components/ListOfSummaryNotesAboutCustomer';

import type { CustomersTbRow } from '../customers.types';

import { css } from '../../../../styled-system/css';

export default function TakeANoteAboutCustomer(): React.JSX.Element {
  const customer = useLocation().state as CustomersTbRow;
  const { id: customerId } = useParams();

  if (customerId && customerId !== customer.id.toString())
    throw new Error('不正なルートでのアクセスを検知しました❢');

  const { notes } = useFetchNotes(customer.id);

  return (
    <>
      <h2
        className={css({
          mx: 'auto',
          p: 2,
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: 'lg',
          textWrap: 'balance',
        })}
      >
        <Link to={`/customers/${customer.id}/decide`} state={customer}>
          {/* eslint-disable-next-line no-irregular-whitespace */}
          {`${customer.name1}　${customer.name2}`}
        </Link>
      </h2>
      <FloatingLinkIcon relativePath="/customers" size="2rem" />
      <div
        className={css({
          display: 'grid',
          px: '1rem',
          alignItems: 'center',
          gridTemplateColumns: 'repeat(auto-fit, minmax(37rem, 1fr))',
          gridGap: '1rem',
        })}
      >
        <ListOfSummaryNotesAboutCustomer notes={notes} customer={customer} mergeStyles={css.raw({ mx: 'auto' })} />
        <FormContainer>
          <CustomerNoteForm customer={customer} notes={notes} />
        </FormContainer>
      </div>
    </>
  );
}
