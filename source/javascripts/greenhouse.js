import h from 'hyperscript';

const seeAllJobs =
  '<a class="seeAll" href="/about/jobs"><span class="fa fa-angle-double-left"></span><span>See All Jobs</span></a>';
const greenhouseContent = '<div id="grnhse_app"></div>';
const greenhouseScript =
  '<script src="https://boards.greenhouse.io/embed/job_board/js?for=sumofus"></script>';

var root = $('#greenhouse-jobs');

if (window.location.search === '') {
  console.log('jobs list');
  // root.append(fetchJobsList());
  fetchJobsList();
} else {
  console.log('job details');
  fetchJobDetails();
}

function fetchJobsList() {
  $.getJSON(
    'https://boards-api.greenhouse.io/v1/boards/sumofus/jobs?content=true'
  ).then(function(success) {
    console.log('fetched jobs:', success.jobs);
    _.forEach(success.jobs, job => root.append(renderJob(job)));
  });
}

function fetchJobDetails() {
  // const html = h('div', [
  //   h('a', {href: '/about/jobs'}, h('span', 'Check all open positions')),
  //   h('div#grnhse_app'),
  //   h('a', {href: '/about/jobs'}, h('span', 'Check all open positions')),
  // ]).outerHTML;
  root.append(seeAllJobs);
  root.append(greenhouseContent);
  root.append(seeAllJobs);
  root.append(greenhouseScript);
  // return html;
}

function renderJob(job) {
  const html = h('div.job-entry', [
    h('div.job-entry__title', job.title),
    h(
      'div.job-entry__details',
      h('div.remote', h('span', job.location.name)),
      h(
        'a.remote.apply',
        { href: `/about/jobs?gh_jid=${job.id}` },
        h('span', 'Apply')
      )
    ),
  ]).outerHTML;

  return html;
}
