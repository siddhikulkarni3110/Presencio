import { useState, useEffect } from 'react';
import styles from './AddSubjectForm.module.css';

function AddSubjectForm({ onAdd, edit = false, defaultValues = {} }) {
  const [name, setName] = useState(defaultValues.name || '');
  const [target, setTarget] = useState(defaultValues.target || 75);
  const [recurringDays, setRecurringDays] = useState(defaultValues.recurringDays || []);

  useEffect(() => {
    if (edit) {
      setName(defaultValues.name || '');
      setTarget(defaultValues.target || 75);
      setRecurringDays(defaultValues.recurringDays || []);
    }
  }, [edit, defaultValues]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name, recurringDays, parseInt(target));
    setName('');
    setTarget(75);
    setRecurringDays([]);
  };

  const toggleDay = (day) => {
    setRecurringDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  };

  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>{edit ? '✏️ Edit Subject' : '➕ Add New Subject'}</h2>

      <label>Subject Name:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Physics"
        required
      />

      <label>Attendance Target %:</label>
      <input
        type="number"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        min="1"
        max="100"
        required
      />

      <label>Recurring Days:</label>
      <div className={styles.days}>
        {weekdays.map((day) => (
          <button
            key={day}
            type="button"
            className={`${styles.dayBtn} ${recurringDays.includes(day) ? styles.active : ''}`}
            onClick={() => toggleDay(day)}
          >
            {day}
          </button>
        ))}
      </div>

      <button type="submit" className={styles.submitBtn}>
        {edit ? '✅ Save Changes' : '➕ Add Subject'}
      </button>
    </form>
  );
}

export default AddSubjectForm;
