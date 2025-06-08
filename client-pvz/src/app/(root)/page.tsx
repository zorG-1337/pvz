import type { Metadata } from 'next'
import { Home } from './Home'

export const metadata: Metadata = {
    title: '',
}

export default function HomePage() {
    return <Home />
}