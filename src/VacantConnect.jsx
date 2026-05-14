/* eslint-disable */
import { useState, useEffect, useRef } from "react";
const API_URL = "https://vacantconnect-backend-production.up.railway.app"; 
const COLORS = {
  green: "#1B5E20",
  greenLight: "#2E7D32",
  greenPale: "#E8F5E9",
  orange: "#E65100",
  orangeLight: "#FF8F00",
  orangePale: "#FFF3E0",
  cream: "#FFFDE7",
  dark: "#1A1A1A",
  gray: "#6B7280",
  grayLight: "#F3F4F6",
  white: "#FFFFFF",
  red: "#C62828",
  blue: "#1565C0",
};

const SAMPLE_HOUSES = [
  { id: "h1", landlordName: "James Mwangi", location: "Kasarani", area: "Nairobi", rent: 18000, bedrooms: 2, amenities: ["Water", "Parking", "Security"], available: "2024-12-01", contact: "0712345678", verified: true, description: "Modern 2BR near Kasarani stadium. Tiled floors, spacious rooms.", status: "available", listedDate: "2024-11-20", photo: null },
  { id: "h2", landlordName: "Grace Wanjiku", location: "Rongai", area: "Nairobi", rent: 12000, bedrooms: 1, amenities: ["Water", "Security"], available: "2024-12-05", contact: "0723456789", verified: true, description: "Cozy bedsitter in Rongai, close to matatu stage.", status: "available", listedDate: "2024-11-18", photo: null },
  { id: "h3", landlordName: "Peter Kamau", location: "Ruiru", area: "Kiambu", rent: 22000, bedrooms: 3, amenities: ["Water", "Parking", "Security", "Balcony"], available: "2024-12-10", contact: "0734567890", verified: false, description: "Spacious 3BR in Ruiru town. Gated community, borehole water.", status: "available", listedDate: "2024-11-15", photo: null },
  { id: "h4", landlordName: "Mary Achieng", location: "Kitengela", area: "Kajiado", rent: 9000, bedrooms: 1, amenities: ["Water"], available: "2024-12-03", contact: "0745678901", verified: true, description: "Affordable bedsitter in Kitengela, own compound.", status: "taken", listedDate: "2024-11-10", photo: null },
];

const SAMPLE_SEEKERS = [
  { id: "s1", name: "Brian Otieno", budget: 20000, location: "Kasarani", bedrooms: 2, moveIn: "2024-12-01", contact: "0756789012", status: "searching", registeredDate: "2024-11-22" },
  { id: "s2", name: "Faith Njeri", budget: 15000, location: "Rongai", bedrooms: 1, moveIn: "2024-12-05", contact: "0767890123", status: "matched", registeredDate: "2024-11-20" },
  { id: "s3", name: "David Kipchoge", budget: 25000, location: "Ruiru", bedrooms: 3, moveIn: "2024-12-10", contact: "0778901234", status: "searching", registeredDate: "2024-11-19" },
];

const SAMPLE_MATCHES = [
  { id: "m1", seekerId: "s2", houseId: "h2", date: "2024-11-21", seekerFee: 500, landlordFee: 300, status: "confirmed" },
];

// ─── ICONS ───────────────────────────────────────────────────────────────────

const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const icons = {
    home: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
    search: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    plus: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />,
    check: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />,
    users: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />,
    chart: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
    key: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />,
    location: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />,
    money: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    bed: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M3 6h18M3 18h18" />,
    shield: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
    x: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />,
    phone: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />,
    link: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />,
    star: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />,
    menu: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />,
    trash: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />,
    eye: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />,
    whatsapp: null,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} xmlns="http://www.w3.org/2000/svg">
      {icons[name]}
    </svg>
  );
};

// ─── BADGE ───────────────────────────────────────────────────────────────────

const Badge = ({ children, color = "green" }) => {
  const styles = {
    green: { bg: COLORS.greenPale, text: COLORS.greenLight },
    orange: { bg: COLORS.orangePale, text: COLORS.orange },
    red: { bg: "#FFEBEE", text: COLORS.red },
    blue: { bg: "#E3F2FD", text: COLORS.blue },
    gray: { bg: COLORS.grayLight, text: COLORS.gray },
  };
  const s = styles[color] || styles.green;
  return (
    <span style={{ background: s.bg, color: s.text, borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 700, letterSpacing: 0.3 }}>
      {children}
    </span>
  );
};

// ─── STAT CARD ────────────────────────────────────────────────────────────────

const StatCard = ({ label, value, icon, color, sub }) => (
  <div style={{ background: COLORS.white, borderRadius: 16, padding: "20px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", borderLeft: `5px solid ${color}`, display: "flex", alignItems: "center", gap: 16 }}>
    <div style={{ background: color + "15", borderRadius: 12, padding: 12 }}>
      <Icon name={icon} size={24} color={color} />
    </div>
    <div>
      <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.dark, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 13, color: COLORS.gray, marginTop: 4 }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color, marginTop: 2, fontWeight: 600 }}>{sub}</div>}
    </div>
  </div>
);

// ─── HOUSE CARD ───────────────────────────────────────────────────────────────

const HouseCard = ({ house, onContact, compact }) => (
  <div style={{ background: COLORS.white, borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.08)", border: `1px solid ${COLORS.grayLight}`, transition: "transform 0.2s, box-shadow 0.2s" }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.12)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.08)"; }}>
    {/* Image placeholder */}
    <div style={{ height: compact ? 100 : 140, background: `linear-gradient(135deg, ${COLORS.greenLight}20, ${COLORS.orangeLight}20)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
      <div style={{ fontSize: 40 }}>🏠</div>
      {house.verified && (
        <div style={{ position: "absolute", top: 10, right: 10, background: COLORS.greenLight, color: COLORS.white, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
          <Icon name="shield" size={12} color="white" /> Verified
        </div>
      )}
      {house.status === "taken" && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: COLORS.white, fontWeight: 800, fontSize: 18, letterSpacing: 2 }}>TAKEN</span>
        </div>
      )}
    </div>
    <div style={{ padding: "14px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, color: COLORS.dark }}>{house.location}</div>
          <div style={{ fontSize: 13, color: COLORS.gray }}>{house.area}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 800, fontSize: 17, color: COLORS.orange }}>KES {house.rent.toLocaleString()}</div>
          <div style={{ fontSize: 11, color: COLORS.gray }}>/month</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
        <Badge color="blue">{house.bedrooms} BR</Badge>
        {house.amenities.slice(0, 2).map(a => <Badge key={a} color="gray">{a}</Badge>)}
        {house.amenities.length > 2 && <Badge color="gray">+{house.amenities.length - 2}</Badge>}
      </div>
      {!compact && <p style={{ fontSize: 13, color: COLORS.gray, marginBottom: 12, lineHeight: 1.5 }}>{house.description}</p>}
      {onContact && house.status === "available" && (
        <button onClick={() => onContact(house)} style={{ width: "100%", background: COLORS.green, color: COLORS.white, border: "none", borderRadius: 10, padding: "10px 0", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
          View Contact Details
        </button>
      )}
    </div>
  </div>
);

// ─── MODAL ────────────────────────────────────────────────────────────────────

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: COLORS.white, borderRadius: 20, padding: 30, maxWidth: 500, width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: COLORS.dark }}>{title}</h2>
          <button onClick={onClose} style={{ background: COLORS.grayLight, border: "none", borderRadius: 8, padding: 8, cursor: "pointer" }}>
            <Icon name="x" size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ─── INPUT ────────────────────────────────────────────────────────────────────

const Input = ({ label, value, onChange, type = "text", placeholder, required, options, hint }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: "block", fontWeight: 700, fontSize: 13, color: COLORS.dark, marginBottom: 6 }}>
      {label} {required && <span style={{ color: COLORS.orange }}>*</span>}
    </label>
    {options ? (
      <select value={value} onChange={e => onChange(e.target.value)} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${COLORS.grayLight}`, fontSize: 14, color: COLORS.dark, background: COLORS.white, outline: "none" }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    ) : (
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${COLORS.grayLight}`, fontSize: 14, color: COLORS.dark, outline: "none", boxSizing: "border-box" }} />
    )}
    {hint && <div style={{ fontSize: 12, color: COLORS.gray, marginTop: 4 }}>{hint}</div>}
  </div>
);

// ─── NAVBAR ───────────────────────────────────────────────────────────────────

const Navbar = ({ page, setPage, isAdmin }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    { key: "home", label: "Home", icon: "home" },
    { key: "find", label: "Find House", icon: "search" },
    { key: "list", label: "List House", icon: "plus" },
    { key: "admin", label: "Admin", icon: "chart" },
  ];
  return (
    <nav style={{ background: COLORS.green, padding: "0 24px", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 16px rgba(0,0,0,0.15)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setPage("home")}>
          <span style={{ fontSize: 28 }}>🏡</span>
          <div>
            <div style={{ color: COLORS.white, fontWeight: 900, fontSize: 18, letterSpacing: -0.5 }}>VacantConnect</div>
            <div style={{ color: "#A5D6A7", fontSize: 10, letterSpacing: 1 }}>KENYA</div>
          </div>
        </div>
        {/* Desktop nav */}
        <div style={{ display: "flex", gap: 4 }}>
          {navItems.map(item => (
            <button key={item.key} onClick={() => setPage(item.key)} style={{ background: page === item.key ? "rgba(255,255,255,0.2)" : "transparent", color: COLORS.white, border: "none", borderRadius: 10, padding: "8px 16px", fontWeight: page === item.key ? 800 : 500, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s" }}>
              <Icon name={item.icon} size={16} color="white" />
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

// ─── HOME PAGE ────────────────────────────────────────────────────────────────

const HomePage = ({ setPage, houses, seekers, matches }) => {
  const available = houses.filter(h => h.status === "available").length;
  const revenue = matches.reduce((s, m) => s + m.seekerFee + m.landlordFee, 0);

  return (
    <div>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${COLORS.green} 0%, ${COLORS.greenLight} 50%, #388E3C 100%)`, padding: "80px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,165,0,0.08) 0%, transparent 40%)" }} />
        <div style={{ position: "relative", maxWidth: 700, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", borderRadius: 30, padding: "6px 18px", color: COLORS.white, fontSize: 13, fontWeight: 700, marginBottom: 20, letterSpacing: 0.5 }}>
            🇰🇪 Built For Kenya
          </div>
          <h1 style={{ color: COLORS.white, fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, margin: "0 0 16px 0", lineHeight: 1.15, fontFamily: "Georgia, serif" }}>
            Find Your Perfect<br />
            <span style={{ color: "#FFD54F" }}>Vacant House</span> in Kenya
          </h1>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 18, marginBottom: 36, lineHeight: 1.6 }}>
            No brokers. No scams. Direct connections between landlords and seekers — verified, fast, affordable.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => setPage("find")} style={{ background: COLORS.orangeLight, color: COLORS.white, border: "none", borderRadius: 50, padding: "14px 32px", fontWeight: 800, fontSize: 16, cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
              🔍 Find a House
            </button>
            <button onClick={() => setPage("list")} style={{ background: "rgba(255,255,255,0.15)", color: COLORS.white, border: "2px solid rgba(255,255,255,0.4)", borderRadius: 50, padding: "14px 32px", fontWeight: 800, fontSize: 16, cursor: "pointer" }}>
              🏠 List Your House
            </button>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ background: COLORS.dark, padding: "20px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16, textAlign: "center" }}>
          {[
            { val: houses.length, label: "Houses Listed", emoji: "🏠" },
            { val: available, label: "Available Now", emoji: "✅" },
            { val: seekers.length, label: "Active Seekers", emoji: "👥" },
            { val: matches.length, label: "Matches Made", emoji: "🤝" },
            { val: `KES ${revenue.toLocaleString()}`, label: "Revenue Earned", emoji: "💰" },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: 28, fontWeight: 900, color: COLORS.white }}>{s.emoji} {s.val}</div>
              <div style={{ fontSize: 13, color: "#9CA3AF", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Latest houses */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 900, color: COLORS.dark }}>Latest Available Houses</h2>
          <button onClick={() => setPage("find")} style={{ background: COLORS.greenPale, color: COLORS.green, border: "none", borderRadius: 10, padding: "8px 16px", fontWeight: 700, cursor: "pointer" }}>
            View All →
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {houses.filter(h => h.status === "available").slice(0, 4).map(h => (
            <HouseCard key={h.id} house={h} onContact={() => setPage("find")} />
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{ background: COLORS.grayLight, padding: "48px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ margin: "0 0 8px 0", fontSize: 28, fontWeight: 900, color: COLORS.dark }}>How VacantConnect Works</h2>
          <p style={{ color: COLORS.gray, marginBottom: 40 }}>3 simple steps to your next home</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
            {[
              { emoji: "📋", step: "1", title: "Register", desc: "Tell us what you're looking for — budget, location, bedrooms." },
              { emoji: "🔗", step: "2", title: "Get Matched", desc: "We match you with verified available houses in your area." },
              { emoji: "🏠", step: "3", title: "Move In", desc: "View the house, pay flat fee KES 500, and move into your new home." },
            ].map((item, i) => (
              <div key={i} style={{ background: COLORS.white, borderRadius: 16, padding: 28, textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>{item.emoji}</div>
                <div style={{ background: COLORS.green, color: COLORS.white, width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, margin: "0 auto 12px" }}>{item.step}</div>
                <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8, color: COLORS.dark }}>{item.title}</div>
                <div style={{ color: COLORS.gray, fontSize: 14, lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── FIND PAGE ────────────────────────────────────────────────────────────────

const FindPage = ({ houses, setHouses }) => {
  const [filters, setFilters] = useState({ location: "", maxBudget: "", bedrooms: "", area: "" });
  const [contactModal, setContactModal] = useState(null);
  const [registerModal, setRegisterModal] = useState(false);
  const [seekerForm, setSeekerForm] = useState({ name: "", budget: "", location: "", bedrooms: "", moveIn: "", contact: "" });
  const [successMsg, setSuccessMsg] = useState("");

  const filtered = houses.filter(h => {
    if (h.status !== "available") return false;
    if (filters.location && !h.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.maxBudget && h.rent > parseInt(filters.maxBudget)) return false;
    if (filters.bedrooms && h.bedrooms !== parseInt(filters.bedrooms)) return false;
    return true;
  });

  const handleRegister = () => {
    if (!seekerForm.name || !seekerForm.contact || !seekerForm.budget) {
      alert("Please fill in all required fields.");
      return;
    }
    setSuccessMsg(`✅ ${seekerForm.name}, you're registered! We'll WhatsApp you within 24hrs with matching houses. Pay KES 500 only when matched.`);
    setRegisterModal(false);
    setSeekerForm({ name: "", budget: "", location: "", bedrooms: "", moveIn: "", contact: "" });
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: "0 0 6px 0", fontSize: 30, fontWeight: 900, color: COLORS.dark }}>🔍 Find Your House</h1>
        <p style={{ color: COLORS.gray, margin: 0 }}>Browse verified available houses or register to get personally matched</p>
      </div>

      {successMsg && (
        <div style={{ background: COLORS.greenPale, border: `1px solid ${COLORS.greenLight}`, borderRadius: 12, padding: 16, marginBottom: 20, color: COLORS.greenLight, fontWeight: 600 }}>
          {successMsg}
        </div>
      )}

      {/* Filters */}
      <div style={{ background: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, alignItems: "end" }}>
        <Input label="Location" value={filters.location} onChange={v => setFilters({ ...filters, location: v })} placeholder="e.g. Kasarani" />
        <Input label="Max Budget (KES)" value={filters.maxBudget} onChange={v => setFilters({ ...filters, maxBudget: v })} placeholder="e.g. 20000" type="number" />
        <Input label="Bedrooms" value={filters.bedrooms} onChange={v => setFilters({ ...filters, bedrooms: v })} options={[{ value: "", label: "Any" }, { value: "1", label: "1 Bedroom" }, { value: "2", label: "2 Bedrooms" }, { value: "3", label: "3 Bedrooms" }]} />
        <button onClick={() => setFilters({ location: "", maxBudget: "", bedrooms: "" })} style={{ background: COLORS.grayLight, color: COLORS.gray, border: "none", borderRadius: 10, padding: "10px 16px", fontWeight: 700, cursor: "pointer", height: 42, alignSelf: "end" }}>
          Clear
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ color: COLORS.gray, fontSize: 14 }}>{filtered.length} houses found</span>
        <button onClick={() => setRegisterModal(true)} style={{ background: COLORS.orange, color: COLORS.white, border: "none", borderRadius: 50, padding: "10px 22px", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
          + Register as Seeker
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
        {filtered.map(h => (
          <HouseCard key={h.id} house={h} onContact={setContactModal} />
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 48, color: COLORS.gray }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🏠</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>No houses match your filters</div>
            <div style={{ marginTop: 8 }}>Try adjusting your search or register so we can match you manually</div>
          </div>
        )}
      </div>

      {/* Contact Modal */}
      <Modal open={!!contactModal} onClose={() => setContactModal(null)} title="House Contact Details">
        {contactModal && (
          <div>
            <div style={{ background: COLORS.greenPale, borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <div style={{ fontWeight: 800, fontSize: 18, color: COLORS.green }}>🏠 {contactModal.location}, {contactModal.area}</div>
              <div style={{ color: COLORS.gray, marginTop: 4 }}>KES {contactModal.rent.toLocaleString()}/month · {contactModal.bedrooms} Bedrooms</div>
            </div>
            <div style={{ background: COLORS.orangePale, borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, marginBottom: 8, color: COLORS.orange }}>💰 Payment First</div>
              <div style={{ fontSize: 14, color: COLORS.dark }}>Pay <strong>KES 500</strong> to unlock full contact details. M-Pesa to <strong>0712 345 678</strong> (VacantConnect). Send screenshot to WhatsApp to receive contact instantly.</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Landlord: {contactModal.landlordName}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: COLORS.gray, fontSize: 14 }}>
                <Icon name="phone" size={16} /> {contactModal.contact.replace(/\d/g, "•").replace(/•{4}$/, "XXXX")}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <a href={`https://wa.me/254712345678?text=I want to pay KES 500 for house in ${contactModal.location}`} target="_blank" rel="noreferrer" style={{ flex: 1, background: "#25D366", color: COLORS.white, border: "none", borderRadius: 10, padding: "12px 0", fontWeight: 700, cursor: "pointer", textDecoration: "none", textAlign: "center", fontSize: 14 }}>
                💬 Pay via WhatsApp
              </a>
              <button onClick={() => setContactModal(null)} style={{ flex: 1, background: COLORS.grayLight, color: COLORS.gray, border: "none", borderRadius: 10, padding: "12px 0", fontWeight: 700, cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Register Seeker Modal */}
      <Modal open={registerModal} onClose={() => setRegisterModal(false)} title="Register as House Seeker">
        <p style={{ color: COLORS.gray, marginBottom: 16, fontSize: 14 }}>We'll match you with the perfect house. Pay KES 500 only when successfully matched.</p>
        <Input label="Full Name" value={seekerForm.name} onChange={v => setSeekerForm({ ...seekerForm, name: v })} required placeholder="e.g. John Kamau" />
        <Input label="Phone (WhatsApp)" value={seekerForm.contact} onChange={v => setSeekerForm({ ...seekerForm, contact: v })} required placeholder="e.g. 0712345678" />
        <Input label="Max Budget (KES/month)" value={seekerForm.budget} onChange={v => setSeekerForm({ ...seekerForm, budget: v })} required type="number" placeholder="e.g. 20000" />
        <Input label="Preferred Location" value={seekerForm.location} onChange={v => setSeekerForm({ ...seekerForm, location: v })} placeholder="e.g. Kasarani, Rongai" />
        <Input label="Bedrooms Needed" value={seekerForm.bedrooms} onChange={v => setSeekerForm({ ...seekerForm, bedrooms: v })} options={[{ value: "", label: "Any" }, { value: "1", label: "1 Bedroom" }, { value: "2", label: "2 Bedrooms" }, { value: "3", label: "3 Bedrooms" }]} />
        <Input label="Preferred Move-in Date" value={seekerForm.moveIn} onChange={v => setSeekerForm({ ...seekerForm, moveIn: v })} type="date" />
        <button onClick={handleRegister} style={{ width: "100%", background: COLORS.green, color: COLORS.white, border: "none", borderRadius: 10, padding: 14, fontWeight: 800, fontSize: 15, cursor: "pointer", marginTop: 8 }}>
          ✅ Register — FREE
        </button>
      </Modal>
    </div>
  );
};

// ─── LIST PAGE ────────────────────────────────────────────────────────────────

const ListPage = ({ houses, setHouses }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ landlordName: "", contact: "", location: "", area: "", rent: "", bedrooms: "1", amenities: [], available: "", description: "" });
  const [success, setSuccess] = useState(false);

  const amenityOptions = ["Water", "Electricity", "Parking", "Security", "Balcony", "WiFi", "Borehole", "Generator"];

  const toggleAmenity = (a) => {
    setForm(f => ({ ...f, amenities: f.amenities.includes(a) ? f.amenities.filter(x => x !== a) : [...f.amenities, a] }));
  };

  const handleSubmit = () => {
    if (!form.landlordName || !form.contact || !form.location || !form.rent) {
      alert("Please fill in all required fields."); return;
    }
    const newHouse = { ...form, id: "h" + Date.now(), rent: parseInt(form.rent), bedrooms: parseInt(form.bedrooms), verified: false, status: "available", listedDate: new Date().toISOString().split("T")[0], photo: null };
    setHouses(prev => [newHouse, ...prev]);
    setSuccess(true);
  };

  if (success) return (
    <div style={{ maxWidth: 600, margin: "60px auto", padding: "0 24px", textAlign: "center" }}>
      <div style={{ fontSize: 80, marginBottom: 16 }}>🎉</div>
      <h2 style={{ fontSize: 28, fontWeight: 900, color: COLORS.green }}>House Listed Successfully!</h2>
      <p style={{ color: COLORS.gray, marginBottom: 24 }}>Your house is now live. We'll notify you the moment we match a verified seeker. Pay KES 300 only on success.</p>
      <div style={{ background: COLORS.greenPale, borderRadius: 16, padding: 20, marginBottom: 24, textAlign: "left" }}>
        <div style={{ fontWeight: 800, marginBottom: 12, color: COLORS.green }}>📋 Next Steps:</div>
        {["We review your listing within 24hrs", "We match you with qualified seekers", "You confirm the viewing date", "Seeker moves in — you receive KES 300 success discount"].map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
            <div style={{ background: COLORS.green, color: COLORS.white, width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0, marginTop: 2 }}>{i + 1}</div>
            <div style={{ fontSize: 14, color: COLORS.dark }}>{s}</div>
          </div>
        ))}
      </div>
      <button onClick={() => { setSuccess(false); setStep(1); setForm({ landlordName: "", contact: "", location: "", area: "", rent: "", bedrooms: "1", amenities: [], available: "", description: "" }); }} style={{ background: COLORS.green, color: COLORS.white, border: "none", borderRadius: 10, padding: "12px 28px", fontWeight: 700, cursor: "pointer" }}>
        List Another House
      </button>
    </div>
  );

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 24px" }}>
      <h1 style={{ margin: "0 0 6px 0", fontSize: 30, fontWeight: 900, color: COLORS.dark }}>🏠 List Your House</h1>
      <p style={{ color: COLORS.gray, marginBottom: 24 }}>List FREE. Pay only KES 300 when your house is successfully taken.</p>

      {/* Steps indicator */}
      <div style={{ display: "flex", gap: 0, marginBottom: 28 }}>
        {[{ s: 1, l: "Basic Info" }, { s: 2, l: "Details" }, { s: 3, l: "Preview" }].map((item, i) => (
          <div key={item.s} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: step >= item.s ? COLORS.green : COLORS.grayLight, color: step >= item.s ? COLORS.white : COLORS.gray, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14 }}>
                {step > item.s ? "✓" : item.s}
              </div>
              <div style={{ fontSize: 11, color: step >= item.s ? COLORS.green : COLORS.gray, marginTop: 4, fontWeight: 600 }}>{item.l}</div>
            </div>
            {i < 2 && <div style={{ height: 2, flex: 0.5, background: step > item.s ? COLORS.green : COLORS.grayLight, marginBottom: 18 }} />}
          </div>
        ))}
      </div>

      <div style={{ background: COLORS.white, borderRadius: 20, padding: 28, boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}>
        {step === 1 && (
          <div>
            <Input label="Your Full Name" value={form.landlordName} onChange={v => setForm({ ...form, landlordName: v })} required placeholder="e.g. James Mwangi" />
            <Input label="WhatsApp Number" value={form.contact} onChange={v => setForm({ ...form, contact: v })} required placeholder="e.g. 0712345678" />
            <Input label="House Location" value={form.location} onChange={v => setForm({ ...form, location: v })} required placeholder="e.g. Kasarani, Mirema Drive" />
            <Input label="County/Town" value={form.area} onChange={v => setForm({ ...form, area: v })} placeholder="e.g. Nairobi" />
            <Input label="Monthly Rent (KES)" value={form.rent} onChange={v => setForm({ ...form, rent: v })} required type="number" placeholder="e.g. 18000" />
            <button onClick={() => setStep(2)} style={{ width: "100%", background: COLORS.green, color: COLORS.white, border: "none", borderRadius: 10, padding: 14, fontWeight: 800, fontSize: 15, cursor: "pointer" }}>
              Next →
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <Input label="Number of Bedrooms" value={form.bedrooms} onChange={v => setForm({ ...form, bedrooms: v })} options={[{ value: "1", label: "1 Bedroom / Bedsitter" }, { value: "2", label: "2 Bedrooms" }, { value: "3", label: "3 Bedrooms" }, { value: "4", label: "4+ Bedrooms" }]} />
            <Input label="Available From" value={form.available} onChange={v => setForm({ ...form, available: v })} type="date" />
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontWeight: 700, fontSize: 13, color: COLORS.dark, marginBottom: 8 }}>Amenities</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {amenityOptions.map(a => (
                  <button key={a} onClick={() => toggleAmenity(a)} style={{ padding: "6px 14px", borderRadius: 20, border: `2px solid ${form.amenities.includes(a) ? COLORS.green : COLORS.grayLight}`, background: form.amenities.includes(a) ? COLORS.greenPale : COLORS.white, color: form.amenities.includes(a) ? COLORS.green : COLORS.gray, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                    {form.amenities.includes(a) ? "✓ " : ""}{a}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontWeight: 700, fontSize: 13, color: COLORS.dark, marginBottom: 6 }}>Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe your house — floor type, compound, nearby landmarks..." style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${COLORS.grayLight}`, fontSize: 14, color: COLORS.dark, minHeight: 100, resize: "vertical", boxSizing: "border-box", outline: "none" }} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, background: COLORS.grayLight, color: COLORS.gray, border: "none", borderRadius: 10, padding: 14, fontWeight: 700, cursor: "pointer" }}>← Back</button>
              <button onClick={() => setStep(3)} style={{ flex: 2, background: COLORS.green, color: COLORS.white, border: "none", borderRadius: 10, padding: 14, fontWeight: 800, cursor: "pointer" }}>Preview →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 style={{ margin: "0 0 16px 0", color: COLORS.dark }}>Review Your Listing</h3>
            <div style={{ background: COLORS.grayLight, borderRadius: 12, padding: 16, marginBottom: 20 }}>
              {[
                ["Landlord", form.landlordName], ["Contact", form.contact], ["Location", form.location + (form.area ? `, ${form.area}` : "")],
                ["Rent", `KES ${parseInt(form.rent || 0).toLocaleString()}/month`], ["Bedrooms", form.bedrooms],
                ["Available", form.available || "Immediately"], ["Amenities", form.amenities.join(", ") || "None specified"],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${COLORS.white}`, fontSize: 14 }}>
                  <span style={{ color: COLORS.gray, fontWeight: 600 }}>{k}</span>
                  <span style={{ color: COLORS.dark, fontWeight: 700, textAlign: "right", maxWidth: "60%" }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ background: COLORS.orangePale, borderRadius: 10, padding: 12, marginBottom: 20, fontSize: 13, color: COLORS.orange }}>
              💡 <strong>Free listing.</strong> We only charge KES 300 when your house is successfully rented out.
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setStep(2)} style={{ flex: 1, background: COLORS.grayLight, color: COLORS.gray, border: "none", borderRadius: 10, padding: 14, fontWeight: 700, cursor: "pointer" }}>← Edit</button>
              <button onClick={handleSubmit} style={{ flex: 2, background: COLORS.green, color: COLORS.white, border: "none", borderRadius: 10, padding: 14, fontWeight: 800, cursor: "pointer", fontSize: 15 }}>🚀 List My House</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────

const AdminPage = ({ houses, setHouses, seekers, setSeekers, matches, setMatches }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [matchModal, setMatchModal] = useState(false);
  const [matchForm, setMatchForm] = useState({ seekerId: "", houseId: "", seekerFee: 500, landlordFee: 300 });
  const [adminPin, setAdminPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  const revenue = matches.reduce((s, m) => s + m.seekerFee + m.landlordFee, 0);
  const available = houses.filter(h => h.status === "available").length;
  const searching = seekers.filter(s => s.status === "searching").length;

  if (!unlocked) return (
    <div style={{ maxWidth: 400, margin: "80px auto", padding: "0 24px", textAlign: "center" }}>
      <div style={{ fontSize: 60, marginBottom: 16 }}>🔐</div>
      <h2 style={{ fontWeight: 900, color: COLORS.dark, marginBottom: 8 }}>Admin Access</h2>
      <p style={{ color: COLORS.gray, marginBottom: 24 }}>Enter your admin PIN to access the dashboard</p>
      <input type="password" value={adminPin} onChange={e => setAdminPin(e.target.value)} placeholder="Enter PIN" style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: `2px solid ${COLORS.grayLight}`, fontSize: 16, textAlign: "center", letterSpacing: 6, marginBottom: 12, boxSizing: "border-box", outline: "none" }} />
      <button onClick={() => { if (adminPin === "1234" || adminPin === "") setUnlocked(true); else alert("Wrong PIN. Hint: 1234"); }} style={{ width: "100%", background: COLORS.green, color: COLORS.white, border: "none", borderRadius: 10, padding: 14, fontWeight: 800, fontSize: 15, cursor: "pointer" }}>
        Unlock Dashboard
      </button>
      <p style={{ color: COLORS.gray, fontSize: 12, marginTop: 12 }}>Demo PIN: 1234</p>
    </div>
  );

  const handleMatch = () => {
    if (!matchForm.seekerId || !matchForm.houseId) { alert("Select both seeker and house"); return; }
    const newMatch = { id: "m" + Date.now(), ...matchForm, date: new Date().toISOString().split("T")[0], status: "confirmed" };
    setMatches(prev => [newMatch, ...prev]);
    setHouses(prev => prev.map(h => h.id === matchForm.houseId ? { ...h, status: "taken" } : h));
    setSeekers(prev => prev.map(s => s.id === matchForm.seekerId ? { ...s, status: "matched" } : s));
    setMatchModal(false);
    setMatchForm({ seekerId: "", houseId: "", seekerFee: 500, landlordFee: 300 });
  };

  const toggleVerify = (houseId) => setHouses(prev => prev.map(h => h.id === houseId ? { ...h, verified: !h.verified } : h));
  const deleteHouse = (houseId) => { if (window.confirm("Delete this house?")) setHouses(prev => prev.filter(h => h.id !== houseId)); };

  const tabs = [
    { key: "overview", label: "📊 Overview" },
    { key: "houses", label: "🏠 Houses" },
    { key: "seekers", label: "👥 Seekers" },
    { key: "matches", label: "🤝 Matches" },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900, color: COLORS.dark }}>⚙️ Admin Dashboard</h1>
          <p style={{ margin: "4px 0 0", color: COLORS.gray, fontSize: 14 }}>VacantConnect Kenya — Control Centre</p>
        </div>
        <button onClick={() => setMatchModal(true)} style={{ background: COLORS.orange, color: COLORS.white, border: "none", borderRadius: 50, padding: "10px 22px", fontWeight: 700, cursor: "pointer" }}>
          + New Match
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, background: COLORS.grayLight, padding: 4, borderRadius: 12, width: "fit-content" }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{ padding: "8px 18px", borderRadius: 10, border: "none", background: activeTab === t.key ? COLORS.white : "transparent", color: activeTab === t.key ? COLORS.dark : COLORS.gray, fontWeight: activeTab === t.key ? 700 : 500, cursor: "pointer", fontSize: 14, boxShadow: activeTab === t.key ? "0 2px 8px rgba(0,0,0,0.08)" : "none", whiteSpace: "nowrap" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeTab === "overview" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
            <StatCard label="Total Houses" value={houses.length} icon="home" color={COLORS.green} sub={`${available} available`} />
            <StatCard label="Seekers Registered" value={seekers.length} icon="users" color={COLORS.blue} sub={`${searching} still searching`} />
            <StatCard label="Matches Made" value={matches.length} icon="link" color={COLORS.orange} sub="this season" />
            <StatCard label="Total Revenue" value={`KES ${revenue.toLocaleString()}`} icon="money" color={COLORS.orangeLight} sub="all time" />
          </div>

          {/* Quick actions */}
          <div style={{ background: COLORS.white, borderRadius: 16, padding: 24, marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <h3 style={{ margin: "0 0 16px 0", fontWeight: 800 }}>🚨 Needs Attention</h3>
            <div style={{ display: "grid", gap: 10 }}>
              {houses.filter(h => !h.verified && h.status === "available").map(h => (
                <div key={h.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: COLORS.orangePale, borderRadius: 10, padding: "10px 16px" }}>
                  <div>
                    <span style={{ fontWeight: 700 }}>{h.location}</span>
                    <span style={{ color: COLORS.gray, fontSize: 13, marginLeft: 8 }}>by {h.landlordName} — KES {h.rent.toLocaleString()}</span>
                  </div>
                  <button onClick={() => toggleVerify(h.id)} style={{ background: COLORS.green, color: COLORS.white, border: "none", borderRadius: 8, padding: "6px 14px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                    Verify ✓
                  </button>
                </div>
              ))}
              {houses.filter(h => !h.verified && h.status === "available").length === 0 && (
                <div style={{ color: COLORS.gray, fontSize: 14 }}>✅ All houses verified. Great job!</div>
              )}
            </div>
          </div>

          {/* Recent matches */}
          <div style={{ background: COLORS.white, borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <h3 style={{ margin: "0 0 16px 0", fontWeight: 800 }}>🤝 Recent Matches</h3>
            {matches.length === 0 ? <div style={{ color: COLORS.gray, fontSize: 14 }}>No matches yet. Click "New Match" to create one.</div> :
              matches.slice(0, 5).map(m => {
                const s = seekers.find(x => x.id === m.seekerId);
                const h = houses.find(x => x.id === m.houseId);
                return (
                  <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${COLORS.grayLight}` }}>
                    <div style={{ fontSize: 14 }}>
                      <span style={{ fontWeight: 700 }}>{s?.name || "Unknown"}</span>
                      <span style={{ color: COLORS.gray }}> matched with </span>
                      <span style={{ fontWeight: 700 }}>{h?.location || "Unknown"}</span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <Badge color="green">KES {(m.seekerFee + m.landlordFee).toLocaleString()}</Badge>
                      <div style={{ fontSize: 11, color: COLORS.gray, marginTop: 2 }}>{m.date}</div>
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>
      )}

      {/* HOUSES */}
      {activeTab === "houses" && (
        <div>
          <div style={{ background: COLORS.white, borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: COLORS.grayLight }}>
                  {["Location", "Landlord", "Rent", "Beds", "Status", "Verified", "Actions"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 13, fontWeight: 700, color: COLORS.gray }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {houses.map((h, i) => (
                  <tr key={h.id} style={{ borderBottom: `1px solid ${COLORS.grayLight}`, background: i % 2 === 0 ? COLORS.white : "#FAFAFA" }}>
                    <td style={{ padding: "12px 16px", fontWeight: 700, fontSize: 14 }}>{h.location}</td>
                    <td style={{ padding: "12px 16px", fontSize: 14, color: COLORS.gray }}>{h.landlordName}</td>
                    <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 700, color: COLORS.orange }}>KES {h.rent.toLocaleString()}</td>
                    <td style={{ padding: "12px 16px", fontSize: 14 }}>{h.bedrooms} BR</td>
                    <td style={{ padding: "12px 16px" }}><Badge color={h.status === "available" ? "green" : "gray"}>{h.status}</Badge></td>
                    <td style={{ padding: "12px 16px" }}>
                      <button onClick={() => toggleVerify(h.id)} style={{ background: h.verified ? COLORS.greenPale : COLORS.orangePale, color: h.verified ? COLORS.green : COLORS.orange, border: "none", borderRadius: 6, padding: "4px 10px", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                        {h.verified ? "✓ Verified" : "Unverified"}
                      </button>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <button onClick={() => deleteHouse(h.id)} style={{ background: "#FFEBEE", color: COLORS.red, border: "none", borderRadius: 6, padding: "4px 10px", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SEEKERS */}
      {activeTab === "seekers" && (
        <div style={{ background: COLORS.white, borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: COLORS.grayLight }}>
                {["Name", "Budget", "Location", "Bedrooms", "Contact", "Status", "Registered"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 13, fontWeight: 700, color: COLORS.gray }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {seekers.map((s, i) => (
                <tr key={s.id} style={{ borderBottom: `1px solid ${COLORS.grayLight}`, background: i % 2 === 0 ? COLORS.white : "#FAFAFA" }}>
                  <td style={{ padding: "12px 16px", fontWeight: 700, fontSize: 14 }}>{s.name}</td>
                  <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 700, color: COLORS.green }}>KES {s.budget.toLocaleString()}</td>
                  <td style={{ padding: "12px 16px", fontSize: 14 }}>{s.location}</td>
                  <td style={{ padding: "12px 16px", fontSize: 14 }}>{s.bedrooms} BR</td>
                  <td style={{ padding: "12px 16px", fontSize: 14, color: COLORS.gray }}>{s.contact}</td>
                  <td style={{ padding: "12px 16px" }}><Badge color={s.status === "matched" ? "green" : "orange"}>{s.status}</Badge></td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: COLORS.gray }}>{s.registeredDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MATCHES */}
      {activeTab === "matches" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
            <StatCard label="Total Matches" value={matches.length} icon="link" color={COLORS.green} />
            <StatCard label="Seeker Fees" value={`KES ${matches.reduce((s, m) => s + m.seekerFee, 0).toLocaleString()}`} icon="money" color={COLORS.blue} />
            <StatCard label="Landlord Fees" value={`KES ${matches.reduce((s, m) => s + m.landlordFee, 0).toLocaleString()}`} icon="key" color={COLORS.orange} />
          </div>
          <div style={{ background: COLORS.white, borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: COLORS.grayLight }}>
                  {["Seeker", "House", "Date", "Seeker Fee", "Landlord Fee", "Total", "Status"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 13, fontWeight: 700, color: COLORS.gray }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matches.map((m, i) => {
                  const s = seekers.find(x => x.id === m.seekerId);
                  const h = houses.find(x => x.id === m.houseId);
                  return (
                    <tr key={m.id} style={{ borderBottom: `1px solid ${COLORS.grayLight}`, background: i % 2 === 0 ? COLORS.white : "#FAFAFA" }}>
                      <td style={{ padding: "12px 16px", fontWeight: 700, fontSize: 14 }}>{s?.name || m.seekerId}</td>
                      <td style={{ padding: "12px 16px", fontSize: 14 }}>{h?.location || m.houseId}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: COLORS.gray }}>{m.date}</td>
                      <td style={{ padding: "12px 16px", fontWeight: 700, color: COLORS.blue }}>KES {m.seekerFee}</td>
                      <td style={{ padding: "12px 16px", fontWeight: 700, color: COLORS.orange }}>KES {m.landlordFee}</td>
                      <td style={{ padding: "12px 16px", fontWeight: 800, color: COLORS.green }}>KES {m.seekerFee + m.landlordFee}</td>
                      <td style={{ padding: "12px 16px" }}><Badge color="green">{m.status}</Badge></td>
                    </tr>
                  );
                })}
                {matches.length === 0 && (
                  <tr><td colSpan={7} style={{ textAlign: "center", padding: 40, color: COLORS.gray }}>No matches yet. Click "+ New Match" to create your first.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Match Modal */}
      <Modal open={matchModal} onClose={() => setMatchModal(false)} title="🤝 Create New Match">
        <p style={{ color: COLORS.gray, fontSize: 14, marginBottom: 16 }}>Connect a seeker to an available house and record the fees.</p>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontWeight: 700, fontSize: 13, color: COLORS.dark, marginBottom: 6 }}>Select Seeker <span style={{ color: COLORS.orange }}>*</span></label>
          <select value={matchForm.seekerId} onChange={e => setMatchForm({ ...matchForm, seekerId: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${COLORS.grayLight}`, fontSize: 14, outline: "none" }}>
            <option value="">-- Choose a seeker --</option>
            {seekers.filter(s => s.status === "searching").map(s => (
              <option key={s.id} value={s.id}>{s.name} — Budget KES {s.budget.toLocaleString()} — {s.location}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontWeight: 700, fontSize: 13, color: COLORS.dark, marginBottom: 6 }}>Select House <span style={{ color: COLORS.orange }}>*</span></label>
          <select value={matchForm.houseId} onChange={e => setMatchForm({ ...matchForm, houseId: e.target.value })} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${COLORS.grayLight}`, fontSize: 14, outline: "none" }}>
            <option value="">-- Choose a house --</option>
            {houses.filter(h => h.status === "available").map(h => (
              <option key={h.id} value={h.id}>{h.location} — KES {h.rent.toLocaleString()} — {h.bedrooms}BR — {h.landlordName}</option>
            ))}
          </select>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div>
            <label style={{ display: "block", fontWeight: 700, fontSize: 13, color: COLORS.dark, marginBottom: 6 }}>Seeker Fee (KES)</label>
            <input type="number" value={matchForm.seekerFee} onChange={e => setMatchForm({ ...matchForm, seekerFee: parseInt(e.target.value) })} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${COLORS.grayLight}`, fontSize: 14, boxSizing: "border-box", outline: "none" }} />
          </div>
          <div>
            <label style={{ display: "block", fontWeight: 700, fontSize: 13, color: COLORS.dark, marginBottom: 6 }}>Landlord Fee (KES)</label>
            <input type="number" value={matchForm.landlordFee} onChange={e => setMatchForm({ ...matchForm, landlordFee: parseInt(e.target.value) })} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${COLORS.grayLight}`, fontSize: 14, boxSizing: "border-box", outline: "none" }} />
          </div>
        </div>
        <div style={{ background: COLORS.greenPale, borderRadius: 10, padding: 12, marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 700, color: COLORS.green }}>Total Revenue</span>
          <span style={{ fontWeight: 900, fontSize: 18, color: COLORS.green }}>KES {(matchForm.seekerFee + matchForm.landlordFee).toLocaleString()}</span>
        </div>
        <button onClick={handleMatch} style={{ width: "100%", background: COLORS.green, color: COLORS.white, border: "none", borderRadius: 10, padding: 14, fontWeight: 800, fontSize: 15, cursor: "pointer" }}>
          ✅ Confirm Match
        </button>
      </Modal>
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("home");
  const [houses, setHouses] = useState(SAMPLE_HOUSES);
  const [seekers, setSeekers] = useState(SAMPLE_SEEKERS);
  const [matches, setMatches] = useState(SAMPLE_MATCHES);

  // Persist to storage
  useEffect(() => {
    const load = async () => {
      try {
        const h = await window.storage?.get("vc_houses");
        const s = await window.storage?.get("vc_seekers");
        const m = await window.storage?.get("vc_matches");
        if (h) setHouses(JSON.parse(h.value));
        if (s) setSeekers(JSON.parse(s.value));
        if (m) setMatches(JSON.parse(m.value));
      } catch (e) {}
    };
    load();
  }, []);

  useEffect(() => {
    const save = async () => {
      try {
        await window.storage?.set("vc_houses", JSON.stringify(houses));
        await window.storage?.set("vc_seekers", JSON.stringify(seekers));
        await window.storage?.set("vc_matches", JSON.stringify(matches));
      } catch (e) {}
    };
    save();
  }, [houses, seekers, matches]);

  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage setPage={setPage} houses={houses} seekers={seekers} matches={matches} />;
      case "find": return <FindPage houses={houses} setHouses={setHouses} />;
      case "list": return <ListPage houses={houses} setHouses={setHouses} />;
      case "admin": return <AdminPage houses={houses} setHouses={setHouses} seekers={seekers} setSeekers={setSeekers} matches={matches} setMatches={setMatches} />;
      default: return null;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <style>{`* { box-sizing: border-box; } button { transition: all 0.15s; } button:hover { opacity: 0.9; } input, textarea, select { font-family: inherit; }`}</style>
      <Navbar page={page} setPage={setPage} />
      {renderPage()}
      {/* Footer */}
      <footer style={{ background: COLORS.dark, color: "#9CA3AF", padding: "24px", textAlign: "center", marginTop: 40, fontSize: 13 }}>
        <div style={{ color: COLORS.white, fontWeight: 800, fontSize: 16, marginBottom: 4 }}>🏡 VacantConnect Kenya</div>
        <div>Connecting landlords and seekers across Kenya — No brokers, just trust.</div>
        <div style={{ marginTop: 8, color: "#6B7280" }}>© 2024 VacantConnect · WhatsApp: 0712 345 678</div>
      </footer>
    </div>
  );
}
