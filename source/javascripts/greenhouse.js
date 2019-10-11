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
    h('p', h('a.job-entry__title', { href: job.absolute_url }, job.title)),
    h('span.subtitle', job.location.name),
  ]).outerHTML;

  console.log(html);

  return html;
}
