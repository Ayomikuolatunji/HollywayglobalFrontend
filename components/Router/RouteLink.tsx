

import Link from 'next/link'
import React from 'react'

interface RouteLinkProps {
    href: string
    children?: JSX.Element;
}

export default function RouteLink({
    href,
    children
}: RouteLinkProps) {
  return (
    <Link href={href}>
        <div>
           {children}
        </div>
    </Link>
  )
}
