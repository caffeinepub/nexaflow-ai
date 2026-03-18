# Luxe Parfum

## Current State
- Public perfume site with 8 sections (Hero, Collections, Brand Story, Fragrance Notes, Testimonials, Contact, Newsletter, Footer)
- Admin panel at `/admin` with CRUD for Services, Testimonials, Submissions view, Admin management
- Admin panel branding incorrectly shows "NexaFlow AI" instead of "Luxe Parfum"
- No public user login page
- No delete button for contact submissions in admin panel
- Responsive issues on mobile/tablet across various sections

## Requested Changes (Diff)

### Add
- User login page at `/login` using Internet Identity — shows user's principal, basic profile area, logout button
- Header nav link to Login page for public users

### Modify
- Fix admin panel branding: replace all "NexaFlow AI" / "NexaFlow Admin" with "Luxe Parfum Admin"
- Add delete button for contact submissions in admin panel Submissions section
- Improve full-site responsiveness: fix header mobile menu, hero section, collections grid, brand story, fragrance notes, testimonials, contact form, footer — all must work properly on mobile (360px+), tablet (768px), desktop
- Admin panel sidebar must be properly collapsible on mobile with overlay
- Admin panel forms and tables must be responsive

### Remove
- Nothing removed

## Implementation Plan
1. Fix AdminPanel.tsx: brand name, delete submissions button, mobile sidebar responsiveness, table/form layouts
2. Add UserLoginPage component: Internet Identity login, show principal, logout
3. Update App.tsx: add `/login` route, add Login link to Header nav
4. Fix all responsive breakpoints across all public site sections
