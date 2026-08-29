import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://yefjfcrevavskvxzkkub.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllZmpmY3JldmF2c2t2eHpra3ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3NzUxMjcsImV4cCI6MjA5OTM1MTEyN30.w7n3wBB4rEbq8Cg2RpOlg-bNnLjwrGIuWajAfLhUE"
);

const HOME_URL = "https://rudar6511-dot.github.io/My-business-website/";

window.googleLogin = async function () {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: HOME_URL }
  });
  if (error) alert(error.message);
};

function initials(name, email) {
  const value = (name || email || "User").trim();
  const parts = value.split(/\s+/).filter(Boolean);
  return parts.length > 1
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : value.slice(0, 2).toUpperCase();
}

function showUserAvatar(user) {
  const nav = document.querySelector(".site-nav ul");
  if (!nav || !user) return;

  document.querySelectorAll(".site-nav .auth-link").forEach(el => el.remove());

  let item = document.getElementById("user-avatar-item");
  if (!item) {
    item = document.createElement("li");
    item.id = "user-avatar-item";
    nav.appendChild(item);
  }

  const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email || "User";
  const avatar = user.user_metadata?.avatar_url || user.user_metadata?.picture || "";
  const safeName = String(name).replace(/"/g, "&quot;");

  item.innerHTML = `
    <a href="dashboard.html" aria-label="Open your account" title="${safeName}" class="user-avatar-link">
      ${avatar
        ? `<img src="${avatar}" alt="${safeName}" class="user-avatar-img">`
        : `<span class="user-avatar-fallback">${initials(name, user.email)}</span>`}
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
