document.addEventListener('DOMContentLoaded', async () => {
  try {
    const funnel = await api('/admin/reports/funnel');
    document.querySelector('#funnel').innerHTML = Object.entries(funnel.data.counts).map(([key, value]) => `<tr><td>${key}</td><td>${value}</td></tr>`).join('');
    document.querySelector('#rates').textContent = JSON.stringify(funnel.data.conversionRates, null, 2);
    const jobs = await api('/admin/reports/jobs');
    document.querySelector('#jobs-report').innerHTML = `<p>Total: ${jobs.data.totalJobPostings} | Open: ${jobs.data.openJobs} | Closed: ${jobs.data.closedJobs}</p><p>By location: ${JSON.stringify(jobs.data.jobsByLocation)}</p>`;
  } catch (error) { showMessage(error.message, 'danger'); }
});
