import PreIPOList from '../../../src/components/PreIPOList';

export const metadata = {
  title: 'Pre-IPO & Unlisted Shares | ShareBazaarOnline',
  description: 'Discover pre-IPO and unlisted companies, track pricing and availability before they list. Find private company opportunities and market insights.',
  openGraph: {
    title: 'Pre-IPO & Unlisted Shares | ShareBazaarOnline',
    description: 'Discover pre-IPO and unlisted companies, track pricing and availability before they list.',
  }
};

export default function Page(){
  return <PreIPOList />;
}
