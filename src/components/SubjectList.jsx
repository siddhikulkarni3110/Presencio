import SubjectCard from './SubjectCard';

function SubjectList({ subjects, setSelectedSubject, onDelete, onQuickMark }) {
  const getStats = (attendance, target) => {
    const values = Object.values(attendance);
    const present = values.filter((v) =>
      typeof v === 'object' ? v.status === 'present' : v === 'present'
    ).length;

    const total = values.filter((v) =>
      typeof v === 'object' ? ['present', 'absent'].includes(v.status) : ['present', 'absent'].includes(v)
    ).length;

    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    const needed = percentage < target
      ? Math.ceil((target / 100 * total - present) / ((100 - target) / 100))
      : 0;

    let skippable = 0;
    if (percentage >= target) {
      let x = 0;
      while ((present / (total + x + 1)) >= target / 100) {
        x++;
      }
      skippable = x;
    }

    return { present, total, percentage, needed, skippable };
  };

  const todayKey = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <div>
      {Object.entries(subjects).map(([name, data]) => {
        const stats = getStats(data.attendance, data.target ?? 75);
        return (
          <SubjectCard
            key={name}
            name={name}
            stats={stats}
            onClick={() => setSelectedSubject(name)}
            target={data.target ?? 75}
            onQuickMark={onQuickMark}
          />
        );
      })}
    </div>
  );
}

export default SubjectList;
