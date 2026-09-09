document.addEventListener('DOMContentLoaded', async () => {
  if (!currentUser() || currentUser().role !== 'Admin') return location.href = '/login.html';
  try {
    const users = await api('/admin/users');
    document.querySelector('#users').innerHTML = users.data.map(user => `<tr><td>${user.name}</td><td>${user.email}</td><td>${user.role}</td></tr>`).join('') || '<tr><td colspan="3">No users.</td></tr>';
    const companies = await api('/admin/companies');
    document.querySelector('#companies').innerHTML = companies.data.map(company => `<tr><td>${company.name}</td><td>${company.website || '-'}</td><td>${company.location || '-'}</td><td>${company.recruiterIds?.map(user => `${user.name} (${user.email})`).join(', ') || '-'}</td></tr>`).join('') || '<tr><td colspan="4">No companies.</td></tr>';
    const jobsList = await api('/admin/jobs');
    document.querySelector('#jobs').innerHTML = jobsList.data.map(job => `<tr><td>${job.title}</td><td>${job.companyId?.name || '-'}</td><td>${job.recruiterId?.name || '-'}</td><td>${job.status}</td></tr>`).join('') || '<tr><td colspan="4">No jobs.</td></tr>';
    const overview = await api('/admin/overview');
    document.querySelector('#applications').innerHTML = overview.data.map(application => `<tr><td>${application.jobId?.title || '-'}</td><td>${application.candidateId?.name || '-'}</td><td>${application.jobId?.recruiterId?.name || '-'}</td><td>${application.stage}</td></tr>`).join('') || '<tr><td colspan="4">No applications.</td></tr>';
    const funnel = await api('/admin/reports/funnel');
    document.querySelector('#funnel').innerHTML = Object.entries(funnel.data.counts).map(([key, value]) => `<tr><td>${key}</td><td>${value}</td></tr>`).join('');
    document.querySelector('#rates').textContent = JSON.stringify(funnel.data.conversionRates, null, 2);
    const jobs = await api('/admin/reports/jobs');
    document.querySelector('#jobs-report').innerHTML = `<p>Total: ${jobs.data.totalJobPostings} | Open: ${jobs.data.openJobs} | Closed: ${jobs.data.closedJobs}</p><p>By location: ${JSON.stringify(jobs.data.jobsByLocation)}</p>`;
  } catch (error) { showMessage(error.message, 'danger'); }
});
