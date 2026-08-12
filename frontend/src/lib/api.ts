// API client for ChargEase
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    cache: 'no-store',
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Network or server error' }));
    throw new Error(err.message || 'API Error');
  }
  return res.json();
}

// Public data fetchers
export const fetchHero = () => apiFetch('/sections/hero').then(r => r.data).catch(() => null);
export const fetchAbout = () => apiFetch('/sections/about').then(r => r.data).catch(() => null);
export const fetchVision = () => apiFetch('/sections/vision').then(r => r.data).catch(() => null);
export const fetchMission = () => apiFetch('/sections/mission').then(r => r.data).catch(() => null);
export const fetchFounders = () => apiFetch('/founders?type=founder').then(r => r.data).catch(() => []);
export const fetchCoFounders = () => apiFetch('/founders?type=cofounder').then(r => r.data).catch(() => []);
export const fetchProjects = (params = '') => apiFetch(`/projects?${params}`).then(r => r).catch(() => ({ data: [], total: 0 }));
export const fetchProjectCategories = () => apiFetch('/projects/categories').then(r => r.data).catch(() => []);
export const fetchServices = () => apiFetch('/services').then(r => r.data).catch(() => []);
export const fetchGallery = (params = '') => apiFetch(`/gallery?${params}`).then(r => r).catch(() => ({ data: [], total: 0 }));
export const fetchSettings = () => apiFetch('/settings').then(r => r.data).catch(() => ({}));

// Inquiry submission (Public)
export const submitInquiry = (data: Record<string, any>) =>
  apiFetch('/inquiries', {
    method: 'POST',
    body: JSON.stringify(data),
  });

// Admin Auth
export const adminLogin = (email: string, password: string) =>
  apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });

export const adminLogout = () =>
  apiFetch('/auth/logout', { method: 'POST' }).catch(() => null);

export const adminGetMe = () =>
  apiFetch('/auth/me').then(r => r.data);

export const adminForgotPassword = (email: string) =>
  apiFetch('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });

export const adminResetPassword = (token: string, password: string) =>
  apiFetch(`/auth/reset-password/${token}`, { method: 'POST', body: JSON.stringify({ password }) });

// Admin Dashboard & Stats
export const fetchDashboardStats = () =>
  apiFetch('/settings/dashboard').then(r => r.data);

// Admin Sections CRUD
export const updateHeroSection = (data: any) =>
  apiFetch('/sections/hero', { method: 'PUT', body: JSON.stringify(data) }).then(r => r.data);

export const updateAboutSection = (data: any) =>
  apiFetch('/sections/about', { method: 'PUT', body: JSON.stringify(data) }).then(r => r.data);

export const updateVisionSection = (data: any) =>
  apiFetch('/sections/vision', { method: 'PUT', body: JSON.stringify(data) }).then(r => r.data);

export const updateMissionSection = (data: any) =>
  apiFetch('/sections/mission', { method: 'PUT', body: JSON.stringify(data) }).then(r => r.data);

// Admin Founders CRUD
export const fetchAllFoundersAdmin = () =>
  apiFetch('/founders').then(r => r.data);

export const createFounderAdmin = (formData: FormData) =>
  apiFetch('/founders', { method: 'POST', body: formData }).then(r => r.data);

export const updateFounderAdmin = (id: string, formData: FormData) =>
  apiFetch(`/founders/${id}`, { method: 'PUT', body: formData }).then(r => r.data);

export const deleteFounderAdmin = (id: string) =>
  apiFetch(`/founders/${id}`, { method: 'DELETE' });

// Admin Projects CRUD
export const fetchAllProjectsAdmin = () =>
  apiFetch('/projects?limit=100').then(r => r.data || []);

export const createProjectAdmin = (formData: FormData) =>
  apiFetch('/projects', { method: 'POST', body: formData }).then(r => r.data);

export const updateProjectAdmin = (id: string, formData: FormData) =>
  apiFetch(`/projects/${id}`, { method: 'PUT', body: formData }).then(r => r.data);

export const deleteProjectAdmin = (id: string) =>
  apiFetch(`/projects/${id}`, { method: 'DELETE' });

export const addProjectGalleryAdmin = (id: string, formData: FormData) =>
  apiFetch(`/projects/${id}/gallery`, { method: 'POST', body: formData }).then(r => r.data);

// Admin Services CRUD
export const fetchAllServicesAdmin = () =>
  apiFetch('/services').then(r => r.data || []);

export const createServiceAdmin = (data: any) =>
  apiFetch('/services', { method: 'POST', body: JSON.stringify(data) }).then(r => r.data);

export const updateServiceAdmin = (id: string, data: any) =>
  apiFetch(`/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }).then(r => r.data);

export const deleteServiceAdmin = (id: string) =>
  apiFetch(`/services/${id}`, { method: 'DELETE' });

// Admin Gallery CRUD
export const fetchAllGalleryAdmin = (params = 'limit=100') =>
  apiFetch(`/gallery?${params}`).then(r => r.data || []);

export const createGalleryItemAdmin = (formData: FormData) =>
  apiFetch('/gallery', { method: 'POST', body: formData }).then(r => r.data);

export const updateGalleryItemAdmin = (id: string, data: any) =>
  apiFetch(`/gallery/${id}`, { method: 'PUT', body: JSON.stringify(data) }).then(r => r.data);

export const deleteGalleryItemAdmin = (id: string) =>
  apiFetch(`/gallery/${id}`, { method: 'DELETE' });

// Admin Inquiries CRUD
export const fetchAllInquiriesAdmin = (params = 'limit=100') =>
  apiFetch(`/inquiries?${params}`).then(r => r.data || []);

export const getInquiryStatsAdmin = () =>
  apiFetch('/inquiries/stats').then(r => r.data);

export const updateInquiryAdmin = (id: string, data: any) =>
  apiFetch(`/inquiries/${id}`, { method: 'PUT', body: JSON.stringify(data) }).then(r => r.data);

export const replyInquiryAdmin = (id: string, replyMessage: string) =>
  apiFetch(`/inquiries/${id}/reply`, { method: 'POST', body: JSON.stringify({ replyMessage }) }).then(r => r.data);

export const deleteInquiryAdmin = (id: string) =>
  apiFetch(`/inquiries/${id}`, { method: 'DELETE' });

// Admin Settings CRUD
export const updateSettingsAdmin = (formDataOrJson: FormData | any) =>
  apiFetch('/settings', {
    method: 'PUT',
    body: formDataOrJson instanceof FormData ? formDataOrJson : JSON.stringify(formDataOrJson),
  }).then(r => r.data);

// User / Client Auth
export const clientRegister = (name: string, email: string, password: string) =>
  apiFetch('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password, role: 'client' }) });

export const adminGetUsers = () =>
  apiFetch('/auth/users').then(r => r.data || []);

// Certificate APIs
export const adminGetCertificates = (params = 'limit=100') =>
  apiFetch(`/certificates?${params}`).then(r => r.data || []);

export const adminCreateCertificate = (formData: FormData) =>
  apiFetch('/certificates', { method: 'POST', body: formData }).then(r => r.data);

export const adminUpdateCertificate = (id: string, formData: FormData) =>
  apiFetch(`/certificates/${id}`, { method: 'PUT', body: formData }).then(r => r.data);

export const adminDeleteCertificate = (id: string) =>
  apiFetch(`/certificates/${id}`, { method: 'DELETE' });

export const searchCertificateByNumber = (certNumber: string) =>
  apiFetch(`/certificates/search/${encodeURIComponent(certNumber)}`).then(r => r.data);

export const claimCertificate = (certificateNumber: string) =>
  apiFetch('/certificates/claim', { method: 'POST', body: JSON.stringify({ certificateNumber }) });

export const getUserCertificates = () =>
  apiFetch('/certificates/my-certificates').then(r => r.data || []);

export default apiFetch;
