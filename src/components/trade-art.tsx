export function TradeArt() {
  return (
    <div className="trade-art" aria-hidden="true">
      <div className="art-grid" />
      <svg viewBox="0 0 600 540" fill="none">
        <defs>
          <linearGradient id="sea" x1="0" y1="0" x2="600" y2="500">
            <stop stopColor="#21465c" />
            <stop offset="1" stopColor="#0c2035" />
          </linearGradient>
        </defs>
        <circle cx="315" cy="246" r="179" stroke="#dfb566" strokeOpacity=".4" />
        <ellipse
          cx="315"
          cy="246"
          rx="92"
          ry="179"
          stroke="#dfb566"
          strokeOpacity=".3"
        />
        <ellipse
          cx="315"
          cy="246"
          rx="179"
          ry="64"
          stroke="#dfb566"
          strokeOpacity=".3"
        />
        <path d="M136 246h358M315 67v358" stroke="#dfb566" strokeOpacity=".3" />
        <path
          d="M105 330Q220 80 472 143"
          stroke="#dfb566"
          strokeWidth="2"
          strokeDasharray="5 7"
        />
        <circle cx="105" cy="330" r="7" fill="#dfb566" />
        <circle cx="472" cy="143" r="7" fill="#dfb566" />
        <path d="M100 365h372l-43 56H150z" fill="url(#sea)" stroke="#7994a0" />
        <path
          d="M128 357v-54h97v54m7 0v-54h97v54m7 0v-54h97v54M181 296v-54h97v54m7 0v-54h97v54"
          fill="#b18c50"
          fillOpacity=".8"
          stroke="#dfb566"
          strokeWidth="2"
        />
        <path
          d="M144 311v39m17-39v39m17-39v39m17-39v39m17-39v39m35-39v39m17-39v39m17-39v39m17-39v39m17-39v39m35-39v39m17-39v39m17-39v39m17-39v39m17-39v39M197 251v39m17-39v39m17-39v39m17-39v39m17-39v39m35-39v39m17-39v39m17-39v39m17-39v39m17-39v39"
          stroke="#0c2035"
          strokeOpacity=".35"
        />
        <path
          d="M434 352v-91h26v91m-26-63h45v63"
          stroke="#7994a0"
          strokeWidth="4"
        />
        <path
          d="M68 437q45-15 90 0t90 0t90 0t90 0t90 0M85 455q45-15 90 0t90 0t90 0t90 0"
          stroke="#7994a0"
          strokeOpacity=".4"
        />
        <path d="m452 126 25 17-27 5 4-10z" fill="#dfb566" />
      </svg>
      <div className="art-label">
        <span className="status-dot" /> CONNECTING POSSIBILITIES
      </div>
      <span className="art-coordinate">APAPA, LAGOS · NIGERIA</span>
    </div>
  );
}
