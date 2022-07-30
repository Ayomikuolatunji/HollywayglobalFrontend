import Link from 'next/link';
import React from 'react';
export default function RouteLink(_a) {
    var href = _a.href, children = _a.children;
    return (<Link href={href}>
        <>
           {children}
        </>
    </Link>);
}
//# sourceMappingURL=RouteLink.jsx.map