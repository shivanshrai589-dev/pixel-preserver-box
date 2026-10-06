import { createFileRoute } from '@tanstack/react-router'
import { ResetPassword } from '@/components/technexus/auth'
import { seo } from '@/lib/club-schema'
export const Route=createFileRoute('/reset-password')({head:()=>({meta:[...seo('Reset password','Secure TechNexus administrator access.').meta,{name:'robots',content:'noindex,nofollow'}]}),component:ResetPassword})
