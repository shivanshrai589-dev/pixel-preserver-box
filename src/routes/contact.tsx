import { createFileRoute } from '@tanstack/react-router'
import { seo } from '@/lib/club-schema'
import { ApplicationForm } from '@/components/technexus/application-form'
export const Route=createFileRoute('/contact')({head:()=>seo('Contact','Send a message to the TechNexus team at Chandigarh University.'),component:()=> <ApplicationForm kind="contact"/>})
