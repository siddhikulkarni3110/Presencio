import { useState, useEffect } from 'react';

const DEFAULT_PROFILE = 'Profile 1';

export default function useSubjects() {
  const [profiles, setProfiles] = useState(() => {
    const stored = localStorage.getItem('attendance_profiles');
    return stored ? JSON.parse(stored) : { [DEFAULT_PROFILE]: {} };
  });

  // Load currentProfile from localStorage, fallback to DEFAULT_PROFILE or first available
  const getInitialProfile = (profilesObj) => {
    const storedProfile = localStorage.getItem('attendance_currentProfile');
    if (storedProfile && profilesObj[storedProfile]) return storedProfile;
    const keys = Object.keys(profilesObj);
    return keys.length > 0 ? keys[0] : DEFAULT_PROFILE;
  };

  const [currentProfile, setCurrentProfileState] = useState(() => getInitialProfile(
    (() => {
      const stored = localStorage.getItem('attendance_profiles');
      return stored ? JSON.parse(stored) : { [DEFAULT_PROFILE]: {} };
    })()
  ));

  // Keep currentProfile in sync with localStorage
  useEffect(() => {
    localStorage.setItem('attendance_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('attendance_currentProfile', currentProfile);
  }, [currentProfile]);

  // When profiles change, ensure currentProfile is valid
  useEffect(() => {
    if (!profiles[currentProfile]) {
      const keys = Object.keys(profiles);
      if (keys.length > 0) {
        setCurrentProfileState(keys[0]);
      } else {
        setCurrentProfileState(DEFAULT_PROFILE);
      }
    }
  }, [profiles]);

  const setCurrentProfile = (profile) => {
    setCurrentProfileState(profile);
  };

  const subjects = profiles[currentProfile] || {};

  const setSubjects = (newSubjects) => {
    setProfiles((prev) => ({
      ...prev,
      [currentProfile]: newSubjects,
    }));
  };

  const addProfile = (name) => {
    const trimmed = name.trim();
    if (!trimmed || profiles[trimmed]) return false;
    setProfiles((prev) => ({ ...prev, [trimmed]: {} }));
    setCurrentProfile(trimmed);
    return true;
  };

  const deleteProfile = (name) => {
    if (Object.keys(profiles).length === 1) return false;
    const updated = { ...profiles };
    delete updated[name];
    setProfiles(updated);
    // If deleted profile was current, switch to first available
    if (currentProfile === name) {
      const keys = Object.keys(updated);
      setCurrentProfile(keys.length > 0 ? keys[0] : DEFAULT_PROFILE);
    }
    return true;
  };

  const addSubject = (name, recurringDays, target) => {
    const trimmed = name.trim();
    if (!trimmed || subjects[trimmed]) return;
    setSubjects({
      ...subjects,
      [trimmed]: {
        recurringDays,
        target,
        attendance: {},
      },
    });
  };

  const editSubject = (oldName, newName, newDays, newTarget) => {
    const trimmedNew = newName.trim();
    if (!trimmedNew) return;
    const updated = { ...subjects };
    const subjectData = updated[oldName];

    if (oldName !== trimmedNew) {
      updated[trimmedNew] = {
        ...subjectData,
        recurringDays: newDays,
        target: newTarget,
      };
      delete updated[oldName];
    } else {
      updated[trimmedNew] = {
        ...subjectData,
        recurringDays: newDays,
        target: newTarget,
      };
    }
    setSubjects(updated);
  };

  const updateAttendance = (subject, date, data) => {
    const updated = { ...subjects };
    if (data) {
      updated[subject].attendance[date] = data;
    } else {
      delete updated[subject].attendance[date];
    }
    setSubjects(updated);
  };

  const deleteSubject = (subjectName) => {
    const updated = { ...subjects };
    delete updated[subjectName];
    setSubjects(updated);
  };

  return {
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
  };
} 