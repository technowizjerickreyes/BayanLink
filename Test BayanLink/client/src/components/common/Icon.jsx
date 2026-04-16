const paths = {
  add: "M12 5v14M5 12h14",
  alert: "M12 9v4m0 4h.01M10.3 3.9 2.6 17a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z",
  back: "M19 12H5m7-7-7 7 7 7",
  building: "M4 21h16M6 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16M9 8h1M13 8h1M9 12h1M13 12h1M9 16h1M13 16h1",
  calendar: "M7 3v3M17 3v3M4 8h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z",
  check: "M20 6 9 17l-5-5",
  close: "M6 6l12 12M18 6 6 18",
  dashboard: "M4 13h6V4H4v9Zm10 7h6V4h-6v16ZM4 20h6v-5H4v5Z",
  delete: "M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3",
  edit: "M4 20h4l10-10a2.8 2.8 0 0 0-4-4L4 16v4Zm11-13 2 2",
  file: "M14 3H6a2 2 0 0 0-2 2v14h16V9l-6-6Zm0 0v6h6M8 13h8M8 17h5",
  menu: "M4 6h16M4 12h16M4 18h16",
  news: "M4 5h13a3 3 0 0 1 3 3v11H7a3 3 0 0 1-3-3V5Zm4 4h7M8 13h8M8 17h5",
  people: "M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM21 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  save: "M5 5h12l2 2v12H5V5Zm3 0v6h8V5M8 19v-5h8v5",
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
