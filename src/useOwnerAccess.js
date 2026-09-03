import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient.js';

// Shared by every protected page (Access, ResellingEngine, and any future
// gated section) to check whether the current browser holds a Supabase
// session belonging to an owner/dev account. This hook never decides
// authorization itself - it only relays what api/check-owner.js says after
// verifying the session server-side (via the public.is_owner() RPC), so a
// client cannot forge owner status by editing anything local.
//
// `checkFailed` is reported separately from `isOwner: false` on purpose:
// a real "you're not an admin" answer and a broken check (wrong env var,
// api/check-owner.js unreachable, etc.) look identical to a plain boolean,
// which made a past misconfiguration hard to diagnose from the UI alone.
export function useOwnerAccess() {
  const [state, setState] = useState({ loading: true, isOwner: false, checkFailed: false, email: null });

  useEffect(() => {
    let active = true;

    async function check(session) {
      if (!session) {
        if (active) setState({ loading: false, isOwner: false, checkFailed: false, email: null });
        return;
      }
      try {
        const res = await fetch('/api/check-owner', {
          method: 'POST',
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (!res.ok) {
          if (active) setState({ loading: false, isOwner: false, checkFailed: true, email: session.user.email });
          return;
        }
        const data = await res.json();
        if (active) setState({ loading: false, isOwner: !!data.isOwner, checkFailed: false, email: session.user.email });
      } catch (err) {
        if (active) setState({ loading: false, isOwner: false, checkFailed: true, email: session.user.email });
      }
    }

    supabase.auth.getSession().then(({ data }) => check(data.session));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setState((s) => ({ ...s, loading: true }));
      check(session);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return state;
}
