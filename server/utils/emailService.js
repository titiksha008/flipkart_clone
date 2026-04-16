import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

export const sendOrderConfirmationEmail = async ({ to, name, order }) => {
  const itemsHtml = order.orderItems
    .map(
      (item) => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee;">${item.product.name}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">₹${(
            Number(item.price_at_purchase) * Number(item.quantity)
          ).toLocaleString()}</td>
        </tr>
      `
    )
    .join('');

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#2874f0;padding:20px;text-align:center;">
        <h1 style="color:white;margin:0;font-size:24px;">Flipkart</h1>
      </div>
      <div style="padding:24px;">
        <h2 style="color:#333;">Order Confirmed! 🎉</h2>
        <p style="color:#555;">Hi <strong>${name}</strong>, your order has been placed successfully.</p>

        <div style="background:#f5f5f5;padding:12px 16px;border-radius:4px;margin:16px 0;">
          <p style="margin:0;font-size:14px;color:#777;">Order ID</p>
          <p style="margin:4px 0 0;font-size:20px;font-weight:bold;color:#2874f0;">#${order.id}</p>
        </div>

        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          <thead>
            <tr style="background:#f0f0f0;">
              <th style="padding:10px;text-align:left;font-size:13px;">Product</th>
              <th style="padding:10px;text-align:center;font-size:13px;">Qty</th>
              <th style="padding:10px;text-align:right;font-size:13px;">Price</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding:12px 8px;font-weight:bold;font-size:15px;">Total</td>
              <td style="padding:12px 8px;font-weight:bold;font-size:15px;text-align:right;">₹${Number(
                order.total_price
              ).toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>

        <div style="background:#e8f5e9;padding:12px 16px;border-radius:4px;border-left:4px solid #4caf50;">
          <p style="margin:0;font-size:13px;color:#2e7d32;">
            <strong>Delivery Address:</strong><br/>${order.shipping_address}
          </p>
        </div>

        <p style="color:#999;font-size:12px;margin-top:24px;">Thank you for shopping with Flipkart Clone!</p>
      </div>
    </div>
  `;

  const info = await transporter.sendMail({
    from: `"Flipkart Clone" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Order Confirmed ✓ — Order #${order.id}`,
    html,
  });

  console.log('Order email sent successfully:', info.response);
  return info;
};