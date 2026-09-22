import Image from 'next/image'
import artemis from '@/public/artemis.png'

export default function Home() {
  return (
    <main>
      <Image
        src={artemis}
        alt="Artemis the cat"
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        style={{ objectFit: 'cover', objectPosition: '50% 45%' }}
      />
    </main>
  )
}
