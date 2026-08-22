import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  TrendingUp,
  Target,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Zap,
  BookOpen,
  UserCheck,
  Briefcase,
  Code2,
  GraduationCap,
  Clock,
  Filter,
  Eye,
  ArrowRight,
  ArrowUpRight,
  Layers,
  CheckSquare
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export interface CategoryActivityGroup {
  category: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ComponentType<{ className?: string }>;
  items: string[];
}

export interface WeeklyDataPoint {
  weekNum: number;
  weekLabel: string;
  shortLabel: string;
  dateRange: string;
  academicPerformance: number;
  attendance: number;
  goalsRoadmap: number;
  skillDevelopment: number;
  projects: number;
  coursesCertifications: number;
  mentoring: number;
  careerActivities: number;
  overallScore: number;
  categoryActivities: CategoryActivityGroup[];
  goalImpact: {
    targetRole: string;
    activityFlow: string;
    impactPercentage: number;
  };
}

export interface DimensionMeta {
  key: keyof Omit<WeeklyDataPoint, 'weekNum' | 'weekLabel' | 'shortLabel' | 'dateRange' | 'categoryActivities' | 'goalImpact'>;
  name: string;
  weight: number; // 0 to 1
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const DIMENSIONS: DimensionMeta[] = [
  {
    key: 'overallScore',
    name: 'Overall Score',
    weight: 1.0,
    color: '#C99632', // VIT Gold
    bgColor: '#FEF3C7',
    borderColor: '#FDE68A',
    icon: Sparkles
  },
  {
    key: 'academicPerformance',
    name: 'Academic Performance',
    weight: 0.20,
    color: '#2563EB', // Blue
    bgColor: '#DBEAFE',
    borderColor: '#BFDBFE',
    icon: GraduationCap
  },
  {
    key: 'goalsRoadmap',
    name: 'Goals / Roadmap',
    weight: 0.20,
    color: '#D97706', // Amber
    bgColor: '#FEF3C7',
    borderColor: '#FDE68A',
    icon: Target
  },
  {
    key: 'skillDevelopment',
    name: 'Skill Development',
    weight: 0.15,
    color: '#6366F1', // Indigo
    bgColor: '#E0E7FF',
    borderColor: '#C7D2FE',
    icon: Code2
  },
  {
    key: 'projects',
    name: 'Projects',
    weight: 0.15,
    color: '#8B5CF6', // Purple
    bgColor: '#F3E8FF',
    borderColor: '#E9D5FF',
    icon: Zap
  },
  {
    key: 'careerActivities',
    name: 'Career Activities',
    weight: 0.10,
    color: '#06B6D4', // Cyan
    bgColor: '#CFFAFE',
    borderColor: '#A5F3FC',
    icon: Briefcase
  },
  {
    key: 'coursesCertifications',
    name: 'Courses & Certifications',
    weight: 0.10,
    color: '#0D9488', // Teal
    bgColor: '#CCFBF1',
    borderColor: '#99F6E4',
    icon: BookOpen
  },
  {
    key: 'mentoring',
    name: 'Mentoring',
    weight: 0.05,
    color: '#E11D48', // Rose
    bgColor: '#FFE4E6',
    borderColor: '#FECDD3',
    icon: UserCheck
  },
  {
    key: 'attendance',
    name: 'Attendance Rate',
    weight: 0.05,
    color: '#10B981', // Emerald
    bgColor: '#D1FAE5',
    borderColor: '#A7F3D0',
    icon: Clock
  }
];

// Helper to calculate weighted overall score
export const calculateWeightedScore = (point: Omit<WeeklyDataPoint, 'overallScore'>): number => {
  const score =
    point.academicPerformance * 0.20 +
    point.goalsRoadmap * 0.20 +
    point.skillDevelopment * 0.15 +
    point.projects * 0.15 +
    point.careerActivities * 0.10 +
    point.coursesCertifications * 0.10 +
    point.mentoring * 0.05 +
    point.attendance * 0.05;
  return Number(score.toFixed(1));
};

// 12 Weeks of realistic historical simulated data with complete activity breakdowns & goal impact chains
export const INITIAL_WEEKLY_DATA: WeeklyDataPoint[] = [
  {
    weekNum: 1,
    weekLabel: 'Week 1',
    shortLabel: 'W1',
    dateRange: 'Jun 02 – Jun 08',
    academicPerformance: 72,
    attendance: 88,
    goalsRoadmap: 55,
    skillDevelopment: 58,
    projects: 50,
    coursesCertifications: 45,
    mentoring: 60,
    careerActivities: 40,
    overallScore: 59.4,
    categoryActivities: [
      { category: 'Academic', color: '#2563EB', bgColor: '#DBEAFE', borderColor: '#BFDBFE', icon: GraduationCap, items: ['CS501 Internal Quiz 1 completed (24/30)', 'Data Structures lab submission', 'SGPA baseline established'] },
      { category: 'Skills', color: '#6366F1', bgColor: '#E0E7FF', borderColor: '#C7D2FE', icon: Code2, items: ['2 LeetCode array problem sessions', 'Python OOP fundamentals refresher'] },
      { category: 'Projects', color: '#8B5CF6', bgColor: '#F3E8FF', borderColor: '#E9D5FF', icon: Zap, items: ['Created initial GitHub repository for Capstone', '2 initial commits'] },
      { category: 'Courses', color: '#0D9488', bgColor: '#CCFBF1', borderColor: '#99F6E4', icon: BookOpen, items: ['Enrolled in Coursera Machine Learning Specialization'] },
      { category: 'Mentoring', color: '#E11D48', bgColor: '#FFE4E6', borderColor: '#FECDD3', icon: UserCheck, items: ['Introductory meeting with Dr. Kulkarni'] },
      { category: 'Career', color: '#06B6D4', bgColor: '#CFFAFE', borderColor: '#A5F3FC', icon: Briefcase, items: ['Configured Placement Portal basic profile'] },
      { category: 'Roadmap', color: '#D97706', bgColor: '#FEF3C7', borderColor: '#FDE68A', icon: Target, items: ['Selected target track: AI Research Engineer'] },
      { category: 'Attendance', color: '#10B981', bgColor: '#D1FAE5', borderColor: '#A7F3D0', icon: Clock, items: ['88% weekly attendance (16/18 lectures)'] }
    ],
    goalImpact: {
      targetRole: 'AI Research Engineer',
      activityFlow: 'Goal Track Initialization → Core DSA Setup → +3.5% Goal Progress',
      impactPercentage: 3.5
    }
  },
  {
    weekNum: 2,
    weekLabel: 'Week 2',
    shortLabel: 'W2',
    dateRange: 'Jun 09 – Jun 15',
    academicPerformance: 74,
    attendance: 90,
    goalsRoadmap: 58,
    skillDevelopment: 62,
    projects: 54,
    coursesCertifications: 50,
    mentoring: 60,
    careerActivities: 42,
    overallScore: 61.8,
    categoryActivities: [
      { category: 'Academic', color: '#2563EB', bgColor: '#DBEAFE', borderColor: '#BFDBFE', icon: GraduationCap, items: ['CS502 Systems assignment submitted', 'Operating Systems lecture prep'] },
      { category: 'Skills', color: '#6366F1', bgColor: '#E0E7FF', borderColor: '#C7D2FE', icon: Code2, items: ['3 NumPy & Pandas data manipulation sessions', 'Data cleaning exercises'] },
      { category: 'Projects', color: '#8B5CF6', bgColor: '#F3E8FF', borderColor: '#E9D5FF', icon: Zap, items: ['Dataset acquisition & exploratory data analysis', '4 code commits'] },
      { category: 'Courses', color: '#0D9488', bgColor: '#CCFBF1', borderColor: '#99F6E4', icon: BookOpen, items: ['Completed Linear Regression module (Coursera)'] },
      { category: 'Mentoring', color: '#E11D48', bgColor: '#FFE4E6', borderColor: '#FECDD3', icon: UserCheck, items: ['1 mentor action item: defined research scope'] },
      { category: 'Career', color: '#06B6D4', bgColor: '#CFFAFE', borderColor: '#A5F3FC', icon: Briefcase, items: ['Added skills tags to LinkedIn profile'] },
      { category: 'Roadmap', color: '#D97706', bgColor: '#FEF3C7', borderColor: '#FDE68A', icon: Target, items: ['Math & Statistics for AI milestone in progress'] },
      { category: 'Attendance', color: '#10B981', bgColor: '#D1FAE5', borderColor: '#A7F3D0', icon: Clock, items: ['90% weekly attendance (18/20 lectures)'] }
    ],
    goalImpact: {
      targetRole: 'AI Research Engineer',
      activityFlow: 'Linear Regression Module → Data Science Skills → +4.2% Goal Progress',
      impactPercentage: 4.2
    }
  },
  {
    weekNum: 3,
    weekLabel: 'Week 3',
    shortLabel: 'W3',
    dateRange: 'Jun 16 – Jun 22',
    academicPerformance: 76,
    attendance: 89,
    goalsRoadmap: 62,
    skillDevelopment: 66,
    projects: 58,
    coursesCertifications: 55,
    mentoring: 70,
    careerActivities: 45,
    overallScore: 64.6,
    categoryActivities: [
      { category: 'Academic', color: '#2563EB', bgColor: '#DBEAFE', borderColor: '#BFDBFE', icon: GraduationCap, items: ['Completed OS Inter-process Communication Lab', 'DBMS normalization exercise'] },
      { category: 'Skills', color: '#6366F1', bgColor: '#E0E7FF', borderColor: '#C7D2FE', icon: Code2, items: ['PyTorch tensor operations practice', 'Implemented custom Gradient Descent'] },
      { category: 'Projects', color: '#8B5CF6', bgColor: '#F3E8FF', borderColor: '#E9D5FF', icon: Zap, items: ['Data preprocessing pipeline module', '6 meaningful commits'] },
      { category: 'Courses', color: '#0D9488', bgColor: '#CCFBF1', borderColor: '#99F6E4', icon: BookOpen, items: ['Logistic Regression & Regularization modules'] },
      { category: 'Mentoring', color: '#E11D48', bgColor: '#FFE4E6', borderColor: '#FECDD3', icon: UserCheck, items: ['1-on-1 mentor session on research methodology'] },
      { category: 'Career', color: '#06B6D4', bgColor: '#CFFAFE', borderColor: '#A5F3FC', icon: Briefcase, items: ['Drafted tech resume V1'] },
      { category: 'Roadmap', color: '#D97706', bgColor: '#FEF3C7', borderColor: '#FDE68A', icon: Target, items: ['Completed Core Math & DSA Milestone'] },
      { category: 'Attendance', color: '#10B981', bgColor: '#D1FAE5', borderColor: '#A7F3D0', icon: Clock, items: ['89% weekly attendance (16/18 lectures)'] }
    ],
    goalImpact: {
      targetRole: 'AI Research Engineer',
      activityFlow: 'PyTorch Tensors + DSA Milestone → Systems & Math → +5.1% Goal Progress',
      impactPercentage: 5.1
    }
  },
  {
    weekNum: 4,
    weekLabel: 'Week 4',
    shortLabel: 'W4',
    dateRange: 'Jun 23 – Jun 29',
    academicPerformance: 78,
    attendance: 91,
    goalsRoadmap: 65,
    skillDevelopment: 70,
    projects: 62,
    coursesCertifications: 60,
    mentoring: 70,
    careerActivities: 48,
    overallScore: 67.4,
    categoryActivities: [
      { category: 'Academic', color: '#2563EB', bgColor: '#DBEAFE', borderColor: '#BFDBFE', icon: GraduationCap, items: ['Computer Networks Lab assignment (TCP/IP)', 'Scored 27/30 in AI Unit Test'] },
      { category: 'Skills', color: '#6366F1', bgColor: '#E0E7FF', borderColor: '#C7D2FE', icon: Code2, items: ['Neural Network architecture design', 'Convolutional Layers implementation'] },
      { category: 'Projects', color: '#8B5CF6', bgColor: '#F3E8FF', borderColor: '#E9D5FF', icon: Zap, items: ['Baseline CNN model implementation', 'Dataset augmentation pipeline'] },
      { category: 'Courses', color: '#0D9488', bgColor: '#CCFBF1', borderColor: '#99F6E4', icon: BookOpen, items: ['Finished Deep Learning Spec Module 1'] },
      { category: 'Mentoring', color: '#E11D48', bgColor: '#FFE4E6', borderColor: '#FECDD3', icon: UserCheck, items: ['Reviewed CNN experiment results with mentor'] },
      { category: 'Career', color: '#06B6D4', bgColor: '#CFFAFE', borderColor: '#A5F3FC', icon: Briefcase, items: ['Reviewed ATS score for resume (78/100)'] },
      { category: 'Roadmap', color: '#D97706', bgColor: '#FEF3C7', borderColor: '#FDE68A', icon: Target, items: ['Deep Learning Foundations milestone initiated'] },
      { category: 'Attendance', color: '#10B981', bgColor: '#D1FAE5', borderColor: '#A7F3D0', icon: Clock, items: ['91% weekly attendance (20/22 lectures)'] }
    ],
    goalImpact: {
      targetRole: 'AI Research Engineer',
      activityFlow: 'CNN Architecture + Deep Learning Spec → Computer Vision Skills → +6.0% Goal Progress',
      impactPercentage: 6.0
    }
  },
  {
    weekNum: 5,
    weekLabel: 'Week 5',
    shortLabel: 'W5',
    dateRange: 'Jun 30 – Jul 06',
    academicPerformance: 80,
    attendance: 92,
    goalsRoadmap: 70,
    skillDevelopment: 74,
    projects: 66,
    coursesCertifications: 64,
    mentoring: 80,
    careerActivities: 50,
    overallScore: 70.3,
    categoryActivities: [
      { category: 'Academic', color: '#2563EB', bgColor: '#DBEAFE', borderColor: '#BFDBFE', icon: GraduationCap, items: ['3 lab assignments submitted on time', 'DBMS SQL queries project checkpoint'] },
      { category: 'Skills', color: '#6366F1', bgColor: '#E0E7FF', borderColor: '#C7D2FE', icon: Code2, items: ['FastAPI microservices development', 'REST API response optimization'] },
      { category: 'Projects', color: '#8B5CF6', bgColor: '#F3E8FF', borderColor: '#E9D5FF', icon: Zap, items: ['Integrated FastAPI inference endpoint', '8 code commits'] },
      { category: 'Courses', color: '#0D9488', bgColor: '#CCFBF1', borderColor: '#99F6E4', icon: BookOpen, items: ['Stanford CS229 Supervised Learning unit'] },
      { category: 'Mentoring', color: '#E11D48', bgColor: '#FFE4E6', borderColor: '#FECDD3', icon: UserCheck, items: ['Mentor approved semester paper abstract'] },
      { category: 'Career', color: '#06B6D4', bgColor: '#CFFAFE', borderColor: '#A5F3FC', icon: Briefcase, items: ['Published Capstone project on GitHub'] },
      { category: 'Roadmap', color: '#D97706', bgColor: '#FEF3C7', borderColor: '#FDE68A', icon: Target, items: ['Completed Machine Learning Engineering milestone'] },
      { category: 'Attendance', color: '#10B981', bgColor: '#D1FAE5', borderColor: '#A7F3D0', icon: Clock, items: ['92% weekly attendance (22/24 lectures)'] }
    ],
    goalImpact: {
      targetRole: 'AI Research Engineer',
      activityFlow: 'FastAPI Microservice + CS229 → ML Engineering → +6.8% Goal Progress',
      impactPercentage: 6.8
    }
  },
  {
    weekNum: 6,
    weekLabel: 'Week 6',
    shortLabel: 'W6',
    dateRange: 'Jul 07 – Jul 13',
    academicPerformance: 82,
    attendance: 90,
    goalsRoadmap: 73,
    skillDevelopment: 77,
    projects: 70,
    coursesCertifications: 68,
    mentoring: 80,
    careerActivities: 52,
    overallScore: 72.5,
    categoryActivities: [
      { category: 'Academic', color: '#2563EB', bgColor: '#DBEAFE', borderColor: '#BFDBFE', icon: GraduationCap, items: ['Mid-Sem Exam revision sessions', 'AI & OS subject summaries completed'] },
      { category: 'Skills', color: '#6366F1', bgColor: '#E0E7FF', borderColor: '#C7D2FE', icon: Code2, items: ['ResNet-18 model transfer learning', 'Hyperparameter tuning in PyTorch'] },
      { category: 'Projects', color: '#8B5CF6', bgColor: '#F3E8FF', borderColor: '#E9D5FF', icon: Zap, items: ['Achieved 94% validation accuracy on dataset', 'Documentation updated'] },
      { category: 'Courses', color: '#0D9488', bgColor: '#CCFBF1', borderColor: '#99F6E4', icon: BookOpen, items: ['Convolutional Neural Networks certificate'] },
      { category: 'Mentoring', color: '#E11D48', bgColor: '#FFE4E6', borderColor: '#FECDD3', icon: UserCheck, items: ['1 mentor action item: research paper outline'] },
      { category: 'Career', color: '#06B6D4', bgColor: '#CFFAFE', borderColor: '#A5F3FC', icon: Briefcase, items: ['Applied to 2 research student programs'] },
      { category: 'Roadmap', color: '#D97706', bgColor: '#FEF3C7', borderColor: '#FDE68A', icon: Target, items: ['Computer Vision specialization milestone'] },
      { category: 'Attendance', color: '#10B981', bgColor: '#D1FAE5', borderColor: '#A7F3D0', icon: Clock, items: ['90% weekly attendance (18/20 lectures)'] }
    ],
    goalImpact: {
      targetRole: 'AI Research Engineer',
      activityFlow: 'ResNet Transfer Learning + CNN Cert → Deep Vision → +7.2% Goal Progress',
      impactPercentage: 7.2
    }
  },
  {
    weekNum: 7,
    weekLabel: 'Week 7',
    shortLabel: 'W7',
    dateRange: 'Jul 14 – Jul 20',
    academicPerformance: 85,
    attendance: 93,
    goalsRoadmap: 76,
    skillDevelopment: 80,
    projects: 74,
    coursesCertifications: 72,
    mentoring: 85,
    careerActivities: 55,
    overallScore: 75.4,
    categoryActivities: [
      { category: 'Academic', color: '#2563EB', bgColor: '#DBEAFE', borderColor: '#BFDBFE', icon: GraduationCap, items: ['Mid-Sem Exams completed (88% aggregate)', 'Maintained top 5% batch standing'] },
      { category: 'Skills', color: '#6366F1', bgColor: '#E0E7FF', borderColor: '#C7D2FE', icon: Code2, items: ['Vector Database Integration (FAISS)', 'Embeddings generation pipeline'] },
      { category: 'Projects', color: '#8B5CF6', bgColor: '#F3E8FF', borderColor: '#E9D5FF', icon: Zap, items: ['Built RAG vector indexing engine', '10 code commits'] },
      { category: 'Courses', color: '#0D9488', bgColor: '#CCFBF1', borderColor: '#99F6E4', icon: BookOpen, items: ['Completed Deep Learning Specialization'] },
      { category: 'Mentoring', color: '#E11D48', bgColor: '#FFE4E6', borderColor: '#FECDD3', icon: UserCheck, items: ['Mentor review: 96% compatibility score verified'] },
      { category: 'Career', color: '#06B6D4', bgColor: '#CFFAFE', borderColor: '#A5F3FC', icon: Briefcase, items: ['Mock System Design interview session'] },
      { category: 'Roadmap', color: '#D97706', bgColor: '#FEF3C7', borderColor: '#FDE68A', icon: Target, items: ['Generative AI & RAG milestone initiated'] },
      { category: 'Attendance', color: '#10B981', bgColor: '#D1FAE5', borderColor: '#A7F3D0', icon: Clock, items: ['93% weekly attendance (26/28 lectures)'] }
    ],
    goalImpact: {
      targetRole: 'AI Research Engineer',
      activityFlow: 'FAISS Vector Indexing + RAG Engine → GenAI & NLP → +7.8% Goal Progress',
      impactPercentage: 7.8
    }
  },
  {
    weekNum: 8,
    weekLabel: 'Week 8',
    shortLabel: 'W8',
    dateRange: 'Jul 21 – Jul 27',
    academicPerformance: 84,
    attendance: 91,
    goalsRoadmap: 78,
    skillDevelopment: 83,
    projects: 78,
    coursesCertifications: 75,
    mentoring: 85,
    careerActivities: 58,
    overallScore: 76.5,
    categoryActivities: [
      { category: 'Academic', color: '#2563EB', bgColor: '#DBEAFE', borderColor: '#BFDBFE', icon: GraduationCap, items: ['2 lab practical submissions', 'Operating Systems IPC project presentation'] },
      { category: 'Skills', color: '#6366F1', bgColor: '#E0E7FF', borderColor: '#C7D2FE', icon: Code2, items: ['Transformer architecture self-attention mechanisms', 'PyTorch Multi-Head Attention'] },
      { category: 'Projects', color: '#8B5CF6', bgColor: '#F3E8FF', borderColor: '#E9D5FF', icon: Zap, items: ['Document chunking & similarity search module', '7 commits'] },
      { category: 'Courses', color: '#0D9488', bgColor: '#CCFBF1', borderColor: '#99F6E4', icon: BookOpen, items: ['Hugging Face NLP Course Module 2'] },
      { category: 'Mentoring', color: '#E11D48', bgColor: '#FFE4E6', borderColor: '#FECDD3', icon: UserCheck, items: ['2 mentor action items completed'] },
      { category: 'Career', color: '#06B6D4', bgColor: '#CFFAFE', borderColor: '#A5F3FC', icon: Briefcase, items: ['Placement Portal coding mock (Passed 5/5 cases)'] },
      { category: 'Roadmap', color: '#D97706', bgColor: '#FEF3C7', borderColor: '#FDE68A', icon: Target, items: ['Completed Generative AI & RAG milestone'] },
      { category: 'Attendance', color: '#10B981', bgColor: '#D1FAE5', borderColor: '#A7F3D0', icon: Clock, items: ['91% weekly attendance (20/22 lectures)'] }
    ],
    goalImpact: {
      targetRole: 'AI Research Engineer',
      activityFlow: 'Transformer Self-Attention + Hugging Face NLP → LLM Architecture → +8.1% Goal Progress',
      impactPercentage: 8.1
    }
  },
  {
    weekNum: 9,
    weekLabel: 'Week 9',
    shortLabel: 'W9',
    dateRange: 'Jul 28 – Aug 03',
    academicPerformance: 86,
    attendance: 94,
    goalsRoadmap: 82,
    skillDevelopment: 86,
    projects: 81,
    coursesCertifications: 78,
    mentoring: 90,
    careerActivities: 60,
    overallScore: 79.4,
    categoryActivities: [
      { category: 'Academic', color: '#2563EB', bgColor: '#DBEAFE', borderColor: '#BFDBFE', icon: GraduationCap, items: ['DBMS normalization project (100% score)', 'AI Lab practical demonstration'] },
      { category: 'Skills', color: '#6366F1', bgColor: '#E0E7FF', borderColor: '#C7D2FE', icon: Code2, items: ['Llama 3 8B fine-tuning using LoRA', 'Model quantization (GGUF)'] },
      { category: 'Projects', color: '#8B5CF6', bgColor: '#F3E8FF', borderColor: '#E9D5FF', icon: Zap, items: ['Deployed fine-tuned model for campus Q&A', '12 commits'] },
      { category: 'Courses', color: '#0D9488', bgColor: '#CCFBF1', borderColor: '#99F6E4', icon: BookOpen, items: ['LLM Fine-tuning & Quantization workshop'] },
      { category: 'Mentoring', color: '#E11D48', bgColor: '#FFE4E6', borderColor: '#FECDD3', icon: UserCheck, items: ['Research paper abstract finalized with mentor'] },
      { category: 'Career', color: '#06B6D4', bgColor: '#CFFAFE', borderColor: '#A5F3FC', icon: Briefcase, items: ['Updated GitHub Readme & live demo links'] },
      { category: 'Roadmap', color: '#D97706', bgColor: '#FEF3C7', borderColor: '#FDE68A', icon: Target, items: ['Model Quantization & Deployment milestone initiated'] },
      { category: 'Attendance', color: '#10B981', bgColor: '#D1FAE5', borderColor: '#A7F3D0', icon: Clock, items: ['94% weekly attendance (28/30 lectures)'] }
    ],
    goalImpact: {
      targetRole: 'AI Research Engineer',
      activityFlow: 'Llama 3 LoRA Fine-tuning + Paper Abstract → Model Research → +8.5% Goal Progress',
      impactPercentage: 8.5
    }
  },
  {
    weekNum: 10,
    weekLabel: 'Week 10',
    shortLabel: 'W10',
    dateRange: 'Aug 04 – Aug 10',
    academicPerformance: 88,
    attendance: 92,
    goalsRoadmap: 85,
    skillDevelopment: 89,
    projects: 84,
    coursesCertifications: 81,
    mentoring: 90,
    careerActivities: 62,
    overallScore: 81.8,
    categoryActivities: [
      { category: 'Academic', color: '#2563EB', bgColor: '#DBEAFE', borderColor: '#BFDBFE', icon: GraduationCap, items: ['Advanced AI Lab quiz (20/20)', 'Coursework assignment 4 submitted'] },
      { category: 'Skills', color: '#6366F1', bgColor: '#E0E7FF', borderColor: '#C7D2FE', icon: Code2, items: ['React 18 & TypeScript frontend architecture', 'Recharts analytics graph integration'] },
      { category: 'Projects', color: '#8B5CF6', bgColor: '#F3E8FF', borderColor: '#E9D5FF', icon: Zap, items: ['Connected React UI to Express backend API', '14 commits'] },
      { category: 'Courses', color: '#0D9488', bgColor: '#CCFBF1', borderColor: '#99F6E4', icon: BookOpen, items: ['AWS Cloud Foundations certificate'] },
      { category: 'Mentoring', color: '#E11D48', bgColor: '#FFE4E6', borderColor: '#FECDD3', icon: UserCheck, items: ['Reviewed full-stack architecture with mentor'] },
      { category: 'Career', color: '#06B6D4', bgColor: '#CFFAFE', borderColor: '#A5F3FC', icon: Briefcase, items: ['Resume submitted for Tier-1 campus placement portal'] },
      { category: 'Roadmap', color: '#D97706', bgColor: '#FEF3C7', borderColor: '#FDE68A', icon: Target, items: ['Completed Full-stack AI System milestone'] },
      { category: 'Attendance', color: '#10B981', bgColor: '#D1FAE5', borderColor: '#A7F3D0', icon: Clock, items: ['92% weekly attendance (22/24 lectures)'] }
    ],
    goalImpact: {
      targetRole: 'AI Research Engineer',
      activityFlow: 'React UI + Express API + AWS Cloud → Full-Stack Systems → +8.8% Goal Progress',
      impactPercentage: 8.8
    }
  },
  {
    weekNum: 11,
    weekLabel: 'Week 11',
    shortLabel: 'W11',
    dateRange: 'Aug 11 – Aug 17',
    academicPerformance: 89,
    attendance: 95,
    goalsRoadmap: 87,
    skillDevelopment: 90,
    projects: 86,
    coursesCertifications: 83,
    mentoring: 95,
    careerActivities: 66,
    overallScore: 84.0,
    categoryActivities: [
      { category: 'Academic', color: '#2563EB', bgColor: '#DBEAFE', borderColor: '#BFDBFE', icon: GraduationCap, items: ['Internal viva voce cleared (Grade A+)', 'Maintained 9.45 SGPA projection'] },
      { category: 'Skills', color: '#6366F1', bgColor: '#E0E7FF', borderColor: '#C7D2FE', icon: Code2, items: ['Docker containerization of AI microservices', 'CI/CD pipeline configuration'] },
      { category: 'Projects', color: '#8B5CF6', bgColor: '#F3E8FF', borderColor: '#E9D5FF', icon: Zap, items: ['Containerized backend & vector database', '9 commits'] },
      { category: 'Courses', color: '#0D9488', bgColor: '#CCFBF1', borderColor: '#99F6E4', icon: BookOpen, items: ['Docker & Kubernetes for AI Developers'] },
      { category: 'Mentoring', color: '#E11D48', bgColor: '#FFE4E6', borderColor: '#FECDD3', icon: UserCheck, items: ['Mentor recommendation letter submitted'] },
      { category: 'Career', color: '#06B6D4', bgColor: '#CFFAFE', borderColor: '#A5F3FC', icon: Briefcase, items: ['System Design mock interview score: 92/100'] },
      { category: 'Roadmap', color: '#D97706', bgColor: '#FEF3C7', borderColor: '#FDE68A', icon: Target, items: ['Production Deployment & Cloud milestone initiated'] },
      { category: 'Attendance', color: '#10B981', bgColor: '#D1FAE5', borderColor: '#A7F3D0', icon: Clock, items: ['95% weekly attendance (19/20 lectures)'] }
    ],
    goalImpact: {
      targetRole: 'AI Research Engineer',
      activityFlow: 'Docker Containerization + Mentor LOR → Cloud Deployment → +9.0% Goal Progress',
      impactPercentage: 9.0
    }
  },
  {
    weekNum: 12,
    weekLabel: 'Week 12',
    shortLabel: 'W12',
    dateRange: 'Aug 18 – Aug 24',
    academicPerformance: 91,
    attendance: 96,
    goalsRoadmap: 90,
    skillDevelopment: 92,
    projects: 88,
    coursesCertifications: 85,
    mentoring: 95,
    careerActivities: 70,
    overallScore: 86.8,
    categoryActivities: [
      { category: 'Academic', color: '#2563EB', bgColor: '#DBEAFE', borderColor: '#BFDBFE', icon: GraduationCap, items: ['4 lab assignments completed & verified', '2 final lab submissions (Grade A+)', 'SGPA performance maintained (8.92/9.45)'] },
      { category: 'Skills', color: '#6366F1', bgColor: '#E0E7FF', borderColor: '#C7D2FE', icon: Code2, items: ['3 Node.js & TypeScript learning sessions', 'Backend & Analytics skill progress +8%'] },
      { category: 'Projects', color: '#8B5CF6', bgColor: '#F3E8FF', borderColor: '#E9D5FF', icon: Zap, items: ['Campus1 Weekly Activity & Progress API module completed', '5 meaningful code commits pushed to main'] },
      { category: 'Courses', color: '#0D9488', bgColor: '#CCFBF1', borderColor: '#99F6E4', icon: BookOpen, items: ['Completed 2 online course modules (Stanford CS229 & edX AI)'] },
      { category: 'Mentoring', color: '#E11D48', bgColor: '#FFE4E6', borderColor: '#FECDD3', icon: UserCheck, items: ['1 mentor 1-on-1 meeting completed', '2 mentor action items reviewed & signed off'] },
      { category: 'Career', color: '#06B6D4', bgColor: '#CFFAFE', borderColor: '#A5F3FC', icon: Briefcase, items: ['Resume updated with latest Capstone achievements', '1 Tier-1 placement preparation mock cleared'] },
      { category: 'Roadmap', color: '#D97706', bgColor: '#FEF3C7', borderColor: '#FDE68A', icon: Target, items: ['Backend & Advanced AI System milestone completed'] },
      { category: 'Attendance', color: '#10B981', bgColor: '#D1FAE5', borderColor: '#A7F3D0', icon: Clock, items: ['96% weekly attendance (24/25 lectures)'] }
    ],
    goalImpact: {
      targetRole: 'AI Research Engineer',
      activityFlow: 'Campus1 API Module + 5 Commits → Technical Skills → +9.4% Roadmap Progress',
      impactPercentage: 9.4
    }
  }
];

interface WeeklyActivitySectionProps {
  targetRole?: string;
}

export const WeeklyActivitySection: React.FC<WeeklyActivitySectionProps> = ({
  targetRole = 'AI Research Engineer'
}) => {
  // Time Horizon Filter: 4, 8, or 12 weeks
  const [timeHorizon, setTimeHorizon] = useState<4 | 8 | 12>(8);

  // Selected Week Index (Default: last week, index 11)
  const [selectedWeekIndex, setSelectedWeekIndex] = useState<number>(INITIAL_WEEKLY_DATA.length - 1);

  // Active Dimensions Toggled on the Graph
  // REQUIREMENT: Default selected lines: Overall Score, Academic Performance, Goals / Roadmap, Skill Development, Projects
  // Remaining 4 are active/selectable (not disabled), just toggled off by default to avoid clutter!
  const [activeDimensions, setActiveDimensions] = useState<Record<string, boolean>>({
    overallScore: true,
    academicPerformance: true,
    goalsRoadmap: true,
    skillDevelopment: true,
    projects: true,
    careerActivities: false,
    coursesCertifications: false,
    mentoring: false,
    attendance: false
  });

  // Filtered dataset according to time horizon
  const visibleData = useMemo(() => {
    return INITIAL_WEEKLY_DATA.slice(-timeHorizon);
  }, [timeHorizon]);

  // Ensure selected index is within bounds of visible range
  const currentSelectedWeek = useMemo(() => {
    const found = INITIAL_WEEKLY_DATA[selectedWeekIndex];
    return found || INITIAL_WEEKLY_DATA[INITIAL_WEEKLY_DATA.length - 1];
  }, [selectedWeekIndex]);

  // Previous week for delta calculation
  const previousWeek = useMemo(() => {
    const prevIdx = selectedWeekIndex > 0 ? selectedWeekIndex - 1 : 0;
    return INITIAL_WEEKLY_DATA[prevIdx];
  }, [selectedWeekIndex]);

  // Dynamic Overall Score Delta
  const scoreDelta = useMemo(() => {
    const diff = currentSelectedWeek.overallScore - previousWeek.overallScore;
    return Number(diff.toFixed(1));
  }, [currentSelectedWeek, previousWeek]);

  // Dynamic AI Insight Generation based on selected week data
  const aiInsight = useMemo(() => {
    const dims: { name: string; val: number; key: string }[] = [
      { name: 'Academic Performance', val: currentSelectedWeek.academicPerformance, key: 'academicPerformance' },
      { name: 'Attendance Rate', val: currentSelectedWeek.attendance, key: 'attendance' },
      { name: 'Goals / Roadmap Progress', val: currentSelectedWeek.goalsRoadmap, key: 'goalsRoadmap' },
      { name: 'Skill Development', val: currentSelectedWeek.skillDevelopment, key: 'skillDevelopment' },
      { name: 'Projects', val: currentSelectedWeek.projects, key: 'projects' },
      { name: 'Courses & Certifications', val: currentSelectedWeek.coursesCertifications, key: 'coursesCertifications' },
      { name: 'Mentoring', val: currentSelectedWeek.mentoring, key: 'mentoring' },
      { name: 'Career Activities', val: currentSelectedWeek.careerActivities, key: 'careerActivities' }
    ];

    // Sort by value descending
    dims.sort((a, b) => b.val - a.val);

    const strongest = dims[0];
    const secondStrongest = dims[1];
    const weakest = dims[dims.length - 1];

    const directionText = scoreDelta >= 0 ? `increased ${scoreDelta}%` : `adjusted ${Math.abs(scoreDelta)}%`;
    
    const paragraph = `Your overall progress ${directionText} during ${currentSelectedWeek.weekLabel}. ${strongest.name} and ${secondStrongest.name} remain strong. Project activity contributed significantly to your ${targetRole} roadmap, while ${weakest.name.toLowerCase()} was lower than your recent average.`;

    let focusRec = `Complete your next ${targetRole} roadmap milestone.`;
    if (weakest.key === 'careerActivities') {
      focusRec = `Spend 2–3 hours on Placement Portal preparation and technical resume polish this week.`;
    } else if (weakest.key === 'coursesCertifications') {
      focusRec = `Complete your pending online course modules assigned by your faculty mentor.`;
    } else if (weakest.key === 'projects') {
      focusRec = `Ship the next API microservice module in your Capstone repository.`;
    } else if (weakest.key === 'goalsRoadmap') {
      focusRec = `Complete your next ${targetRole} roadmap milestone.`;
    }

    return {
      paragraph,
      strongestArea: `${strongest.name} (${strongest.val}%)`,
      needsAttention: `${weakest.name} (${weakest.val}%)`,
      recommendedFocus: focusRec
    };
  }, [currentSelectedWeek, scoreDelta, targetRole]);

  // Toggle individual dimension
  const toggleDimension = (key: string) => {
    setActiveDimensions((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Toggle All On / Clear All
  const toggleAll = (enable: boolean) => {
    const updated: Record<string, boolean> = {};
    DIMENSIONS.forEach((d) => {
      updated[d.key] = enable;
    });
    setActiveDimensions(updated);
  };

  return (
    <div className="bg-[#FFFCF7]/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-[#0C2238]/08 shadow-xs hover:shadow-md transition-all duration-300 space-y-6">
      
      {/* 1. TOP HEADER & KPI METRICS SCORE ROW */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-[#0C2238]/08">
        
        {/* Left Title & Description */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#EFE7D8] text-[#10253A] text-[10px] font-extrabold tracking-wider uppercase">
              Unified Progress Engine
            </span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C99632] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C99632]"></span>
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#10253A] font-display tracking-tight flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-[#C99632]" />
            Weekly Activity & Progress
          </h3>
          <p className="text-xs sm:text-sm text-[#627083] max-w-2xl">
            A weighted evaluation connecting your daily academic labs, project commits, course submissions, and mentor sessions directly to your target career goal ({targetRole}).
          </p>
        </div>

        {/* Right Score KPI & Time Horizon Selector */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 self-start lg:self-center">
          
          {/* Overall Score Prominent Display */}
          <div className="bg-[#FAF7F0] border border-[#0C2238]/08 rounded-2xl px-5 py-3 flex items-center space-x-4 shadow-2xs">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#627083] block">
                Overall Progress
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#10253A] font-display">
                  {currentSelectedWeek.overallScore}%
                </span>
                <span
                  className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${
                    scoreDelta >= 0
                      ? 'bg-[#DCFCE7] text-[#15803D]'
                      : 'bg-[#FEE2E2] text-[#B91C1C]'
                  }`}
                >
                  {scoreDelta >= 0 ? `↑ ${scoreDelta}%` : `↓ ${Math.abs(scoreDelta)}%`}
                  <span className="hidden sm:inline ml-1 text-[10px] opacity-80">vs last wk</span>
                </span>
              </div>
            </div>
          </div>

          {/* Time Horizon Selector (4W / 8W / 12W) */}
          <div className="bg-[#FAF7F0] p-1.5 rounded-2xl border border-[#0C2238]/08 flex items-center space-x-1">
            {([4, 8, 12] as const).map((weeks) => (
              <button
                key={weeks}
                onClick={() => setTimeHorizon(weeks)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  timeHorizon === weeks
                    ? 'bg-[#0C2238] text-white shadow-xs'
                    : 'text-[#627083] hover:text-[#10253A] hover:bg-[#EFE7D8]/60'
                }`}
              >
                {weeks} Weeks
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* 2. DIMENSIONS TOGGLE FILTER PILLS (ALL 8 DIMENSIONS ACTIVE & SELECTABLE) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#627083] flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-[#C99632]" />
            Toggle Graph Dimensions (Selectable Lines)
          </span>
          <div className="flex items-center space-x-2 text-[11px]">
            <button
              onClick={() => toggleAll(true)}
              className="text-[#C99632] hover:text-[#0C2238] font-bold transition-colors"
            >
              Select All
            </button>
            <span className="text-[#0C2238]/20">|</span>
            <button
              onClick={() => toggleAll(false)}
              className="text-[#627083] hover:text-[#0C2238] font-bold transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {DIMENSIONS.map((dim) => {
            const isActive = !!activeDimensions[dim.key];
            const IconComp = dim.icon;
            return (
              <button
                key={dim.key}
                onClick={() => toggleDimension(dim.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center space-x-2 transition-all duration-200 border cursor-pointer ${
                  isActive
                    ? 'shadow-2xs scale-[1.02]'
                    : 'bg-[#FAF7F0] border-[#0C2238]/10 text-[#627083] hover:border-[#C99632]/50 hover:text-[#10253A]'
                }`}
                style={{
                  backgroundColor: isActive ? dim.bgColor : '#FAF7F0',
                  borderColor: isActive ? dim.color : 'rgba(12, 34, 56, 0.12)',
                  color: isActive ? (dim.key === 'overallScore' ? '#0C2238' : dim.color) : '#627083'
                }}
              >
                <span
                  className={`w-2 h-2 rounded-full transition-opacity ${isActive ? 'opacity-100' : 'opacity-40'}`}
                  style={{ backgroundColor: dim.color }}
                />
                <IconComp className="w-3.5 h-3.5" />
                <span>{dim.name}</span>
                {dim.key !== 'overallScore' && (
                  <span className="text-[10px] opacity-75 font-semibold">
                    ({Math.round(dim.weight * 100)}%)
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. INTERACTIVE MULTI-LINE GRAPH (RECHARTS) */}
      <div className="bg-[#FAF7F0]/80 rounded-2xl p-4 sm:p-5 border border-[#0C2238]/06 space-y-3">
        
        <div className="flex items-center justify-between text-xs text-[#627083]">
          <span className="font-semibold flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-[#C99632]" />
            Click any point or week button to inspect activity breakdown
          </span>
          <span className="font-bold text-[#10253A]">
            Selected: <span className="text-[#C99632]">{currentSelectedWeek.weekLabel}</span> ({currentSelectedWeek.dateRange})
          </span>
        </div>

        <div className="h-[320px] sm:h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={visibleData}
              margin={{ top: 15, right: 15, left: -20, bottom: 5 }}
              onClick={(e) => {
                if (e && e.activeTooltipIndex !== undefined) {
                  const targetDataPoint = visibleData[e.activeTooltipIndex];
                  if (targetDataPoint) {
                    const globalIdx = INITIAL_WEEKLY_DATA.findIndex(
                      (d) => d.weekNum === targetDataPoint.weekNum
                    );
                    if (globalIdx !== -1) setSelectedWeekIndex(globalIdx);
                  }
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#0C2238" strokeOpacity={0.06} />
              
              <XAxis
                dataKey="shortLabel"
                stroke="#627083"
                fontSize={11}
                fontWeight={700}
                tickLine={false}
                axisLine={{ stroke: '#0C2238', strokeOpacity: 0.1 }}
              />
              
              <YAxis
                domain={[30, 100]}
                stroke="#627083"
                fontSize={11}
                fontWeight={700}
                tickLine={false}
                axisLine={{ stroke: '#0C2238', strokeOpacity: 0.1 }}
                tickFormatter={(v) => `${v}%`}
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const point = payload[0].payload as WeeklyDataPoint;
                    return (
                      <div className="bg-[#0C2238] text-white p-3.5 rounded-2xl shadow-xl border border-[#C99632]/40 text-xs space-y-2 max-w-xs">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <span className="font-extrabold text-[#C99632]">{point.weekLabel}</span>
                          <span className="text-[10px] text-white/70">{point.dateRange}</span>
                        </div>
                        
                        <div className="flex items-baseline justify-between text-sm font-bold pt-0.5">
                          <span className="text-white/80">Overall Progress:</span>
                          <span className="text-[#C99632] font-display text-base font-extrabold">
                            {point.overallScore}%
                          </span>
                        </div>

                        <div className="space-y-1 text-[11px] pt-1">
                          {DIMENSIONS.filter((d) => d.key !== 'overallScore' && activeDimensions[d.key]).map((d) => (
                            <div key={d.key} className="flex justify-between items-center text-white/80">
                              <span className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }} />
                                {d.name}:
                              </span>
                              <span className="font-bold text-white">{(point as any)[d.key]}%</span>
                            </div>
                          ))}
                        </div>

                        <div className="text-[10px] text-[#C99632] pt-1 border-t border-white/10 italic">
                          Click point to select week & view activity breakdown
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* Render Lines for Active Dimensions */}
              {DIMENSIONS.map((dim) => {
                if (!activeDimensions[dim.key]) return null;
                const isOverall = dim.key === 'overallScore';
                return (
                  <Line
                    key={dim.key}
                    type="monotone"
                    dataKey={dim.key}
                    name={dim.name}
                    stroke={dim.color}
                    strokeWidth={isOverall ? 3.5 : 2}
                    dot={{
                      r: isOverall ? 5 : 3,
                      fill: dim.color,
                      stroke: '#FFFCF7',
                      strokeWidth: 2
                    }}
                    activeDot={{
                      r: isOverall ? 8 : 6,
                      fill: dim.color,
                      stroke: '#0C2238',
                      strokeWidth: 2
                    }}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Week Selector Bar (W1 to W12) */}
        <div className="flex items-center justify-between pt-3 border-t border-[#0C2238]/06 overflow-x-auto text-xs gap-2">
          <span className="font-bold text-[#627083] shrink-0 text-[11px]">Select Week:</span>
          <div className="flex items-center gap-1.5">
            {INITIAL_WEEKLY_DATA.map((w, idx) => {
              const isSelected = selectedWeekIndex === idx;
              return (
                <button
                  key={w.weekNum}
                  onClick={() => setSelectedWeekIndex(idx)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    isSelected
                      ? 'bg-[#C99632] text-[#0C2238] shadow-xs scale-105 font-extrabold'
                      : 'bg-[#FFFCF7] text-[#627083] hover:text-[#10253A] border border-[#0C2238]/08'
                  }`}
                >
                  {w.shortLabel}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* 4. WEEKLY ACTIVITY BREAKDOWN & GOAL IMPACT CONNECTION */}
      <div className="bg-[#FAF7F0] rounded-2xl p-5 border border-[#0C2238]/08 space-y-5">
        
        {/* Header with Selected Week Label */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#0C2238]/08">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#E0E7FF] border border-[#C7D2FE] flex items-center justify-center text-[#4338CA] shadow-2xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-[#10253A]">
                {currentSelectedWeek.weekLabel} — Activity Breakdown
              </h4>
              <p className="text-xs text-[#627083]">
                Simulated real activities responsible for {currentSelectedWeek.weekLabel} ({currentSelectedWeek.dateRange}) performance score
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-[#EFE7D8] text-[#10253A] text-xs font-extrabold self-start sm:self-center">
            Overall Score: <span className="text-[#C99632]">{currentSelectedWeek.overallScore}%</span>
          </span>
        </div>

        {/* 8-Category Detailed Activity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {currentSelectedWeek.categoryActivities.map((catGroup, idx) => {
            const IconComp = catGroup.icon;
            return (
              <div
                key={idx}
                className="bg-[#FFFCF7] rounded-xl p-3.5 border border-[#0C2238]/06 shadow-2xs space-y-2 flex flex-col justify-between hover:border-[#C99632]/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="px-2 py-0.5 rounded-md text-[10px] font-extrabold flex items-center gap-1 border"
                      style={{
                        backgroundColor: catGroup.bgColor,
                        borderColor: catGroup.borderColor,
                        color: catGroup.color
                      }}
                    >
                      <IconComp className="w-3 h-3" />
                      {catGroup.category}
                    </span>
                    <span className="text-[10px] font-extrabold text-[#627083]">
                      {catGroup.items.length} Activities
                    </span>
                  </div>

                  <ul className="space-y-1.5 text-xs text-[#0C2238]/90">
                    {catGroup.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-1.5 leading-snug">
                        <span className="text-[#C99632] font-bold mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* 5. CONNECT ACTIVITIES TO STUDENT GOALS (GOAL IMPACT FLOW) */}
        <div className="bg-gradient-to-r from-[#0C2238] to-[#10253A] text-white p-4 sm:p-5 rounded-2xl shadow-sm border border-[#C99632]/30 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-[#C99632]" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#C99632]">
                Goal Impact Chain: Student Activity → Skill Dev → Roadmap → Career Goal
              </span>
            </div>
            <div className="flex items-center space-x-2 bg-[#FFFCF7]/10 px-3 py-1 rounded-full border border-white/10 text-xs">
              <span className="text-white/70">Target Goal:</span>
              <span className="font-extrabold text-[#C99632]">{currentSelectedWeek.goalImpact.targetRole || targetRole}</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
            <div className="flex items-center space-x-3 text-xs sm:text-sm font-semibold text-white/90">
              <span className="bg-[#C99632]/20 text-[#C99632] px-3 py-1.5 rounded-xl border border-[#C99632]/40 font-mono text-xs">
                {currentSelectedWeek.goalImpact.activityFlow}
              </span>
            </div>

            <div className="flex items-center space-x-2 bg-[#C99632] text-[#0C2238] px-4 py-2 rounded-xl font-extrabold text-sm shadow-xs font-display shrink-0">
              <ArrowUpRight className="w-4 h-4" />
              <span>+{currentSelectedWeek.goalImpact.impactPercentage}% Goal Impact</span>
            </div>
          </div>
        </div>

      </div>

      {/* 6. SIMULATED AI WEEKLY ANALYSIS */}
      <div className="bg-[#FAF7F0] rounded-2xl p-5 border border-[#0C2238]/08 space-y-4">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#D97706] shadow-2xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-[#10253A]">
                AI Weekly Analysis
              </h4>
              <span className="text-[10px] text-[#627083] font-medium">
                Calculated programmatically from {currentSelectedWeek.weekLabel} simulated data
              </span>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#E0E7FF] text-[#4338CA] text-[10px] font-extrabold">
            SIMULATED AI ENGINE
          </span>
        </div>

        {/* Dynamic Analysis Paragraph */}
        <p className="text-xs sm:text-sm text-[#0C2238]/90 leading-relaxed bg-[#FFFCF7] p-4 rounded-xl border border-[#0C2238]/06 shadow-2xs">
          "{aiInsight.paragraph}"
        </p>

        {/* 3 Compact Indicator Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          
          {/* Strongest Area */}
          <div className="bg-[#DCFCE7]/80 border border-[#BBF7D0] p-3.5 rounded-xl">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#15803D] block mb-0.5">
              Strongest Area
            </span>
            <span className="text-xs font-extrabold text-[#10253A] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
              {aiInsight.strongestArea}
            </span>
          </div>

          {/* Needs Attention */}
          <div className="bg-[#FEF2F2]/80 border border-[#FECACA] p-3.5 rounded-xl">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#B91C1C] block mb-0.5">
              Needs Attention
            </span>
            <span className="text-xs font-extrabold text-[#10253A] flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-[#B91C1C] shrink-0" />
              {aiInsight.needsAttention}
            </span>
          </div>

          {/* Recommended Focus */}
          <div className="bg-[#FFFCF7] border-l-4 border-[#C99632] p-3.5 rounded-r-xl border-y border-r border-[#0C2238]/06">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#C99632] block mb-0.5">
              Recommended Focus
            </span>
            <p className="text-xs font-bold text-[#10253A] leading-snug">
              {aiInsight.recommendedFocus}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
