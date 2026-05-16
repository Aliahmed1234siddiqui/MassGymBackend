module.exports = ({ name, invoiceNumber, amount, plan, method, paidAt, dueDate, memberId }) => {
  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' });

  const subtotal = Number(amount);
  const tax = 0; // adjust if you charge tax
  const total = subtotal + tax;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice ${invoiceNumber}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Helvetica Neue',Arial,sans-serif;color:#111827">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 20px">
    <tr>
      <td align="center">
        <table width="640" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.05)">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1e3a5f 0%,#2c5282 100%);padding:32px 40px">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color:#ffffff">
                    <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;opacity:0.8;margin-bottom:4px">Invoice</div>
                    <div style="font-size:24px;font-weight:700">${process.env.GYM_NAME || 'Your Gym'}</div>
                  </td>
                  <td align="right" style="color:#ffffff">
                    <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;opacity:0.8;margin-bottom:4px">Status</div>
                    <div style="display:inline-block;background:#10b981;color:#ffffff;padding:6px 14px;border-radius:20px;font-size:12px;font-weight:600">PAID</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:32px 40px 0">
              <p style="margin:0 0 4px;font-size:16px;color:#111827">Hi <strong>${name}</strong>,</p>
              <p style="margin:0;color:#6b7280;font-size:14px;line-height:1.6">
                Thank you for your payment. Below is your official receipt for your records.
              </p>
            </td>
          </tr>

          <!-- Invoice Meta -->
          <tr>
            <td style="padding:24px 40px 0">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:8px">
                <tr>
                  <td style="padding:20px;border-right:1px solid #e5e7eb;width:33%">
                    <div style="font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#9ca3af;margin-bottom:6px">Invoice No.</div>
                    <div style="font-size:14px;font-weight:600;color:#111827">${invoiceNumber}</div>
                  </td>
                  <td style="padding:20px;border-right:1px solid #e5e7eb;width:33%">
                    <div style="font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#9ca3af;margin-bottom:6px">Issue Date</div>
                    <div style="font-size:14px;font-weight:600;color:#111827">${formatDate(paidAt)}</div>
                  </td>
                  <td style="padding:20px;width:33%">
                    <div style="font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#9ca3af;margin-bottom:6px">Member ID</div>
                    <div style="font-size:14px;font-weight:600;color:#111827">${memberId ? String(memberId).slice(-8).toUpperCase() : 'N/A'}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Bill To / From -->
          <tr>
            <td style="padding:32px 40px 0">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:50%;vertical-align:top">
                    <div style="font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#9ca3af;margin-bottom:8px">Billed To</div>
                    <div style="font-size:15px;font-weight:600;color:#111827;margin-bottom:4px">${name}</div>
                    <div style="font-size:13px;color:#6b7280;line-height:1.5">Valued Member</div>
                  </td>
                  <td style="width:50%;vertical-align:top">
                    <div style="font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#9ca3af;margin-bottom:8px">From</div>
                    <div style="font-size:15px;font-weight:600;color:#111827;margin-bottom:4px">${process.env.GYM_NAME || 'Your Gym'}</div>
                    <div style="font-size:13px;color:#6b7280;line-height:1.5">${process.env.GYM_ADDRESS || ''}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Line Items -->
          <tr>
            <td style="padding:32px 40px 0">
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
                <thead>
                  <tr>
                    <th align="left" style="padding:12px 0;border-bottom:2px solid #1e3a5f;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#374151">Description</th>
                    <th align="right" style="padding:12px 0;border-bottom:2px solid #1e3a5f;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#374151">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="padding:18px 0;border-bottom:1px solid #f3f4f6">
                      <div style="font-size:14px;font-weight:600;color:#111827;margin-bottom:4px">${plan} Membership</div>
                      <div style="font-size:12px;color:#9ca3af">Monthly subscription fee</div>
                    </td>
                    <td align="right" style="padding:18px 0;border-bottom:1px solid #f3f4f6;font-size:14px;color:#111827">Rs ${subtotal.toLocaleString('en-PK')}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Totals -->
          <tr>
            <td style="padding:0 40px">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:55%"></td>
                  <td style="width:45%">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:10px 0;font-size:13px;color:#6b7280">Subtotal</td>
                        <td align="right" style="padding:10px 0;font-size:13px;color:#111827">Rs ${subtotal.toLocaleString('en-PK')}</td>
                      </tr>
                      <tr>
                        <td style="padding:10px 0;font-size:13px;color:#6b7280;border-bottom:1px solid #e5e7eb">Tax</td>
                        <td align="right" style="padding:10px 0;font-size:13px;color:#111827;border-bottom:1px solid #e5e7eb">Rs ${tax.toLocaleString('en-PK')}</td>
                      </tr>
                      <tr>
                        <td style="padding:14px 0;font-size:15px;font-weight:700;color:#111827">Total</td>
                        <td align="right" style="padding:14px 0;font-size:18px;font-weight:700;color:#1e3a5f">Rs ${total.toLocaleString('en-PK')}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Payment Info -->
          <tr>
            <td style="padding:8px 40px 32px">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#ecfdf5;border-left:4px solid #10b981;border-radius:6px">
                <tr>
                  <td style="padding:16px 20px">
                    <div style="font-size:13px;font-weight:600;color:#065f46;margin-bottom:4px">✓ Payment Received</div>
                    <div style="font-size:12px;color:#047857">
                      Paid via <strong>${method}</strong> on ${formatDate(paidAt)}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:24px 40px;border-top:1px solid #e5e7eb">
              <p style="margin:0 0 6px;font-size:12px;color:#6b7280;text-align:center">
                Questions? Reach out to us at <a href="mailto:${process.env.GYM_EMAIL || ''}" style="color:#1e3a5f;text-decoration:none">${process.env.GYM_EMAIL || 'support@gym.com'}</a>
              </p>
              <p style="margin:0;font-size:11px;color:#9ca3af;text-align:center">
                ${process.env.GYM_NAME || 'Your Gym'} · ${process.env.GYM_ADDRESS || ''}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};