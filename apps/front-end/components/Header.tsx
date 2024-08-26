'use client'

import { useRouter } from 'next/navigation'

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
    const router = useRouter()

    const handleClick = () => {
        router.push('/')
    }

    return (
        <div className="h-16 w-screen px-3 border-b-[1px] border-b-[#242424] flex flex-col justify-center">
            <div className="flex flex-row justify-between items-center">
                <div onClick={handleClick} className="cursor-pointer">
                    <h1 className="text-white font-semibold text-lg uppercase leading-10">
                        MEME
                        <span className="font-light">SCAN</span>
                    </h1>
                </div>

                <div>
                    <button className="bg-gradient-to-r from-[#004AAD] to-[#001E47] px-2 py-2 rounded-lg border-[0.5px] font-semibold border-[#407ED2] text-sm">
                        Connect Wallet
                    </button>
                </div>
            </div>
        </div>
    )
}
