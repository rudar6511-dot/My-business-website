import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://yefjfcrevavskvxzkkub.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllZmpmY3JldmF2c2t2eHpra3ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3NzUxMjcsImV4cCI6MjA5OTM1MTEyN30.w7n3wBB4rEbq8Cg2RpOlg-bNnLjwrGIuWajAfLhUE";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.querySelector(".order-form");
if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const originalText = button?.textContent || "Place Order";
    if (button) { button.disabled = true; button.textContent = "Placing Order..."; }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Please login before placing an order.");
        location.href = "login.html";
        return;
      }

      const fd = new FormData(form);
      const style = fd.get("style") || "Custom";
      const price = Number(fd.get("price") || 0);
      const elements = fd.getAll("elements").join(", ");

      const { error } = await supabase.from("orders").insert({
        user_id: user.id,
        name: fd.get("name") || user.user_metadata?.full_name || "",
        email: fd.get("email") || user.email || "",
        whatsapp: fd.get("whatsapp") || "",
        business_name: fd.get("business") || "",
        logo_style: style,
        price,
        status: "Pending",
        details: [
          fd.get("details") ? `Details: ${fd.get("details")}` : "",
          fd.get("primary_color") ? `Primary color: ${fd.get("primary_color")}` : "",
          fd.get("secondary_color") ? `Secondary color: ${fd.get("secondary_color")}` : "",
          fd.get("color_notes") ? `Color notes: ${fd.get("color_notes")}` : "",
          fd.get("shape") ? `Shape: ${fd.get("shape")}` : "",
          elements ? `Elements: ${elements}` : ""
        ].filter(Boolean).join(" | ")
      });

      if (error) throw error;
      location.href = "thank-you.html";
    } catch (error) {
      console.error("Order submission error:", error);
      alert("Order could not be placed. Please make sure you are logged in and the Supabase orders table is configured correctly.");
    } finally {
      if (button) { button.disabled = false; button.textContent = originalText; }
    }
  });
}
