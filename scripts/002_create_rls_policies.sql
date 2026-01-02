-- RLS Policies for journals
create policy "users_select_own_journals"
  on public.journals for select
  using (auth.uid() = user_id);

create policy "users_insert_own_journals"
  on public.journals for insert
  with check (auth.uid() = user_id);

create policy "users_update_own_journals"
  on public.journals for update
  using (auth.uid() = user_id);

create policy "users_delete_own_journals"
  on public.journals for delete
  using (auth.uid() = user_id);

-- RLS Policies for tasks
create policy "users_select_own_tasks"
  on public.tasks for select
  using (auth.uid() = user_id);

create policy "users_insert_own_tasks"
  on public.tasks for insert
  with check (auth.uid() = user_id);

create policy "users_update_own_tasks"
  on public.tasks for update
  using (auth.uid() = user_id);

create policy "users_delete_own_tasks"
  on public.tasks for delete
  using (auth.uid() = user_id);

-- RLS Policies for study_sessions
create policy "users_select_own_study_sessions"
  on public.study_sessions for select
  using (auth.uid() = user_id);

create policy "users_insert_own_study_sessions"
  on public.study_sessions for insert
  with check (auth.uid() = user_id);

create policy "users_update_own_study_sessions"
  on public.study_sessions for update
  using (auth.uid() = user_id);

create policy "users_delete_own_study_sessions"
  on public.study_sessions for delete
  using (auth.uid() = user_id);

-- RLS Policies for habits
create policy "users_select_own_habits"
  on public.habits for select
  using (auth.uid() = user_id);

create policy "users_insert_own_habits"
  on public.habits for insert
  with check (auth.uid() = user_id);

create policy "users_update_own_habits"
  on public.habits for update
  using (auth.uid() = user_id);

create policy "users_delete_own_habits"
  on public.habits for delete
  using (auth.uid() = user_id);

-- RLS Policies for habit_logs
create policy "users_select_own_habit_logs"
  on public.habit_logs for select
  using (auth.uid() = user_id);

create policy "users_insert_own_habit_logs"
  on public.habit_logs for insert
  with check (auth.uid() = user_id);

create policy "users_delete_own_habit_logs"
  on public.habit_logs for delete
  using (auth.uid() = user_id);

-- RLS Policies for exams
create policy "users_select_own_exams"
  on public.exams for select
  using (auth.uid() = user_id);

create policy "users_insert_own_exams"
  on public.exams for insert
  with check (auth.uid() = user_id);

create policy "users_delete_own_exams"
  on public.exams for delete
  using (auth.uid() = user_id);
