import '../styles/globals.css'
import type { AppProps } from 'next/app'
import PageWrapper from '../layouts/wrapper/PageWrapper'


function MyApp({ Component, pageProps }: AppProps) {
  return <div className='sm:w-[70%] mx-auto w-[97%]'>
    <PageWrapper>
      <Component {...pageProps} />
    </PageWrapper>
</div>
}

export default MyApp
