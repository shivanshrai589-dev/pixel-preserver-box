import { createFileRoute } from '@tanstack/react-router'
import { clubQuery } from '@/lib/club-query'
import { seo } from '@/lib/club-schema'
import { CollectionPage,ClubError,Loading } from '@/components/technexus/public-ui'
export const Route=createFileRoute('/activities')({head:()=>seo('Activities','Explore TechNexus workshops, projects, and technical activities.'),loader:({context})=>context.queryClient.ensureQueryData(clubQuery),component:()=> <CollectionPage type="activities"/>,errorComponent:ClubError,notFoundComponent:ClubError,pendingComponent:Loading})
