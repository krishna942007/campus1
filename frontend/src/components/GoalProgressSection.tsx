import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { studentGoalsApi } from '../services/api';
import { studentStore } from '../services/studentStateStore';
import {
  Target,
  CheckCircle2,
  Clock,
  ChevronRight,
  GraduationCap,
  Code2,
  Zap,
  BookOpen,
  Briefcase,
  Sparkles,
  Layers,
  CheckSquare,
  AlertCircle,
  ArrowDown,
  Plus,
  Loader2
} from 'lucide-react';

export interface GoalStep {
  id: string;
  title: string;
  percentage: number; // 0 to 100
  status: 'completed' | 'in_progress' | 'not_started';
  completedActivities: string[];
  remainingTasks: string[];
}

export interface GoalDefinition {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  monthlyDelta: number; // e.g. 7.4
  isCustom?: boolean;
  source?: 'prototype' | 'database';
  steps: GoalStep[];
}

export const INITIAL_GOALS: GoalDefinition[] = [
  {
    id: 'tcs_placement',
    title: 'TCS Placement',
    icon: Briefcase,
    monthlyDelta: 7.4,
    steps: [
      {
        id: 'academic_foundation',
        title: 'Academic Foundation',
        percentage: 100,
        status: 'completed',
        completedActivities: [
          'Maintained 8.92 CGPA (Above 60% requirement)',
          'Zero active backlogs verified',
          'Academic transcripts synced from VIT ERP'
        ],
        remainingTasks: []
      },
      {
        id: 'dsa_prep',
        title: 'DSA Preparation',
        percentage: 78,
        status: 'in_progress',
        completedActivities: [
          '42 LeetCode array & string practice problems',
          '2 Data Structures modules completed',
          '1 timed coding mock test cleared'
        ],
        remainingTasks: [
          'Graph algorithms (BFS / DFS traversals)',
          'Dynamic Programming 1D arrays'
        ]
      },
      {
        id: 'core_cs',
        title: 'Core CS Preparation',
        percentage: 65,
        status: 'in_progress',
        completedActivities: [
          'DBMS SQL queries lab (100% score)',
          'Operating Systems IPC & Memory Management'
        ],
        remainingTasks: [
          'Computer Networks TCP/IP protocol stack',
          'Object-Oriented Design principles'
        ]
      },
      {
        id: 'projects_portfolio',
        title: 'Projects & Portfolio',
        percentage: 60,
        status: 'in_progress',
        completedActivities: [
          'Capstone API Gateway module built',
          'GitHub repository with documentation'
        ],
        remainingTasks: [
          'Deploy live demo link on Vercel/Render',
          'Add README architecture diagrams'
        ]
      },
      {
        id: 'resume_profile',
        title: 'Resume & Profile',
        percentage: 45,
        status: 'in_progress',
        completedActivities: [
          'ATS-formatted resume V1 drafted',
          'Placement Portal profile initialized'
        ],
        remainingTasks: [
          'Include Capstone project metrics',
          'Faculty mentor approval stamp'
        ]
      },
      {
        id: 'mock_interviews',
        title: 'Mock Interviews',
        percentage: 25,
        status: 'in_progress',
        completedActivities: [
          '1 preliminary System Design interview session'
        ],
        remainingTasks: [
          '2 Technical 1-on-1 mock interviews',
          '1 HR behavioral mock session'
        ]
      },
      {
        id: 'placement_ready',
        title: 'TCS Placement Ready',
        percentage: 0,
        status: 'not_started',
        completedActivities: [],
        remainingTasks: [
          'Final TCS NQT registration',
          'Hall ticket verification'
        ]
      }
    ]
  },
  {
    id: 'academic_goal',
    title: 'Academic Goal',
    icon: GraduationCap,
    monthlyDelta: 5.2,
    steps: [
      {
        id: 'current_sem',
        title: 'Current Semester Enrollment',
        percentage: 100,
        status: 'completed',
        completedActivities: [
          'Registered for 24 semester IV credits',
          'Elective chosen: Advanced AI & Neural Networks'
        ],
        remainingTasks: []
      },
      {
        id: 'assignments_coursework',
        title: 'Assignments & Coursework',
        percentage: 90,
        status: 'completed',
        completedActivities: [
          '14/15 lab assignments submitted on time',
          'Grade A+ in OS & DBMS lab practicals'
        ],
        remainingTasks: [
          'Final AI assignment submission'
        ]
      },
      {
        id: 'internal_assessments',
        title: 'Internal Assessments',
        percentage: 85,
        status: 'completed',
        completedActivities: [
          'Scored 88% aggregate in Mid-Sem exams',
          'Unit Test 1 & 2 cleared with Distinction'
        ],
        remainingTasks: [
          'Internal Assessment 3 preparation'
        ]
      },
      {
        id: 'lab_performance',
        title: 'Lab Performance',
        percentage: 80,
        status: 'in_progress',
        completedActivities: [
          '20/20 score in AI Lab Practical Quiz',
          'DBMS normalization project presentation'
        ],
        remainingTasks: [
          'OS File Systems lab viva voce'
        ]
      },
      {
        id: 'sgpa_improvement',
        title: 'SGPA Target Curve',
        percentage: 75,
        status: 'in_progress',
        completedActivities: [
          'Projected SGPA 9.45 curve maintained'
        ],
        remainingTasks: [
          'Score >90% in End-Sem theory papers'
        ]
      },
      {
        id: 'semester_target',
        title: 'Semester Final Target',
        percentage: 60,
        status: 'in_progress',
        completedActivities: [
          'Faculty mentor academic review completed'
        ],
        remainingTasks: [
          'Complete End-Sem exam series'
        ]
      },
      {
        id: 'academic_achieved',
        title: 'Academic Honor Achieved',
        percentage: 0,
        status: 'not_started',
        completedActivities: [],
        remainingTasks: [
          'Grade card release',
          'Dean List certificate issuance'
        ]
      }
    ]
  },
  {
    id: 'aiml_career',
    title: 'AI/ML Career',
    icon: Sparkles,
    monthlyDelta: 8.9,
    steps: [
      {
        id: 'python_fundamentals',
        title: 'Python Fundamentals',
        percentage: 100,
        status: 'completed',
        completedActivities: [
          'Mastered NumPy, Pandas & Matplotlib',
          'Built custom data analysis scripts'
        ],
        remainingTasks: []
      },
      {
        id: 'math_stats',
        title: 'Mathematics & Statistics',
        percentage: 92,
        status: 'completed',
        completedActivities: [
          'Linear Algebra, Matrix Calculus & Probability',
          'Stanford CS229 Math modules'
        ],
        remainingTasks: [
          'Bayesian inference deep-dive'
        ]
      },
      {
        id: 'machine_learning',
        title: 'Machine Learning',
        percentage: 82,
        status: 'in_progress',
        completedActivities: [
          'Scikit-learn algorithms & Cross-validation',
          'Decision Trees, Random Forests, XGBoost'
        ],
        remainingTasks: [
          'Support Vector Machines optimization'
        ]
      },
      {
        id: 'deep_learning',
        title: 'Deep Learning',
        percentage: 75,
        status: 'in_progress',
        completedActivities: [
          'PyTorch neural network architectures',
          'CNN ResNet-18 model trained to 94% accuracy'
        ],
        remainingTasks: [
          'Recurrent Neural Networks & LSTMs'
        ]
      },
      {
        id: 'ai_projects',
        title: 'AI Projects & RAG',
        percentage: 68,
        status: 'in_progress',
        completedActivities: [
          'RAG vector indexing search engine (FAISS)',
          'Llama 3 8B fine-tuning via LoRA'
        ],
        remainingTasks: [
          'Model quantization to GGUF format'
        ]
      },
      {
        id: 'research_cert',
        title: 'Research & Certification',
        percentage: 55,
        status: 'in_progress',
        completedActivities: [
          'Deep Learning Specialization certificate',
          'Paper abstract drafted with Dr. Kulkarni'
        ],
        remainingTasks: [
          'Submit paper to IEEE conference'
        ]
      },
      {
        id: 'portfolio_github',
        title: 'Portfolio & Hugging Face',
        percentage: 45,
        status: 'in_progress',
        completedActivities: [
          'GitHub profile featuring PyTorch models'
        ],
        remainingTasks: [
          'Hugging Face Spaces live demo app'
        ]
      },
      {
        id: 'aiml_ready',
        title: 'AI/ML Career Ready',
        percentage: 0,
        status: 'not_started',
        completedActivities: [],
        remainingTasks: [
          'Tier-1 AI Research Engineer applications'
        ]
      }
    ]
  },
  {
    id: 'backend_dev',
    title: 'Backend Developer',
    icon: Code2,
    monthlyDelta: 6.5,
    steps: [
      {
        id: 'programming_fundamentals',
        title: 'Programming Fundamentals',
        percentage: 100,
        status: 'completed',
        completedActivities: [
          'Data Structures & Algorithms mastery',
          'Object-Oriented Programming principles'
        ],
        remainingTasks: []
      },
      {
        id: 'java_nodejs',
        title: 'Java / Node.js Runtime',
        percentage: 88,
        status: 'completed',
        completedActivities: [
          'Node.js runtime, Event Loop & Async/Await',
          'TypeScript strong typing & ES Modules'
        ],
        remainingTasks: [
          'Java Spring Boot fundamentals'
        ]
      },
      {
        id: 'apis',
        title: 'REST APIs & Microservices',
        percentage: 80,
        status: 'in_progress',
        completedActivities: [
          'Express RESTful API endpoints',
          'JWT authentication & Cookie middleware'
        ],
        remainingTasks: [
          'GraphQL query schema design'
        ]
      },
      {
        id: 'databases',
        title: 'Databases (SQL & NoSQL)',
        percentage: 72,
        status: 'in_progress',
        completedActivities: [
          'MongoDB Atlas Mongoose schemas & aggregation',
          'PostgreSQL relational schema & indexing'
        ],
        remainingTasks: [
          'Redis caching layer implementation'
        ]
      },
      {
        id: 'backend_project',
        title: 'Backend Production Project',
        percentage: 65,
        status: 'in_progress',
        completedActivities: [
          'Campus1 Backend service built',
          'API error handling & response wrappers'
        ],
        remainingTasks: [
          'Rate limiting middleware & Swagger docs'
        ]
      },
      {
        id: 'system_design',
        title: 'System Design',
        percentage: 40,
        status: 'in_progress',
        completedActivities: [
          'Load balancing & Microservices architecture'
        ],
        remainingTasks: [
          'Message queues (RabbitMQ / Kafka)'
        ]
      },
      {
        id: 'cloud_deployment',
        title: 'Cloud & Deployment',
        percentage: 30,
        status: 'in_progress',
        completedActivities: [
          'Vercel serverless functions configuration'
        ],
        remainingTasks: [
          'Docker containerization',
          'AWS EC2 / S3 setup'
        ]
      },
      {
        id: 'backend_ready',
        title: 'Backend Career Ready',
        percentage: 0,
        status: 'not_started',
        completedActivities: [],
        remainingTasks: [
          'Full-stack backend portfolio release'
        ]
      }
    ]
  }
];

interface GoalProgressSectionProps {
  onGoalChange?: (goalId: string) => void;
}

export const GoalProgressSection: React.FC<GoalProgressSectionProps> = ({ onGoalChange }) => {
  const [dbGoals, setDbGoals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDesc, setNewGoalDesc] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchGoals = async () => {
    try {
      setIsLoading(true);
      const res = await studentGoalsApi.getGoals();
      setDbGoals(res.data);
      // Sync primary goal with global store
      const primary = res.data.find((g: any) => g.isPrimary);
      if (primary) {
        studentStore.setCareerGoal(primary.title);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const displayGoals = useMemo(() => {
    const prototypeGoals: GoalDefinition[] = INITIAL_GOALS.map(g => ({
      ...g,
      source: 'prototype',
      isPrimary: g.title === studentStore.getState().careerGoal
    }));

    const databaseGoals: GoalDefinition[] = dbGoals.map(g => {
      const isFailed = g.roadmapGenerationStatus === 'failed';
      const steps = g.roadmap?.length > 0 ? g.roadmap.map((m: any) => ({
        id: m._id || m.title,
        title: m.title,
        percentage: m.percentage || 0,
        status: (m.status || 'not_started').toLowerCase(),
        completedActivities: m.completedActivities || [],
        remainingTasks: m.remainingTasks || []
      })) : isFailed ? [{
        id: `fail-${g._id}`,
        title: 'Roadmap Generation Failed',
        percentage: 0,
        status: 'not_started',
        completedActivities: [],
        remainingTasks: ['Roadmap generation is temporarily unavailable.']
      }] : [{
        id: `pending-${g._id}`,
        title: 'Roadmap Generation Pending',
        percentage: 0,
        status: 'not_started',
        completedActivities: [],
        remainingTasks: ['Waiting for AI...']
      }];

      return {
        id: g._id,
        title: g.title,
        icon: Target,
        monthlyDelta: 0,
        isPrimary: g.isPrimary,
        source: 'database',
        isCustom: true,
        steps
      };
    });

    return [...prototypeGoals, ...databaseGoals];
  }, [dbGoals, studentStore.getState().careerGoal]);

  // Active selected goal ID
  const [selectedGoalId, setSelectedGoalId] = useState<string>(INITIAL_GOALS[0].id);

  // Auto-select primary goal when loaded if nothing selected
  useEffect(() => {
    const primary = displayGoals.find(g => g.isPrimary);
    if (primary && selectedGoalId === INITIAL_GOALS[0].id && !isLoading) {
      setSelectedGoalId(primary.id);
    }
  }, [displayGoals, isLoading]);


  // Currently active goal object
  const currentGoal = useMemo(() => {
    return displayGoals.find((g) => g.id === selectedGoalId) || displayGoals[0];
  }, [selectedGoalId, displayGoals]);

  // Selected step for detail inspection (default: first in-progress step)
  const [selectedStepId, setSelectedStepId] = useState<string>('');

  useEffect(() => {
    if (currentGoal) {
      const firstActive = currentGoal.steps.find((s) => s.status === 'in_progress');
      setSelectedStepId(firstActive ? firstActive.id : currentGoal.steps[0].id);
    }
  }, [currentGoal]);

  // Whenever goal changes, set default selected step to its active step
  const handleSelectGoal = (goalId: string) => {
    setSelectedGoalId(goalId);
    if (onGoalChange) onGoalChange(goalId);
  };

  const handleSetPrimary = async () => {
    if (currentGoal.source === 'prototype') {
      // For prototype goals, just update the local store (which syncs other AI features)
      studentStore.setCareerGoal(currentGoal.title);
      window.dispatchEvent(
        new CustomEvent('campus-toast', {
          detail: { title: 'Primary Goal Updated', message: `${currentGoal.title} is now your primary goal (Demo Mode).`, type: 'success' }
        })
      );
      return;
    }
    
    // For database goals, update via API and persist
    try {
      await studentGoalsApi.setPrimaryGoal(currentGoal.id);
      studentStore.setCareerGoal(currentGoal.title);
      window.dispatchEvent(
        new CustomEvent('campus-toast', {
          detail: { title: 'Primary Goal Updated', message: `${currentGoal.title} is now your primary goal.`, type: 'success' }
        })
      );
      await fetchGoals();
    } catch (err: any) {
      console.error("Error setting primary:", err);
    }
  };

  const handleAddGoal = async () => {
    if (!newGoalTitle.trim()) {
      setErrorMsg('Goal title is required');
      return;
    }
    try {
      setIsSaving(true);
      setErrorMsg('');
      const res = await studentGoalsApi.createGoal({ title: newGoalTitle.trim(), description: newGoalDesc.trim() });
      window.dispatchEvent(
        new CustomEvent('campus-toast', {
          detail: { title: 'Goal Added', message: 'Goal added successfully', type: 'success' }
        })
      );
      setNewGoalTitle('');
      setNewGoalDesc('');
      setIsModalOpen(false);
      await fetchGoals();
      setSelectedGoalId(res.data._id); // switch to the new goal
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to add goal');
    } finally {
      setIsSaving(false);
    }
  };

  // Currently selected step object
  const currentStep = useMemo(() => {
    if (!currentGoal) return null;
    return currentGoal.steps.find((s) => s.id === selectedStepId) || currentGoal.steps[0];
  }, [currentGoal, selectedStepId]);

  // Calculate overall goal completion percentage
  const overallGoalPercentage = useMemo(() => {
    if (!currentGoal || currentGoal.steps.length === 0) return 0;
    const total = currentGoal.steps.reduce((acc, step) => acc + step.percentage, 0);
    return Math.round(total / currentGoal.steps.length);
  }, [currentGoal]);

  return (
    <div className="bg-[#FFFCF7]/95 backdrop-blur-xl rounded-3xl p-5 sm:p-6 border border-[#0C2238]/08 shadow-xs hover:shadow-md transition-all duration-300 space-y-4.5">
      
      {/* 1. COMPACT TOP HEADER WITH GOAL TABS & OVERALL PROGRESS CARD */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-3.5 border-b border-[#0C2238]/08">
        
        {/* Left: Heading & Mini Goal Selection Tabs */}
        <div className="space-y-2">
          <h3 className="text-xl font-extrabold text-[#10253A] font-display tracking-tight flex items-center gap-2">
            <Target className="w-5 h-5 text-[#C99632]" />
            Goal Progress
          </h3>

          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            {isLoading && displayGoals.length === INITIAL_GOALS.length ? (
              <span className="text-xs text-[#627083] flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin"/> Loading goals...</span>
            ) : (
              <>
                {displayGoals.map((goal) => {
                  const isSelected = goal.id === selectedGoalId;
                  const IconComp = goal.icon;
                  return (
                    <button
                      key={goal.id}
                      onClick={() => handleSelectGoal(goal.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 transition-all duration-200 border cursor-pointer ${
                        isSelected
                          ? 'bg-[#0C2238] text-white border-[#0C2238] shadow-2xs scale-[1.02]'
                          : 'bg-[#FAF7F0] text-[#627083] border-[#0C2238]/08 hover:border-[#C99632]/50 hover:text-[#10253A]'
                      }`}
                    >
                      <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-[#C99632]' : 'text-[#627083]'}`} />
                      <span>{goal.title}</span>
                      {goal.isPrimary && (
                         <span className={`ml-1 text-[9px] px-1.5 rounded-full ${isSelected ? 'bg-[#C99632] text-white' : 'bg-[#FEF3C7] text-[#D97706]'}`}>PRIMARY</span>
                      )}
                    </button>
                  );
                })}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center space-x-1 transition-all duration-200 border border-dashed border-[#C99632]/50 text-[#C99632] bg-[#FAF7F0] hover:bg-[#FEF3C7] hover:border-[#C99632]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Goal</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right: Compact Overall Goal Progress Card */}
        <div className="bg-[#FAF7F0] border border-[#0C2238]/08 rounded-2xl px-4 py-2.5 flex items-center space-x-3 shadow-2xs shrink-0 self-start sm:self-center">
          <div className="relative w-11 h-11 flex items-center justify-center">
            <svg className="w-11 h-11 transform -rotate-90">
              <circle
                cx="22"
                cy="22"
                r="16"
                stroke="#EFE7D8"
                strokeWidth="3.5"
                fill="transparent"
              />
              <circle
                cx="22"
                cy="22"
                r="16"
                stroke="#C99632"
                strokeWidth="3.5"
                strokeDasharray={2 * Math.PI * 16}
                strokeDashoffset={2 * Math.PI * 16 * (1 - overallGoalPercentage / 100)}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <span className="absolute text-xs font-extrabold text-[#10253A]">
              {overallGoalPercentage}%
            </span>
          </div>

            <div className="flex flex-col items-start gap-1">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#627083] block">
                Overall Goal Progress
              </span>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-extrabold text-[#10253A]">
                  {currentGoal?.title}
                </span>
                {!currentGoal?.isCustom && (
                  <span className="inline-flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D]">
                    +{currentGoal?.monthlyDelta}% this month
                  </span>
                )}
              </div>
              {!currentGoal?.isPrimary && (
                <button 
                  onClick={handleSetPrimary}
                  className="mt-1 text-[10px] font-bold text-[#C99632] hover:text-[#B07E28] underline underline-offset-2 transition-colors"
                >
                  Set as Primary Goal
                </button>
              )}
            </div>
        </div>

      </div>

      {/* 2. VERTICAL SEQUENTIAL ROADMAP TIMELINE */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-[#627083]">
          <span className="font-bold text-[#10253A] flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#C99632]" />
            Sequential Roadmap Timeline: Click any milestone to inspect activities
          </span>
          <span className="font-extrabold text-[#C99632]">
            {currentGoal.steps.filter((s) => s.status === 'completed').length} / {currentGoal.steps.length} Milestones Cleared
          </span>
        </div>

        {/* Vertical Timeline List */}
        <div className="space-y-2 relative pl-2">
          {currentGoal.steps.map((step, idx) => {
            const isSelected = step.id === selectedStepId;
            const isCompleted = step.status === 'completed';
            const isInProgress = step.status === 'in_progress';
            const isLast = idx === currentGoal.steps.length - 1;

            return (
              <div key={step.id} className="relative">
                {/* Connecting Vertical Line */}
                {!isLast && (
                  <div
                    className={`absolute left-[15px] top-[34px] bottom-[-9px] w-0.5 z-0 ${
                      isCompleted ? 'bg-[#15803D]/30' : isInProgress ? 'bg-[#C99632]/40' : 'bg-[#0C2238]/10'
                    }`}
                  />
                )}

                {/* Milestone Node Row */}
                <div
                  onClick={() => setSelectedStepId(step.id)}
                  className={`relative z-10 p-2.5 sm:p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#FFFCF7] border-[#C99632] shadow-2xs ring-2 ring-[#C99632]/30 scale-[1.008]'
                      : isCompleted
                      ? 'bg-[#FFFCF7] border-[#BBF7D0] shadow-2xs hover:border-[#15803D]'
                      : isInProgress
                      ? 'bg-[#FFFCF7] border-[#FDE68A] shadow-2xs hover:border-[#C99632]'
                      : 'bg-[#FAF7F0]/60 border-[#0C2238]/08 opacity-60 hover:opacity-100'
                  }`}
                >
                  {/* Left Indicator Dot + Title */}
                  <div className="flex items-center space-x-3 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 ${
                        isCompleted
                          ? 'bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]'
                          : isInProgress
                          ? 'bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]'
                          : 'bg-[#EFE7D8] text-[#627083] border border-[#0C2238]/10'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4 text-[#15803D]" /> : idx + 1}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-xs sm:text-sm font-extrabold text-[#10253A] truncate">
                          Step {idx + 1} — {step.title}
                        </h4>
                        {isCompleted && (
                          <span className="px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] text-[9px] font-extrabold shrink-0">
                            ✓ Done
                          </span>
                        )}
                        {isInProgress && (
                          <span className="px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706] text-[9px] font-extrabold shrink-0">
                            Active
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#627083] block truncate">
                        {step.completedActivities.length > 0
                          ? step.completedActivities[0]
                          : step.remainingTasks.length > 0
                          ? `Next: ${step.remainingTasks[0]}`
                          : 'Milestone pending'}
                      </span>
                    </div>
                  </div>

                  {/* Right Progress Bar & Percentage */}
                  <div className="flex items-center space-x-3 shrink-0">
                    <div className="w-24 sm:w-32 hidden sm:block">
                      <div className="w-full bg-[#EFE7D8] h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isCompleted
                              ? 'bg-[#15803D]'
                              : isInProgress
                              ? 'bg-[#C99632]'
                              : 'bg-[#627083]'
                          }`}
                          style={{ width: `${step.percentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-[#10253A] min-w-[36px] text-right font-display">
                      {step.percentage}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. ACTIVITY CONNECTION DETAIL PANEL FOR SELECTED STEP */}
      <div className="bg-[#FAF7F0] rounded-2xl p-4 sm:p-5 border border-[#0C2238]/08 space-y-3">
        
        <div className="flex items-center justify-between pb-2 border-b border-[#0C2238]/08">
          <div className="flex items-center space-x-2">
            <CheckSquare className="w-4 h-4 text-[#C99632]" />
            <h4 className="text-xs sm:text-sm font-extrabold text-[#10253A]">
              Activity Connection: {currentStep.title} ({currentStep.percentage}% Complete)
            </h4>
          </div>

          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
            currentStep.status === 'completed'
              ? 'bg-[#DCFCE7] text-[#15803D]'
              : currentStep.status === 'in_progress'
              ? 'bg-[#FEF3C7] text-[#D97706]'
              : 'bg-[#EFE7D8] text-[#627083]'
          }`}>
            {currentStep.status === 'completed' ? '100% Cleared' : currentStep.status === 'in_progress' ? 'Active Step' : 'Upcoming'}
          </span>
        </div>

        {/* 2-Column Grid: Completed Activities vs Remaining Tasks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          
          {/* Completed Activities */}
          <div className="bg-[#FFFCF7] p-3.5 rounded-xl border border-[#0C2238]/06 shadow-2xs space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#15803D] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
              Completed Activities ({currentStep.completedActivities.length})
            </span>

            {currentStep.completedActivities.length > 0 ? (
              <ul className="space-y-1 text-xs text-[#0C2238]/90">
                {currentStep.completedActivities.map((act, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 leading-snug">
                    <span className="text-[#15803D] font-bold">•</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-[#627083] italic">No completed activities logged for this step yet.</p>
            )}
          </div>

          {/* Remaining Tasks */}
          <div className="bg-[#FFFCF7] p-3.5 rounded-xl border border-[#0C2238]/06 shadow-2xs space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D97706] flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-[#D97706]" />
              Remaining Tasks ({currentStep.remainingTasks.length})
            </span>

            {currentStep.remainingTasks.length > 0 ? (
              <ul className="space-y-1 text-xs text-[#0C2238]/90">
                {currentStep.remainingTasks.map((task, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 leading-snug">
                    <span className="text-[#D97706] font-bold">•</span>
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-[#15803D] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                All requirements completed!
              </p>
            )}
          </div>

        </div>

      </div>

      {/* ADD GOAL MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#0C2238]/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-[#FFFCF7] rounded-3xl p-6 shadow-2xl border border-[#0C2238]/08 overflow-hidden z-10"
            >
              <h3 className="text-lg font-extrabold text-[#10253A] font-display mb-1 flex items-center gap-2">
                <Target className="w-5 h-5 text-[#C99632]" />
                Add New Goal
              </h3>
              <p className="text-sm text-[#627083] mb-5">What do you want to achieve?</p>

              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {errorMsg}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-[#10253A] uppercase tracking-wider">Goal Title *</label>
                  <input
                    type="text"
                    autoFocus
                    placeholder="e.g. Software Engineer, Data Scientist"
                    value={newGoalTitle}
                    onChange={(e) => setNewGoalTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#0C2238]/10 bg-white text-sm font-semibold text-[#10253A] placeholder-[#627083]/50 focus:outline-none focus:border-[#C99632] focus:ring-1 focus:ring-[#C99632]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-[#10253A] uppercase tracking-wider">Description (Optional)</label>
                  <textarea
                    placeholder="e.g. I want to build scalable apps"
                    rows={3}
                    value={newGoalDesc}
                    onChange={(e) => setNewGoalDesc(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#0C2238]/10 bg-white text-sm text-[#10253A] placeholder-[#627083]/50 focus:outline-none focus:border-[#C99632] focus:ring-1 focus:ring-[#C99632] resize-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[#0C2238]/08">
                <button
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-[#627083] hover:bg-[#0C2238]/05 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddGoal}
                  disabled={isSaving || !newGoalTitle.trim()}
                  className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-[#0C2238] hover:bg-[#1A365D] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md flex items-center gap-2"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  {isSaving ? 'Creating personalized roadmap...' : 'Add Goal'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
