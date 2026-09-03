import { useState, useEffect } from 'react';

export interface PriorityTask {
  title: string;
  reason: string;
  impact: string;
  explanation: string;
  status: 'pending' | 'active' | 'completed';
}

export interface Recommendation {
  id: string;
  topic: string;
  basedOn: string[];
  impact: string;
  added: boolean;
}

export interface ActivityItem {
  id: string;
  text: string;
  timestamp: string;
  type: 'task' | 'mentor' | 'opportunity' | 'roadmap';
}

export interface StudentState {
  careerGoal: string;
  cgpa: number;
  attendance: number;
  courses: { active: number; total: number };
  tasks: { total: number; pending: number; completed: number };
  progress: number;
  opportunities: number;
  skills: { name: string; score: number }[];
  todayPriority: PriorityTask;
  recommendations: Recommendation[];
  recentActivity: ActivityItem[];
  syncStatus: 'synced' | 'updating' | 'updated';
  activeProgressStage: 'LEARN' | 'PRACTICE' | 'BUILD' | 'GROW';
  learningStatus: 'RECOMMENDED' | 'IN PROGRESS' | 'COMPLETED';
  evidenceStatus: 'Not Started' | 'In Progress' | 'Submitted' | 'Verified';
  sequenceOptimized: boolean;
  projectedProgress?: number;
  lastDeltas?: { roadmapDelta: string; skillDelta: string; taskDelta: string };
}

const CAREER_PRIORITIES: Record<string, { priority: PriorityTask; rec: Recommendation }> = {
  'AI Research Engineer': {
    priority: {
      title: 'Complete PyTorch Module 3',
      reason: 'Highest-impact action for your selected career goal.',
      impact: '+4% Career Readiness',
      explanation: 'PyTorch is currently one of your largest skill gaps for the AI Research Engineer pathway. Completing this module is expected to improve your neural network implementation proficiency.',
      status: 'pending'
    },
    rec: {
      id: 'rec-1',
      topic: 'Focus on PyTorch & Transformer Architectures',
      basedOn: ['current skill gaps', 'selected career goal', 'roadmap progress'],
      impact: '+4% career readiness',
      added: false
    }
  },
  'ML Engineer': {
    priority: {
      title: 'Strengthen System Design & MLOps',
      reason: 'Highest-impact action for ML Engineering deployment.',
      impact: '+5% Career Readiness',
      explanation: 'Production model serving and pipeline monitoring are key requirements for ML Engineering roles. Completing this section strengthens model deployment confidence.',
      status: 'pending'
    },
    rec: {
      id: 'rec-2',
      topic: 'Focus on MLOps & Model Serving Pipelines',
      basedOn: ['production skill gaps', 'selected career goal', 'deployment specs'],
      impact: '+5% career readiness',
      added: false
    }
  },
  'Software Engineer': {
    priority: {
      title: 'Complete DSA Practice Set',
      reason: 'Highest-impact action for Systems & Core Software Engineering.',
      impact: '+6% Career Readiness',
      explanation: 'Advanced Data Structures, Graph Algorithms, and System Architecture form the foundation for software engineering placement benchmarks.',
      status: 'pending'
    },
    rec: {
      id: 'rec-3',
      topic: 'Focus on Distributed Systems & Core DSA',
      basedOn: ['algorithmic speed', 'selected career goal', 'technical interview matrix'],
      impact: '+6% career readiness',
      added: false
    }
  },
  'Data Scientist': {
    priority: {
      title: 'Complete SQL + Statistics Module',
      reason: 'Highest-impact action for Data Science & Analytics.',
      impact: '+4% Career Readiness',
      explanation: 'Complex SQL queries and inferential statistics are the core requirements for data science case studies and analytical decision-making.',
      status: 'pending'
    },
    rec: {
      id: 'rec-4',
      topic: 'Focus on Inferential Statistics & Data Modeling',
      basedOn: ['statistical gaps', 'selected career goal', 'analytics benchmarks'],
      impact: '+4% career readiness',
      added: false
    }
  }
};

let currentState: StudentState = {
  careerGoal: 'AI Research Engineer',
  cgpa: 8.92,
  attendance: 86.4,
  courses: { active: 6, total: 6 },
  tasks: { total: 15, pending: 12, completed: 3 },
  progress: 75,
  opportunities: 8,
  skills: [
    { name: 'Python', score: 92 },
    { name: 'Data Structures', score: 88 },
    { name: 'PyTorch', score: 64 },
    { name: 'System Design', score: 70 }
  ],
  todayPriority: CAREER_PRIORITIES['AI Research Engineer'].priority,
  recommendations: [CAREER_PRIORITIES['AI Research Engineer'].rec],
  recentActivity: [
    { id: 'act-1', text: 'Completed DSA Practice Set', timestamp: 'Today, 6:42 PM', type: 'task' },
    { id: 'act-2', text: 'Started PyTorch Module 3', timestamp: 'Today, 5:18 PM', type: 'task' },
    { id: 'act-3', text: 'Mentor feedback logged by Prof. S. Kulkarni', timestamp: 'Yesterday', type: 'mentor' }
  ],
  syncStatus: 'synced',
  activeProgressStage: 'LEARN',
  learningStatus: 'RECOMMENDED',
  evidenceStatus: 'In Progress',
  sequenceOptimized: false
};

const listeners = new Set<(state: StudentState) => void>();

function notify() {
  listeners.forEach(cb => cb({ ...currentState }));
}

function triggerSyncAnimation() {
  currentState.syncStatus = 'updating';
  notify();
  setTimeout(() => {
    currentState.syncStatus = 'updated';
    notify();
    setTimeout(() => {
      currentState.syncStatus = 'synced';
      notify();
    }, 2000);
  }, 600);
}

export const studentStore = {
  getState: () => ({ ...currentState }),
  
  subscribe: (callback: (state: StudentState) => void) => {
    listeners.add(callback);
    callback({ ...currentState });
    return () => {
      listeners.delete(callback);
    };
  },

  setCareerGoal: (goal: string) => {
    currentState.careerGoal = goal;
    if (CAREER_PRIORITIES[goal]) {
      currentState.todayPriority = { ...CAREER_PRIORITIES[goal].priority };
      currentState.recommendations = [{ ...CAREER_PRIORITIES[goal].rec }];
    } else {
      // Fallback for custom goals
      currentState.todayPriority = {
        title: 'Complete your next roadmap milestone',
        reason: `Highest-impact action for your custom goal: ${goal}`,
        impact: '+2% Career Readiness',
        explanation: 'Continue following your personalized action plan to make progress on your goal.',
        status: 'pending'
      };
      currentState.recommendations = [{
        id: `rec-custom-${Date.now()}`,
        topic: `Focus on fundamentals for ${goal}`,
        basedOn: ['custom goal selection', 'general readiness'],
        impact: '+2% career readiness',
        added: false
      }];
    }
    triggerSyncAnimation();
  },

  startPriorityTask: () => {
    if (currentState.todayPriority.status === 'completed') return;
    currentState.todayPriority.status = 'active';
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    currentState.recentActivity = [
      {
        id: Date.now().toString(),
        text: `Started ${currentState.todayPriority.title}`,
        timestamp: `Today, ${timeStr}`,
        type: 'task'
      },
      ...currentState.recentActivity
    ];
    triggerSyncAnimation();
  },

  completePriorityTask: () => {
    if (currentState.todayPriority.status === 'completed') return;
    currentState.todayPriority.status = 'completed';
    currentState.tasks.pending = Math.max(0, currentState.tasks.pending - 1);
    currentState.tasks.completed += 1;
    currentState.progress = Math.min(100, currentState.progress + 4);
    
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    currentState.recentActivity = [
      {
        id: Date.now().toString(),
        text: `Completed ${currentState.todayPriority.title}`,
        timestamp: `Today, ${timeStr}`,
        type: 'task'
      },
      ...currentState.recentActivity
    ];

    window.dispatchEvent(
      new CustomEvent('campus-toast', {
        detail: {
          title: 'Task Completed',
          message: 'Task completed. Your roadmap has been updated.',
          type: 'success'
        }
      })
    );

    triggerSyncAnimation();
  },

  applyOpportunity: () => {
    currentState.opportunities = Math.max(0, currentState.opportunities - 1);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    currentState.recentActivity = [
      {
        id: Date.now().toString(),
        text: 'Applied for AI Research Internship',
        timestamp: `Today, ${timeStr}`,
        type: 'opportunity'
      },
      ...currentState.recentActivity
    ];

    window.dispatchEvent(
      new CustomEvent('campus-toast', {
        detail: {
          title: 'Application Submitted',
          message: 'Opportunity application saved to your profile.',
          type: 'success'
        }
      })
    );

    triggerSyncAnimation();
  },

  applyFuturePlan: (plan: { actionNames: string[]; projectedProgress: number; primaryAction: string }) => {
    currentState.projectedProgress = plan.projectedProgress;
    currentState.progress = Math.min(100, plan.projectedProgress);
    currentState.tasks.pending = Math.max(1, currentState.tasks.pending - 1);
    currentState.tasks.completed += 1;
    currentState.lastDeltas = {
      roadmapDelta: '+4% roadmap progress',
      skillDelta: '+6% PyTorch proficiency',
      taskDelta: '1 task completed'
    };

    currentState.todayPriority = {
      title: plan.primaryAction,
      reason: `Action part of your Future Simulator plan (${plan.actionNames.length} selected items).`,
      impact: `+${Math.min(25, plan.actionNames.length * 4)}% Career Readiness`,
      explanation: `Selected action "${plan.primaryAction}" is identified by AI Future Simulator as your highest impact next step.`,
      status: 'active'
    };

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    currentState.recentActivity = [
      {
        id: Date.now().toString(),
        text: `Applied Future Plan: ${plan.primaryAction}`,
        timestamp: `Today, ${timeStr}`,
        type: 'roadmap'
      },
      ...currentState.recentActivity
    ];

    window.dispatchEvent(
      new CustomEvent('campus-toast', {
        detail: {
          title: 'Future Plan Active',
          message: 'Future plan added to your roadmap.',
          type: 'success'
        }
      })
    );

    triggerSyncAnimation();
  },

  startRecommendedLearning: () => {
    currentState.learningStatus = 'IN PROGRESS';
    currentState.progress = Math.min(100, currentState.progress + 3);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    currentState.recentActivity = [
      {
        id: Date.now().toString(),
        text: 'Started Deep Learning Specialization Module',
        timestamp: `Today, ${timeStr}`,
        type: 'roadmap'
      },
      ...currentState.recentActivity
    ];
    window.dispatchEvent(
      new CustomEvent('campus-toast', {
        detail: {
          title: 'Learning Started',
          message: 'Module is now IN PROGRESS. Roadmap updated.',
          type: 'success'
        }
      })
    );
    triggerSyncAnimation();
  },

  updateEvidenceStatus: (status: 'Not Started' | 'In Progress' | 'Submitted' | 'Verified') => {
    currentState.evidenceStatus = status;
    if (status === 'Verified' || status === 'Submitted') {
      currentState.progress = Math.min(100, currentState.progress + 4);
    }
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    currentState.recentActivity = [
      {
        id: Date.now().toString(),
        text: `Updated Capstone Evidence to "${status}"`,
        timestamp: `Today, ${timeStr}`,
        type: 'roadmap'
      },
      ...currentState.recentActivity
    ];
    window.dispatchEvent(
      new CustomEvent('campus-toast', {
        detail: {
          title: 'Project Evidence Updated',
          message: `Evidence status set to ${status}.`,
          type: 'success'
        }
      })
    );
    triggerSyncAnimation();
  },

  applySequenceOptimization: () => {
    currentState.sequenceOptimized = true;
    currentState.progress = Math.min(100, currentState.progress + 2);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    currentState.recentActivity = [
      {
        id: Date.now().toString(),
        text: 'Applied AI Recommended Roadmap Sequence',
        timestamp: `Today, ${timeStr}`,
        type: 'roadmap'
      },
      ...currentState.recentActivity
    ];
    window.dispatchEvent(
      new CustomEvent('campus-toast', {
        detail: {
          title: 'Sequence Optimized',
          message: 'AI recommended sequence order applied to your roadmap.',
          type: 'success'
        }
      })
    );
    triggerSyncAnimation();
  },

  addRecommendationToRoadmap: (recId: string) => {
    currentState.recommendations = currentState.recommendations.map(r => 
      r.id === recId ? { ...r, added: true } : r
    );
    const rec = currentState.recommendations.find(r => r.id === recId);
    const topic = rec ? rec.topic : 'Recommendation';

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    currentState.recentActivity = [
      {
        id: Date.now().toString(),
        text: `Added "${topic}" to Roadmap`,
        timestamp: `Today, ${timeStr}`,
        type: 'roadmap'
      },
      ...currentState.recentActivity
    ];

    window.dispatchEvent(
      new CustomEvent('campus-toast', {
        detail: {
          title: 'Roadmap Updated',
          message: 'Roadmap updated with AI Recommendation.',
          type: 'success'
        }
      })
    );

    triggerSyncAnimation();
  },

  setProgressStage: (stage: 'LEARN' | 'PRACTICE' | 'BUILD' | 'GROW') => {
    currentState.activeProgressStage = stage;
    notify();
  }
};

// Global listener for career goal change events from Update 1
if (typeof window !== 'undefined') {
  window.addEventListener('career-goal-changed', (e: Event) => {
    const customEvent = e as CustomEvent<{ goal: string }>;
    if (customEvent.detail && customEvent.detail.goal) {
      studentStore.setCareerGoal(customEvent.detail.goal);
    }
  });
}

export function useStudentState(): StudentState {
  const [state, setState] = useState<StudentState>(studentStore.getState());
  useEffect(() => {
    return studentStore.subscribe(setState);
  }, []);
  return state;
}
