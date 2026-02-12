import { useEffect, useCallback } from 'react';
import { Skill, SKILLS, SkillNames } from '@/data/constants';

interface UseSkillKeyboardOptions {
    onSkillSelect: (skill: Skill) => void;
    enabled?: boolean;
}

export const useSkillKeyboard = ({
    onSkillSelect,
    enabled = true,
}: UseSkillKeyboardOptions) => {
    const handleKeyPress = useCallback(
        (event: KeyboardEvent) => {
            // Don't trigger if user is typing in an input field
            const isInputFocused =
                document.activeElement?.tagName === 'INPUT' ||
                document.activeElement?.tagName === 'TEXTAREA' ||
                (document.activeElement as HTMLElement)?.isContentEditable;

            if (isInputFocused || !enabled) return;

            // Map keys to skills (QWERTY layout)
            const keyToSkillMap: Record<string, SkillNames> = {
                'q': SkillNames.TENSORFLOW,
                'w': SkillNames.UNITY,
                'e': SkillNames.HTML,
                'r': SkillNames.CSS,
                't': SkillNames.NEXTJS,
                'y': SkillNames.TAILWIND,
                'u': SkillNames.NODEJS,
                'i': SkillNames.EXPRESS,
                'o': SkillNames.GIT,
                'p': SkillNames.GITHUB,
                'a': SkillNames.REACT,
                's': SkillNames.NPM,
                'd': SkillNames.LINUX,
                'f': SkillNames.FIREBASE,
                'g': SkillNames.MONGODB,
                'h': SkillNames.AWS,
            };

            const skillName = keyToSkillMap[event.key];
            if (skillName) {
                event.preventDefault();
                const skill = SKILLS[skillName];
                if (skill) {
                    onSkillSelect(skill);
                }
            }
        },
        [onSkillSelect, enabled]
    );

    useEffect(() => {
        if (!enabled) return;

        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress, enabled]);
};
