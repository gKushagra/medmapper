create extension if not exists "uuid-ossp";
alter table scan_session alter column created_by set data type uuid using (uuid_generate_v4());