import type { SVGProps } from "react";

export type IconName =
  | "alert"
  | "bell"
  | "calendar"
  | "chart"
  | "check"
  | "chevron-down"
  | "chevron-right"
  | "clock"
  | "close"
  | "file-text"
  | "history"
  | "home"
  | "info"
  | "moon"
  | "more"
  | "panel-left"
  | "plus"
  | "search"
  | "settings"
  | "sun"
  | "trash"
  | "user"
  | "users"
  | "wallet"
  | "warning";

type IconProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  name: IconName;
  size?: 14 | 16 | 18 | 20 | 24;
  label?: string;
};

export function Icon({ name, size = 18, label, ...props }: IconProps) {
  const shared = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8,
  };

  const paths: Record<IconName, React.ReactNode> = {
    alert: (
      <>
        <circle cx="12" cy="12" r="9" {...shared} />
        <path d="M12 8v5" {...shared} />
        <path d="M12 16.25h.01" {...shared} />
      </>
    ),
    bell: (
      <>
        <path d="M6.5 9.5a5.5 5.5 0 0 1 11 0v4l1.5 2.5H5l1.5-2.5v-4Z" {...shared} />
        <path d="M10 19h4" {...shared} />
      </>
    ),
    calendar: (
      <>
        <rect x="4" y="5" width="16" height="15" rx="2" {...shared} />
        <path d="M8 3v4M16 3v4M4 10h16" {...shared} />
      </>
    ),
    chart: (
      <>
        <path d="M5 19V10M12 19V5M19 19v-7" {...shared} />
        <path d="M3.5 19.5h17" {...shared} />
      </>
    ),
    check: <path d="m5.5 12.5 4 4 9-10" {...shared} />,
    "chevron-down": <path d="m7 9.5 5 5 5-5" {...shared} />,
    "chevron-right": <path d="m9.5 7 5 5-5 5" {...shared} />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" {...shared} />
        <path d="M12 7v5l3.5 2" {...shared} />
      </>
    ),
    close: <path d="M7 7l10 10M17 7 7 17" {...shared} />,
    "file-text": (
      <>
        <path d="M7 3.5h7l3 3V20H7V3.5Z" {...shared} />
        <path d="M14 3.5V7h3M9.5 11h5M9.5 14.5h5" {...shared} />
      </>
    ),
    history: (
      <>
        <path d="M4 12a8 8 0 1 0 2.1-5.4L4 8.5" {...shared} />
        <path d="M4 4.5v4h4M12 8v4l3 2" {...shared} />
      </>
    ),
    home: (
      <>
        <path d="m4 10 8-6 8 6" {...shared} />
        <path d="M6.5 9v10h11V9M10 19v-5h4v5" {...shared} />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="9" {...shared} />
        <path d="M12 11v6M12 7.5h.01" {...shared} />
      </>
    ),
    moon: <path d="M20 15.1A8 8 0 0 1 8.9 4a8.5 8.5 0 1 0 11.1 11.1Z" {...shared} />,
    more: (
      <>
        <circle cx="6" cy="12" r="1" fill="currentColor" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
        <circle cx="18" cy="12" r="1" fill="currentColor" />
      </>
    ),
    "panel-left": (
      <>
        <rect x="3.5" y="4" width="17" height="16" rx="2" {...shared} />
        <path d="M9 4v16" {...shared} />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" {...shared} />,
    search: (
      <>
        <circle cx="11" cy="11" r="6.5" {...shared} />
        <path d="m16 16 4 4" {...shared} />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" {...shared} />
        <path
          d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2M6 6l1.4 1.4M16.6 16.6 18 18M18 6l-1.4 1.4M7.4 16.6 6 18"
          {...shared}
        />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="3.5" {...shared} />
        <path
          d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4"
          {...shared}
        />
      </>
    ),
    trash: (
      <>
        <path d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13" {...shared} />
        <path d="M10 11v5M14 11v5" {...shared} />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="3.5" {...shared} />
        <path d="M5.5 20c.6-4 3-6 6.5-6s5.9 2 6.5 6" {...shared} />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3" {...shared} />
        <path d="M3.5 19c.5-3.6 2.5-5.5 5.5-5.5s5 1.9 5.5 5.5" {...shared} />
        <path d="M15 5.5a2.8 2.8 0 0 1 0 5.2M16.5 13.5c2.2.5 3.6 2.2 4 5" {...shared} />
      </>
    ),
    wallet: (
      <>
        <path d="M4 7.5h14.5A1.5 1.5 0 0 1 20 9v9H5.5A1.5 1.5 0 0 1 4 16.5v-9Z" {...shared} />
        <path d="M4.5 7.5 16 4.5v3M15 12h5v3h-5a1.5 1.5 0 0 1 0-3Z" {...shared} />
      </>
    ),
    warning: (
      <>
        <path d="M12 4 3.5 19h17L12 4Z" {...shared} />
        <path d="M12 9v4.5M12 16.5h.01" {...shared} />
      </>
    ),
  };

  return (
    <svg
      aria-hidden={label ? undefined : true}
      className="ui-icon"
      height={size}
      role={label ? "img" : undefined}
      viewBox="0 0 24 24"
      width={size}
      {...props}
    >
      {label ? <title>{label}</title> : null}
      {paths[name]}
    </svg>
  );
}
