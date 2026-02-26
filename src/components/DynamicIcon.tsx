import {
  Calculator,
  Atom,
  BookOpen,
  Globe,
  PenTool,
  FlaskConical,
  Landmark,
  Languages,
  Brain,
  Lightbulb,
  Microscope,
  Music,
  Palette,
  Ruler,
  Scroll,
  Trophy,
  type LucideProps,
} from 'lucide-react';

const iconMap: Record<string, React.FC<LucideProps>> = {
  calculator: Calculator,
  atom: Atom,
  'book-open': BookOpen,
  globe: Globe,
  'pen-tool': PenTool,
  'flask-conical': FlaskConical,
  landmark: Landmark,
  languages: Languages,
  brain: Brain,
  lightbulb: Lightbulb,
  microscope: Microscope,
  music: Music,
  palette: Palette,
  ruler: Ruler,
  scroll: Scroll,
  trophy: Trophy,
};

interface DynamicIconProps extends LucideProps {
  name: string;
}

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  const Icon = iconMap[name] || BookOpen;
  return <Icon {...props} />;
}
