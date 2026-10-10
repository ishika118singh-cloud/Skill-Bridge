import './styles.css';

const BASE = import.meta.env.BASE_URL || '/';
const key = {
  demo: 'skillswap.demo.v1',
  users: 'skillswap.users.v1',
  requests: 'skillswap.requests.v1',
  identity: 'skillswap.identity.v1',
  projects: 'skillswap.projects.v1',
};
const categories = ['Coding', 'Graphic Design', 'UI/UX', 'Video Editing', 'Digital Marketing'];
const demos = [
  { id: 'demo-asha', name: 'Asha Nair', role: 'Product designer & illustrator', years: 6, skills: ['UI/UX', 'Graphic Design'], teaches: ['UI/UX', 'Visual identity'], learns: ['Frontend coding', 'Creative writing'], bio: 'I turn tangled product ideas into calm, useful experiences. Happy to share the thinking behind my process — and curious to learn how you bring interfaces to life in code.', availability: 'Weekdays after 5pm', preference: 'A relaxed 45-minute video call, then a small project to practice together.', photo: 'images/mentor-asha.jpg', tone: '', location: 'Brooklyn, NY' },
  { id: 'demo-marcus', name: 'Marcus Reed', role: 'Brand designer & creative lead', years: 8, skills: ['Graphic Design', 'Digital Marketing'], teaches: ['Brand systems', 'Creative direction'], learns: ['UX research', 'No-code tools'], bio: 'I help early ideas find a visual voice. Let’s talk typography, storytelling, and how to make a brand feel like a real person.', availability: 'Tue–Thu, 6–8pm', preference: 'Open to exchanging a focused 1:1 session or a friendly portfolio review.', photo: 'images/mentor-marcus.jpg', tone: 'tone-mint', location: 'Chicago, IL' },
  { id: 'demo-lin', name: 'Lin Chen', role: 'Filmmaker & editor', years: 5, skills: ['Video Editing', 'Digital Marketing'], teaches: ['Premiere Pro', 'Short-form storytelling'], learns: ['Illustration', 'Motion design'], bio: 'Editor by day, chronic collector of story ideas by night. I can help you find rhythm in your footage and make every cut count.', availability: 'Weekends, flexible', preference: 'Bring a rough cut or an idea. We can work through it live and leave with a next step.', photo: 'images/mentor-lin.jpg', tone: 'tone-peach', location: 'Los Angeles, CA' },
  { id: 'demo-jules', name: 'Jules Okafor', role: 'Frontend engineer & teacher', years: 7, skills: ['Coding', 'UI/UX'], teaches: ['JavaScript', 'Creative coding'], learns: ['Brand illustration', 'Content strategy'], bio: 'I make the web feel playful and teach the fundamentals without the jargon. Bring a question you’ve been sitting on.', availability: 'Mon & Wed evenings', preference: 'Pair programming with lots of room for questions.', photo: 'images/mentor-jules.jpg', tone: '', location: 'Austin, TX' },
];
const sampleProjects = [
  { id: 'sample-1', owner: 'demo-asha', title: 'A softer way to bank', description: 'A mobile-first money experience for people building new habits.', category: 'UI/UX', image: 'images/sample-uiux.jpg', sample: true },
  { id: 'sample-2', owner: 'demo-marcus', title: 'Good Things Market', description: 'A lively identity for a neighborhood makers market.', category: 'Graphic Design', image: 'images/sample-brand.jpg', sample: true },
  { id: 'sample-3', owner: 'demo-lin', title: 'Small stories, big city', description: 'A short-form documentary series about everyday rituals.', category: 'Video Editing', image: 'images/sample-film.jpg', sample: true },
  { id: 'sample-4', owner: 'demo-jules', title: 'Playground for pixels', description: 'A browser-based experiment in color, code, and curiosity.', category: 'Coding', image: 'images/portfolio-art.jpg', sample: true },
];

function readStore(storeKey, fallback) {
  try {
    const raw = localStorage.getItem(storeKey);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch (error) {
    console.warn(`SkillSwap storage issue in ${storeKey}`, error);
    return fallback;
  }
}
function writeStore(storeKey, value) {
  try { localStorage.setItem(storeKey, JSON.stringify(value)); return true; }
  catch (error) { console.warn('SkillSwap could not save to this browser.', error); toast('Browser storage is full. Try a smaller image.'); return false; }
}
function loadDemo() {
  const current = readStore(key.demo, null);
  if (current?.version === 2 && Array.isArray(current.mentors)) return current;
  const seed = { version: 2, mentors: demos, projects: sampleProjects };
  writeStore(key.demo, seed);
  return seed;
}
let demo = loadDemo();
let users = readStore(key.users, []);
let requests = readStore(key.requests, []);
let identity = readStore(key.identity, null);
if (!Array.isArray(users)) users = [];
if (!Array.isArray(requests)) requests = [];
let exploreFilter = '';
let exploreQuery = '';
let projectFilter = 'All projects';
let authMode = 'login';
const app = document.querySelector('#app');
const icon = (name, size = 18) => {
  const paths = {
    spark: '<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/><path d="m19 14 .9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14Z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    code: '<path d="m8 8-4 4 4 4m8-8 4 4-4 4m-3-11-2 14"/>',
    palette: '<circle cx="12" cy="12" r="9"/><path d="M8 13h.01M12 7h.01M16 10h.01M14 17h.01"/><path d="M12 21c-1.5 0-2-1-2-2.2 0-1 .8-1.8 1.8-1.8H14a2 2 0 0 0 0-4h-1"/>',
    layout: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M9 4v16M9 9h12"/>',
    video: '<rect x="3" y="5" width="14" height="14" rx="3"/><path d="m17 10 4-3v10l-4-3z"/>',
    chart: '<path d="M4 19V5m0 14h16M8 15l3-4 3 2 5-7"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    close: '<path d="m18 6-12 12M6 6l12 12"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/>',
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.spark}</svg>`;
};
const asset = (path) => `${BASE}${path}`;
const esc = (value = '') => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const uid = () => `u-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
const allMentors = () => [...demo.mentors, ...users.filter((u) => u.role !== 'Student').map(userToMentor)];
function userToMentor(user) {
  return { ...user, id: user.id, photo: user.photo || '', location: user.location || 'SkillSwap community', skills: user.skills || [], teaches: user.teaches || user.skills || [], learns: user.learns || [], years: Number.isFinite(Number(user.years)) ? Number(user.years) : 1, bio: user.bio || 'I’m here to share what I know and learn something new.', availability: user.availability || 'Let’s find a time', preference: user.preference || 'Open to a friendly skill exchange.', role: user.role, tone: '' };
}
const allProjects = () => [...demo.projects, ...readStore(key.projects, []).filter((p) => !p.sample)];
const person = (id) => allMentors().find((m) => m.id === id) || users.find((u) => u.id === id);
const current = () => identity ? person(identity.id) || identity : null;
const isTeacher = (u = current()) => u && u.role !== 'Student';
const imageSrc = (path) => path?.startsWith('data:') ? path : path ? asset(path) : '';

function toast(message) {
  document.querySelector('.toast')?.remove();
  const el = document.createElement('div');
  el.className = 'toast'; el.textContent = message; document.body.append(el);
  setTimeout(() => el.remove(), 3000);
}
function navigate(path) { location.hash = path; window.scrollTo(0, 0); }
function header() {
  const user = current();
  return `<header class="topbar">
    <button class="brand" data-nav="/" aria-label="SkillSwap home"><span class="brand-mark">${icon('spark', 20)}</span>SkillSwap</button>
    <nav class="nav-links" id="nav-links"><button data-nav="/explore">Explore</button><button data-nav="/#how">How it works</button>${user ? `<button data-nav="/dashboard">Dashboard</button>` : ''}</nav>
    <div class="nav-actions">${user ? `<button class="btn btn-outline btn-small" data-action="logout">Sign out</button><button class="btn btn-primary btn-small" data-nav="/dashboard">${esc(user.name.split(' ')[0])} · ${user.role}</button>` : `<button class="btn btn-outline btn-small" data-nav="/auth">Log in</button><button class="btn btn-primary btn-small" data-nav="/auth?mode=signup">Join SkillSwap</button>`}<button class="mobile-menu" data-action="menu" aria-label="Open navigation">☰</button></div>
  </header>`;
}
function footer() {
  return `<footer class="footer"><span>© ${new Date().getFullYear()} SkillSwap · Better together.</span><span>Demo records are clearly labeled. Your account is stored only in this browser.</span></footer>`;
}
function mentorCard(mentor) {
  const skills = mentor.skills || [];
  return `<article class="mentor-card fade-in">
    <div class="mentor-cover ${mentor.tone || ''}">${mentor.photo ? `<img class="mentor-photo" src="${esc(imageSrc(mentor.photo))}" alt="${esc(mentor.name)}">` : `<div class="mentor-photo initials">${esc(mentor.name?.split(' ').map((n) => n[0]).join(''))}</div>`}<span class="demo-tag">${mentor.id.startsWith('demo-') ? 'DEMO PROFILE' : 'COMMUNITY'}</span></div>
    <div class="mentor-body"><div class="mentor-name-line"><h3>${esc(mentor.name)}</h3><span class="mentor-exp">${mentor.years} yrs</span></div>
    <div class="mentor-exp">${esc(mentor.title || mentor.role || 'Skill-sharing mentor')} · ${esc(mentor.location || 'Online')}</div>
    <p class="mentor-bio">${esc(mentor.bio)}</p>
    <div class="tag-row">${skills.slice(0, 3).map((s) => `<span class="tag">${esc(s)}</span>`).join('')}</div>
    <div class="exchange-line"><span>Offers <b>${esc((mentor.teaches || skills)[0] || 'A skill')}</b></span><button class="btn btn-soft btn-small" data-profile="${esc(mentor.id)}">View profile ${icon('arrow', 13)}</button></div></div>
  </article>`;
}
function heroArt() {
  return `<div class="hero-art"><div class="art-center"><svg width="126" height="126" viewBox="0 0 126 126" fill="none"><circle cx="63" cy="63" r="52" stroke="#9B87E8" stroke-width="1.5" stroke-dasharray="3 5"/><path d="M37 68c10-15 20-23 31-23 9 0 15 7 21 15" stroke="#7253D6" stroke-width="5" stroke-linecap="round"/><circle cx="38" cy="69" r="9" fill="#fff"/><circle cx="38" cy="69" r="5" fill="#7253D6"/><circle cx="89" cy="60" r="9" fill="#fff"/><circle cx="89" cy="60" r="5" fill="#7253D6"/><path d="M61 28v10m0 50v10M28 62h10m50 0h10" stroke="#B3A5ED" stroke-width="2" stroke-linecap="round"/></svg></div><div class="art-card art-card-a"><strong>Design ↔ code</strong><small>Trade what you know</small></div><div class="art-card art-card-b"><strong>One good hour</strong><small>Can open a new door</small></div></div>`;
}
function landing() {
  const featured = demo.mentors.slice(0, 3);
  const catIcons = { Coding: 'code', 'Graphic Design': 'palette', 'UI/UX': 'layout', 'Video Editing': 'video', 'Digital Marketing': 'chart' };
  return `${header()}<main class="fade-in">
    <section class="hero"><div><span class="eyebrow"><span class="eyebrow-dot"></span> A little knowledge goes a long way</span><h1>Share Your Skills.<br><em>Learn From Each Other.</em></h1><p class="hero-copy">SkillSwap makes it easy to trade skills with people who are just as curious as you. No fees. Just good conversations and real learning.</p><div class="hero-actions"><button class="btn btn-primary" data-nav="/explore">Explore skills ${icon('arrow', 16)}</button><button class="btn btn-outline" data-action="become">Become a mentor</button></div><div class="hero-note"><div class="face-stack">${demo.mentors.slice(0,3).map((m) => `<img src="${asset(m.photo)}" alt="">`).join('')}</div><span><b>Peer learning, made human.</b><br>Start with one skill swap.</span></div></div>${heroArt()}</section>
    <section class="section" id="how"><div class="section-heading"><div><h2>Find your kind of curious</h2><p>Real people, practical skills, and room to grow both ways.</p></div><button class="text-button" data-nav="/explore">Browse all skills →</button></div><div class="category-row">${categories.map((c) => { const count = allMentors().filter((m) => [...(m.skills || []), ...(m.teaches || [])].some((skill) => skill.toLowerCase().includes(c.toLowerCase()))).length; return `<button class="category" data-category="${esc(c)}"><span class="category-icon">${icon(catIcons[c], 20)}</span><strong>${esc(c)}</strong><small>${count} ${count === 1 ? 'profile' : 'profiles'} in this demo</small></button>`; }).join('')}</div></section>
    <section class="section"><div class="section-heading"><div><h2>People worth learning from</h2><p>Each mentor brings something to teach — and something they’d love to learn.</p></div><button class="text-button" data-nav="/explore">Meet the community →</button></div><div class="mentor-grid">${featured.map(mentorCard).join('')}</div></section>
    <section class="cta-band"><div><h2>Your next skill is one conversation away.</h2><p>Bring what you know. Leave with something new.</p></div><button class="btn btn-primary" data-nav="/explore">Find your person ${icon('arrow', 15)}</button></section>
  </main>${footer()}`;
}
function explorePage() {
  let list = allMentors();
  if (exploreFilter) list = list.filter((m) => [...(m.skills || []), ...(m.teaches || [])].some((s) => s.toLowerCase().includes(exploreFilter.toLowerCase())));
  if (exploreQuery) list = list.filter((m) => `${m.name} ${(m.skills || []).join(' ')} ${(m.teaches || []).join(' ')} ${m.bio}`.toLowerCase().includes(exploreQuery.toLowerCase()));
  return `${header()}<main class="page-wrap fade-in"><span class="eyebrow"><span class="eyebrow-dot"></span> FIND YOUR NEXT SKILL SWAP</span><h1 class="page-title" style="margin-top:16px">The best way to learn<br>is to learn together.</h1><p class="page-subtitle">Search people, explore a skill, and find a good fit for a two-way exchange.</p>
  <div class="explore-tools"><label class="searchbox"><span>${icon('search', 17)}</span><input id="mentor-search" type="search" placeholder="Try “Asha” or “video editing”" value="${esc(exploreQuery)}" aria-label="Search mentors"></label><select class="filter-select" id="skill-filter" aria-label="Filter by skill"><option value="">All skills</option>${categories.map((c) => `<option ${exploreFilter === c ? 'selected' : ''}>${esc(c)}</option>`).join('')}</select></div>
  <p class="footnote">${list.length} ${list.length === 1 ? 'mentor' : 'mentors'} to explore · Sample profiles are marked as demo data.</p><div class="mentor-grid">${list.length ? list.map(mentorCard).join('') : `<div class="empty-state" style="grid-column:1/-1"><strong>No matches just yet</strong>Try another name or clear your skill filter.</div>`}</div></main>${footer()}`;
}
function projectCards(ownerId, manageable = false) {
  let projects = allProjects().filter((p) => p.owner === ownerId);
  if (projectFilter !== 'All projects') projects = projects.filter((p) => p.category === projectFilter);
  return projects.map((p) => `<article class="project-card"><div class="project-art ${p.category === 'Graphic Design' ? 'art-three' : p.category === 'UI/UX' ? '' : 'art-two'}">${p.image ? `<img src="${esc(imageSrc(p.image))}" alt="${esc(p.title)} project artwork">` : `<span>${icon('spark', 30)}</span>`}</div><div class="project-inner"><h3>${esc(p.title)} ${p.sample ? '<span class="demo-tag" style="position:static">DEMO</span>' : ''}</h3><p>${esc(p.description)}</p><div class="project-meta"><span>${esc(p.category)}</span>${p.video ? `<a href="${esc(p.video)}" target="_blank" rel="noopener">Watch project ↗</a>` : ''}${manageable && !p.sample ? `<button class="text-button" data-delete-project="${esc(p.id)}" aria-label="Delete project">Delete</button>` : ''}</div></div></article>`).join('');
}
function profilePage(id) {
  const m = person(id);
  if (!m) return `${header()}<main class="page-wrap"><div class="empty-state"><strong>Profile not found</strong>This profile may have been removed.<br><button class="btn btn-primary" data-nav="/explore" style="margin-top:15px">Back to explore</button></div></main>${footer()}`;
  const profile = m.id.startsWith('demo-') ? demo.mentors.find((d) => d.id === id) : userToMentor(m);
  const self = current()?.id === id;
  const skills = profile.skills || [];
  return `${header()}<main class="page-wrap fade-in"><button class="text-button" data-nav="/explore">← Back to explore</button><section class="profile-top" style="margin-top:16px">${profile.photo ? `<img class="profile-image" src="${esc(imageSrc(profile.photo))}" alt="${esc(profile.name)}">` : `<div class="profile-image profile-initials" aria-label="${esc(profile.name)}">${esc(profile.name.split(' ').map((n) => n[0]).join(''))}</div>`}<div><span class="eyebrow">${id.startsWith('demo-') ? 'DEMO PROFILE' : 'SKILLSWAP COMMUNITY'}</span><h1>${esc(profile.name)}</h1><div style="font-weight:700;color:#6e687a">${esc(profile.title || profile.role || 'SkillSwap member')}</div><p class="profile-bio" style="margin-top:12px">${esc(profile.bio)}</p><div class="profile-statline"><span>${icon('clock', 14)} ${profile.years} years experience</span><span>${esc(profile.location || 'Online')}</span></div><div class="tag-row">${skills.map((s) => `<span class="tag">${esc(s)}</span>`).join('')}</div>${self ? `<div class="action-row">${!id.startsWith('demo-') && isTeacher(profile) ? `<button class="btn btn-primary" data-action="edit-profile">Edit profile</button>` : ''}<button class="btn btn-soft" data-nav="/dashboard">Dashboard</button></div>` : `<button class="btn btn-primary" data-book="${esc(profile.id)}">Request a skill swap ${icon('arrow', 15)}</button>`}</div></section>
  <div class="profile-panels"><section class="panel"><h2>A good exchange goes both ways</h2><div class="exchange-box"><span>WHAT ${esc(profile.name.split(' ')[0].toUpperCase())} CAN SHARE</span><strong>${(profile.teaches || skills).map(esc).join(' · ') || 'Skills and perspective'}</strong></div><div class="exchange-box" style="background:#f3faf6"><span>WHAT THEY’RE CURIOUS TO LEARN</span><strong>${(profile.learns || []).map(esc).join(' · ') || 'Always open to something new'}</strong></div><h2 style="margin-top:22px">How they like to learn</h2><p class="page-subtitle" style="margin:0">${esc(profile.preference || 'A relaxed, collaborative session.')}</p></section><section class="panel"><h2>Availability</h2><p class="page-subtitle" style="margin-bottom:0">${icon('calendar', 16)} &nbsp;${esc(profile.availability || 'Let’s find a time that works.')}</p><div class="notice">SkillSwap is a peer-learning demo. Agree on a time and learning plan together before your session.</div></section></div>
  <section class="panel" style="margin-top:20px"><div class="section-heading"><div><h2 style="margin-bottom:6px">A little work they’re proud of</h2><p>Demo samples are labeled. Portfolio uploads stay in your browser storage.</p></div>${self && !id.startsWith('demo-') ? `<button class="btn btn-primary btn-small" data-action="add-project">${icon('plus', 14)} Add project</button>` : ''}</div><div class="explore-tools" style="margin:0 0 17px"><select class="filter-select" id="project-filter"><option>All projects</option>${categories.map((c) => `<option ${projectFilter === c ? 'selected' : ''}>${esc(c)}</option>`).join('')}</select></div><div class="gallery-grid" id="project-grid">${projectCards(profile.id, self && !id.startsWith('demo-')) || `<div class="empty-state" style="grid-column:1/-1"><strong>No projects here yet</strong>Check back later for portfolio updates.</div>`}</div></section>
  </main>${footer()}`;
}
function authPage() {
  const signup = authMode === 'signup';
  return `${header()}<main class="auth-layout fade-in"><section class="auth-aside"><span class="eyebrow">A COMMUNITY BUILT ON CURIOSITY</span><h1>Learn a thing.<br><em>Teach a thing.</em></h1><p>Somewhere out there, someone knows what you’re trying to learn. And you know something they’d love to know.</p><div class="notice" style="max-width:440px">Demo only: profiles and activity are stored locally in this browser. This is not secure authentication or a shared account.</div></section><section class="auth-form-wrap"><form class="auth-form" id="auth-form"><h2>${signup ? 'Join the exchange' : 'Welcome back'}</h2><p>${signup ? 'Create a local demo profile to get started.' : 'Sign in to your local SkillSwap demo.'}</p>${signup ? `<div class="field"><label for="auth-name">Your name</label><input id="auth-name" name="name" required minlength="2" placeholder="e.g. Sam Rivera"></div>` : ''}<div class="field"><label for="auth-email">Email address</label><input id="auth-email" name="email" type="email" required placeholder="you@example.com"></div>${signup ? `<div class="field"><label for="auth-password">Password</label><input id="auth-password" name="password" type="password" minlength="6" required placeholder="At least 6 characters"></div><div class="field"><label for="auth-role">I’d like to join as</label><select id="auth-role" name="role"><option>Student</option><option>Teacher</option><option>Both</option></select></div><div class="field"><label for="auth-skills">Skills you can share <span class="footnote">(comma separated)</span></label><input id="auth-skills" name="skills" placeholder="e.g. Coding, UI/UX"></div><div class="field"><label for="auth-learns">Skills you’d like to learn</label><input id="auth-learns" name="learns" placeholder="e.g. Graphic Design"></div>` : `<div class="field"><label for="auth-password">Password</label><input id="auth-password" name="password" type="password" required placeholder="Your local demo password"></div>`}<button class="btn btn-primary" type="submit" style="width:100%;margin-top:5px">${signup ? 'Create local profile' : 'Log in to demo'}</button><button type="button" class="text-button" style="width:100%;margin-top:16px;font-size:12px" data-auth-mode="${signup ? 'login' : 'signup'}">${signup ? 'Already have a profile? Log in' : 'New to SkillSwap? Create a profile'}</button>${!signup ? `<div class="demo-entry"><h3>Jump in with a demo role</h3><div><button class="btn btn-soft btn-small" type="button" data-demo-login="student">Try as student</button><button class="btn btn-soft btn-small" type="button" data-demo-login="teacher">Try as teacher</button></div></div>` : ''}<div class="notice">No data leaves this browser. Local demo passwords are not protected or encrypted; never use a real password here.</div></form></section></main>${footer()}`;
}
function requestStatus(status) {
  const cls = status === 'Confirmed' ? 'confirmed' : status === 'Completed' ? 'completed' : status === 'Time Suggested' ? 'suggested' : '';
  return `<span class="status ${cls}">${esc(status)}</span>`;
}
function dashboardPage() {
  const user = current();
  if (!user) { navigate('/auth'); return ''; }
  const teacher = isTeacher(user);
  const userReq = requests.filter((r) => r.mentorId === user.id || r.studentId === user.id);
  const upcoming = userReq.filter((r) => ['Confirmed', 'Time Suggested'].includes(r.status));
  const incoming = teacher ? userReq.filter((r) => r.mentorId === user.id) : [];
  const outgoing = userReq.filter((r) => r.studentId === user.id);
  const projects = allProjects().filter((p) => p.owner === user.id && !p.sample);
  return `${header()}<main class="page-wrap fade-in"><div class="dashboard-head"><div><span class="eyebrow">YOUR SKILLSWAP SPACE</span><h1 style="margin-top:13px">Good to see you, ${esc(user.name.split(' ')[0])}.</h1><p class="page-subtitle" style="margin:0">${teacher ? 'Your teaching calendar and portfolio, all in one place.' : 'Keep track of the people and skills you’re learning from.'}</p></div><button class="btn btn-primary" data-nav="/explore">${teacher ? 'Find a skill to learn' : 'Find a mentor'} ${icon('arrow', 15)}</button></div>
  ${user.role === 'Both' ? `<div class="notice" style="margin-bottom:17px">You joined as both student and teacher. Your dashboard shows both sides of your exchanges.</div>` : ''}
  <div class="stats-row"><div class="stat-card"><span>Upcoming sessions</span><strong>${upcoming.length}</strong></div><div class="stat-card"><span>${teacher ? 'Incoming requests' : 'Requests sent'}</span><strong>${teacher ? incoming.length : outgoing.length}</strong></div><div class="stat-card"><span>${teacher ? 'Portfolio projects' : 'Skills to learn'}</span><strong>${teacher ? projects.length : (user.learns || []).length}</strong></div></div>
  <div class="dash-grid"><section class="panel"><h2>${teacher ? 'Incoming requests' : 'Your requests'}</h2>${(teacher ? incoming : outgoing).length ? (teacher ? incoming : outgoing).map(requestCard).join('') : `<div class="empty-state"><strong>No requests yet</strong>${teacher ? 'When someone asks to learn with you, it will appear here.' : 'Find a mentor and send your first learning request.'}</div>`}${user.role === 'Both' ? `<h2 style="margin-top:22px">Requests you sent</h2>${outgoing.length ? outgoing.map(requestCard).join('') : `<div class="empty-state"><strong>No outgoing requests</strong>Explore mentors when you’re ready to learn.</div>`}` : ''}</section>
  <section class="panel"><h2>Upcoming sessions</h2>${upcoming.length ? upcoming.map(requestCard).join('') : `<div class="empty-state"><strong>A little space for what’s next</strong>Confirmed sessions will appear here.</div>`}<div class="exchange-box"><span>YOUR OFFERED SKILLS</span><strong>${(user.teaches || user.skills || []).map(esc).join(' · ') || 'Add skills to your profile'}</strong></div><div class="exchange-box" style="background:#f3faf6"><span>CURIOUS TO LEARN</span><strong>${(user.learns || []).map(esc).join(' · ') || 'Add your learning goals'}</strong></div></section></div>
  ${teacher ? `<section class="panel" style="margin-top:18px"><div class="section-heading"><div><h2>Your portfolio</h2><p>Your portfolio is saved separately from demo examples.</p></div>${user.id.startsWith('demo-') ? '' : `<button class="btn btn-primary btn-small" data-action="add-project">${icon('plus', 14)} Add project</button>`}</div>${user.id.startsWith('demo-') ? `<div class="notice">This seeded teacher profile is read-only demo data. Create a local Teacher or Both profile to edit your profile and portfolio.</div>` : ''}<div class="gallery-grid">${projectCards(user.id, !user.id.startsWith('demo-')) || `<div class="empty-state" style="grid-column:1/-1"><strong>Start your portfolio</strong>Add one project to give learners a feel for your work.</div>`}</div><p class="footnote" style="margin-top:14px">Demo portfolio work appears only on sample mentor profiles.</p></section>` : ''}${teacher && !user.id.startsWith('demo-') ? `<section class="panel" style="margin-top:18px"><div class="section-heading"><div><h2>Your public profile</h2><p>Update how you show up in discovery and profile views.</p></div><button class="btn btn-outline btn-small" data-action="edit-profile">Edit profile</button></div><div class="profile-statline">${icon('clock', 14)} ${user.years || 1} years experience · ${esc(user.location || 'SkillSwap community')}</div><p class="profile-bio">${esc(user.bio || 'Add a short intro to help others find you.')}</p></section>` : ''}</main>${footer()}`;
}
function requestCard(r) {
  const teacherSide = r.mentorId === current()?.id;
  const other = person(teacherSide ? r.studentId : r.mentorId);
  const otherName = other?.name || (teacherSide ? 'Learner' : 'Mentor');
  const canTeacherAct = teacherSide;
  const canStudentAct = r.studentId === current()?.id;
  return `<article class="request-card"><div class="request-head"><div><strong>${teacherSide ? 'Learning with ' : 'Learning from '}${esc(otherName)}</strong><div class="footnote">${esc(r.skill)} · ${esc(r.date)} at ${esc(r.time)}</div></div>${requestStatus(r.status)}</div><p>${esc(r.note || 'A one-to-one skill exchange.')}${r.suggestedDate ? `<br><b>Suggested:</b> ${esc(r.suggestedDate)} at ${esc(r.suggestedTime)}` : ''}</p><div class="action-row">${canTeacherAct && r.status === 'Pending' ? `<button class="btn btn-primary btn-small" data-request-action="confirm" data-id="${esc(r.id)}">Confirm</button><button class="btn btn-outline btn-small" data-request-action="suggest" data-id="${esc(r.id)}">Suggest another time</button>` : ''}${canStudentAct && r.status === 'Time Suggested' ? `<button class="btn btn-primary btn-small" data-request-action="accept-time" data-id="${esc(r.id)}">Accept suggested time</button>` : ''}${canTeacherAct && r.status === 'Confirmed' ? `<button class="btn btn-soft btn-small" data-request-action="complete" data-id="${esc(r.id)}">Mark completed</button>` : ''}${canStudentAct && r.status === 'Confirmed' ? `<span class="footnote">Your session is confirmed.</span>` : ''}</div></article>`;
}
function render() {
  demo = loadDemo();
  users = readStore(key.users, []);
  requests = readStore(key.requests, []);
  identity = readStore(key.identity, null);
  const raw = location.hash.slice(1) || '/';
  const [route, query] = raw.split('?');
  const params = new URLSearchParams(query || '');
  if (route === '/auth' && params.get('mode') === 'signup') authMode = 'signup';
  let view;
  if (!route || route === '/') view = landing();
  else if (route === '/explore') view = explorePage();
  else if (route.startsWith('/profile/')) view = profilePage(decodeURIComponent(route.slice('/profile/'.length)));
  else if (route === '/auth') view = authPage();
  else if (route === '/dashboard') view = dashboardPage();
  else view = `${header()}<main class="page-wrap"><div class="empty-state"><strong>We couldn’t find that page</strong><button class="btn btn-primary" data-nav="/" style="margin-top:14px">Back home</button></div></main>${footer()}`;
  app.innerHTML = view;
}
function showModal(title, body) {
  document.querySelector('.modal-backdrop')?.remove();
  const overlay = document.createElement('div');
  overlay.className = 'modal-backdrop';
  overlay.innerHTML = `<section class="modal" role="dialog" aria-modal="true"><div class="modal-head"><h2>${title}</h2><button class="icon-button" data-action="close-modal" aria-label="Close">${icon('close')}</button></div>${body}</section>`;
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
  app.append(overlay);
}
function bookingModal(mentorId) {
  const mentor = person(mentorId);
  if (!current()) { navigate('/auth'); toast('Create a local demo profile to request a session.'); return; }
  if (current().id === mentorId) { toast('You can’t book a session with your own profile.'); return; }
  if (isTeacher() && current().role !== 'Both') { toast('Switch to a Student or Both demo account to request a session.'); return; }
  showModal(`Request a skill swap with ${esc(mentor.name)}`, `<form id="booking-form" data-mentor="${esc(mentorId)}"><div class="field"><label for="booking-skill">What would you like to learn?</label><select name="skill" id="booking-skill" required>${(mentor.teaches || mentor.skills).map((s) => `<option>${esc(s)}</option>`).join('')}</select></div><div class="form-grid"><div class="field"><label for="booking-date">Preferred date</label><input type="date" name="date" id="booking-date" required min="${new Date().toISOString().slice(0,10)}"></div><div class="field"><label for="booking-time">Preferred time</label><input type="time" name="time" id="booking-time" required></div></div><div class="field"><label for="booking-note">A note for ${esc(mentor.name.split(' ')[0])}</label><textarea name="note" id="booking-note" placeholder="What are you hoping to work on together?"></textarea></div><div class="notice">This creates a local demo request. Coordinate the actual session directly — no messages or calls are sent.</div><button class="btn btn-primary" type="submit" style="width:100%">Send request</button></form>`);
}
function addProjectModal() {
  const user = current();
  if (!isTeacher(user)) return toast('A teacher or Both profile is needed to add portfolio projects.');
  if (user.id.startsWith('demo-')) return toast('Seeded demo profiles are read-only. Create a local Teacher or Both profile to manage a portfolio.');
  showModal('Add a portfolio project', `<form id="project-form"><div class="field"><label for="project-title">Project title</label><input id="project-title" name="title" required maxlength="70" placeholder="A name for your project"></div><div class="field"><label for="project-description">Short description</label><textarea id="project-description" name="description" required maxlength="260" placeholder="What did you make, and what was the idea?"></textarea></div><div class="field"><label for="project-category">Category</label><select name="category" id="project-category">${categories.map((c) => `<option>${esc(c)}</option>`).join('')}</select></div><div class="field"><label for="project-url">Image URL (optional)</label><input name="url" id="project-url" type="url" placeholder="https://..."></div><div class="field"><label for="project-file">Or choose an image file (max 1.5 MB)</label><input name="file" id="project-file" type="file" accept="image/png,image/jpeg,image/webp"></div><div class="field"><label for="project-video">Demo video URL (optional)</label><input name="video" id="project-video" type="url" placeholder="https://..."></div><div id="image-preview" class="footnote"></div><div class="notice">Images are stored in this browser only. Keep files under 1.5 MB so local storage remains responsive.</div><button class="btn btn-primary" type="submit" style="width:100%">Save project</button></form>`);
}
function editProfileModal() {
  const user = current();
  if (!user || user.id.startsWith('demo-') || !isTeacher(user)) {
    toast('Seeded demo profiles are read-only. Create a local Teacher or Both profile to edit a profile.');
    return;
  }
  showModal('Edit your public profile', `<form id="profile-form" data-id="${esc(user.id)}" data-original-photo="${esc(user.photo || '')}">
    <div class="profile-edit-photo"><div id="profile-photo-preview">${user.photo ? `<img src="${esc(imageSrc(user.photo))}" alt="Current profile photo">` : `<span>${esc(user.name.split(' ').map((part) => part[0]).join(''))}</span>`}</div><div><strong>Profile photo</strong><p>Upload a portrait up to 1.5 MB. It stays in this browser.</p><label class="btn btn-outline btn-small file-label" for="profile-photo-file">Choose a photo</label><input class="visually-hidden" id="profile-photo-file" name="photo" type="file" accept="image/png,image/jpeg,image/webp"><button type="button" class="text-button remove-photo" data-action="remove-profile-photo">Remove photo</button></div></div>
    <div class="field"><label for="profile-name">Name</label><input id="profile-name" name="name" required minlength="2" maxlength="70" value="${esc(user.name)}"></div>
    <div class="field"><label for="profile-title">What you do</label><input id="profile-title" name="title" maxlength="80" value="${esc(user.title || '')}" placeholder="e.g. Product designer & illustrator"></div>
    <div class="field"><label for="profile-bio">About you</label><textarea id="profile-bio" name="bio" maxlength="500" required placeholder="What do you love sharing?">${esc(user.bio || '')}</textarea></div>
    <div class="form-grid"><div class="field"><label for="profile-years">Years of experience</label><input id="profile-years" name="years" type="number" min="0" max="70" step="1" required value="${Number.isFinite(Number(user.years)) ? Number(user.years) : 1}"></div><div class="field"><label for="profile-location">Location</label><input id="profile-location" name="location" maxlength="70" value="${esc(user.location || '')}" placeholder="City or online"></div></div>
    <div class="field"><label for="profile-teaches">Skills you can teach</label><input id="profile-teaches" name="teaches" required value="${esc((user.teaches || user.skills || []).join(', '))}" placeholder="Coding, UI/UX"></div>
    <div class="field"><label for="profile-learns">Skills you’d like to learn</label><input id="profile-learns" name="learns" value="${esc((user.learns || []).join(', '))}" placeholder="Graphic design, storytelling"></div>
    <div class="field"><label for="profile-availability">Availability</label><input id="profile-availability" name="availability" maxlength="120" value="${esc(user.availability || '')}" placeholder="Weekdays after 5pm"></div>
    <div class="field"><label for="profile-preference">How do you like to learn?</label><textarea id="profile-preference" name="preference" maxlength="240" placeholder="A relaxed video call, pair work, a portfolio review...">${esc(user.preference || '')}</textarea></div>
    <div class="notice">Your changes update your profile card and public profile. They are saved only in this browser, not shared to other devices.</div>
    <button class="btn btn-primary" type="submit" style="width:100%">Save profile changes</button>
  </form>`);
}
function saveIdentity(user) {
  identity = { id: user.id, name: user.name, role: user.role };
  writeStore(key.identity, identity);
}
function loginDemo(role) {
  const demoUser = role === 'teacher' ? demo.mentors[0] : null;
  if (demoUser) saveIdentity(demoUser);
  else {
    let student = users.find((u) => u.email === 'student@demo.skillswap');
    if (!student) {
      student = { id: 'demo-student-local', name: 'Taylor Morgan', email: 'student@demo.skillswap', role: 'Student', skills: ['Creative writing'], teaches: ['Creative writing'], learns: ['UI/UX', 'Coding'], years: 1, bio: 'Curious by nature, here to trade ideas and learn by doing.', photo: '', location: 'SkillSwap demo' };
      users.push(student); writeStore(key.users, users);
    }
    saveIdentity(student);
  }
  navigate('/dashboard');
}
function updateRequest(id, mutate) {
  requests = requests.map((r) => r.id === id ? mutate(r) : r);
  writeStore(key.requests, requests); render();
}

app.addEventListener('click', (event) => {
  const target = event.target.closest('[data-nav],[data-profile],[data-category],[data-action],[data-auth-mode],[data-demo-login],[data-book],[data-request-action],[data-delete-project]');
  if (!target) return;
  if (target.dataset.nav) {
    const route = target.dataset.nav;
    if (route === '/#how') {
      if (location.hash === '#/') document.querySelector('#how')?.scrollIntoView({ behavior: 'smooth' });
      else { navigate('/'); setTimeout(() => document.querySelector('#how')?.scrollIntoView({ behavior: 'smooth' }), 60); }
    }
    else if (route.includes('?')) { authMode = route.includes('signup') ? 'signup' : 'login'; navigate(route.split('?')[0]); }
    else navigate(route);
  }
  if (target.dataset.profile) { projectFilter = 'All projects'; navigate(`/profile/${encodeURIComponent(target.dataset.profile)}`); }
  if (target.dataset.category) { exploreFilter = target.dataset.category; navigate('/explore'); }
  if (target.dataset.book) bookingModal(target.dataset.book);
  if (target.dataset.authMode) { authMode = target.dataset.authMode; render(); }
  if (target.dataset.demoLogin) loginDemo(target.dataset.demoLogin);
  if (target.dataset.action === 'become') { authMode = 'signup'; navigate('/auth?mode=signup'); }
  if (target.dataset.action === 'menu') document.querySelector('#nav-links')?.classList.toggle('open');
  if (target.dataset.action === 'close-modal') document.querySelector('.modal-backdrop')?.remove();
  if (target.dataset.action === 'add-project') addProjectModal();
  if (target.dataset.action === 'edit-profile') editProfileModal();
  if (target.dataset.action === 'remove-profile-photo') {
    const form = document.querySelector('#profile-form');
    const fileInput = document.querySelector('#profile-photo-file');
    const preview = document.querySelector('#profile-photo-preview');
    if (form && preview) {
      form.dataset.removePhoto = 'true';
      if (fileInput) fileInput.value = '';
      const initials = document.querySelector('#profile-name')?.value.split(/\s+/).map((part) => part[0]).join('') || 'SS';
      preview.innerHTML = `<span>${esc(initials)}</span>`;
    }
  }
  if (target.dataset.action === 'logout') { localStorage.removeItem(key.identity); identity = null; navigate('/'); }
  if (target.dataset.requestAction) {
    const id = target.dataset.id;
    if (target.dataset.requestAction === 'confirm') updateRequest(id, (r) => ({ ...r, status: 'Confirmed' }));
    if (target.dataset.requestAction === 'complete') updateRequest(id, (r) => ({ ...r, status: 'Completed' }));
    if (target.dataset.requestAction === 'accept-time') updateRequest(id, (r) => ({ ...r, status: 'Confirmed', date: r.suggestedDate, time: r.suggestedTime, suggestedDate: '', suggestedTime: '' }));
    if (target.dataset.requestAction === 'suggest') {
      const r = requests.find((x) => x.id === id);
      showModal('Suggest another time', `<form id="suggest-form" data-id="${esc(id)}"><p class="page-subtitle">Offer an alternative for ${esc(r?.skill || 'the session')}.</p><div class="form-grid"><div class="field"><label>Date</label><input name="date" type="date" required min="${new Date().toISOString().slice(0,10)}"></div><div class="field"><label>Time</label><input name="time" type="time" required></div></div><button class="btn btn-primary" type="submit" style="width:100%">Send suggested time</button></form>`);
    }
  }
  if (target.dataset.deleteProject) {
    if (!confirm('Delete this project from your local portfolio?')) return;
    const projectList = readStore(key.projects, []).filter((p) => p.id !== target.dataset.deleteProject);
    writeStore(key.projects, projectList); render(); toast('Project removed from your portfolio.');
  }
});
app.addEventListener('input', (event) => {
  if (event.target.id === 'mentor-search') {
    exploreQuery = event.target.value;
    const start = event.target.selectionStart;
    const page = explorePage();
    app.innerHTML = page;
    const input = document.querySelector('#mentor-search');
    input?.focus(); input?.setSelectionRange(start, start);
  }
});
app.addEventListener('change', (event) => {
  if (event.target.id === 'skill-filter') { exploreFilter = event.target.value; render(); }
  if (event.target.id === 'project-filter') {
    projectFilter = event.target.value;
    const profileId = location.hash.slice(1).split('/profile/')[1]?.split('?')[0];
    const grid = document.querySelector('#project-grid');
    const profile = profileId ? person(decodeURIComponent(profileId)) : current();
    if (grid && profile) grid.innerHTML = projectCards(profile.id, current()?.id === profile.id && !profile.id.startsWith('demo-')) || `<div class="empty-state" style="grid-column:1/-1"><strong>No projects in this category</strong>Choose another filter.</div>`;
  }
  if (event.target.id === 'project-file') {
    const file = event.target.files?.[0];
    const preview = document.querySelector('#image-preview');
    if (!file || !preview) return;
    if (file.size > 1.5 * 1024 * 1024) { event.target.value = ''; preview.textContent = 'That file is too large. Choose an image under 1.5 MB.'; return; }
    const reader = new FileReader();
    reader.onload = () => { preview.innerHTML = `<img src="${reader.result}" alt="Image preview" style="width:100%;max-height:130px;object-fit:cover;border-radius:12px;margin-top:8px">`; };
    reader.onerror = () => { preview.textContent = 'Could not read this image. Try another file.'; };
    reader.readAsDataURL(file);
  }
  if (event.target.id === 'profile-photo-file') {
    const file = event.target.files?.[0];
    const form = document.querySelector('#profile-form');
    const preview = document.querySelector('#profile-photo-preview');
    if (!file || !form || !preview) return;
    if (file.size > 1.5 * 1024 * 1024) {
      event.target.value = '';
      toast('Choose a profile photo under 1.5 MB.');
      return;
    }
    form.dataset.removePhoto = 'false';
    const reader = new FileReader();
    reader.onload = () => { preview.innerHTML = `<img src="${reader.result}" alt="Selected profile photo preview">`; };
    reader.onerror = () => toast('Could not read this image. Try another photo.');
    reader.readAsDataURL(file);
  }
  if (event.target.id === 'profile-name') {
    const form = document.querySelector('#profile-form');
    const preview = document.querySelector('#profile-photo-preview');
    if (form?.dataset.removePhoto === 'true' && preview) preview.innerHTML = `<span>${esc(event.target.value.split(/\s+/).map((part) => part[0]).join(''))}</span>`;
  }
});
app.addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.target;
  if (form.id === 'auth-form') {
    const values = new FormData(form);
    const email = String(values.get('email')).trim().toLowerCase();
    const password = String(values.get('password'));
    if (authMode === 'signup') {
      if (password.length < 6) return toast('Password must be at least 6 characters.');
      if (users.some((u) => u.email === email)) return toast('A local profile already uses that email. Try logging in.');
      const role = String(values.get('role'));
      const skills = String(values.get('skills') || '').split(',').map((s) => s.trim()).filter(Boolean);
      const learns = String(values.get('learns') || '').split(',').map((s) => s.trim()).filter(Boolean);
      const newUser = { id: uid(), name: String(values.get('name')).trim(), email, password, role, skills, teaches: skills, learns, years: 1, bio: 'I’m here to share what I know and learn something new.', availability: 'Let’s find a time', preference: 'A relaxed peer-learning session.', photo: '', location: 'SkillSwap community' };
      users.push(newUser);
      if (!writeStore(key.users, users)) { users = users.filter((u) => u.id !== newUser.id); return; }
      saveIdentity(newUser); navigate('/dashboard'); toast('Your local demo profile is ready.');
    } else {
      const match = users.find((u) => u.email === email && u.password === password);
      if (!match) return toast('No matching local profile. Create one or use a demo entry.');
      saveIdentity(match); navigate('/dashboard');
    }
  }
  if (form.id === 'booking-form') {
    const values = new FormData(form);
    const mentor = person(form.dataset.mentor);
    const date = String(values.get('date'));
    const time = String(values.get('time'));
    if (!date || !time || !mentor) return toast('Choose a mentor, date, and time.');
    const newRequest = { id: uid(), mentorId: mentor.id, studentId: current().id, skill: String(values.get('skill')), date, time, note: String(values.get('note') || ''), status: 'Pending', createdAt: new Date().toISOString() };
    requests.push(newRequest);
    if (!writeStore(key.requests, requests)) { requests = requests.filter((r) => r.id !== newRequest.id); return; }
    document.querySelector('.modal-backdrop')?.remove(); navigate('/dashboard'); toast('Request sent — it’s now in your dashboard.');
  }
  if (form.id === 'suggest-form') {
    const values = new FormData(form);
    updateRequest(form.dataset.id, (r) => ({ ...r, status: 'Time Suggested', suggestedDate: String(values.get('date')), suggestedTime: String(values.get('time')) }));
    document.querySelector('.modal-backdrop')?.remove(); toast('Alternative time sent to the learner.');
  }
  if (form.id === 'project-form') {
    const values = new FormData(form);
    const file = form.querySelector('[name=file]').files?.[0];
    const url = String(values.get('url') || '').trim();
    if (file && file.size > 1.5 * 1024 * 1024) return toast('Choose an image under 1.5 MB.');
    let image = url || '';
    const commit = () => {
      const list = readStore(key.projects, []);
      const project = { id: uid(), owner: current().id, title: String(values.get('title')).trim(), description: String(values.get('description')).trim(), category: String(values.get('category')), image, video: String(values.get('video') || '').trim(), createdAt: new Date().toISOString(), sample: false };
      list.push(project);
      if (!writeStore(key.projects, list)) return;
      document.querySelector('.modal-backdrop')?.remove(); render(); toast('Project saved to your local portfolio.');
    };
    if (file) {
      const reader = new FileReader();
      reader.onload = () => { image = String(reader.result); commit(); };
      reader.onerror = () => toast('Could not read this image. Try a different file.');
      reader.readAsDataURL(file);
    } else commit();
  }
  if (form.id === 'profile-form') {
    const values = new FormData(form);
    const file = form.querySelector('[name=photo]').files?.[0];
    const commit = (photo) => {
      const oldUsers = users;
      const updated = users.map((u) => u.id === form.dataset.id ? {
        ...u,
        name: String(values.get('name')).trim(),
        title: String(values.get('title') || '').trim(),
        bio: String(values.get('bio') || '').trim(),
        years: Number(values.get('years')) || 0,
        location: String(values.get('location') || '').trim() || 'SkillSwap community',
        teaches: String(values.get('teaches') || '').split(',').map((s) => s.trim()).filter(Boolean),
        skills: String(values.get('teaches') || '').split(',').map((s) => s.trim()).filter(Boolean),
        learns: String(values.get('learns') || '').split(',').map((s) => s.trim()).filter(Boolean),
        availability: String(values.get('availability') || '').trim() || 'Let’s find a time',
        preference: String(values.get('preference') || '').trim() || 'Open to a friendly skill exchange.',
        photo,
      } : u);
      users = updated;
      if (!writeStore(key.users, users)) { users = oldUsers; return; }
      const saved = users.find((u) => u.id === form.dataset.id);
      saveIdentity(saved);
      document.querySelector('.modal-backdrop')?.remove();
      render();
      toast('Your profile is updated in this browser.');
    };
    const originalPhoto = form.dataset.originalPhoto || '';
    if (file && file.size > 1.5 * 1024 * 1024) return toast('Choose a profile photo under 1.5 MB.');
    if (file) {
      const reader = new FileReader();
      reader.onload = () => commit(String(reader.result));
      reader.onerror = () => toast('Could not read this image. Try another photo.');
      reader.readAsDataURL(file);
    } else commit(form.dataset.removePhoto === 'true' ? '' : originalPhoto);
  }
});
window.addEventListener('hashchange', render);
render();
