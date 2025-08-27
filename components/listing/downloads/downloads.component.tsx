"use client";
import { useSearchParams } from 'next/navigation'
import React from 'react'

const Downloads = () => {
    const searchParams = useSearchParams()
    const next_url = searchParams.get('next_url')
    
    location.replace(next_url ?? '/')
    return (
        <div>

        </div>
    )
}

export default Downloads