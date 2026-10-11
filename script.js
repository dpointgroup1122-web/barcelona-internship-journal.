document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", event => {
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
  });
});

const revealTargets = document.querySelectorAll(
  ".intro-grid, .work-grid, .journal-heading, .article-card, .spotlight-copy, .final-grid"
);

revealTargets.forEach(el => el.classList.add("reveal"));

if ("IntersectionObserver" in window) {
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealTargets.forEach(el => observer.observe(el));
} else {
  revealTargets.forEach(el => el.classList.add("visible"));
}

// Visitor-controlled share controls. No SDK, tracking, login, or automatic posting.
(() => {
  const byId = id => document.getElementById(id);
  const nativeButton = byId("share-native");
  const copyButton = byId("share-copy");
  const status = byId("share-status");
  const facebook = byId("share-facebook");
  const xShare = byId("share-x");
  const linkedin = byId("share-linkedin");
  const email = byId("share-email");
  if (![nativeButton, copyButton, status, facebook, xShare, linkedin, email].every(Boolean)) return;

  const SHARE_TEXT = "Barcelona Internship Journal — notes on an international internship and life in Barcelona.";
  const current = new URL(window.location.href);
  const publicPage = current.protocol === "https:" && !["localhost", "127.0.0.1", "::1"].includes(current.hostname) && !current.hostname.endsWith(".invalid");
  const shareUrl = publicPage ? current.origin + current.pathname : "";
  const demoMode = !publicPage;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(SHARE_TEXT);
  [facebook, xShare, linkedin, email].forEach(a => { if (demoMode) {a.setAttribute("aria-disabled", "true");a.removeAttribute("target");a.addEventListener("click", e => {e.preventDefault(); status.textContent = "Publish the website to HTTPS first. Share links are disabled in local preview.";});} else a.removeAttribute("aria-disabled"); });

  facebook.href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  xShare.href = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
  linkedin.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  email.href = `mailto:?subject=${encodeURIComponent("Barcelona Internship Journal")}&body=${encodedText}%0A%0A${encodedUrl}`;

  status.textContent = demoMode
    ? "Local preview: publish this website to a public HTTPS address to activate sharing."
    : "Ready to share. Nothing is posted until you confirm in the selected app or service.";

  nativeButton.addEventListener("click", async () => {
    if (demoMode) { status.textContent = "Publish the website first; no public share URL exists."; return; }
    if (navigator.share) {
      try { await navigator.share({ title: document.title, text: SHARE_TEXT, url: shareUrl }); }
      catch (error) { if (error.name !== "AbortError") status.textContent = "Native sharing was unavailable. Choose a social link instead."; }
      return;
    }
    status.textContent = "This browser has no native share menu. Choose Facebook, X, LinkedIn, or Email instead.";
  });

  copyButton.addEventListener("click", async () => {
    if (demoMode) { status.textContent = "Publish the website first; no public share URL exists."; return; }
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const input = document.createElement("textarea");
        input.value = shareUrl;
        input.setAttribute("readonly", "");
        input.style.position = "fixed";
        input.style.opacity = "0";
        document.body.appendChild(input);
        input.select();
        const copied = document.execCommand("copy");
        input.remove();
        if (!copied) throw new Error("Copy command unavailable");
      }
      status.textContent = "Page link copied.";
    } catch {
      status.textContent = "Copy was unavailable. Select and copy the page URL from the browser address bar.";
    }
  });
})();
