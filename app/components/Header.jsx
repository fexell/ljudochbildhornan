import {Suspense, useEffect, useId, useRef, useState} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {useAnalytics, useOptimisticCart, Image} from '@shopify/hydrogen';
import {Aside, useAside} from '~/components/Aside';
import {SearchInput} from './SearchInput';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCartShopping, faBars} from '@fortawesome/free-solid-svg-icons';

/**
 * @param {HeaderProps}
 */
export function Header({header, cart, isLoggedIn, publicStoreDomain}) {
  const {shop, menu} = header;
  const logoImage = shop?.brand?.logo?.image;
  const queriesDatalistId = useId();

  const {open} = useAside();

  return (
    <>
      <header className="flex flex-col justify-center bg-light-blue">
        <div className="flex justify-center shadow-lg max-md:w-full">
          <div className="flex flex-col lg:w-5xl max-lg:w-full max-lg:px-4">
            <div className="flex flex-row max-md:flex-col max-md:w-full max-md:px-4">
              <div className="">
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
              <div className='flex flex-1 w-full max-lg:grow-4 md:mx-2 justify-center items-center'>
                <div className="flex flex-col w-full">
                  <div className="absolute top-0 px-6 py-3 max-md:hidden">
                    <p>Lorem ipsum dolor sit amet</p>
                  </div>
                  <div className="w-full max-lg:grow-4 max-md:mb-4">
                    <SearchInput />
                  </div>
                </div>
              </div>
              <div className="md:hidden max-md:fixed max-md:top-2 max-md:left-2">
                <div>
                  <button onClick={() => open('mobile')} className="flex w-full h-full justify-center items-center p-4 cursor-pointer hover:bg-light-blue/80!">
                    <h3>
                      <FontAwesomeIcon icon={faBars} />
                    </h3>
                  </button>
                </div>
              </div>
              <div className="flex max-md:fixed max-md:top-2 max-md:right-2">
                <div className="flex w-full h-full justify-center items-center">
                  <button onClick={() => open('cart')} className="relative w-12 h-12 rounded-full hover:bg-white/50 hover:cursor-pointer">
                    <FontAwesomeIcon icon={faCartShopping} />
                    {cart?.totalQuantity > 0 && (
                      <span className="absolute w-5 h-5 right-0 bottom-0 rounded-full text-[0.75rem] text-white bg-dark-blue">{cart?.totalQuantity ?? 0}</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center max-md:hidden">
          <HeaderMenu
            menu={menu}
            viewport="desktop"
            primaryDomainUrl={header.shop.primaryDomain.url}
            publicStoreDomain={publicStoreDomain}
          />
          {/* <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} /> */}
        </div>
      </header>
    </>
  );
}

function DropdownMenu({ item, close }) {
  const [isOpen, setOpen] = useState(false);
  const firstTap = useRef(true);
  const [isTouchDevice, setTouchDevice] = useState(false);

  useEffect(() => {
    if(typeof window !== "undefined")
      setTouchDevice(window.matchMedia("(hover: none)").matches);
  }, [])

  const handleTouch = (e) => {
    if(!isTouchDevice) return;

    if(firstTap.current) {
      e.preventDefault();
      setOpen(true);
      firstTap.current = false;
    }
  };

  const closeAll = () => {
    setOpen(false);
    firstTap.current = true;
    close();
  };

  return (
    <>
      <div
        className="relative"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => {
          setOpen(false);
          firstTap.current = true;
        }}>
          <NavLink
            to={item.url}
            className="header-menu-item p-4 block"
            aria-expanded={isOpen}
            onClick={handleTouch}
            style={activeLinkStyle}>
            {item.title}
          </NavLink>

          {isOpen && (
            <div className="absolute w-sm -left-36 py-2 border-t-4 border-white rounded-lg bg-light-blue shadow-xl z-40">
              <ul className="flex-1 px-[15px]">
                {item.items.map(({id, title, url}) => (
                  <li key={id}>
                    <NavLink
                      className="relative block p-3 decoration-none hover:bg-blue/40 z-50"
                      to={url}
                      onClick={closeAll}>
                      {title}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
    </>
  )
}

/**
 * @param {{
 *   menu: HeaderProps['header']['menu'];
 *   primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
 *   viewport: Viewport;
 *   publicStoreDomain: HeaderProps['publicStoreDomain'];
 * }}
 */
export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}) {
  const className = `header-menu-${viewport}`;
  const {close} = useAside();

  const normalizeUrl = (url) => {
    if(!url) return "/";
    
    const isInternal = [primaryDomainUrl, publicStoreDomain, "myshopify.com"].some(domain => url.includes(domain));

    return isInternal ? new URL(url).pathname : url;
  }

  const items = (menu || FALLBACK_HEADER_MENU).items;

  return (
    <>
      <nav className={`${className}`} role="navigation">
        {items.map((item) => {
          if(!item.url) return null;

          const url = normalizeUrl(item.url);

          if(item.items?.length > 0) {
            const normalizedItem = {
              ...item,
              url,
              items: item.items.map((sub) => ({
                ...sub,
                url: normalizeUrl(sub.url),
              }))
            }

            return <DropdownMenu key={item.id} item={normalizedItem} close={close} />
          }

          return (
            <NavLink
              key={item.id}
              to={url}
              end
              onClick={close}
              prefetch="intent"
              className="header-menu-item p-4 text-nowrap"
              style={activeLinkStyle}>
              {item.title}
            </NavLink>
          )
        })}
      </nav>
    </>
  );
}

/**
 * @param {Pick<HeaderProps, 'isLoggedIn' | 'cart'>}
 */
function HeaderCtas({isLoggedIn, cart}) {
  return (
    <nav className="header-ctas" role="navigation">
      <HeaderMenuMobileToggle />
      <NavLink prefetch="intent" to="/account" style={activeLinkStyle}>
        <Suspense fallback="Sign in">
          <Await resolve={isLoggedIn} errorElement="Sign in">
            {(isLoggedIn) => (isLoggedIn ? 'Account' : 'Sign in')}
          </Await>
        </Suspense>
      </NavLink>
      <SearchToggle />
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="header-menu-mobile-toggle reset"
      onClick={() => open('mobile')}
    >
      <h3>☰</h3>
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button className="reset" onClick={() => open('search')}>
      Search
    </button>
  );
}

/**
 * @param {{count: number | null}}
 */
function CartBadge({count}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        });
      }}
    >
      Cart {count === null ? <span>&nbsp;</span> : count}
    </a>
  );
}

/**
 * @param {Pick<HeaderProps, 'cart'>}
 */
function CartToggle({cart}) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue();
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
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
    color: isPending ? 'grey' : 'black',
  };
}

/** @typedef {'desktop' | 'mobile'} Viewport */
/**
 * @typedef {Object} HeaderProps
 * @property {HeaderQuery} header
 * @property {Promise<CartApiQueryFragment|null>} cart
 * @property {Promise<boolean>} isLoggedIn
 * @property {string} publicStoreDomain
 */

/** @typedef {import('@shopify/hydrogen').CartViewPayload} CartViewPayload */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
