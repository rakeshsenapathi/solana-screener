'use client'

import { Token } from '@/types'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import Image from 'next/image'

interface DashboardProps {
    lpTokens: Token[]
}

const PopulateTableBody: React.FC<DashboardProps> = ({ lpTokens }) => {
    return (
        <TableBody>
            {lpTokens.map((token, id) => (
                <TableRow>
                    <TableCell className="font-medium">
                        <span className="flex flex-row gap-3">
                            <span className="text-gray-400">{`#${
                                id + 1
                            }`}</span>
                            <Image
                                src={'/solana_logo.png'}
                                alt="solana_logo"
                                width={20}
                                height={10}
                            />
                            {token.tokenA}
                        </span>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    )
}

export const Dashboard: React.FC<DashboardProps> = ({ lpTokens }) => {
    return (
        <div className="m-3 rounded-lg border-[#242424] border-[0.5px] bg-[#171616]">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px] uppercase text-white">
                            Token
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <PopulateTableBody lpTokens={lpTokens} />
            </Table>
        </div>
    )
}
