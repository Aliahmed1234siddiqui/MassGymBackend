module.exports = ({ name, renewalDate, plan }) => `
<div style="font-family:sans-serif;max-width:560px;margin:auto;background:#f9fafb;padding:32px;border-radius:12px">
  <div style="background:#d97706;padding:24px;border-radius:8px;text-align:center;margin-bottom:24px">
    <h1 style="color:#fff;margin:0;font-size:22px">Membership Renewal Reminder</h1>
  </div>
  <p style="color:#374151">Hi <strong>${name}</strong>,</p>
  <p style="color:#374151">Your <strong>${plan}</strong> membership is due for renewal on <strong>${new Date(renewalDate).toLocaleDateString('en-PK')}</strong>.</p>
  <p style="color:#374151">Please visit the gym or contact our front desk to renew and avoid any service interruption.</p>
  <p style="color:#6b7280;font-size:12px;margin-top:24px">${process.env.GYM_NAME} · ${process.env.GYM_ADDRESS} · ${process.env.GYM_PHONE}</p>
</div>`;