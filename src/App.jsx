import { useState } from 'react';
import styles from './App.module.css';
import AddSubjectForm from './components/AddSubjectForm';
import SubjectList from './components/SubjectList';
import CalendarView from './components/CalendarView';
import Modal from './components/Modal';
import useSubjects from './hooks/useSubjects';
import Header from './components/Header';

function App() {
  const {
    profiles,
    currentProfile,
    setCurrentProfile,
    addProfile,
    deleteProfile,
    subjects,
    addSubject,
    editSubject,
    updateAttendance,
    deleteSubject,
  } = useSubjects();

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [editSubjectName, setEditSubjectName] = useState(null);

  const confirmDeleteSubject = (subjectName) => {
    setConfirmDelete(subjectName);
  };

  const handleQuickMark = (subject, status) => {
    const d = new Date();
    const todayKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    updateAttendance(subject, todayKey, { status, note: '' });
  };

  return (
    <>
      <Header
        profiles={profiles}
        currentProfile={currentProfile}
        setCurrentProfile={setCurrentProfile}
        addProfile={addProfile}
        deleteProfile={deleteProfile}
      />

      {/* ADD SUBJECT BUTTON */}
      <button onClick={() => setIsAddFormOpen(true)} className={styles.addBtn}>
        ➕ Add Subject
      </button>

      {/* SUBJECT LIST */}
      <div style={{ width: '100%', maxWidth: 600, margin: '0 auto' }}>
        <SubjectList
          subjects={subjects}
          setSelectedSubject={setSelectedSubject}
          onDelete={confirmDeleteSubject}
          onQuickMark={handleQuickMark}
        />
      </div>

      {/* CALENDAR + EDIT/DELETE MODAL */}
      <Modal isOpen={!!selectedSubject} onClose={() => setSelectedSubject(null)}>
        {selectedSubject && (
          <div>
            <CalendarView
              subject={selectedSubject}
              data={subjects[selectedSubject]}
              onUpdate={updateAttendance}
              onClose={() => setSelectedSubject(null)}
            />
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  setEditSubjectName(selectedSubject);
                  setIsEditFormOpen(true);
                  setSelectedSubject(null);
                }}
                className={`${styles.actionBtn} ${styles.editBtn}`}
              >
                ✏️ Edit Subject
              </button>

              <button
                onClick={() => {
                  setConfirmDelete(selectedSubject);
                  setSelectedSubject(null);
                }}
                className={`${styles.actionBtn} ${styles.deleteBtn}`}
              >
                🗑️ Delete Subject
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
        <h2>🛑 Are you sure?</h2>
        <p>
          You’re about to delete <strong>{confirmDelete}</strong> and all its attendance data. This action cannot be undone.
        </p>
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              deleteSubject(confirmDelete);
              if (selectedSubject === confirmDelete) setSelectedSubject(null);
              setConfirmDelete(null);
            }}
            className={`${styles.actionBtn} ${styles.deleteBtn}`}
          >
            Delete
          </button>
          <button
            onClick={() => setConfirmDelete(null)}
            className={styles.actionBtn}
            style={{ background: '#f2d6c2', color: '#7c6f57' }}
          >
            Cancel
          </button>
        </div>
      </Modal>

      {/* ADD SUBJECT MODAL */}
      <Modal isOpen={isAddFormOpen} onClose={() => setIsAddFormOpen(false)}>
        <AddSubjectForm
          onAdd={(name, days, target) => {
            addSubject(name, days, target);
            setIsAddFormOpen(false);
          }}
        />
      </Modal>

      {/* EDIT SUBJECT MODAL */}
      <Modal isOpen={isEditFormOpen} onClose={() => setIsEditFormOpen(false)}>
        {editSubjectName && (
          <AddSubjectForm
            edit
            defaultValues={{
              name: editSubjectName,
              target: subjects[editSubjectName]?.target,
              recurringDays: subjects[editSubjectName]?.recurringDays,
            }}
            onAdd={(newName, newDays, newTarget) => {
              editSubject(editSubjectName, newName, newDays, newTarget);
              setIsEditFormOpen(false);
              setEditSubjectName(null);
            }}
          />
        )}
      </Modal>
    </>
  );
}

export default App;
