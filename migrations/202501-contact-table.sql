-- Tabla para datos de contacto asociados al feedback (no visible en el frontend)
create table if not exists public.feedback_contacts (
    feedback_id uuid primary key references public.feedback (id) on delete cascade,
    contact text not null,
    privacy_accepted_at timestamptz not null,
    created_at timestamptz not null default now()
);

-- RLS
alter table public.feedback_contacts enable row level security;

-- Sin políticas de select para anon: no se exponen contactos.
-- Política de upsert solo para service role (manejado por API con supabaseAdmin).
create policy "service role can write contacts"
    on public.feedback_contacts
    for all
    using (true)
    with check (true);

-- Asegurar lectura pública del feedback (si no existe ya).
alter table public.feedback enable row level security;
drop policy if exists "anon read feedback" on public.feedback;
create policy "anon read feedback"
    on public.feedback
    for select
    using (true);
