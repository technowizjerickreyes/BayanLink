const paths = {
  add: "M12 5v14M5 12h14",
  alert: "M12 9v4m0 4h.01M10.3 3.9 2.6 17a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z",
  archive: "M4 7h16M6 7l1 14h10l1-14M8 3h8l1 4H7l1-4Zm2 9h4",
  back: "M19 12H5m7-7-7 7 7 7",
  building: "M4 21h16M6 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16M9 8h1M13 8h1M9 12h1M13 12h1M9 16h1M13 16h1",
  calendar: "M7 3v3M17 3v3M4 8h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z",
  chat: "M4 5h16v10H8l-4 4V5Zm5 4h6M9 12h4",
  check: "M20 6 9 17l-5-5",
  close: "M6 6l12 12M18 6 6 18",
  dashboard: "M4 13h6V4H4v9Zm10 7h6V4h-6v16ZM4 20h6v-5H4v5Z",
  delete: "M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3",
  edit: "M4 20h4l10-10a2.8 2.8 0 0 0-4-4L4 16v4Zm11-13 2 2",
  file: "M14 3H6a2 2 0 0 0-2 2v14h16V9l-6-6Zm0 0v6h6M8 13h8M8 17h5",
  hide: "m3 3 18 18M10.6 10.7a3 3 0 1 0 4.1 4.1M9.9 5.2A10.9 10.9 0 0 1 12 5c6 0 10 7 10 7a18.6 18.6 0 0 1-4 4.8M6.1 6.1C3.5 8.1 2 12 2 12s4 7 10 7a10.8 10.8 0 0 0 2.7-.3",
  lock: "M7 11V8a5 5 0 0 1 10 0v3M6 11h12v10H6V11Zm6 4v2",
  logout: "M10 17l5-5-5-5M15 12H3M21 4v16h-6",
  map: "M9 18 3 21V6l6-3 6 3 6-3v15l-6 3-6-3Zm0 0V3m6 18V6",
  menu: "M4 6h16M4 12h16M4 18h16",
  news: "M4 5h13a3 3 0 0 1 3 3v11H7a3 3 0 0 1-3-3V5Zm4 4h7M8 13h8M8 17h5",
  notification: "M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5m2 0v1a1 1 0 1 0 2 0v-1m-2 0h2",
  people: "M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM21 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  qr: "M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h2v2h-2v-2Zm4 0h2v6h-2v-6Zm-4 4h2v2h-2v-2Z",
  save: "M5 5h12l2 2v12H5V5Zm3 0v6h8V5M8 19v-5h8v5",
  sos: "M12 21s7-4.4 7-11a7 7 0 1 0-14 0c0 6.6 7 11 7 11Zm-2-11h4m-2-2v4",
  tracking: "M4 5h16M4 12h10M4 19h16m-4-10 4 3-4 3",
  trend: "M3 17 9 11l4 4 7-8M14 7h6v6",
  view: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  wallet: "M4 7h15a1 1 0 0 1 1 1v11H4a2 2 0 0 1-2-2V5a2 2 0 0 0 2 2Zm12 6h4M4 7h13V5H4a2 2 0 0 0 0 4",
};

export default function Icon({ name, size = 18 }) {
  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width={size}
    >
      <path d={paths[name]} />
    </svg>
  );
}
