module.exports = ({ name, email, password, plan, cardNumber }) => `
<div style="font-family:sans-serif;max-width:560px;margin:auto;background:#f9fafb;padding:32px;border-radius:12px">
  <div style="background:#1e3a5f;padding:24px;border-radius:8px;text-align:center;margin-bottom:24px">
    <h1 style="color:#fff;margin:0;font-size:24px">Welcome to <span style="color:#93c5fd">Mass Gym</span></h1>
  </div>
  <p style="color:#374151;font-size:15px">Hi <strong>${name}</strong>,</p>
  <p style="color:#374151">Your membership has been registered. Here are your login credentials:</p>
  <div style="background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:20px;margin:20px 0">
    <p style="margin:0 0 12px;color:#374151"><strong>Email:</strong> ${email}</p>
    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;padding:12px 16px;margin:16px 0;">
      <p style="margin:0 0 4px;font-size:12px;color:#2563eb;text-transform:uppercase;letter-spacing:0.05em;font-weight:bold;">Password</p>
      <p style="margin:0;font-size:18px;color:#1e3a8a;font-weight:bold;letter-spacing:1px;font-family:monospace;">${password}</p>
    </div>
    <p style="margin:0 0 8px;color:#374151"><strong>Plan:</strong> ${plan}</p>
    <p style="margin:0;color:#374151"><strong>Gym Card:</strong> ${cardNumber}</p>
  </div>
  <p style="color:#6b7280;font-size:13px">Please change your password after first login. See you at the gym!</p>
  <p style="color:#6b7280;font-size:12px;margin-top:24px">${process.env.GYM_NAME} · ${process.env.GYM_ADDRESS} · ${process.env.GYM_PHONE}</p>
</div>`;