ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY orders_select_user ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY orders_select_admin ON orders FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY orders_select_employee ON orders FOR SELECT USING (auth.uid() = employee_id);
CREATE POLICY orders_insert ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY orders_update_admin ON orders FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY orders_update_employee ON orders FOR UPDATE USING (auth.uid() = employee_id);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY messages_select ON messages FOR SELECT USING (EXISTS (SELECT 1 FROM orders WHERE id = order_id AND (user_id = auth.uid() OR employee_id = auth.uid())) OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY messages_insert ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY messages_update ON messages FOR UPDATE USING (true);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY notif_select ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY notif_insert ON notifications FOR INSERT WITH CHECK (true);
CREATE POLICY notif_update ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY notif_delete ON notifications FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE employee_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY emp_select ON employee_status FOR SELECT USING (true);
CREATE POLICY emp_insert ON employee_status FOR INSERT WITH CHECK (auth.uid() = employee_id);
CREATE POLICY emp_update ON employee_status FOR UPDATE USING (auth.uid() = employee_id);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY profiles_select ON profiles FOR SELECT USING (true);
CREATE POLICY profiles_insert ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY profiles_update_own ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY profiles_update_admin ON profiles FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY profiles_delete_admin ON profiles FOR DELETE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

ALTER PUBLICATION supabase_realtime ADD TABLE messages;
