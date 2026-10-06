import { createFileRoute } from '@tanstack/react-router'
import { clubQuery } from '@/lib/club-query'
import { seo } from '@/lib/club-schema'
import { CollectionPage,ClubError,Loading } from '@/components/technexus/public-ui'
export const Route=createFileRoute('/core-team')({head:()=>seo('Core Team','Meet the team shaping the TechNexus AIT-CSE community.'),loader:({context})=>context.queryClient.ensureQueryData(clubQuery),component:()=> <CollectionPage type="core_members"/>,errorComponent:ClubError,notFoundComponent:ClubError,pendingComponent:Loading})
