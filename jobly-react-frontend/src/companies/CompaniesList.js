import { useState } from "react";
import CompanyCard from "./CompanyCard";

/** Presentation Component for creating list of CompanyCards
 * props: companies
 */
function CompaniesList({ companies }) {
  const [shownCompanies, setShownCompanies] = useState(companies.slice(0, 20));
  const numButts = Math.ceil(companies.length / 20);
  const buttsArray = Array.from({ length: numButts }, (v, i) => i + 1);

  function showNewBatch(evt) {
    const pageNum = +evt.target.innerHTML;

    setShownCompanies(companies.slice(pageNum * 20 - 20, pageNum * 20));
  }

  return (
    <div className="CompaniesList container">
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

      {shownCompanies.map((company) => (
        <CompanyCard key={company.handle} company={company} />
      ))}
    </div>
  );
}

export default CompaniesList;
