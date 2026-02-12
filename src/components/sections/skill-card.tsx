import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skill } from '@/data/constants';
import { cn } from '@/lib/utils';

interface SkillCardProps {
    skill: Skill | null;
    position?: { x: number; y: number };
    className?: string;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, position, className }) => {
    if (!skill) return null;

    // Proficiency stars
    const renderProficiency = (level: number) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3].map((star) => (
                    <svg
                        key={star}
                        className={cn(
                            "w-4 h-4",
                            star <= level ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
                        )}
                        viewBox="0 0 20 20"
                    >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                ))}
            </div>
        );
    };

    // Category badge color
    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'frontend':
                return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            case 'backend':
                return 'bg-green-500/20 text-green-300 border-green-500/30';
            case 'tools':
                return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
            case 'cloud':
                return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
            default:
                return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{
                opacity: 0,
                scale: 0.5,
                y: -50,
                rotate: 5,
                filter: 'blur(15px)',
                transition: { duration: 0.4, ease: 'backIn' }
            }}
            transition={{ duration: 0.4, type: 'spring', damping: 20, stiffness: 100 }}
            style={{
                position: 'absolute',
                left: position?.x || '50%',
                top: position?.y || '50%',
                transform: 'translate(-50%, -50%)',
            }}
            className={cn(
                'skill-card',
                'w-80 p-6 rounded-2xl',
                'bg-white/10 dark:bg-black/20',
                'backdrop-blur-xl',
                'border border-white/20 dark:border-white/10',
                'shadow-2xl shadow-black/50',
                'pointer-events-auto',
                className
            )}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-1">{skill.label}</h3>
                    <div className="flex items-center gap-2">
                        {renderProficiency(skill.proficiency)}
                        {skill.yearsOfExperience && (
                            <span className="text-xs text-gray-400">
                                {skill.yearsOfExperience}+ years
                            </span>
                        )}
                    </div>
                </div>

                {/* Keyboard shortcut badge */}
                {skill.keyboardShortcut && (
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 border border-white/20">
                        <span className="text-sm font-mono font-bold text-white">
                            {skill.keyboardShortcut}
                        </span>
                    </div>
                )}
            </div>

            {/* Category badge */}
            <div className="mb-4">
                <span
                    className={cn(
                        'inline-block px-3 py-1 rounded-full text-xs font-semibold border',
                        getCategoryColor(skill.category)
                    )}
                >
                    {skill.category.charAt(0).toUpperCase() + skill.category.slice(1)}
                </span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-300 leading-relaxed">
                {skill.description}
            </p>

            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        </motion.div>
    );
};

export default SkillCard;
