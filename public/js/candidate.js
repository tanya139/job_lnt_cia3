document.addEventListener('DOMContentLoaded', async () => {
  if (!currentUser()) return location.href = '/login.html';
  const render = (selector, html, empty) => { document.querySelector(selector).innerHTML = html || empty; };
  try {
    const applications = await api('/candidates/applications');
    render('#applications-table', applications.data.map(item => `<tr><td>${item.jobId?.title || '-'}</td><td>${item.jobId?.companyId?.name || '-'}</td><td>${item.stage}</td><td>${new Date(item.appliedAt).toLocaleDateString()}</td></tr>`).join(''), '<tr><td colspan="4">No applications yet.</td></tr>');

    const saved = await api('/saved-jobs');
    render('#saved-jobs', saved.data.map(item => `<div class="col-md-6"><div class="card h-100"><div class="card-body"><h5>${item.jobId?.title || 'Job'}</h5><p>${item.jobId?.location || ''}</p><button class="btn btn-outline-danger btn-sm unsave" data-id="${item._id}">Remove</button></div></div></div>`).join(''), '<p>No saved jobs yet.</p>');
    document.querySelectorAll('.unsave').forEach(button => button.addEventListener('click', async () => { await api(`/saved-jobs/${button.dataset.id}`, { method: 'DELETE' }); location.reload(); }));

    const alerts = await api('/job-alerts');
    render('#job-alerts', alerts.data.map(alert => `<div class="card mb-2"><div class="card-body"><strong>${alert.keyword || 'Any job'}</strong> ${alert.location ? `in ${alert.location}` : ''} ${alert.skills?.length ? `(${alert.skills.join(', ')})` : ''}<button class="btn btn-sm btn-outline-danger float-end delete-alert" data-id="${alert._id}">Delete</button><div class="small mt-2">Matches: ${alert.matches?.map(job => job.title).join(', ') || 'None'}</div></div></div>`).join(''), '<p>No job alerts yet.</p>');
    document.querySelectorAll('.delete-alert').forEach(button => button.addEventListener('click', async () => { await api(`/job-alerts/${button.dataset.id}`, { method: 'DELETE' }); location.reload(); }));

    const interviews = await api('/candidates/interviews');
    const now = Date.now();
    render('#interviews', interviews.data.map(interview => `<div class="card mb-2"><div class="card-body"><strong>${interview.applicationId?.jobId?.title || 'Interview'}</strong> | ${new Date(interview.scheduledAt).toLocaleString()} | ${interview.mode}<br>Recruiter: ${interview.applicationId?.jobId?.recruiterId?.name || '-'}${interview.meetingLink ? `<br>Meeting: <a href="${interview.meetingLink}" target="_blank">${interview.meetingLink}</a>` : ''}<span class="badge ${new Date(interview.scheduledAt).getTime() >= now ? 'text-bg-success' : 'text-bg-secondary'} ms-2">${new Date(interview.scheduledAt).getTime() >= now ? 'Upcoming' : 'Past'}</span></div></div>`).join(''), '<p>No interviews scheduled.</p>');

    const offers = await api('/candidates/offers');
    render('#offers', offers.data.map(offer => `<div class="card mb-2"><div class="card-body">${offer.applicationId?.jobId?.title || 'Offer'} | Salary: ${offer.salary} | Joining: ${new Date(offer.joiningDate).toLocaleDateString()} | Status: <strong>${offer.status}</strong>${offer.status === 'Pending' ? `<button class="btn btn-sm btn-success ms-2 offer-action" data-id="${offer._id}" data-status="Accepted">Accept</button><button class="btn btn-sm btn-danger ms-2 offer-action" data-id="${offer._id}" data-status="Rejected">Reject</button>` : ''}</div></div>`).join(''), '<p>No offers yet.</p>');
    document.querySelectorAll('.offer-action').forEach(button => button.addEventListener('click', async () => { await api(`/offers/${button.dataset.id}/status`, { method: 'PUT', body: JSON.stringify({ status: button.dataset.status }) }); location.reload(); }));
    document.querySelector('#alert-form').addEventListener('submit', async event => { event.preventDefault(); const data = Object.fromEntries(new FormData(event.target)); data.skills = data.skills ? data.skills.split(',').map(skill => skill.trim()).filter(Boolean) : []; await api('/job-alerts', { method: 'POST', body: JSON.stringify(data) }); location.reload(); });
  } catch (error) { showMessage(error.message, 'danger'); }
});
