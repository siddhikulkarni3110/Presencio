import { useState } from 'react';
import styles from './CalendarView.module.css';

function CalendarView({ subject, data, onUpdate }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getDateKey = (y, m, d) =>
    `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const toggleStatus = (dateKey) => {
    const current = data.attendance[dateKey];
    const currentStatus = typeof current === 'object' ? current.status : current;

    const newStatus =
      currentStatus === 'present' ? 'absent' :
      currentStatus === 'absent' ? null :
      'present';

    onUpdate(subject, dateKey, newStatus ? { status: newStatus, note: "" } : null);
  };

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(month - 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(month + 1);
    setCurrentDate(newDate);
  };

  return (
    <div className={styles.wrapper}>
      <h2>
        {subject} - {currentDate.toLocaleString('default', { month: 'long' })} {year}
      </h2>

      <div className={styles.nav}>
        <button onClick={handlePrevMonth} className={styles.navBtn}>⬅️ Prev</button>
        <button onClick={handleNextMonth} className={styles.navBtn}>Next ➡️</button>
      </div>

      <div className={styles.grid}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className={styles.dayLabel}>{day}</div>
        ))}
        {Array(firstDay).fill().map((_, i) => (
          <div key={`blank-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dateKey = getDateKey(year, month, day);
          const dateObj = new Date(year, month, day);
          const dayOfWeek = dateObj.getDay(); // 0 = Sunday

          // Convert number to weekday string to match AddSubjectForm's format
          const weekdayStr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek];
          const isRecurring = data.recurringDays?.includes(weekdayStr);

          const attendance = data.attendance[dateKey];
          const status = typeof attendance === 'object' ? attendance.status : attendance;

          let cellClass = styles.cell;
          if (status === 'present') cellClass += ` ${styles.present}`;
          else if (status === 'absent') cellClass += ` ${styles.absent}`;
          else if (isRecurring) cellClass += ` ${styles.recurring}`;

          return (
            <div
              key={dateKey}
              className={cellClass}
              onClick={() => toggleStatus(dateKey)}
              title={isRecurring ? 'Recurring class (click to mark)' : ''}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CalendarView;
