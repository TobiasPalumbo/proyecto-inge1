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
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    fill="none"
    {...props}
  >
    <rect width="256" height="256" rx="60" fill="#00B1EA" />
    <path
      d="M128 62c33.6 0 66 15.5 66 41s-32.4 41-66 41-66-15.5-66-41 32.4-41 66-41Z"
      fill="#fff"
    />
    <path
      d="M104.3 98.7c-2.3-2.6-6.5-2.8-9.6-.6l-9.5 6.6c-3.2 2.2-4.3 6-2.4 8.7 6.6 9.5 18.4 15.6 29.2 16l15.5-13.3-12.6-17.4c-2.4-3.4-6.5-3.8-9.7-.7l-3.3 3.4-3.5-3.7Zm47.4 0c2.3-2.6 6.5-2.8 9.6-.6l9.5 6.6c3.2 2.2 4.3 6 2.4 8.7-6.6 9.5-18.4 15.6-29.2 16l-15.5-13.3 12.6-17.4c2.4-3.4 6.5-3.8 9.7-.7l3.3 3.4 3.5-3.7Z"
      fill="#00B1EA"
    />
  </svg>
),
}
