REVOKE SELECT ON public.members FROM anon;
DROP POLICY public_read ON public.members;
CREATE VIEW public.public_members WITH (security_barrier=true) AS SELECT id,CASE WHEN data->>'show_email'='true' THEN data ELSE data-'email' END AS data,status,created_at FROM public.members WHERE status='Active';
GRANT SELECT ON public.public_members TO anon,authenticated;
GRANT ALL ON public.public_members TO service_role;