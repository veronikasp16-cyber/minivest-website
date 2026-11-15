// MiniVest data layer: profiles live in this browser's localStorage only (demo, no server).
(function () {
  const KEY = "minivest.profiles", ME = "minivest.me";

  const CATEGORIES = [
    { id: "food", label: "מזון ומסעדנות", emoji: "🍞" },
    { id: "tech", label: "טכנולוגיה", emoji: "💻" },
    { id: "fashion", label: "אופנה", emoji: "👗" },
    { id: "health", label: "בריאות וכושר", emoji: "🏋️" },
    { id: "agri", label: "חקלאות וקיימות", emoji: "🌱" },
    { id: "travel", label: "תיירות ופנאי", emoji: "✈️" },
    { id: "edu", label: "חינוך", emoji: "📚" },
    { id: "retail", label: "קמעונאות", emoji: "🛍️" },
    { id: "art", label: "אמנות ויצירה", emoji: "🎨" },
    { id: "services", label: "שירותים מקצועיים", emoji: "🔧" },
    { id: "pets", label: "חיות מחמד", emoji: "🐾" },
    { id: "beauty", label: "יופי וטיפוח", emoji: "💄" },
  ];
  const EXPERIENCE = { first: "השקעה ראשונה", some: "יש לי ניסיון", pro: "משקיע/ה מנוסה" };
  const BRINGS = { advice: "ייעוץ עסקי", network: "קשרים", marketing: "שיווק", mentor: "ליווי אישי" };
  const GRADS = [
    "linear-gradient(135deg,#ffd8a8,#ffa94d)", "linear-gradient(135deg,#a5d8ff,#4dabf7)",
    "linear-gradient(135deg,#fcc2d7,#f783ac)", "linear-gradient(135deg,#b2f2bb,#51cf66)",
    "linear-gradient(135deg,#d0bfff,#9775fa)",
  ];

  const SEED = [
    { id: "s-bakery", sample: true, role: "business", name: "דנה לוי", bizName: "מאפיית הבוקר", city: "חיפה", categories: ["food"], bizCategory: "food", emoji: "🥐", bg: GRADS[0], years: 4, goal: 80000, raised: 62, purpose: "פתיחת סניף שני ליד הנמל.", about: "מאפייה שכונתית שמוכרת לחם טרי ומאפים מקמח מלא כבר ארבע שנים." },
    { id: "s-code", sample: true, role: "business", name: "יואב כהן", bizName: "קוד לילדים", city: "תל אביב", categories: ["edu", "tech"], bizCategory: "edu", emoji: "🧑‍💻", bg: GRADS[1], years: 2, goal: 120000, raised: 35, purpose: "פיתוח פלטפורמת לימוד אונליין.", about: "חוגי תכנות לילדים בגילאי 8–14, עם מאות תלמידים בשנה." },
    { id: "s-nol", sample: true, role: "business", name: "מיכל שרון", bizName: "סטודיו נול", city: "ירושלים", categories: ["fashion"], bizCategory: "fashion", emoji: "🧵", bg: GRADS[2], years: 3, goal: 45000, raised: 81, purpose: "רכישת מכונת תפירה תעשייתית.", about: "מותג בגדים מבדים ממוחזרים, תוצרת מקומית וסדרות קטנות." },
    { id: "s-farm", sample: true, role: "business", name: "אורי מזרחי", bizName: "חוות השקד", city: "עמק יזרעאל", categories: ["agri", "food"], bizCategory: "agri", emoji: "🌱", bg: GRADS[3], years: 6, goal: 150000, raised: 48, purpose: "הרחבת משלוחים ישירות לבית הלקוח.", about: "חווה אורגנית משפחתית עם סלי ירקות שבועיים." },
    { id: "s-fit", sample: true, role: "business", name: "נועה אביב", bizName: "פיט בשכונה", city: "באר שבע", categories: ["health"], bizCategory: "health", emoji: "🏋️", bg: GRADS[4], years: 1, goal: 60000, raised: 22, purpose: "הוספת חדר אימוני קבוצות.", about: "סטודיו אימונים קטן ואישי, עם קהילה נאמנה בשכונה." },
    { id: "s-inv1", sample: true, role: "investor", name: "רונית פרידמן", city: "רעננה", categories: ["tech", "edu"], minInvest: 1000, maxInvest: 20000, experience: "pro", brings: ["advice", "network"], about: "מנהלת מוצר לשעבר. אוהבת לעזור לסטארט-אפים קטנים לצמוח." },
    { id: "s-inv2", sample: true, role: "investor", name: "אלון ברק", city: "חיפה", categories: ["food", "retail"], minInvest: 500, maxInvest: 5000, experience: "first", brings: ["marketing"], about: "בעל חנות ספרים. רוצה לתמוך בעסקים מקומיים בשכונה." },
    { id: "s-inv3", sample: true, role: "investor", name: "תמר גולן", city: "תל אביב", categories: ["fashion", "art", "beauty"], minInvest: 500, maxInvest: 10000, experience: "some", brings: ["network", "mentor"], about: "מעצבת גרפית שמאמינה ביצירה מקומית ובמותגים עצמאיים." },
    { id: "s-inv4", sample: true, role: "investor", name: "אמיר דוד", city: "באר שבע", categories: ["agri", "health", "travel"], minInvest: 2000, maxInvest: 30000, experience: "pro", brings: ["advice"], about: "יזם בעבר. משקיע בעסקים עם השפעה על הקהילה." },
  ];

  function read() {
    try { const v = JSON.parse(localStorage.getItem(KEY) || "[]"); return Array.isArray(v) ? v : []; }
    catch (e) { return []; }
  }
  function write(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); return true; }
    catch (e) { return false; } // storage blocked or full
  }

  const MV = {
    CATEGORIES, EXPERIENCE, BRINGS,
    fmt: n => "₪" + Number(n || 0).toLocaleString("he-IL"),
    esc: s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])),
    cat: id => CATEGORIES.find(c => c.id === id),
    all() { return read().concat(SEED); },
    get(id) { return MV.all().find(p => p.id === id) || null; },
    myId() { try { const id = localStorage.getItem(ME); return id && read().some(p => p.id === id) ? id : null; } catch (e) { return null; } },
    // Saves (adds or updates by id). Returns the id, or null if storage failed.
    save(p) {
      const list = read();
      p.id = p.id || "u-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      const i = list.findIndex(x => x.id === p.id);
      if (i >= 0) list[i] = p; else list.push(p);
      if (!write(list)) return null;
      try { localStorage.setItem(ME, p.id); } catch (e) { return null; }
      return p.id;
    },
    displayName: p => (p.role === "business" && p.bizName) ? p.bizName : p.name,
    // Avatar: uploaded photo, else seed emoji, else initials on a colored background.
    avatar(p, cls) {
      const nm = MV.displayName(p);
      let h = 0; for (const ch of nm) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
      const bg = p.bg || GRADS[h % GRADS.length];
      const inner = p.photo ? `<img src="${MV.esc(p.photo)}" alt="">`
        : (p.emoji || MV.esc([...nm.trim()][0] || "?"));
      return `<div class="avatar ${cls || ""}" style="background:${p.photo ? "var(--surface-2)" : bg}">${inner}</div>`;
    },
    // Downscale an uploaded image to keep localStorage small. Resolves to a JPEG data URL.
    resizeImage(file, max) {
      max = max || 400;
      return new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onerror = reject;
        r.onload = () => {
          const img = new Image();
          img.onerror = reject;
          img.onload = () => {
            const k = Math.min(1, max / Math.max(img.width, img.height));
            const c = document.createElement("canvas");
            c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
            c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
            resolve(c.toDataURL("image/jpeg", .8));
          };
          img.src = r.result;
        };
        r.readAsDataURL(file);
      });
    },
  };
  window.MV = MV;

  // Shared header behaviour: mobile menu + "הצטרפות" becomes "העמוד שלי" once a profile exists.
  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("menuBtn"), links = document.getElementById("navLinks");
    if (btn && links) {
      btn.onclick = () => { const o = links.classList.toggle("open"); btn.setAttribute("aria-expanded", o); };
      links.querySelectorAll("a").forEach(a => a.addEventListener("click", () => links.classList.remove("open")));
    }
    const join = document.getElementById("joinBtn"), me = MV.myId();
    if (join && me) { join.textContent = "העמוד שלי"; join.href = "profile.html?id=" + encodeURIComponent(me); }
  });
})();
