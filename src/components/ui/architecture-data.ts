import { Shield, Eye, CheckCircle, Target, Database } from 'lucide-react';

export interface AgentLayer {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  position: number;
}

export const agentLayers: AgentLayer[] = [
  {
    id: 'doctor-assurance',
    title: 'Doctor Assurance',
    description: 'Guarantees answers are fully supported and accurate',
    icon: Shield,
    color: 'from-primary to-secondary',
    position: 0
  },
  {
    id: 'hallucination-filtering',
    title: 'Hallucination Filtering',
    description: 'Eliminates unsupported or inaccurate information',
    icon: Eye,
    color: 'from-secondary to-accent',
    position: 1
  },
  {
    id: 'quality-check',
    title: 'Answer Quality Check',
    description: 'Postprocessing QA: Ensures answers align with user queries',
    icon: CheckCircle,
    color: 'from-accent to-primary',
    position: 2
  },
  {
    id: 'relevance-ranking',
    title: 'Source Relevance Ranking',
    description: 'Preprocessing QA: Rigorous evaluation of source relevance',
    icon: Target,
    color: 'from-primary to-accent',
    position: 3
  },
  {
    id: 'knowledge-bases',
    title: 'Specialty Knowledge Bases',
    description: 'Grounded in specialty-specific medical guidelines',
    icon: Database,
    color: 'from-secondary to-primary',
    position: 4
  }
];