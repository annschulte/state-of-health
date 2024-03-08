export default function DownVote({ fill = "#FF4B4B" }: { fill: string }) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="9"
        y="9"
        width="34"
        height="34"
        fill="black"
        stroke="black"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <rect
        x="5"
        y="5"
        width="34"
        height="34"
        fill={fill}
        stroke="black"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M14 23L22 31L30 23" stroke="black" strokeWidth="4" />
      <path d="M22 31L22 10" stroke="black" strokeWidth="4" />
    </svg>
  );
}
