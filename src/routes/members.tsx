import { createFileRoute } from '@tanstack/react-router'
import { clubQuery } from '@/lib/club-query'
import { seo } from '@/lib/club-schema'
import { CollectionPage,ClubError,Loading } from '@/components/technexus/public-ui'
export const Route=createFileRoute('/members')({head:()=>seo('Members','Meet the TechNexus student community at Chandigarh University.'),loader:({context})=>context.queryClient.ensureQueryData(clubQuery),component:()=> <CollectionPage type="members"/>,errorComponent:ClubError,notFoundComponent:ClubError,pendingComponent:Loading})
