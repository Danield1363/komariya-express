-- =============================================
-- Komaniya Express - Database Schema (v2)
-- Execute este SQL no painel do Supabase:
-- SQL Editor > New Query > Cole e execute
-- IMPORTANTE: Execute bloco por bloco se houver erro
-- =============================================

-- =============================================
-- 1. Tabela de profiles
-- =============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  avatar TEXT NOT NULL DEFAULT '',
  discord_id TEXT,
  discord_username TEXT,
  discord_avatar TEXT,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'employee', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 2. Funções de verificação (ANTES das policies)
-- =============================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_employee()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'employee'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_client()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'client'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 3. Policies de profiles (agora as funções existem)
-- =============================================
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete any profile"
  ON public.profiles FOR DELETE
  USING (public.is_admin());

-- =============================================
-- 4. Tabela de pedidos
-- =============================================
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  description TEXT DEFAULT '',
  items JSONB NOT NULL DEFAULT '[]',
  total_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  employee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Employees can view assigned orders"
  ON public.orders FOR SELECT
  USING (
    auth.uid() = employee_id OR
    public.is_employee() OR
    public.is_admin()
  );

CREATE POLICY "Users can create own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update all orders"
  ON public.orders FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete all orders"
  ON public.orders FOR DELETE
  USING (public.is_admin());

CREATE POLICY "Employees can update assigned orders"
  ON public.orders FOR UPDATE
  USING (
    auth.uid() = employee_id OR
    public.is_admin()
  );

-- =============================================
-- 5. Tabela de mensagens (chat)
-- =============================================
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_name TEXT NOT NULL,
  sender_role TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  read_by JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Order participants can view messages"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = messages.order_id
      AND (
        o.user_id = auth.uid() OR
        o.employee_id = auth.uid() OR
        public.is_admin()
      )
    )
  );

CREATE POLICY "Order participants can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = messages.order_id
      AND (
        o.user_id = auth.uid() OR
        o.employee_id = auth.uid() OR
        public.is_admin()
      )
    )
  );

CREATE POLICY "Participants can update read status"
  ON public.messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = messages.order_id
      AND (
        o.user_id = auth.uid() OR
        o.employee_id = auth.uid() OR
        public.is_admin()
      )
    )
  );

-- =============================================
-- 6. Tabela de status dos funcionários
-- =============================================
CREATE TABLE IF NOT EXISTS public.employee_status (
  employee_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  active_orders INTEGER NOT NULL DEFAULT 0,
  max_orders INTEGER NOT NULL DEFAULT 2,
  availability TEXT NOT NULL DEFAULT 'offline' CHECK (availability IN ('online', 'offline', 'busy')),
  last_active TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.employee_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view employee status"
  ON public.employee_status FOR SELECT USING (true);

CREATE POLICY "Employees can update own status"
  ON public.employee_status FOR UPDATE
  USING (auth.uid() = employee_id);

CREATE POLICY "Employees can insert own status"
  ON public.employee_status FOR INSERT
  WITH CHECK (auth.uid() = employee_id);

CREATE POLICY "Admins can manage all employee status"
  ON public.employee_status FOR ALL
  USING (public.is_admin());

-- =============================================
-- 7. Tabela de roles do Discord (sync com bot)
-- =============================================
CREATE TABLE IF NOT EXISTS public.discord_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discord_id TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'employee', 'admin')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.discord_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view discord roles"
  ON public.discord_roles FOR SELECT USING (true);

CREATE POLICY "Only admins can manage discord roles"
  ON public.discord_roles FOR ALL
  USING (public.is_admin());

-- =============================================
-- 8. Tabela de notificações
-- =============================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'order', 'message')),
  order_id TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can delete own notifications"
  ON public.notifications FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- 9. Trigger: criar profile automaticamente
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, avatar, discord_id, discord_username, discord_avatar)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      NEW.email
    ),
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      UPPER(LEFT(COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'U'), 2))
    ),
    NEW.raw_user_meta_data->>'provider_id',
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );

  IF (NEW.raw_user_meta_data->>'role' = 'employee') THEN
    INSERT INTO public.employee_status (employee_id, availability)
    VALUES (NEW.id, 'offline');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- 10. Trigger: sincronizar role do Discord
-- =============================================
CREATE OR REPLACE FUNCTION public.sync_discord_role()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET role = NEW.role
  WHERE discord_id = NEW.discord_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_discord_role_updated ON public.discord_roles;
CREATE TRIGGER on_discord_role_updated
  AFTER INSERT OR UPDATE ON public.discord_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_discord_role();

-- =============================================
-- 11. Trigger: atualizar contagem de pedidos
-- =============================================
CREATE OR REPLACE FUNCTION public.update_employee_order_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (OLD.employee_id IS DISTINCT FROM NEW.employee_id) THEN
    IF (OLD.employee_id IS NOT NULL) THEN
      UPDATE public.employee_status
      SET active_orders = GREATEST(active_orders - 1, 0),
          availability = CASE
            WHEN active_orders - 1 < max_orders THEN 'online'
            ELSE availability
          END,
          updated_at = NOW()
      WHERE employee_id = OLD.employee_id;
    END IF;
    IF (NEW.employee_id IS NOT NULL) THEN
      INSERT INTO public.employee_status (employee_id, active_orders, availability)
      VALUES (NEW.employee_id, 1, 'online')
      ON CONFLICT (employee_id) DO UPDATE
      SET active_orders = employee_status.active_orders + 1,
          availability = CASE
            WHEN employee_status.active_orders + 1 >= employee_status.max_orders THEN 'busy'
            ELSE 'online'
          END,
          updated_at = NOW();
    END IF;
  END IF;

  IF (NEW.status IN ('completed', 'cancelled') AND OLD.status NOT IN ('completed', 'cancelled')) THEN
    IF (NEW.employee_id IS NOT NULL) THEN
      UPDATE public.employee_status
      SET active_orders = GREATEST(active_orders - 1, 0),
          availability = CASE
            WHEN active_orders - 1 < max_orders THEN 'online'
            ELSE availability
          END,
          updated_at = NOW()
      WHERE employee_id = NEW.employee_id;
    END IF;
    UPDATE public.orders SET completed_at = NOW() WHERE id = NEW.id AND NEW.status = 'completed';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_order_employee_changed ON public.orders;
CREATE TRIGGER on_order_employee_changed
  AFTER UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_employee_order_count();

-- =============================================
-- 12. Índices para performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_employee_id ON public.orders(employee_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_messages_order_id ON public.messages(order_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);
CREATE INDEX IF NOT EXISTS idx_profiles_discord_id ON public.profiles(discord_id);
CREATE INDEX IF NOT EXISTS idx_discord_roles_discord_id ON public.discord_roles(discord_id);
