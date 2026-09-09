const API = '/api';
const token = () => localStorage.getItem('token');
const currentUser = () => JSON.parse(localStorage.getItem('user') || 'null');

async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token()) headers.Authorization = `Bearer ${token()}`;
  const response = await fetch(API + path, { ...options, headers });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Request failed');
  return result;
}

function showMessage(message, type = 'info') {
  const area = document.querySelector('.alert-area');
  if (area) area.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
}

function renderNav() {
  const user = currentUser();
  const nav = document.querySelector('#main-nav');
  if (!nav) return;
  nav.innerHTML = `<a class="navbar-brand" href="/">Job Portal</a><button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navLinks">Menu</button><div class="collapse navbar-collapse" id="navLinks"><div class="navbar-nav ms-auto"><a class="nav-link" href="/jobs.html">Jobs</a>${user ? `<a class="nav-link" href="/${user.role.toLowerCase()}-dashboard.html">Dashboard</a><button class="btn btn-sm btn-outline-secondary m-1" id="logout">Logout</button>` : '<a class="nav-link" href="/login.html">Login</a><a class="nav-link" href="/register.html">Register</a>'}</div></div>`;
  document.querySelector('#logout')?.addEventListener('click', () => { localStorage.clear(); location.href = '/'; });
}

document.addEventListener('DOMContentLoaded', renderNav);
