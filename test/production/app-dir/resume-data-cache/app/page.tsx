import { Suspense } from 'react'
import { connection } from 'next/server'

import { unstable_cacheTag } from 'next/cache'

async function getRandomNumber() {
  'use cache'
  unstable_cacheTag('test')
  return Math.random()
}

async function DynamicComponent() {
  await connection()
  return null
}

export default async function Page() {
  const randomNumber = await getRandomNumber()
  return (
    <>
      <p id="random-number">{randomNumber}</p>
      <Suspense>
        <DynamicComponent />
      </Suspense>
    </>
  )
}
