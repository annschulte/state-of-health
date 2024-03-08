export default function MehVote({ fill = "#FFB443" }: { fill: string }) {
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
        stroke-width="4"
        stroke-linejoin="round"
      />
      <rect
        x="5"
        y="5"
        width="34"
        height="34"
        fill={fill}
        stroke="black"
        stroke-width="4"
        stroke-linejoin="round"
      />
      <path d="M12 22H32" stroke="black" stroke-width="4" />
    </svg>
  );
}
