import type { ReactNode } from "react";

type HelpIconName = "book" | "search" | "message" | "shield" | "ticket";

function Icon({ children }: { children: ReactNode }) {
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

export default function HelpIcon({ name }: { name: HelpIconName }) {
  if (name === "search") {
    return (
      <Icon>
        <circle cx="10.8" cy="10.8" r="6.4" />
        <path d="m16 16 4.5 4.5" strokeLinecap="round" />
      </Icon>
    );
  }
  if (name === "message") {
    return (
      <Icon>
        <path
          d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v6a2.5 2.5 0 0 1-2.5 2.5H11l-4.5 4v-4.2A2.5 2.5 0 0 1 5 12.5v-6Z"
          strokeLinejoin="round"
        />
        <path d="M8.5 9h7M8.5 12h4" strokeLinecap="round" />
      </Icon>
    );
  }
  if (name === "shield") {
    return (
      <Icon>
        <path
          d="M12 3 20 6v5.5c0 4.7-3.2 7.7-8 9.5-4.8-1.8-8-4.8-8-9.5V6l8-3Z"
          strokeLinejoin="round"
        />
        <path
          d="m8.5 12 2.2 2.2 4.8-5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Icon>
    );
  }
  if (name === "ticket") {
    return (
      <Icon>
        <path
          d="M4 8.5A2.5 2.5 0 0 0 6.5 6h11A2.5 2.5 0 0 0 20 8.5v1a2.5 2.5 0 0 0 0 5v1a2.5 2.5 0 0 0-2.5 2.5h-11A2.5 2.5 0 0 0 4 15.5a2.5 2.5 0 0 0 0-5v-2Z"
          strokeLinejoin="round"
        />
        <path d="M12 8v8" strokeLinecap="round" strokeDasharray="1.5 2" />
      </Icon>
    );
  }
  return (
    <Icon>
      <path
        d="M6 4.5A2.5 2.5 0 0 1 8.5 2H19v17H8.5A2.5 2.5 0 0 0 6 21.5v-17Z"
        strokeLinejoin="round"
      />
      <path d="M6 5v16M10 6h5M10 9h5" strokeLinecap="round" />
    </Icon>
  );
}
