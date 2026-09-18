export default function SuccessScreen() {
  return (
    <div className="successScreen">
      <div className="successScreen-card">
        <div className="successScreen-circle" aria-hidden="true">
          ✓
        </div>
        <h1 className="successScreen-heading">Payment Successful</h1>
        <p className="successScreen-text">
          Your order has been received. Thank you!
        </p>
      </div>
    </div>
  );
}
