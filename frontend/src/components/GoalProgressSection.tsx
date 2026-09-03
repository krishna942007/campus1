import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  ArrowDown
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
  // Active selected goal ID
  const [selectedGoalId, setSelectedGoalId] = useState<string>('tcs_placement');

  // Currently active goal object
  const currentGoal = useMemo(() => {
    return INITIAL_GOALS.find((g) => g.id === selectedGoalId) || INITIAL_GOALS[0];
  }, [selectedGoalId]);

  // Selected step for detail inspection (default: first in-progress step)
  const [selectedStepId, setSelectedStepId] = useState<string>(() => {
    const firstActive = currentGoal.steps.find((s) => s.status === 'in_progress');
    return firstActive ? firstActive.id : currentGoal.steps[0].id;
  });

  // Whenever goal changes, set default selected step to its active step
  const handleSelectGoal = (goalId: string) => {
    setSelectedGoalId(goalId);
    const target = INITIAL_GOALS.find((g) => g.id === goalId) || INITIAL_GOALS[0];
    const firstActive = target.steps.find((s) => s.status === 'in_progress') || target.steps[0];
    setSelectedStepId(firstActive.id);
    if (onGoalChange) onGoalChange(goalId);
  };

  // Currently selected step object
  const currentStep = useMemo(() => {
    return currentGoal.steps.find((s) => s.id === selectedStepId) || currentGoal.steps[0];
  }, [currentGoal, selectedStepId]);

  // Calculate overall goal completion percentage
  const overallGoalPercentage = useMemo(() => {
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

          {/* Goal Mini-Tabs */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {INITIAL_GOALS.map((goal) => {
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
                </button>
              );
            })}
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

          <div>
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#627083] block">
              Overall Goal Progress
            </span>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-extrabold text-[#10253A]">
                {currentGoal.title}
              </span>
              <span className="inline-flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D]">
                +{currentGoal.monthlyDelta}% this month
              </span>
            </div>
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

    </div>
  );
};
