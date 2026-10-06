import { z } from 'zod'
export const tables = ['members','core_members','activities','events','volunteer_applications','join_applications','contact_messages','club_content','site_settings'] as const
export type Table = typeof tables[number]
export type RecordRow = { id: string; data: Record<string,string>; status: string; created_at: string }
const text = z.string().trim().max(3000)
const optionalUrl = z.string().trim().max(1000).refine(v => !v || /^https:\/\//.test(v), 'Use a secure https:// URL')
export const recordSchema = z.object({ table: z.enum(tables), id: z.string().uuid().optional(), status: z.enum(['Active','Inactive','Published','Draft','Upcoming','Ongoing','Completed','Cancelled','New','Reviewed','Read']), data: z.record(z.string().max(80),text).refine(d=>Object.keys(d).length<=40,'Too many fields') })
export const submissionSchema = z.object({ kind:z.enum(['join','volunteer','contact']), data:z.object({ name:z.string().trim().min(2,'Enter your full name').max(100), email:z.string().trim().email('Enter a valid email').max(255), phone:z.string().trim().max(30).optional(), student_id:text.optional(), department:text.optional(), year:text.optional(), skills:text.optional(), interests:text.optional(), github:optionalUrl.optional(), linkedin:optionalUrl.optional(), motivation:text.optional(), experience:text.optional(), availability:text.optional(), subject:text.optional(), message:text.optional(), website:z.string().max(100).optional() }).superRefine((d,ctx)=>{ for(const key of ['department','year'] as const) { if(!d[key] && !d.subject) ctx.addIssue({code:'custom',path:[key],message:'This field is required'}) } }) }).superRefine((v,ctx)=> { const required=v.kind==='contact'?['subject','message']:v.kind==='join'?['motivation']:['interests','motivation','availability']; for(const key of required) if(!v.data[key as keyof typeof v.data]?.trim())ctx.addIssue({code:'custom',path:['data',key],message:'This field is required'}) })
export const fields: Record<Table,string[]> = {
 members:['name','position','department','year','skills','bio','linkedin','github','email','show_email','image'],
 core_members:['name','position','bio','linkedin','github','image'],
 activities:['title','description','category','date','link','image'],
 events:['title','description','date','start_time','end_time','venue','category','registration_url','organizer','speaker','image'],
 volunteer_applications:[],join_applications:[],contact_messages:[],
 club_content:['hero_title','hero_description','about','mission','vision','objectives','cta','footer'],
 site_settings:['categories','email','phone','address','linkedin','github','instagram','google_verification','canonical_url']
}
export function label(key:string){return key.replaceAll('_',' ').replace(/\b\w/g,c=>c.toUpperCase())}
export const seo = (title:string,description:string)=>({meta:[{title:`${title} — TechNexus`},{name:'description',content:description},{property:'og:title',content:`${title} — TechNexus`},{property:'og:description',content:description},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]})
