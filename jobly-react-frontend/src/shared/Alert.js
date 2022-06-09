import formErrorsMap from "./FormErrors";

/** Presentational Alert component
 *
 * props: alerts(list)
 * state: none
 */
function Alert({ alerts }) {
  console.log(alerts);
  const success = alerts.includes("Successfully updated!") ? true : false;
  alerts = alerts.map((alert) =>
    formErrorsMap[alert] ? formErrorsMap[alert] : alert
  );

  if (success) {
    return (
      <div className="alert alert-success">
        {alerts.map((alert, idx) => (
          <p key={idx}>{alert}</p>
        ))}
      </div>
    );
  }

  return (
    <div className="alert alert-danger">
      {alerts.map((alert, idx) => (
        <p key={idx}>{alert}</p>
      ))}
    </div>
  );
}

export default Alert;
