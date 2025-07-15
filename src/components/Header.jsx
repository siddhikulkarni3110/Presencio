import { useState, useRef, useEffect } from 'react';
import styles from './Header.module.css';

function Header({ profiles, currentProfile, setCurrentProfile, addProfile, deleteProfile }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAddProfileModalOpen, setIsAddProfileModalOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const profileRef = useRef(null);

  useEffect(() => {
    if (!isDropdownOpen) return;
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  const handleProfileClick = () => {
    setIsDropdownOpen((open) => !open);
  };

  const handleProfileSelect = (profile) => {
    setCurrentProfile(profile);
    setIsDropdownOpen(false);
  };

  const handleAddProfile = () => {
    if (addProfile(newProfileName)) {
      setIsAddProfileModalOpen(false);
      setNewProfileName('');
      setIsDropdownOpen(false);
    }
  };

  const handleDeleteProfile = (profile) => {
    deleteProfile(profile);
    setIsDropdownOpen(false);
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.heading}>Attendance Manager</h1>
      <div className={styles.profileWrapper} ref={profileRef}>
        <button
          aria-label="Profile menu"
          onClick={handleProfileClick}
          className={styles.profileCircle}
        >
          {currentProfile[0]?.toUpperCase() || '?'}
        </button>
        {isDropdownOpen && (
          <div className={styles.dropdown}>
            {Object.keys(profiles).map((profile) => (
              <div key={profile} className={styles.dropdownRow}>
                <button
                  onClick={() => handleProfileSelect(profile)}
                  className={
                    profile === currentProfile
                      ? `${styles.dropdownBtn} ${styles.active}`
                      : styles.dropdownBtn
                  }
                >
                  {profile}
                </button>
                {Object.keys(profiles).length > 1 && (
                  <button
                    aria-label={`Delete profile ${profile}`}
                    onClick={() => handleDeleteProfile(profile)}
                    className={styles.deleteBtn}
                  >
                    🗑️
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => {
                setIsAddProfileModalOpen(true);
                setIsDropdownOpen(false);
              }}
              className={styles.addProfileBtn}
            >
              + New Profile
            </button>
          </div>
        )}
        {/* Add Profile Modal */}
        {isAddProfileModalOpen && (
          <div className={styles.modalBackdrop}>
            <div className={styles.modalBox}>
              <h2 className={styles.modalTitle}>New Profile</h2>
              <p className={styles.modalText}>Enter a name for the new profile:</p>
              <input
                type="text"
                placeholder="e.g. John, Roommate"
                value={newProfileName}
                onChange={e => setNewProfileName(e.target.value)}
                className={styles.modalInput}
              />
              <div className={styles.modalActions}>
                <button
                  onClick={handleAddProfile}
                  className={styles.modalCreateBtn}
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setIsAddProfileModalOpen(false);
                    setNewProfileName('');
                  }}
                  className={styles.modalCancelBtn}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header; 