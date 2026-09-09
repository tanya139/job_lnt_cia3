document.addEventListener('DOMContentLoaded', async () => {
  if (!currentUser()) return location.href = '/login.html';
  const table = document.querySelector('#applications-table');
  try {
    const result = await api('/candidates/applications');
    table.innerHTML = result.data.map(item => `<tr><td>${item.jobId?.title || '-'}</td><td>${item.jobId?.companyId?.name || '-'}</td><td>${item.stage}</td><td>${new Date(item.appliedAt).toLocaleDateString()}</td></tr>`).join('') || '<tr><td colspan="4">No applications yet.</td></tr>';
    const offers = await api('/candidates/offers');
    document.querySelector('#offers').innerHTML = offers.data.map(offer => `<div class="card mb-2"><div class="card-body">Salary: ${offer.salary} | Joining: ${new Date(offer.joiningDate).toLocaleDateString()} | Status: <strong>${offer.status}</strong>${offer.status === 'Pending' ? `<button class="btn btn-sm btn-success ms-2 offer-action" data-id="${offer._id}" data-status="Accepted">Accept</button><button class="btn btn-sm btn-danger ms-2 offer-action" data-id="${offer._id}" data-status="Rejected">Reject</button>` : ''}</div></div>`).join('') || '<p>No offers yet.</p>';
    document.querySelectorAll('.offer-action').forEach(button => button.addEventListener('click', async () => { await api(`/offers/${button.dataset.id}/status`, { method: 'PUT', body: JSON.stringify({ status: button.dataset.status }) }); location.reload(); }));
  } catch (error) { showMessage(error.message, 'danger'); }
});
