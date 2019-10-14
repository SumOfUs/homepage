import h from 'hyperscript';

var root = $('#greenhouse-jobs');
$.getJSON(
  'https://boards-api.greenhouse.io/v1/boards/sumofus/jobs?content=true'
).then(function(success) {
  console.log('fetched jobs:', success.jobs);
  _.forEach(success.jobs, job => root.append(renderJob(job)));
});

function renderJob(job) {
  const html = h('div.job-entry', [
    h('div.job-entry__title', job.title),
    h(
      'div.job-entry__details',
      h('div.remote', h('span', job.location.name)),
      h('a.remote.apply', { href: job.absolute_url }, h('span', 'Apply'))
    ),
  ]).outerHTML;

  return html;
}
