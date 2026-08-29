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
  return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : value.slice(0, 2).toUpperCase();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>\"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[ch]));
}

function showUserAvatar(user) {
  const nav = document.querySelector(".site-nav ul");
  if (!nav || !user) return;
  document.querySelectorAll(".site-nav .auth-link, .site-nav #login-link, .site-nav #signup-link").forEach(el => el.remove());
  let item = document.getElementById("user-avatar-item");
  if (!item) { item = document.createElement("li"); item.id = "user-avatar-item"; nav.appendChild(item); }
  const metadata = user.user_metadata || {};
  const identityData = user.identities?.[0]?.identity_data || {};
  const name = metadata.full_name || metadata.name || identityData.full_name || identityData.name || user.email || "User";
  const avatar = metadata.avatar_url || metadata.picture || identityData.avatar_url || identityData.picture || "";
  const safeName = escapeHtml(name);
  item.innerHTML = `<a href="dashboard.html" aria-label="Open your account" title="${safeName}" class="user-avatar-link">${avatar ? `<img src="${escapeHtml(avatar)}" alt="${safeName}" class="user-avatar-img" referrerpolicy="no-referrer">` : `<span class="user-avatar-fallback">${escapeHtml(initials(name, user.email))}</span>`}</a>`;
}

function removeAvatar() { document.getElementById("user-avatar-item")?.remove(); }

function addThemeToggle() {
  if (!document.querySelector(".site-header") || document.getElementById("theme-toggle-item")) return;
  const nav = document.querySelector(".site-nav ul");
  if (!nav) return;
  const item = document.createElement("li");
  item.id = "theme-toggle-item";
  item.innerHTML = `<button id="theme-toggle" type="button" aria-label="Switch theme" title="Switch theme"><span id="theme-icon">🌙</span><span id="theme-label">Dark</span></button>`;
  nav.appendChild(item);

  const saved = localStorage.getItem("my-business-theme");
  const apply = theme => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("my-business-theme", theme);
    const dark = theme === "dark";
    document.getElementById("theme-icon").textContent = dark ? "☀️" : "🌙";
    document.getElementById("theme-label").textContent = dark ? "Light" : "Dark";
  };
  apply(saved === "dark" ? "dark" : "light");
  document.getElementById("theme-toggle").addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    apply(current === "dark" ? "light" : "dark");
  });

  const style = document.createElement("style");
  style.textContent = `
    #theme-toggle-item{display:flex;align-items:center}
    #theme-toggle{border:1px solid #d7deea;background:#fff;color:#182230;border-radius:999px;padding:8px 13px;display:flex;align-items:center;gap:7px;font:600 13px inherit;cursor:pointer;transition:.25s;box-shadow:0 3px 12px rgba(0,0,0,.08)}
    #theme-toggle:hover{transform:translateY(-1px);box-shadow:0 6px 16px rgba(0,0,0,.12)}
    [data-theme="dark"] body{background:#0b1220!important;color:#e5e7eb!important}
    [data-theme="dark"] .site-header,[data-theme="dark"] .site-footer{background:#070d18!important;color:#e5e7eb!important}
    [data-theme="dark"] .site-nav a{color:#e5e7eb!important}
    [data-theme="dark"] .portfolio,[data-theme="dark"] .services,[data-theme="dark"] .pricing,[data-theme="dark"] .order,[data-theme="dark"] .contact,#brand-showcase[data-theme="dark"]{background:#0f172a!important;color:#e5e7eb!important}
    [data-theme="dark"] h1,[data-theme="dark"] h2,[data-theme="dark"] h3,[data-theme="dark"] p,[data-theme="dark"] label,[data-theme="dark"] legend{color:inherit}
    [data-theme="dark"] .card,[data-theme="dark"] .pricing-card,[data-theme="dark"] .logo-sample,[data-theme="dark"] .form input,[data-theme="dark"] .form textarea,[data-theme="dark"] .form select{background:#172033!important;color:#e5e7eb!important;border-color:#334155!important}
    [data-theme="dark"] .brand-showcase-heading p,[data-theme="dark"] .brand-sub{color:#aab7ca!important}
    [data-theme="dark"] #brand-showcase{background:linear-gradient(180deg,#0b1220,#0f172a)!important;border-color:#253047!important}
    [data-theme="dark"] .brand-logo-card{background:#151f32!important;border-color:#2c3a52!important}
    [data-theme="dark"] .brand-logo-card span{color:#f1f5f9!important}
    [data-theme="dark"] .brand-disclaimer{color:#94a3b8!important}
    [data-theme="dark"] #theme-toggle{background:#172033;color:#fff;border-color:#475569}
    @media(max-width:800px){#theme-toggle{padding:8px 10px}#theme-label{display:none}}
  `;
  document.head.appendChild(style);
}

function addBrandShowcase() {
  if (!document.querySelector(".site-header") || document.getElementById("brand-showcase")) return;
  const page = location.pathname.split("/").pop();
  if (page && page !== "index.html") return;
  const section = document.createElement("section");
  section.id = "brand-showcase";
  section.innerHTML = `<div class="brand-showcase-inner"><div class="brand-showcase-heading"><span class="brand-eyebrow">BRAND INSPIRATION</span><h2>Global Brands</h2><p>Real brand logos shown as visual references for design inspiration.</p></div><div class="brand-logo-grid">${[["Google","google"],["Microsoft","microsoft"],["Apple","apple"],["Amazon","amazon"],["Adobe","adobe"],["Meta","meta"],["Netflix","netflix"],["IBM","ibm"]].map(([name,slug])=>`<div class="brand-logo-card"><img src="https://cdn.simpleicons.org/${slug}" alt="${name} logo" loading="lazy"><span>${name}</span></div>`).join("")}</div><p class="brand-disclaimer">These trademarks and logos belong to their respective owners. This showcase is for reference/inspiration only and does not imply endorsement, partnership, or client status.</p></div>`;
  const portfolio = document.querySelector("#portfolio");
  if (portfolio) portfolio.insertAdjacentElement("afterend", section); else document.querySelector("main")?.prepend(section);
  const style = document.createElement("style");
  style.textContent = `#brand-showcase{padding:72px 20px;background:linear-gradient(180deg,#f8fbff,#fff);border-top:1px solid #e9eef7;border-bottom:1px solid #e9eef7}.brand-showcase-inner{max-width:1180px;margin:0 auto;text-align:center}.brand-eyebrow{display:inline-block;font-size:12px;font-weight:800;letter-spacing:2px;color:#0b6efd;margin-bottom:10px}#brand-showcase h2{font-size:clamp(30px,4vw,44px);margin:0 0 10px;color:#111827}#brand-showcase .brand-showcase-heading p{margin:0 auto 34px;color:#64748b;max-width:620px}.brand-logo-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}.brand-logo-card{min-height:125px;background:#fff;border:1px solid #e6eaf0;border-radius:18px;display:flex;align-items:center;justify-content:center;gap:12px;flex-direction:column;padding:22px;box-shadow:0 8px 25px rgba(15,23,42,.06);transition:transform .25s ease,box-shadow .25s ease}.brand-logo-card:hover{transform:translateY(-5px);box-shadow:0 14px 32px rgba(15,23,42,.12)}.brand-logo-card img{width:48px;height:48px;object-fit:contain}.brand-logo-card span{font-weight:700;color:#1f2937;font-size:15px}.brand-disclaimer{margin:26px auto 0;max-width:900px;font-size:12px;line-height:1.6;color:#94a3b8}@media(max-width:800px){.brand-logo-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:420px){.brand-logo-grid{grid-template-columns:1fr}}`;
  document.head.appendChild(style);
}

async function loadHomepageUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) { console.warn("Supabase session check failed:", error.message); return; }
  if (data?.user) showUserAvatar(data.user); else removeAvatar();
}

supabase.auth.onAuthStateChange((_event, session) => { if (session?.user) showUserAvatar(session.user); else removeAvatar(); });

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => { loadHomepageUser(); addBrandShowcase(); addThemeToggle(); });
else { loadHomepageUser(); addBrandShowcase(); addThemeToggle(); }
