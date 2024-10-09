import { Outlet } from 'react-router-dom';
import { css } from '../../../styled-system/css';
import SearchInput from './components/SearchInput';
import LinkNewRegistration from './components/LinkNewRegistration';
import { useSearchCustomer } from './components/hooks/useSearchCustomer';

export default function SearchCustomer() {
  const { searchString, setSearchString, searchTrigger, setSearchTrigger, latestCommunicationTime, customers } =
    useSearchCustomer();

  return (
    <>
      <header
        className={css({
          pos: 'sticky',
          top: 0,
          zIndex: '1',
          backdropFilter: 'blur(8px)',
          px: 2,
          py: 2.5,
          boxShadow: '0 0.125rem 0.25rem rgba(0,0,0,.02),0 1px 0 rgba(0,0,0,.06)',
        })}
      >
        <nav
          className={css({
            display: 'grid',
            alignItems: 'center',
            gridTemplateColumns: '1fr auto 1fr',
          })}
        >
          <div className={css({ gridColumn: '2/3' })}>
            <SearchInput
              searchString={searchString}
              setSearchString={setSearchString}
              searchTrigger={searchTrigger}
              setSearchTrigger={setSearchTrigger}
              placeholder="スペース区切りアンド検索、末尾に ：都道府県 or ：：市区町村 絞り込"
            />
          </div>
          <div className={css({ gridColumn: '3/4', justifySelf: 'end', mr: '0.75rem' })}>
            <LinkNewRegistration relativePath="/customers/register" height="1.875rem" />
          </div>
        </nav>
      </header>
      <Outlet context={{ latestCommunicationTime, customers }} />
    </>
  );
}
