-- Execute este SQL no Supabase SQL Editor para corrigir o login Discord

-- 1. Garantir que o trigger existe e funciona
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, avatar, discord_id, discord_username, discord_avatar)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'email',
      'Usuario'
    ),
    NEW.email,
    COALESCE(
      LEFT(COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'U'), 2)
    ),
    COALESCE(NEW.raw_user_meta_data->>'provider_id', NEW.raw_user_meta_data->>'sub'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Recriar o trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 3. Garantir que as policies de INSERT existem para profiles
-- (caso tenham sido dropadas)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own profile' AND tablename = 'profiles'
  ) THEN
    CREATE POLICY "Users can insert own profile"
      ON public.profiles FOR INSERT
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- 4. Garantir que o SELECT funciona para profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Profiles are viewable by everyone' AND tablename = 'profiles'
  ) THEN
    CREATE POLICY "Profiles are viewable by everyone"
      ON public.profiles FOR SELECT USING (true);
  END IF;
END $$;

-- 5. Criar profiles para usuarios Discord que ja existem mas nao tem profile
INSERT INTO public.profiles (id, name, email, avatar, discord_id, discord_username, discord_avatar)
SELECT
  au.id,
  COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name', au.email, 'Usuario'),
  au.email,
  COALESCE(LEFT(COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name', 'U'), 2)),
  COALESCE(au.raw_user_meta_data->>'provider_id', au.raw_user_meta_data->>'sub'),
  COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name'),
  au.raw_user_meta_data->>'avatar_url'
FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;
