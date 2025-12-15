import {Suspense, useEffect} from 'react';
import {Await, NavLink} from 'react-router';
import { Image } from '@shopify/hydrogen';

import { HeaderMenu } from './Header';

// Use a client-side loader to avoid SSR/client hydration mismatch.
import FreeMapClientLoader from './FreeMapClientLoader';

/**
 * @param {FooterProps}
 */
export function Footer({footer: footerPromise, header, publicStoreDomain}) {
  const {shop} = header;
  const logoImage = header?.shop?.brand?.logo?.image;

  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="footer">
            <div className="flex flex-col bg-light-blue">
              <div>
                <div>
                  <Suspense fallback={<div>Laddar karta...</div>}>
                    <FreeMapClientLoader />
                  </Suspense>
                </div>
              </div>
              <div className="flex flex-col justify-center min-h-96 lg:w-5xl mx-auto">
                <div className="flex justify-center items-center">
                  <NavLink className='flex justify-center items-center' prefetch="intent" to="/" end>
                    {logoImage ? (
                      <Image
                        alt={shop.name}
                        data={logoImage}
                        className="header-logo w-50!"
                        width={logoImage.width}
                        height={logoImage.height}
                        sizes="(min-width: 45em) 50vw, 100vw"
                      />
                    ) : (
                      <span>{shop?.name}</span>
                    )}
                  </NavLink>
                </div>
                <div className="flex flex-col justify-center">
                  {header?.menu && (
                    <FooterMenu
                      classes="flex flex-row text-black!"
                      menu={header.menu}
                      primaryDomainUrl={header.shop.primaryDomain.url}
                      publicStoreDomain={publicStoreDomain}
                    />
                  )}
                </div>
              </div>
              <div className="bg-neutral-950">
                {footer?.menu && header.shop.primaryDomain?.url && (
                  <FooterMenu
                    classes="flex py-4 text-white!"
                    menu={footer.menu}
                    primaryDomainUrl={header.shop.primaryDomain.url}
                    publicStoreDomain={publicStoreDomain}
                  />
                )}
              </div>
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

/**
 * @param {{
 *   menu: FooterQuery['menu'];
 *   primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
 *   publicStoreDomain: string;
 * }}
 */
function FooterMenu({menu, primaryDomainUrl, publicStoreDomain, classes}) {
  return (
    <nav className={`footer-menu ${classes || ''}`} role="navigation">
      {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
        if (!item.url) return null;
        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        const isExternal = !url.startsWith('/');
        return isExternal ? (
          <a href={url} key={item.id} rel="noopener noreferrer" target="_blank">
            {item.title}
          </a>
        ) : (
          <NavLink
            end
            key={item.id}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};

/**
 * @param {{
 *   isActive: boolean;
 *   isPending: boolean;
 * }}
 */
function activeLinkStyle({isActive, isPending}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
  };
}

/**
 * @typedef {Object} FooterProps
 * @property {Promise<FooterQuery|null>} footer
 * @property {HeaderQuery} header
 * @property {string} publicStoreDomain
 */

/** @typedef {import('storefrontapi.generated').FooterQuery} FooterQuery */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
