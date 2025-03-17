-- Create a secure function to look up users
CREATE OR REPLACE FUNCTION lookup_user_by_email(lookup_email TEXT)
RETURNS TABLE (
  id uuid,
  email text
) 
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  -- First check auth.users
  RETURN QUERY
  SELECT au.id, au.email::text
  FROM auth.users au
  WHERE au.email = lookup_email
  LIMIT 1;
END;
$$;