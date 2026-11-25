# After Class — V0.2 test
React + Vite. Private learning-community prototype. Test accounts and fictional data only.

## Development
npm install
npm run dev
npm run build

## Implemented for validation
Google PKCE, invitation redemption, pending review, approved test profile, preset avatar with database restriction, bilingual core navigation and account, classroom-specific experience, tab-scoped token renewal, admin roster filter, locally generated QR invitations.

## Release gates
Adult school-authorized administrator; no real student records before authorization and privacy review. Test RLS with different accounts, verify token renewal and logout, verify QR and mobile/desktop, check OAuth restrictions and account supervision. Community posts remain local; no messaging or shared student content. Admin account not provisioned. Test sessions use sessionStorage and do not intentionally persist after tab closure. No third-party QR service receives invitation codes. Preferences are local by default; profile save writes current choices to the database.
