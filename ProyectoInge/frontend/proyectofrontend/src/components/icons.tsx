"use client"

import {
  CreditCard,
  Loader2,
  MoreVertical,
  Trash,
  User,
} from "lucide-react"

import { SVGProps } from "react"

export const Icons = {
  creditcard: CreditCard,
  spinner: (props: SVGProps<SVGSVGElement>) => (
    <Loader2 className="animate-spin" {...props} />
  ),
  mercadoPago: (props: SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 128 128"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      {...props}
    >
      <path d="M64 10C30.43 10 4 31.82 4 58.48c0 12.34 5.69 23.6 15.08 32.3 1.58 1.45 2.66 2.88 2.88 4.19.45 2.73-1.95 11.3-2.04 11.73a.86.86 0 0 0 1.23.96c.51-.23 12.58-5.43 17.34-7.65 2.33-1.08 4.91-1.64 7.51-1.64h.61c5.07 1.17 10.43 1.77 15.91 1.77 33.57 0 60-21.82 60-48.48S97.57 10 64 10zm22.92 39.34-9.71 9.75a5.71 5.71 0 0 1-8.12 0l-5.08-5.1-5.08 5.1a5.71 5.71 0 0 1-8.12 0l-9.71-9.75c-2.29-2.3-2.29-6.02 0-8.32a5.81 5.81 0 0 1 8.16 0l5.04 5.07 5.04-5.07a5.81 5.81 0 0 1 8.16 0l5.04 5.07 5.04-5.07a5.81 5.81 0 0 1 8.16 0c2.29 2.3 2.29 6.02 0 8.32z" />
    </svg>
  ),
  trash: Trash,
  user: User,
  more: MoreVertical,
}
