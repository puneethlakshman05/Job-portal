import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhooks = async (req, res) => {
  try {
    const payload = req.body.toString("utf8");
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    const evt = wh.verify(payload, headers);

    const { data, type } = evt;
    console.log("📩 Clerk webhook:", type, data.id);

    const userData = {
      _id: data.id,
      email: data.email_addresses[0]?.email_address,
      name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
      image: data.image_url,
    };

    switch (type) {
      case "user.created":
      case "user.updated":
        await User.findByIdAndUpdate(data.id, userData, { upsert: true, new: true });
        console.log("✅ User saved/updated:", userData);
        break;

      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        console.log("🗑 User deleted:", data.id);
        break;

      default:
        console.log("⚠️ Unhandled Clerk event:", type);
    }

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Webhook Error:", err.message);
    res.status(400).json({ success: false, message: "Webhook Error" });
  }
};
