document.addEventListener('DOMContentLoaded', async () => {
  const form = document.querySelector('#search-form');
  const list = document.querySelector('#jobs-list');
  async function loadJobs() {
    const params = new URLSearchParams(new FormData(form));
    try {
      const result = await api(`/jobs/search?${params}`);
      const candidate = currentUser()?.role === 'Candidate';
      list.innerHTML = result.data.length ? result.data.map(job => `<div class="col-md-6"><div class="card job-card"><div class="card-body"><h5>${job.title}</h5><p>${job.companyId?.name || 'Company'} | ${job.location}</p><p>${job.description}</p><p><strong>Skills:</strong> ${(job.skills || []).join(', ')}</p>${candidate ? `<button class="btn btn-primary btn-sm apply-job" data-id="${job._id}">Apply</button> <button class="btn btn-outline-secondary btn-sm save-job" data-id="${job._id}">Save</button>` : '<a class="btn btn-primary btn-sm" href="/login.html">Login to apply</a>'}</div></div></div>`).join('') : '<p>No open jobs found.</p>';
      document.querySelectorAll('.apply-job').forEach(button => button.addEventListener('click', async () => { try { await api('/applications', { method: 'POST', body: JSON.stringify({ jobId: button.dataset.id }) }); showMessage('Application submitted', 'success'); } catch (error) { showMessage(error.message, 'danger'); } }));
      document.querySelectorAll('.save-job').forEach(button => button.addEventListener('click', async () => { try { await api('/saved-jobs', { method: 'POST', body: JSON.stringify({ jobId: button.dataset.id }) }); showMessage('Job saved', 'success'); } catch (error) { showMessage(error.message, 'danger'); } }));
    } catch (error) { showMessage(error.message, 'danger'); }
  }
  form.addEventListener('submit', event => { event.preventDefault(); loadJobs(); });
  loadJobs();
});
