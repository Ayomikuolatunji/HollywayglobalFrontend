import React from 'react';
import Link from 'next/link';

interface FooterItems {
  title: string;
  items: { title: string; url: string; external: boolean }[];
}

const Footer = (): JSX.Element => {
  const footer: FooterItems[] = [
    {
      title: 'Company',
      items: [
        { external: false, title: 'About', url: '#' },
        { external: false, title: 'Careers', url: '#' },
        { external: false, title: 'Brand Center', url: '#' },
        { external: false, title: 'Blog', url: '#' },
      ],
    },
    {
      title: 'Help Center',
      items: [
        { external: false, title: 'Discord Server', url: '#' },
        { external: false, title: 'Facebook', url: '#' },
        { external: false, title: 'Twitter', url: '#' },
        { external: false, title: 'Contact Us', url: '#' },
      ],
    },
    {
      title: 'Legal',
      items: [
        { external: false, title: 'Privacy Policy', url: '#' },
        { external: false, title: ' Licensing', url: '#' },
        { external: false, title: 'Terms & Conditions', url: '#' },
      ],
    },
    {
      title: 'Download',
      items: [
        {
          external: true,
          title: 'iOS',
          url: 'https://twitter.com/Afrisplash',
        },
        {
          external: true,
          title: ' Android',
          url: 'https://www.linkedin.com/company/afrisplash/',
        },
        {
          external: true,
          title: ' Windows',
          url: 'https://web.facebook.com/AfriSplashRemotely',
        },
        { external: true, title: 'MacOs', url: '#' },
      ],
    },
  ];

  return (
    <footer className='bg-[#1C1D36] w-full py-5 text-white'>
      <div className='w-11/12 md:w-10/12 mx-auto space-y-12'>
        <div className='flex w-full justify-between flex-wrap pt-14'>
          {footer.map((item: FooterItems, index) => (
            <section
              key={index}
              className='text-white_2 mx-5 py-3 w-4/12 sm:w-3/12 md:w-max space-y-4'
            >
              <div className='capitalize font-bold text-sm md:text-base'>
                {item.title}
              </div>
              <ul className='space-y-3 text-xs sm:text-sm md:text-base'>
                {item.items.map((subItems: any, index: number) => (
                  <li
                    key={index}
                    className='capitalize'
                  >
                    <Link
                      href={subItems.url}
                      target={subItems.external ? '_blank' : '_self'}
                    >
                      {subItems.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <div className='text-white_2 flex items-center flex-col md:flex-row md:justify-between border-t border-white_2/20 py-10'>
          <section>
            <span>&copy; </span>
            <span className='capitalize xs:text-xs md:text-sm lg:text-base'>
          { new Date().getFullYear()} Hollywayglobal.com .All Rights //
              Reserved.
            </span>
          </section>
          <section>
            <ul className='flex space-x-3  text-sm lg:text-base'>
              <li>Terms of use</li>
              <li>Privacy policy</li>
              <li>Copyright policy</li>
            </ul>
          </section>
        </div>
      </div>
    </footer>

    // <footer className='bg-dark_blue w-full py-5'>
    //   <div className='w-11/12 md:w-10/12 mx-auto space-y-12'>
    //     <div className='flex w-full justify-between flex-wrap pt-14'>
    //       {footer.map((footer: any) => {
    //         const { title, items } = footer;
    //         return (
    //           <div key={title}>
    //             <h2 className='mb-6 text-sm font-semibold text-gray-500 uppercase dark:text-gray-400'>
    //               {title}
    //             </h2>
    //             <ul className='text-gray-500 dark:text-gray-400'>
    //               {items.map((subItems: any, index: number) => (
    //                 <li
    //                   key={index}
    //                   className='capitalize mb-3 text-white'
    //                 >
    //                   <Link
    //                     href={subItems.url}
    //                     target={subItems.external ? '_blank' : '_self'}
    //                   >
    //                     {subItems.title}
    //                   </Link>
    //                 </li>
    //               ))}
    //             </ul>
    //           </div>
    //         );
    //       })}

    //       {/*
    //     <hr />
    //     <div className='px-4 py-6 dark:bg-gray-700 md:flex md:items-center md:justify-between'>
    //       <span className='text-sm text-gray-500 dark:text-gray-300 sm:text-center'>
    //         © {new Date().getFullYear()} Hollywayglobal.com .All Rights
    //         Reserved.
    //       </span>
    //     */}
    //       <div className='text-white_2 flex items-center flex-col md:flex-row md:justify-between border-t border-white_2/20 py-10'>
    //         <section>
    //           <span>&copy;</span>
    //           <span className='capitalize xs:text-xs md:text-sm lg:text-base'>
    //             afrisplash remotely. all rights reserved
    //           </span>
    //         </section>
    //         <section>
    //           <ul className='flex space-x-3  text-sm lg:text-base'>
    //             <li>Terms of use</li>
    //             <li>Privacy policy</li>
    //             <li>Copyright policy</li>
    //           </ul>
    //         </section>
    //       </div>
    //     </div>
    //   </div>
    // </footer>
  );
};

export default Footer;
