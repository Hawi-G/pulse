export const useBadges = () => {
  const badges = ref([
    {
      id: 'intern',
      name: 'Intern',
      description: '3-day streak',
      icon: '🩺',
      unlocked: false,
      requirement: { type: 'streak', value: 3 }
    },
    {
      id: 'resident',
      name: 'Resident',
      description: '7-day streak',
      icon: '👨‍⚕️',
      unlocked: false,
      requirement: { type: 'streak', value: 7 }
    },
    {
      id: 'consultant',
      name: 'Consultant',
      description: '30-day streak',
      icon: '⚕️',
      unlocked: false,
      requirement: { type: 'streak', value: 30 }
    },
    {
      id: 'chief-surgeon',
      name: 'Chief Surgeon',
      description: '100 Pomodoros',
      icon: '🏆',
      unlocked: false,
      requirement: { type: 'sessions', value: 100 }
    }
  ]);

  const loadBadges = () => {
    if (process.client) {
      const saved = localStorage.getItem('badges');
      if (saved) {
        const savedBadges = JSON.parse(saved);
        badges.value = badges.value.map(badge => {
          const savedBadge = savedBadges.find(b => b.id === badge.id);
          return savedBadge ? { ...badge, unlocked: savedBadge.unlocked } : badge;
        });
      }
    }
  };

  const saveBadges = () => {
    if (process.client) {
      localStorage.setItem('badges', JSON.stringify(badges.value));
    }
  };

  const checkAndUnlockBadges = (currentStreak, totalSessions) => {
    let newUnlocks = [];

    badges.value.forEach(badge => {
      if (!badge.unlocked) {
        if (badge.requirement.type === 'streak' && currentStreak >= badge.requirement.value) {
          badge.unlocked = true;
          newUnlocks.push(badge.name);
        } else if (badge.requirement.type === 'sessions' && totalSessions >= badge.requirement.value) {
          badge.unlocked = true;
          newUnlocks.push(badge.name);
        }
      }
    });

    if (newUnlocks.length > 0) {
      saveBadges();
    }

    return newUnlocks;
  };

  onMounted(() => {
    loadBadges();
  });

  return {
    badges: computed(() => badges.value),
    unlockedBadges: computed(() => badges.value.filter(b => b.unlocked)),
    checkAndUnlockBadges,
    loadBadges
  };
};
