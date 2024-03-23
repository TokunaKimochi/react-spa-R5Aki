import { useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { AxiosResponse } from 'axios';
import { Outlet } from 'react-router-dom';
import { css } from '../../../styled-system/css';
import { CustomersTbRow } from './customers.types';
import SearchInput from './components/SearchInput';
import LinkNewRegistration from './components/LinkNewRegistration';
import axiosInst from '../../util/axios-instance';

export default function SearchCustomer() {
  const [searchString, setSearchString] = useState('');
  const [searchTrigger, setSearchTrigger] = useState(false);
  const [latestCommunicationTime, setLatestCommunicationTime] = useState('0');
  const fetchSelectedCustomersQueryFn = async () => {
    // useSuspenseQuery には enabled オプションが無いので
    // コンポーネントのマウント時に queryFn が走ってしまう 👇一行はその対策
    if (searchString.length === 0) return [];
    // おまけ機能（データ取得時間計測⏱）の前処理🐢
    const preRunTime = performance.now();
    const result: void | AxiosResponse<CustomersTbRow[]> = await axiosInst
      .get(`/customers?search_name=${searchString}`)
      .catch((err: string) => {
        console.error(`💥💥💥 /customers?search_name=${searchString} からのエラーをキャッチ❢ ${err} 💀💀💀`);
        return Promise.reject(new Error(err));
      });

    // おまけ機能で useState() をひとつ使ってる😅💦
    const runTime = performance.now() - preRunTime;
    let runTimeString = runTime.toString();
    // 小数点付きミリ秒か否かを記録
    const index = runTimeString.indexOf('.');
    // ミリ秒の小数点（0.000.00秒）を取る
    runTimeString = runTimeString.replace('.', '');
    // 一秒未満
    if (runTime < 1000) {
      setLatestCommunicationTime(`0.${runTimeString.padStart(3, '0')}`);
      // 一秒以上かつ精度はミリ秒まで
    } else if (index === -1) {
      setLatestCommunicationTime(runTimeString.replace(/([0-9]{3})$/, '.$1'));
      // 一秒以上かつ小数点付きミリ秒
    } else {
      const patternStr = `^([0-9]{${index - 3}})`;
      setLatestCommunicationTime(runTimeString.replace(new RegExp(patternStr), '$1.'));
    }

    if (!result) return [];

    return result.data;
  };
  const { data: customers } = useSuspenseQuery({
    queryKey: ['customers?search_name', searchTrigger],
    queryFn: fetchSelectedCustomersQueryFn,
  });

  return (
    <>
      <header
        className={css({
          pos: 'sticky',
          top: 0,
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
