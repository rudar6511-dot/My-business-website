import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://yefjfcrevavskvxzkkub.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllZmpmY3JldmF2c2t2eHpra3ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3NzUxMjcsImV4cCI6MjA5OTM1MTEyN30.w7n3wBB4rEbq8Cg2RpOlg-bNnLjwrGIuWajAfLhUE"
);

const HOME_URL = "https://rudar6511-dot.github.io/My-business-website/";

// Google Login
window.googleLogin = async function () {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: HOME_URL }
  });

  if (error) alert(error.message);
};

function initials(name, email) {
  const value = (name || email || "U").trim();
  const parts = value.split(/\s+/).filter(Boolean);
  if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
  return value.slice(0, 2).toUpperCase();
}

function showUserAvatar(user) {
  const nav = document.querySelector(".site-nav ul");
  if (!nav || !user) return;

  let item = document.getElementById("user-avatar-item");
  if (!item) {
    item = document.createElement("li");
    item.id = "user-avatar-item";
    nav.appendChild(item);
  }

  const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email || "User";
  const avatar = user.user_metadata?.avatar_url || user.user_metadata?.picture || "";

  item.innerHTML = `
    <a href="dashboard.html" aria-label="Open your account" title="${name.replace(/\"/g, "&quot;")}" style="display:flex;align-items:center;gap:8px;text-decoration:none;">
      ${avatar
        ? `<img src="${avatar}" alt="${name.replace(/\"/g, "&quot;")}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;border:2px solid #0b6efd;">`
        : `<span style="width:40px;height:40px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#0b6efd,#00c6ff);color:#fff;font-weight:700;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.15);">${initials(name, user.email)}</span>`
      }
    </a>`;
}

async function loadHomepageUser() {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) showUserAvatar(user);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadHomepageUser);
} else {
  loadHomepageUser();
}
