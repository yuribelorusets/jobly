/** Presentational component for each job in job list
 * props: job
 */
function Job({ job }) {
  return (
    <div className="JobCard bg-light my-3 d-flex p-3">
      <div className=" text-start ">
        <h2>{job.title}</h2>
        {job.companyName && <h3>{job.companyName}</h3>}
        <p>Salary: ${job.salary && job.salary.toLocaleString("en")}</p>
        <p>Equity: {job.equity}</p>
      </div>
    </div>
  );
}

export default Job;
