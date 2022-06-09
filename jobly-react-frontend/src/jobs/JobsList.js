import { useState } from "react";
import Job from "./Job";

/** Presentational component that creates list of Job components
 *  props: jobs
 */
function JobsList({ jobs }) {
  const [shownJobs, setShownJobs] = useState(jobs.slice(0, 20));
  const numButts = Math.ceil(jobs.length / 20);
  const buttsArray = Array.from({ length: numButts }, (v, i) => i + 1);

  function showNewBatch(evt) {
    const pageNum = +evt.target.innerHTML;

    setShownJobs(jobs.slice(pageNum * 20 - 20, pageNum * 20));
  }

  return (
    <div className="JobsList container">
      <ul className="pagination justify-content-center">
        {numButts > 1 &&
          buttsArray.map((num) => (
            <li className="page-item mb-1" key={num}>
              <button className="page-link" onClick={showNewBatch}>
                {num}
              </button>
            </li>
          ))}
      </ul>

      {shownJobs.map((job) => (
        <Job key={job.id} job={job} />
      ))}
    </div>
  );
}

export default JobsList;
