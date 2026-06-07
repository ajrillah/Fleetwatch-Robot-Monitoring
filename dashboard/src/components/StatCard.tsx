interface StatCardProps {
  label: string;
  value: number | string;
  color?: string;
  suffix?: string;
}

export function StatCard({ label, value, color = "var(--accent)", suffix }: StatCardProps) {
  return (
    <div className="stat-card">
      {/* <div className="stat-card__icon" style={{ color }}>
        <Icon size={18} />
      </div> */}
      <div className="stat-card__body">
        <div className="stat-card__value" style={{ color }}>
          {value}
          {suffix && <span className="stat-card__suffix">{suffix}</span>}
        </div>
        <div className="stat-card__label">{label}</div>
      </div>
    </div>
  );
}
