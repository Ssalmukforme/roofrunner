-- Registers ROOFRUNNER in the shared ssalmuk_ranking Supabase leaderboard.
-- The core schema (games, boards, scores, get_leaderboard, submit_score) lives in the SKYHOOK repo:
-- supabase/migrations/20260915000000_ranking_core.sql. Safe to re-run.
-- Value: finish time in milliseconds, lower wins. Keep in sync with src/ranking-boards.js.
insert into public.games (id, name) values ('roofrunner', 'ROOFRUNNER')
on conflict (id) do update set name = excluded.name;

insert into public.boards (game_id, id, name, higher_is_better, min_value, max_value) values
  ('roofrunner', 'sunset-v5', '선셋 디스트릭트', false, 13726, 3600000),
  ('roofrunner', 'harbor-v5', '하버 라인', false, 15581, 3600000),
  ('roofrunner', 'neon-v5', '네온 하이츠', false, 10120, 3600000),
  ('roofrunner', 'dawn-v5', '새벽 언덕', false, 12851, 3600000)
on conflict (game_id, id) do update set
  name = excluded.name, higher_is_better = excluded.higher_is_better, min_value = excluded.min_value,
  max_value = excluded.max_value, penalty_key = excluded.penalty_key, penalty_per = excluded.penalty_per;
