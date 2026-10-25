"use client"
import { useRouter } from "next/navigation"

export default function IndexPage() {
  const router = useRouter()
  router.push("/dashboard")

  return (
    <>
    </>
  )
}
