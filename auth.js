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
  const value = String(name || email || "User").trim();
  const parts = value.split(/\s+/).filter(Boolean);
  return parts.length > 1
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : value.slice(0, 2).toUpperCase();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>\"']/g, ch => ({
    "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"
  }[ch]));
}

function showUserAvatar(user) {
  const nav = document.querySelector(".site-nav ul");
  if (!nav || !user) return;

  // Remove any old auth buttons if another version of the header is cached.
  document.querySelectorAll(".site-nav .auth-link, .site-nav #login-link, .site-nav #signup-link").forEach(el => el.remove());

  let item = document.getElementById("user-avatar-item");
  if (!item) {
    item = document.createElement("li");
    item.id = "user-avatar-item";
    nav.appendChild(item);
  }

  const metadata = user.user_metadata || {};
  const identityData = user.identities?.[0]?.identity_data || {};
  const name = metadata.full_name || metadata.name || identityData.full_name || identityData.name || user.email || "User";
  const avatar = metadata.avatar_url || metadata.picture || identityData.avatar_url || identityData.picture || "";
  const safeName = escapeHtml(name);

  item.innerHTML = `
    <a href="dashboard.html" aria-label="Open your account" title="${safeName}" class="user-avatar-link">
      ${avatar
        ? `<img src="${escapeHtml(avatar)}" alt="${safeName}" class="user-avatar-img" referrerpolicy="no-referrer">`
        : `<span class="user-avatar-fallback">${escapeHtml(initials(name, user.email))}</span>`}
    </a>`;
}

function removeAvatar() {
  document.getElementById("user-avatar-item")?.remove();
}

async function loadHomepageUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.warn("Supabase session check failed:", error.message);
    return;
  }
  if (data?.user) showUserAvatar(data.user);
  else removeAvatar();
}

supabase.auth.onAuthStateChange((_event, session) => {
  if (session?.user) showUserAvatar(session.user);
  else removeAvatar();
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadHomepageUser);
} else {
  loadHomepageUser();
}
