import type { ReactNode } from "react";

function Svg({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export default function DashboardIcon({ name }: { name: string }) {
  if (name === "grid") {
    return (
      <Svg>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </Svg>
    );
  }
  if (name === "store") {
    return (
      <Svg>
        <path d="M4 9h16l-1.5-5h-13L4 9Z" strokeLinejoin="round" />
        <path d="M5 9v11h14V9M9 20v-6h6v6" strokeLinejoin="round" />
        <path
          d="M4 9a3 3 0 0 0 5 2 3 3 0 0 0 6 0 3 3 0 0 0 5-2"
          strokeLinecap="round"
        />
      </Svg>
    );
  }
  if (name === "cart") {
    return (
      <Svg>
        <path
          d="M3.5 4h2l1.7 10.2a2 2 0 0 0 2 1.7h8.5a2 2 0 0 0 1.9-1.5L21 8H6.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="9" cy="19" r="1.2" />
        <circle cx="18" cy="19" r="1.2" />
      </Svg>
    );
  }
  if (name === "box") {
    return (
      <Svg>
        <path d="m4 7 8-4 8 4v10l-8 4-8-4V7Z" strokeLinejoin="round" />
        <path d="m4 7 8 4 8-4M12 11v10" />
      </Svg>
    );
  }
  if (name === "search") {
    return (
      <Svg>
        <circle cx="10.8" cy="10.8" r="6.3" />
        <path d="m16 16 4.5 4.5" strokeLinecap="round" />
      </Svg>
    );
  }
  if (name === "shield") {
    return (
      <Svg>
        <path
          d="M12 3 20 6v5.5c0 4.7-3.2 7.7-8 9.5-4.8-1.8-8-4.8-8-9.5V6l8-3Z"
          strokeLinejoin="round"
        />
        <path d="m8.5 12 2.2 2.2 4.8-5" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  }
  if (name === "truck") {
    return (
      <Svg>
        <path d="M3 6h11v10H3zM14 9h4l3 3v4h-7z" strokeLinejoin="round" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="18" cy="18" r="2" />
      </Svg>
    );
  }
  if (name === "tool") {
    return (
      <Svg>
        <path
          d="m14.5 6.5 3-3a5 5 0 0 0-6.4 6.4l-7.6 7.6a2 2 0 0 0 2.8 2.8l7.6-7.6a5 5 0 0 0 6.4-6.4l-3 3-2.8-.8-.8-2.8Z"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }
  if (name === "bell") {
    return (
      <Svg>
        <path
          d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }
  if (name === "settings") {
    return (
      <Svg>
        <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
        <path
          d="m19.4 15 .1.1-1.6 2.7-.2-.1a2.3 2.3 0 0 0-2.4 0l-.2.1-1.6-2.7.1-.1a2.3 2.3 0 0 0 0-2.1l-.1-.2 1.6-2.7.2.1a2.3 2.3 0 0 0 2.4 0l.2-.1 1.6 2.7-.1.2a2.3 2.3 0 0 0 0 2.1ZM4.6 15l-.1.1 1.6 2.7.2-.1a2.3 2.3 0 0 1 2.4 0l.2.1 1.6-2.7-.1-.1a2.3 2.3 0 0 1 0-2.1l.1-.2-1.6-2.7-.2.1a2.3 2.3 0 0 1-2.4 0l-.2-.1-1.6 2.7.1.2a2.3 2.3 0 0 1 0 2.1Z"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }
  if (name === "sun") {
    return (
      <Svg>
        <circle cx="12" cy="12" r="3.7" />
        <path
          d="M12 2.8v2M12 19.2v2M21.2 12h-2M4.8 12h-2M18.5 5.5l-1.4 1.4M6.9 17.1l-1.4 1.4M18.5 18.5l-1.4-1.4M6.9 6.9 5.5 5.5"
          strokeLinecap="round"
        />
      </Svg>
    );
  }
  if (name === "moon") {
    return (
      <Svg>
        <path
          d="M19.2 15.7A7.8 7.8 0 0 1 8.3 4.8 8.5 8.5 0 1 0 19.2 15.7Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }
  if (name === "wallet") {
    return (
      <Svg>
        <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H19v16H6.5A2.5 2.5 0 0 1 4 17.5v-11Z" strokeLinejoin="round" />
        <path d="M4 7h15M16 12h4v4h-4a2 2 0 1 1 0-4Z" strokeLinejoin="round" />
      </Svg>
    );
  }
  if (name === "clock") {
    return (
      <Svg>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  }
  if (name === "check") {
    return (
      <Svg>
        <circle cx="12" cy="12" r="8.5" />
        <path d="m8 12 2.5 2.5L16.5 9" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  }
  if (name === "list") {
    return (
      <Svg>
        <path d="M8 6h11M8 12h11M8 18h11" strokeLinecap="round" />
        <circle cx="4.5" cy="6" r=".8" fill="currentColor" stroke="none" />
        <circle cx="4.5" cy="12" r=".8" fill="currentColor" stroke="none" />
        <circle cx="4.5" cy="18" r=".8" fill="currentColor" stroke="none" />
      </Svg>
    );
  }
  if (name === "share") {
    return (
      <Svg>
        <circle cx="18" cy="5" r="2.5" />
        <circle cx="6" cy="12" r="2.5" />
        <circle cx="18" cy="19" r="2.5" />
        <path d="m8.2 10.8 7.6-4.5M8.2 13.2l7.6 4.5" strokeLinecap="round" />
      </Svg>
    );
  }
  return (
    <Svg>
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.3" />
      <path d="M3.5 19c.5-3 2.3-4.6 5.5-4.6s5 1.6 5.5 4.6M14 15c2.8-.4 5 .9 5.7 3.5" strokeLinecap="round" />
    </Svg>
  );
}
