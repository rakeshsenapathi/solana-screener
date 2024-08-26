'use client'

import { cn } from '@/lib/utils'

interface CardProps {
    className?: any
    children?: any
}

export const Card: React.FC<CardProps> = ({ className, children }) => {
    return (
        <div
            className={cn(
                'p-3 rounded-lg border-[#242424] border-[0.5px] bg-[#171616] hover:border-[#407ED2] transition-all duration-300',
                className
            )}
        >
            {children}
        </div>
    )
}
