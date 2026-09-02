// Shared admin UI styles for consistent look & feel

export const adminBtn = {
  primary: (saving = false): React.CSSProperties => ({
    background: '#fff',
    color: '#000',
    border: 'none',
    padding: '0.65rem 1.25rem',
    borderRadius: 10,
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: saving ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    opacity: saving ? 0.6 : 1,
    transition: 'all 0.15s ease',
  }),
  secondary: (disabled = false): React.CSSProperties => ({
    background: '#1c1c1f',
    border: '1px solid #27272a',
    color: '#a1a1aa',
    padding: '0.65rem 1.25rem',
    borderRadius: 10,
    fontSize: '0.85rem',
    fontWeight: 500,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.15s ease',
  }),
  ghost: {
    background: 'transparent',
    border: '1px solid #27272a',
    color: '#a1a1aa',
    padding: '0.45rem 0.75rem',
    borderRadius: 8,
    fontSize: '0.8rem',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    transition: 'all 0.15s ease',
  },
  danger: {
    background: 'transparent',
    color: '#f87171',
    border: '1px solid rgba(248,113,113,0.25)',
    padding: '0.45rem 0.65rem',
    borderRadius: 8,
    fontSize: '0.8rem',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    transition: 'all 0.15s ease',
  },
  iconBtn: {
    background: '#1c1c1f',
    border: '1px solid #27272a',
    color: '#a1a1aa',
    width: 34,
    height: 34,
    borderRadius: 8,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s ease',
    flexShrink: 0,
  },
};

export const adminInput: React.CSSProperties = {
  width: '100%',
  background: '#0d0d0f',
  border: '1px solid #27272a',
  borderRadius: 10,
  padding: '0.7rem 0.9rem',
  color: '#fafafa',
  fontSize: '0.85rem',
  outline: 'none',
  fontFamily: 'inherit',
  transition: 'border-color 0.15s ease',
  boxSizing: 'border-box',
};

export const adminTextarea: React.CSSProperties = {
  ...adminInput,
  resize: 'vertical' as const,
  minHeight: 80,
  lineHeight: 1.5,
};

export const adminSelect: React.CSSProperties = {
  ...adminInput,
  cursor: 'pointer',
  appearance: 'none' as const,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 0.75rem center',
  paddingRight: '2.5rem',
};

export const adminLabel: React.CSSProperties = {
  display: 'block',
  fontSize: '0.775rem',
  fontWeight: 600,
  color: '#71717a',
  marginBottom: '0.45rem',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.04em',
};

export const adminCard: React.CSSProperties = {
  background: '#09090b',
  border: '1px solid #18181b',
  borderRadius: 16,
  padding: '1.5rem',
};

export const adminCardHeader: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1.25rem',
  paddingBottom: '1rem',
  borderBottom: '1px solid #18181b',
};

export const adminSectionTitle: React.CSSProperties = {
  fontSize: '1.1rem',
  fontWeight: 700,
  color: '#fafafa',
  margin: 0,
};
