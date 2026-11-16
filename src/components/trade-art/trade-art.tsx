import styles from "./trade-art.module.css";

export function TradeArt() {
  return (
    <div
      className="relative aspect-[1.08] overflow-hidden text-gold min-w-0 bg-[radial-gradient(ellipse_at_center,#294a5833,transparent_70%)] w-full max-w-[510px] mx-auto rounded-lg"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[linear-gradient(#738c9c10_1px,transparent_1px),linear-gradient(90deg,#738c9c10_1px,transparent_1px)] bg-[size:42px_42px] [mask-image:radial-gradient(ellipse,#000,transparent_72%)]" />
      <svg viewBox="0 0 600 540" fill="none" className="w-full h-full relative">
        <defs>
          <linearGradient id="sea" x1="0" y1="0" x2="600" y2="500">
            <stop stopColor="#21465c" />
            <stop offset="1" stopColor="#0c2035" />
          </linearGradient>
        </defs>
        <g className={styles.globe}>
          <circle
            cx="315"
            cy="246"
            r="179"
            stroke="#dfb566"
            strokeOpacity=".4"
          />
          <ellipse
            className={styles.meridian}
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
          <path
            d="M136 246h358M315 67v358"
            stroke="#dfb566"
            strokeOpacity=".3"
          />
        </g>
        <path
          className={styles.route}
          d="M105 330Q220 80 472 143"
          stroke="#dfb566"
          strokeWidth="2"
          strokeDasharray="5 7"
        />
        <circle cx="105" cy="330" r="7" fill="#dfb566" />
        <circle cx="472" cy="143" r="7" fill="#dfb566" />
        <circle
          className={styles.beacon}
          cx="105"
          cy="330"
          r="15"
          stroke="#dfb566"
          strokeOpacity=".5"
        />
        <g className={styles.ship}>
          <path
            d="M100 365h372l-43 56H150z"
            fill="url(#sea)"
            stroke="#7994a0"
          />
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
        </g>
        <g stroke="#7994a0" strokeOpacity=".4">
          <path
            className={styles.wave}
            d="M50 437q45-15 90 0t90 0t90 0t90 0t90 0"
          />
          <path
            className={styles.waveBack}
            d="M85 455q45-15 90 0t90 0t90 0t90 0"
          />
          <path
            className={styles.waveFront}
            d="M120 472q45-10 90 0t90 0t90 0"
            stroke="#7994a0"
            strokeOpacity=".25"
          />
        </g>
        <path
          className={styles.plane}
          d="m452 126 25 17-27 5 4-10z"
          fill="#dfb566"
        />
      </svg>
      <div
        className={`${styles.badge} absolute top-[8%] left-[5%] border border-[#b7a47744] px-3.5 py-2.5 text-[0.54rem] tracking-[0.15em] bg-[#0c2035c9] text-[#d5c092] flex items-center gap-2 rounded-xs`}
      >
        <span
          className={`${styles.statusDot} w-1.5 h-1.5 bg-gold rounded-full inline-block`}
        />{" "}
        CONNECTING POSSIBILITIES
      </div>
      <span className="absolute bottom-[6%] right-[7%] text-[0.55rem] tracking-[0.2em] text-[#95a7b3]">
        APAPA, LAGOS · NIGERIA
      </span>
    </div>
  );
}
