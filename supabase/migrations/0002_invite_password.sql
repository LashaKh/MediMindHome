-- 0002_invite_password.sql
-- Adds an explicit password column to investor_invites and backfills it.
-- Format: FirstName + UPPER(FirstLetterOfSurname). Examples:
--   "Lasha Khoshtaria"  -> "LashaK"
--   "Test User"         -> "TestU"
--   "Single"            -> "Single"   (single-word fallback)
--
-- Existing logic compared the typed password against first_name (lowercase).
-- After this migration, the comparison shifts to the password column
-- (case-insensitive). The investor-login edge function update is shipped
-- in the same release.

alter table investor_invites
  add column if not exists password text;

-- Backfill multi-word names: FirstName + UPPER(first letter of surname)
update investor_invites
set password = (
  split_part(full_name, ' ', 1)
  || upper(left(
       split_part(full_name, ' ',
         array_length(string_to_array(trim(full_name), ' '), 1)
       ),
       1
     ))
)
where password is null
  and full_name is not null
  and array_length(string_to_array(trim(full_name), ' '), 1) >= 2;

-- Backfill single-word names: just the first word
update investor_invites
set password = split_part(trim(full_name), ' ', 1)
where password is null
  and full_name is not null;

alter table investor_invites
  alter column password set not null;
