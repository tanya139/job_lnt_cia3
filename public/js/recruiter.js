document.addEventListener('DOMContentLoaded', async () => {
  if (!currentUser()) return location.href = '/login.html';
  const table = document.querySelector('#applicants-table');
  async function load() {
    const stage = document.querySelector('#stage-filter')?.value || '';
    try { const result = await api(`/recruiter/applicants${stage ? `?stage=${stage}` : ''}`); table.innerHTML = result.data.map(item => `<tr><td>${item.jobId?.title}</td><td>${item.candidateId?.name}</td><td>${item.candidateId?.email}</td><td>${item.stage}</td><td><select class="form-select stage-change" data-id="${item._id}"><option>${item.stage}</option><option>Shortlisted</option><option>Interview</option><option>Offered</option><option>Rejected</option><option>Hired</option></select></td></tr>`).join('') || '<tr><td colspan="5">No applicants.</td></tr>'; document.querySelectorAll('.stage-change').forEach(select => select.addEventListener('change', async () => { try { await api(`/applications/${select.dataset.id}/stage`, { method: 'PUT', body: JSON.stringify({ stage: select.value }) }); load(); } catch (error) { showMessage(error.message, 'danger'); } })); } catch (error) { showMessage(error.message, 'danger'); }
  }
  document.querySelector('#stage-filter')?.addEventListener('change', load); load();
});
