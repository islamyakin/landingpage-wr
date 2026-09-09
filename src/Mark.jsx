import React from "react";

// Gateway A: a controlled entrance, with three people approaching in order.
export default function Mark() {
  return (
    <svg
      className="mark"
      viewBox="0 0 128 128"
      width="48"
      height="48"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M48 8h31c7 0 11 3 14 10l32 86c2 6-1 10-7 10H98c-5 0-7-3-9-8L74 56c-1-5-4-7-9-7h-3c-5 0-8 2-9 7l-16 50c-1 5-4 8-9 8H9c-6 0-9-4-7-10l33-86c2-7 6-10 13-10Z"
      />
      <path
        fill="var(--brand-orange)"
        d="M55 59c1-5 3-7 8-7h3c4 0 7 2 8 7l11 44-13-13-3-23H58l-4 24-12 13Z"
      />
      <path fill="var(--brand-orange-soft)" d="M59 62h9l5 24-9-9-10 9Z" />
      <g fill="currentColor">
        <circle cx="64" cy="88" r="4" />
        <circle cx="64" cy="100" r="5" />
        <circle cx="64" cy="115" r="6.5" />
      </g>
    </svg>
  );
}
