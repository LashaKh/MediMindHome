-- Sales CRM: a "message" timeline entry (WhatsApp, Messenger, SMS, LinkedIn).
-- Most first contact with Georgian hospitals happens in a messenger, not by email.
-- Like a call or an email, a logged message counts as contact with the hospital.

alter table public.crm_activities drop constraint if exists crm_activities_type_check;
alter table public.crm_activities add constraint crm_activities_type_check
  check (type in ('note', 'call', 'meeting', 'email', 'message',
                  'created', 'stage', 'status', 'owner', 'next_step',
                  'moved', 'archived', 'restored', 'inbound'));
