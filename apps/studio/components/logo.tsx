export function Logo() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Christian Cross</title>
      <rect width="32" height="32" rx="16" fill="var(--card-fg-color)" />
      {/* Hill */}
      <path
        d="M4 24C4 24 8 20 16 20C24 20 28 24 28 24V32H4V24Z"
        fill="url(#paint0_linear_2_18)"
      />
      {/* Vertical beam of cross */}
      <path
        d="M14 8V24"
        stroke="url(#paint1_linear_2_18)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Horizontal beam of cross */}
      <path
        d="M8 14H20"
        stroke="url(#paint2_linear_2_18)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_2_18"
          x1="16"
          y1="20"
          x2="16"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--card-fg-color)" />
          <stop offset="1" stopColor="var(--card-bg-color)" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_2_18"
          x1="14"
          y1="8"
          x2="14"
          y2="24"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--card-fg-color)" />
          <stop offset="1" stopColor="var(--card-bg-color)" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_2_18"
          x1="8"
          y1="14"
          x2="20"
          y2="14"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--card-fg-color)" />
          <stop offset="1" stopColor="var(--card-bg-color)" />
        </linearGradient>
      </defs>
    </svg>
  );
}
