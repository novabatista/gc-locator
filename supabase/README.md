# Supabase setup

Conteúdo deste diretório:
- `migrations/0001_init.sql` — schema inicial da tabela `gcs` + RLS

## Setup manual (one-time)

1. **Criar projeto Supabase**: https://supabase.com/dashboard → New project
2. **Coletar credenciais** em *Settings → API*:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` (secret) → `SUPABASE_SERVICE_ROLE_KEY`
3. **Aplicar schema**: *SQL Editor* → cole `migrations/0001_init.sql` → *Run*
4. **Criar buckets** em *Storage* (todos *Public*):
   - `gc-maps`
   - `gc-qr`
   - `gc-opengraph`
5. **Criar usuário admin** em *Authentication → Users* → *Add user* (email + senha)
6. **Rodar seed** local com env vars setadas:
   ```bash
   npm run db:seed
   ```
7. **Adicionar mesmas env vars na Vercel** (Project → Settings → Environment Variables) e redeploy

## Env vars (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```
