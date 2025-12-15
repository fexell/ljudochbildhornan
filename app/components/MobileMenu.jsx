import { NavLink } from 'react-router';

export function MyMobileMenu({header, publicStoreDomain, primaryDomainUrl}) {
  const {menu} = header;

  const normalizeUrl = (url) => {
    if(!url) return "/";
    
    const isInternal = [primaryDomainUrl, publicStoreDomain, "myshopify.com"].some(domain => url.includes(domain));

    return isInternal ? new URL(url).pathname : url;
  }

  return (
    <div className="flex flex-col h-full justify-center items-center bg-blue">
      <div className="h-fit">
        {menu.items.map((item) => {
          if (!item.url) return null;

          const url = normalizeUrl(item.url);

          return (
            <div key={item.id}>
              <NavLink
                className="block py-2 text-2xl text-center text-white w-full"
                end
                prefetch="intent"
                to={url}
              >
                {item.title}
              </NavLink>
            </div>
          )
        })}
      </div>
    </div>
  );
}
