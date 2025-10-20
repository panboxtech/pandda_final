// supabase.js - placeholder wrapper for future migration
// Exposes same calling style used in data modules: query(table).select(...), insert, update, delete
// For now it throws to signal it's not configured; when migrating implement client and methods.

export const Supabase = {
  async query() {
    throw new Error('Supabase não configurado. Use MockDB durante o protótipo.');
  },
  async insert() {
    throw new Error('Supabase não configurado. Use MockDB durante o protótipo.');
  },
  async update() {
    throw new Error('Supabase não configurado. Use MockDB durante o protótipo.');
  },
  async delete() {
    throw new Error('Supabase não configurado. Use MockDB durante o protótipo.');
  }
};
