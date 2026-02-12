import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Skill } from '@/data/constants';

interface SkillContextType {
    selectedSkill: Skill | null;
    setSelectedSkill: (skill: Skill | null) => void;
}

const SkillContext = createContext<SkillContextType | undefined>(undefined);

export const SkillProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

    React.useEffect(() => {
        if (selectedSkill) {
            const timer = setTimeout(() => {
                setSelectedSkill(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [selectedSkill]);

    return (
        <SkillContext.Provider value={{ selectedSkill, setSelectedSkill }}>
            {children}
        </SkillContext.Provider>
    );
};

export const useSkillContext = () => {
    const context = useContext(SkillContext);
    if (!context) {
        throw new Error('useSkillContext must be used within a SkillProvider');
    }
    return context;
};
