import styles from './SubjectCard.module.css';

function SubjectCard({ name, stats, onClick, target, onQuickMark }) {
  const { present, total, percentage, needed, skippable } = stats;

  let cardStyle = styles.card;
  if (total > 0 && percentage < target) {
    cardStyle += ` ${styles.redBorder}`;
  } else if (total > 0 && percentage >= target && skippable === 0) {
    cardStyle += ` ${styles.yellowBorder}`;
  } else if (total > 0 && percentage >= target && skippable > 0) {
    cardStyle += ` ${styles.greenBorder}`;
  }

  return (
    <div className={cardStyle} onClick={onClick} style={{ position: 'relative' }}>
      <h3>{name}</h3>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <p style={{ margin: 0 }}>
          Present: {present} / {total} ({percentage}%)
        </p>
        {onQuickMark && (
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              aria-label="Mark present"
              style={{
                background: '#c8f7c5',
                color: '#7c6f57',
                border: 'none',
                borderRadius: '50%',
                width: 30,
                height: 30,
                fontSize: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontWeight: 700,
                boxShadow: '0 1px 2px #c8f7c533',
                transition: 'background 0.18s',
                lineHeight: 1.1,
                padding: 0,
              }}
              onClick={e => { e.stopPropagation(); onQuickMark(name, 'present'); }}
            >
              ✔️
            </button>
            <button
              aria-label="Mark absent"
              style={{
                background: '#f7c5c5',
                color: '#7c6f57',
                border: 'none',
                borderRadius: '50%',
                width: 30,
                height: 30,
                fontSize: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontWeight: 700,
                boxShadow: '0 1px 2px #f7c5c533',
                transition: 'background 0.18s',
                lineHeight: 1.1,
                padding: 0,
              }}
              onClick={e => { e.stopPropagation(); onQuickMark(name, 'absent'); }}
            >
              ❌
            </button>
          </div>
        )}
      </div>

      {total > 0 && percentage < target && (
        <p className={styles.warning}>
          Attend <strong>{needed}</strong> more to reach {target}%
        </p>
      )}

      {total > 0 && percentage >= target && (
        skippable > 0 ? (
          <p className={styles.safe}>
            You can skip <strong>{skippable}</strong> lecture(s)
          </p>
        ) : (
          <p className={styles.warning}>
            You should not skip the next lecture
          </p>
        )
      )}
    </div>
  );
}

export default SubjectCard;
