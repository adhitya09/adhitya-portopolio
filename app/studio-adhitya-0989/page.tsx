import CMSPanel from "@/components/CMSPanel"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Control Studio | Adhitya Hermawan",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
}

export default function StudioSecretPage() {
  return <CMSPanel />
}
