import { randomUUID } from 'node:crypto';
/**
 * ============================================================================
 * NASA SPACE APPS CHALLENGE - 3D HOLOGRAPHIC MEDICAL BAY
 * MODULE: Local Storage & Mock Database Integration Layer
 * AUTHOR: Saad (Backend, State Management & Data Integration Engineer)
 * ============================================================================
 *
 * DESCRIPTION:
 * Universal persistence layer that saves:
 * 1. Daily Astronaut Mood & Stress Check-in logs
 * 2. Exercise & Musculoskeletal countermeasure logs (ARED, Treadmill)
 * 3. SANS (Spaceflight-Associated Neuro-ocular Syndrome) self-assessment history
 * 4. Sleep logs & Circadian scores
 * 5. Historical Radiation logs & Emergency incident archives
 *
 * Works seamlessly in Browser (localStorage) and in Node.js environment.
 */

export class StorageService {
  constructor() {
    this.memoryStore = {
      astronautProfile: {
        id: 'ASTRO-01',
        name: 'Commander Alex Vance',
        mission: 'Artemis VII - Deep Space Transit',
        missionDay: 85,
        bloodType: 'O-Negative',
        age: 38
      },
      moodLogs: [],
      exerciseLogs: [],
      sansAssessments: [],
      sleepLogs: [],
      emergencyEvents: []
    };

    // Load initial data from browser localStorage if available
    this._loadFromStorage();
  }

  _isBrowser() {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  _loadFromStorage() {
    if (!this._isBrowser()) return;
    try {
      const saved = window.localStorage.getItem('NASA_MEDBAY_STORE');
      if (saved) {
        this.memoryStore = { ...this.memoryStore, ...JSON.parse(saved) };
      }
    } catch (err) {
      console.warn('Could not read from localStorage, using memory store:', err);
    }
  }

  _saveToStorage() {
    if (!this._isBrowser()) return;
    try {
      window.localStorage.setItem('NASA_MEDBAY_STORE', JSON.stringify(this.memoryStore));
    } catch (err) {
      console.warn('Could not write to localStorage:', err);
    }
  }

  // --- ASTRONAUT PROFILE ---
  getProfile() {
    return { ...this.memoryStore.astronautProfile };
  }

  updateProfile(profileData) {
    this.memoryStore.astronautProfile = {
      ...this.memoryStore.astronautProfile,
      ...profileData
    };
    this._saveToStorage();
    return this.getProfile();
  }

  // --- MOOD & PSYCHOLOGICAL LOGS ---
  saveMoodLog(log) {
    const entry = {
      id: 'MOOD_' + randomUUID(),
      timestamp: new Date().toISOString(),
      moodScore: log.moodScore ?? 7, // 1 - 10
      stressScore: log.stressScore ?? 3, // 1 - 10
      notes: log.notes || '',
      isolationCopingStatus: (log.stressScore ?? 3) > 7 ? 'High Stress' : 'Resilient'
    };
    this.memoryStore.moodLogs.unshift(entry);
    this._saveToStorage();
    return entry;
  }

  getMoodLogs() {
    return [...this.memoryStore.moodLogs];
  }

  // --- EXERCISE & COUNTERMEASURES LOGS ---
  saveExerciseLog(log) {
    const entry = {
      id: 'EX_' + randomUUID(),
      timestamp: new Date().toISOString(),
      type: log.type || 'ARED', // 'ARED' | 'T2_TREADMILL' | 'CYCLE'
      durationMin: log.durationMin ?? 45,
      intensityPercent: log.intensityPercent ?? 85,
      caloriesBurned: log.caloriesBurned ?? 420
    };
    this.memoryStore.exerciseLogs.unshift(entry);
    this._saveToStorage();
    return entry;
  }

  getExerciseLogs() {
    return [...this.memoryStore.exerciseLogs];
  }

  // --- SANS ASSESSMENTS ---
  saveSANSAssessment(assessment) {
    const entry = {
      id: 'SANS_' + randomUUID(),
      timestamp: new Date().toISOString(),
      ...assessment
    };
    this.memoryStore.sansAssessments.unshift(entry);
    this._saveToStorage();
    return entry;
  }

  getSANSAssessments() {
    return [...this.memoryStore.sansAssessments];
  }

  // --- SLEEP LOGS ---
  saveSleepLog(log) {
    const entry = {
      id: 'SLEEP_' + randomUUID(),
      timestamp: new Date().toISOString(),
      ...log
    };
    this.memoryStore.sleepLogs.unshift(entry);
    this._saveToStorage();
    return entry;
  }

  getSleepLogs() {
    return [...this.memoryStore.sleepLogs];
  }

  // --- EMERGENCY INCIDENTS ---
  logEmergencyIncident(incident) {
    const entry = {
      id: 'EMERGENCY_' + randomUUID(),
      timestamp: new Date().toISOString(),
      ...incident
    };
    this.memoryStore.emergencyEvents.unshift(entry);
    this._saveToStorage();
    return entry;
  }

  getEmergencyIncidents() {
    return [...this.memoryStore.emergencyEvents];
  }

  // --- CLEAR / RESET FOR DEMO ---
  resetStore() {
    this.memoryStore.moodLogs = [];
    this.memoryStore.exerciseLogs = [];
    this.memoryStore.sansAssessments = [];
    this.memoryStore.sleepLogs = [];
    this.memoryStore.emergencyEvents = [];
    if (this._isBrowser()) {
      window.localStorage.removeItem('NASA_MEDBAY_STORE');
    }
    return { success: true, message: 'Store reset successfully' };
  }
}

export const storageService = new StorageService();
export default storageService;
