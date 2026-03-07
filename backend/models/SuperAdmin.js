import { query } from "../config/database.js";
async function createManager(username, email, password_hash, full_name) {
  await query(
    "insert into users(username,email,password_hash,full_name) values($1,$2,crypt($3,gen_salt('bg')),$4)",
    [username, email, password_hash, full_name],
  );
}
