DROP POLICY IF EXISTS orders_select_user ON orders;
DROP POLICY IF EXISTS orders_select_admin ON orders;
DROP POLICY IF EXISTS orders_select_employee ON orders;
DROP POLICY IF EXISTS orders_insert ON orders;
DROP POLICY IF EXISTS orders_update_admin ON orders;
DROP POLICY IF EXISTS orders_update_employee ON orders;

CREATE POLICY orders_select_user ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY orders_select_admin ON orders FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY orders_select_employee ON orders FOR SELECT USING (auth.uid() = employee_id);
CREATE POLICY orders_insert ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY orders_update_admin ON orders FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY orders_update_employee ON orders FOR UPDATE USING (auth.uid() = employee_id);

DROP POLICY IF EXISTS messages_select ON messages;
DROP POLICY IF EXISTS messages_insert ON messages;
DROP POLICY IF EXISTS messages_update ON messages;

CREATE POLICY messages_select ON messages FOR SELECT USING (EXISTS (SELECT 1 FROM orders WHERE id = order_id AND (user_id = auth.uid() OR employee_id = auth.uid())) OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY messages_insert ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY messages_update ON messages FOR UPDATE USING (true);

DROP POLICY IF EXISTS notif_select ON notifications;
DROP POLICY IF EXISTS notif_insert ON notifications;
DROP POLICY IF EXISTS notif_update ON notifications;
DROP POLICY IF EXISTS notif_delete ON notifications;

CREATE POLICY notif_select ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY notif_insert ON notifications FOR INSERT WITH CHECK (true);
CREATE POLICY notif_update ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY notif_delete ON notifications FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS emp_select ON employee_status;
DROP POLICY IF EXISTS emp_insert ON employee_status;
DROP POLICY IF EXISTS emp_update ON employee_status;
DROP POLICY IF EXISTS emp_delete ON employee_status;
DROP POLICY IF EXISTS emp_admin_manage ON employee_status;

CREATE POLICY emp_select ON employee_status FOR SELECT USING (true);
CREATE POLICY emp_insert ON employee_status FOR INSERT WITH CHECK (auth.uid() = employee_id);
CREATE POLICY emp_update ON employee_status FOR UPDATE USING (auth.uid() = employee_id);
CREATE POLICY emp_delete ON employee_status FOR DELETE USING (auth.uid() = employee_id);
CREATE POLICY emp_admin_manage ON employee_status FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS profiles_select ON profiles;
DROP POLICY IF EXISTS profiles_insert ON profiles;
DROP POLICY IF EXISTS profiles_update_own ON profiles;
DROP POLICY IF EXISTS profiles_update_admin ON profiles;
DROP POLICY IF EXISTS profiles_delete_admin ON profiles;

CREATE POLICY profiles_select ON profiles FOR SELECT USING (true);
CREATE POLICY profiles_insert ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY profiles_update_own ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY profiles_update_admin ON profiles FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY profiles_delete_admin ON profiles FOR DELETE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

ALTER TABLE discord_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS discord_roles_select ON discord_roles;
CREATE POLICY discord_roles_select ON discord_roles FOR SELECT USING (true);
