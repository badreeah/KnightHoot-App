// src/api/profile.js
import supabase, { supabase as sb } from '../../supabase';

const clean = (o) => Object.fromEntries(Object.entries(o).filter(([,v]) => v !== undefined));

export async function getMyProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  if (error) throw error;
  return data;
}

export async function ensureProfile(init = {}) {
  const { data: { user } } = await supabase.auth.getUser();
  const { data: existing } = await supabase.from('profiles').select('id').eq('id', user.id).maybeSingle();
  if (existing) return existing;

  const payload = clean({
    id: user.id,
    first_name: init.first_name,
    last_name: init.last_name,
    gender: init.gender,
    date_of_birth: init.date_of_birth, 
    phone: init.phone,
    email: user.email, 
  });

  const { data, error } = await supabase.from('profiles').insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function updateMyProfile(patch) {
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('profiles')
    .update({
      first_name: patch.first_name,
      last_name: patch.last_name,
      gender: patch.gender,
      date_of_birth: patch.date_of_birth,
      phone: patch.phone,
      email: patch.email,
    })
    .eq('id', user.id)
    .select()
    .single();
  if (error) throw error;
  return data;
}