export default function ReadyState() {
  return (
    <div className="ready-state">
      <div className="ready-visual" aria-hidden="true">
        <svg className="ready-market" viewBox="0 0 260 180" fill="none">
          <path
            d="M14 38H246M14 90H246M14 142H246"
            stroke="currentColor"
            strokeDasharray="3 7"
          />
          <path
            d="M22 135 58 123 88 130 122 88 157 100 197 57 238 67"
            stroke="#668b79"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="22" cy="135" r="3" fill="#668b79" />
          <circle cx="238" cy="67" r="3" fill="#668b79" />
          <path
            d="M34 111v34m0-23v12m192-82v30m0-20v10"
            stroke="#8ea99a"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <div className="ready-brand">
          <img src="/strat.svg" alt="" />
        </div>
      </div>
      <p className="ready-title">Market analysis is ready</p>
      <p className="ready-description">
        Tap Find Trade to explore a sample setup.
      </p>
    </div>
  );
}
